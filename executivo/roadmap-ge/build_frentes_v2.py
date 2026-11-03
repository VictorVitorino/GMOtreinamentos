"""Roadmap de evolução do Modelo de Operação, versão visual: um slide por frente, com gráficos de apoio.

Uso: python3 build_frentes_v2.py <AM_Etapa_5_-_Roadmap_de_evolucao_do_modelo.pptx> [saida.pptx]

Abre com uma linha do tempo das 8 ações e os marcos do Gerente Executivo. Cada frente tem a entrega (dono e
prazo), um gráfico do mecanismo (fluxo, gauge, painel, ciclo, anel ou escada), a direção do GE e a pergunta para
o comitê. Conteúdo tirado do roadmap; o texto vem de build_frentes.py.
"""
import math
import os
import sys

from lxml import etree
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_CONNECTOR, MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, MSO_AUTO_SIZE, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Pt

from build_frentes import FRENTES, PLANO
from build_sintese import (COND, GREY, LIGHT, LINE, NAVY, ORANGE, PALE, PEACH, SLATE, STEEL, TXT, WARN, WHITE, X0,
                           X1, E, H, P, S, prune, tw)

LAYOUT = 'AM_CONTEUDO'
GREEN, AMBER, RED, MINT = '2E8B57', 'F2B134', 'D64545', 'DFF1E6'
A_NS = 'http://schemas.openxmlformats.org/drawingml/2006/main'


# ------------------------------------------------------------------ helpers de desenho
def shadow(sh, alpha=16):
    spPr = sh._element.spPr
    for e in spPr.findall(qn('a:effectLst')):
        spPr.remove(e)
    spPr.append(etree.fromstring(
        f'<a:effectLst xmlns:a="{A_NS}"><a:outerShdw blurRad="63500" dist="25400" dir="5400000" algn="t" '
        f'rotWithShape="0"><a:srgbClr val="002A46"><a:alpha val="{alpha * 1000}"/></a:srgbClr></a:outerShdw></a:effectLst>'))


def card(s, x, y, w, h, fill=WHITE, line=LINE, radius=0.04, shade=True):
    c = s.box(x, y, w, h, fill=fill, line=line, prst=MSO_SHAPE.ROUNDED_RECTANGLE, adj=radius)
    if shade:
        shadow(c)
    return c


def fill_shape(sh, paras, anchor='m', ins=(4, 2, 4, 2)):
    tf = sh.text_frame
    tf.word_wrap = True
    tf.auto_size = MSO_AUTO_SIZE.NONE
    bp = tf._txBody.bodyPr
    for a, v in zip(('lIns', 'tIns', 'rIns', 'bIns'), ins):
        bp.set(a, str(int(E(v))))
    tf.vertical_anchor = {'t': MSO_ANCHOR.TOP, 'm': MSO_ANCHOR.MIDDLE, 'b': MSO_ANCHOR.BOTTOM}[anchor]
    for i, p in enumerate(paras):
        para = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        para.alignment = {'l': PP_ALIGN.LEFT, 'c': PP_ALIGN.CENTER, 'r': PP_ALIGN.RIGHT}[p['align']]
        para.line_spacing = Pt(p['lh'])
        para.space_before = Pt(p['sb'] if i else 0)
        for t, b, c in p['runs']:
            r = para.add_run()
            r.text = t
            r.font.name, r.font.size, r.font.bold = COND, Pt(p['size']), b
            r.font.color.rgb = RGBColor.from_string(c)
            r._r.get_or_add_rPr().set('lang', 'pt-BR')


def shape_text(s, x, y, w, h, paras, fill=None, line=None, prst=MSO_SHAPE.RECTANGLE, adj=None, anchor='m',
               ins=(4, 2, 4, 2), shade=False):
    sh = s.box(x, y, w, h, fill=fill, line=line, prst=prst, adj=adj)
    if shade:
        shadow(sh)
    fill_shape(sh, paras, anchor, ins)
    return sh


def arrow(s, x1, y1, x2, y2, color=STEEL, w=1.25, head=True):
    c = s.sl.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, E(x1), E(y1), E(x2), E(y2))
    st = c._element.find(qn('p:style'))
    if st is not None:
        c._element.remove(st)
    c.line.color.rgb = RGBColor.from_string(color)
    c.line.width = Pt(w)
    if head:
        ln = c.line._get_or_add_ln()
        etree.SubElement(ln, qn('a:tailEnd'), type='triangle', w='med', len='med')
    return c


def badge(s, x, y, d, text, fill=ORANGE, color=WHITE, size=10):
    return shape_text(s, x, y, d, d, [P(text, size, True, color, lh=size + 2, align='c')], fill=fill,
                      prst=MSO_SHAPE.OVAL, ins=(0, 0, 0, 0))


def kicker(s, x, y, w, text, color=STEEL):
    s.box(x, y + 3.5, 5, 5, fill=ORANGE)
    s.text(x + 10, y, w - 10, [P(text, 8, True, color, lh=11, spc=1)])


def chevrons(s, x, y, w, h, items, colors=None, size=9.5, gap=4, first_pentagon=True):
    """Fileira de chevrons com texto dentro; items = [(título, legenda)]."""
    n = len(items)
    cw = (w - gap * (n - 1)) / n
    for i, (t, d) in enumerate(items):
        cor = (colors[i] if colors else (NAVY if i == n - 1 else STEEL))
        paras = [P(t, size, True, WHITE, lh=size + 2, align='c')]
        if d:
            paras.append(P(d, size - 1.5, False, LIGHT, lh=size + 0.5, sb=1, align='c'))
        shape_text(s, x + i * (cw + gap), y, cw, h, paras, fill=cor,
                   prst=MSO_SHAPE.PENTAGON if (i == 0 and first_pentagon) else MSO_SHAPE.CHEVRON, adj=0.22,
                   ins=(8 if i == 0 else 12, 1, 6, 1))


def gauge(s, cx, cy, r, zones, meta=None, thick=0.3, value=None, label=None, meta_label='meta'):
    """Meio-arco com zonas coloridas (frações 0-1), marcador na meta e valor no centro."""
    def arc(p0, p1, color):
        sh = s.box(cx - r, cy - r, 2 * r, 2 * r, fill=color, prst=MSO_SHAPE.BLOCK_ARC)
        a0, a1 = (180 + p0 * 180) % 360, (180 + p1 * 180) % 360
        sh.adjustments[0] = a0 * 0.6
        sh.adjustments[1] = a1 * 0.6
        sh.adjustments[2] = thick
    for p0, p1, color in zones:
        arc(p0, p1, color)
    if meta is not None:
        th = math.radians(180 + meta * 180)
        rr = r + 7
        mx, my = cx + rr * math.cos(th), cy + rr * math.sin(th)
        tri = s.box(mx - 5, my - 5, 10, 10, fill=NAVY, prst=MSO_SHAPE.ISOSCELES_TRIANGLE)
        tri.rotation = (math.degrees(th) - 90) % 360
        lx, ly = cx + (rr + 14) * math.cos(th), cy + (rr + 14) * math.sin(th)
        s.text(lx - 24, ly - 6, 48, [P(meta_label, 7.5, True, NAVY, lh=9, align='c')], check=False)
    if value:
        s.text(cx - r, cy - r * 0.62, 2 * r, [P(value, 20, True, NAVY, lh=22, align='c')], check=False)
    if label:
        s.text(cx - r, cy - r * 0.62 + 24, 2 * r, [P(label, 8, False, GREY, lh=9.5, align='c')], check=False)


def tile(s, x, y, w, h, big, small, fill=PALE, big_color=NAVY, big_size=18):
    card(s, x, y, w, h, fill=fill, line=None, shade=False)
    s.text(x + 8, y + 8, w - 16, [P(big, big_size, True, big_color, lh=big_size + 2, align='c')], check=False)
    s.text(x + 8, y + 8 + big_size + 6, w - 16, [P(small, 8.5, False, TXT, lh=10.5, align='c')], check=False)


def dots(s, x, y, n, current):
    for i in range(n):
        s.box(x + i * 11, y, 6, 6, fill=ORANGE if i == current else LIGHT, prst=MSO_SHAPE.OVAL)


def tag(s, n, texto, idx, total):
    largura = tw(texto, 9 / 0.84) + 8
    for sh in s.sl.shapes:
        if sh.name == 'Texto_32':
            sh.text_frame.paragraphs[0].runs[0].text = texto
            sh.width = E(largura)
        if sh.name == 'Etiqueta secao_30':
            sh.width = E(largura + 26)
        if sh.name == 'Nº 03':
            sh.text_frame.paragraphs[0].runs[0].text = n
    dots(s, 83 + largura + 40, 23, total, idx)


# ------------------------------------------------------------------ slide 0: linha do tempo
CURTO = {  # nome curto e foco curto para a linha do tempo
    '01': ('Backlog e Azure DevOps', 'Todo fórum roda no Azure DevOps'),
    '02': ('Comunidades Técnicas', 'Líderes formalizados; decidir PMO'),
    '03': ('Monitoramento do modelo', 'Confirmar a meta de 90% por frente'),
    '04': ('Performance das Squads', 'Primeiros resultados como referência'),
    '05': ('Gestão de pessoas', 'Gate do onboarding e Fase 1 da avaliação'),
    '06': ('Continuidade da GMO', 'Donos de GMO na semana 1; CMAK no comitê'),
    '07': ('Processos de suporte', 'Começar pelo portfólio e pelo conhecimento'),
    '08': ('SLAs com o negócio', 'SLA só com ~3 meses de histórico'),
}
MARCOS = [(1, 'Donos de GMO nomeados', 0), (2, 'Ponto de partida medido', 1), (3, '1ª leitura no comitê', 0),
          (4, 'Revisão com a liderança', 1), (6, 'GMO é rotina da FE', 0), (12, 'SLAs formalizados', 1)]


def slide_timeline(prs, layout, ref, total):
    s = S(prs, layout, ref, 0, 'Roadmap de evolução: oito ações em três horizontes',
          'Dono, duração e foco do Gerente Executivo em cada ação; abaixo, os marcos que ele acompanha',
          'Linha do tempo das 8 ações do roadmap (M1 a M12), com o foco do Gerente Executivo em cada uma e os '
          'marcos do plano de Gestão da Mudança e dos SLAs.')
    tag(s, '00', 'Visão geral · Gerente Executivo', 0, total)
    xl, xg = X0, 352
    mw = (X1 - xg) / 12
    y0 = 128
    for m in range(12):
        s.text(xg + m * mw, y0, mw, [P(f'M{m + 1}', 8, True, STEEL, lh=10, align='c')], check=False)
        s.box(xg + m * mw, y0 + 14, 0.5, 290, fill=LINE)
    s.box(xg + 12 * mw, y0 + 14, 0.5, 290, fill=LINE)
    y = y0 + 20
    rh = 31
    for hz, cor, acoes in PLANO:
        lane_h = rh * len(acoes) + 8
        s.box(xl, y, X1 - xl, lane_h, fill=PALE, prst=MSO_SHAPE.ROUNDED_RECTANGLE, adj=0.08)
        shape_text(s, xl, y, 74, lane_h, [P(hz, 7.5, True, WHITE, lh=9.5, spc=0.5)], fill=cor,
                   prst=MSO_SHAPE.ROUNDED_RECTANGLE, adj=0.12, ins=(8, 0, 4, 0))
        yy = y + 4
        for n, acao, dono, foco, barras, prazo in acoes:
            nome_c, foco_c = CURTO[n]
            badge(s, xl + 82, yy + 4, 18, n, fill=cor, size=7.5)
            s.text(xl + 106, yy + 2, xg - xl - 112, [P(nome_c, 9.5, True, NAVY, lh=11), P(foco_c, 7.5, False, ORANGE, lh=9, sb=1)],
                   check=False)
            nb = len(barras)
            bh = 16 if nb == 1 else 9
            for j, (ini, dur) in enumerate(barras):
                by = yy + (rh - bh * nb - 3 * (nb - 1)) / 2 + j * (bh + 3)
                b = s.box(xg + ini * mw + 2, by, dur * mw - 4, bh, fill=cor, prst=MSO_SHAPE.ROUNDED_RECTANGLE, adj=0.5)
                if nb == 1 and dur * mw > 150:
                    fill_shape(b, [P(f'{dono} · {prazo}', 8, True, WHITE, lh=9.5)], ins=(8, 0, 4, 0))
            if nb > 1 or max(d for _, d in barras) * mw <= 150:
                lx = xg + max(d for _, d in barras) * mw + 6
                s.text(lx, yy + 3, X1 - lx, [P(f'{dono} · {prazo}', 8, False, TXT, lh=9.5)], h=rh - 6, anchor='m', check=False)
            yy += rh
        y += lane_h + 5
    # marcos do GE
    ya = y + 12
    s.box(xg, ya, X1 - xg, 1.5, fill=NAVY)
    s.text(xl, ya - 6, xg - xl - 10, [P('MARCOS QUE O GE ACOMPANHA', 8, True, STEEL, lh=10, spc=1)], check=False)
    for m, lbl, row in MARCOS:
        mx = xg + (m - 0.5) * mw
        s.box(mx - 6, ya - 5, 12, 12, fill=ORANGE, prst=MSO_SHAPE.DIAMOND)
        ly = ya + 10 + row * 19
        s.box(mx, ya + 6, 0.5, ly - ya - 6, fill=STEEL)
        lx = min(mx - 44, X1 - 88)
        s.text(lx, ly, 88, [P(f'M{m} · {lbl}', 7.5, True, NAVY, lh=9, align='c')], check=False)
    s.check('timeline')


# ------------------------------------------------------------------ gráficos de cada frente
def g_fechamento(s, x, y, w, h):
    kicker(s, x, y, w, 'DA DEMANDA AO INDICADOR · UMA SÓ TRILHA')
    chevrons(s, x, y + 22, w, 44, [('Demanda', 'registrada'), ('Azure DevOps', 'fonte única'),
                                   ('Fóruns', 'rodam na ferramenta'), ('Indicadores', '4ª semana')],
             colors=[STEEL, ORANGE, STEEL, NAVY], size=8.5)
    yy = y + 86
    kicker(s, x, yy, w, 'AS DUAS ENTREGAS DO FECHAMENTO · SEMANAS')
    yy += 22
    sw = (w - 120) / 4
    for k in range(4):
        s.text(x + 120 + k * sw, yy, sw, [P(f'S{k + 1}', 8, True, STEEL, lh=10, align='c')], check=False)
        s.box(x + 120 + k * sw, yy + 12, 0.5, 70, fill=LINE)
    s.box(x + 120 + 4 * sw, yy + 12, 0.5, 70, fill=LINE)
    for k, (nome, semanas, cor) in enumerate((('Azure DevOps · FEG', 4, STEEL), ('Comunidades Técnicas', 2, NAVY))):
        by = yy + 20 + k * 34
        s.text(x, by + 1, 114, [P(nome, 9, True, NAVY, lh=11)], check=False)
        b = s.box(x + 122, by, semanas * sw - 4, 18, fill=cor, prst=MSO_SHAPE.ROUNDED_RECTANGLE, adj=0.5)
        fill_shape(b, [P(f'{semanas} semanas', 8, True, WHITE, lh=9.5)], ins=(8, 0, 4, 0))
    yy += 96
    shape_text(s, x, yy, w, h - (yy - y), [P(runs=[('Critério de adoção: ', True, NAVY),
                                                 ('demandas registradas no Azure DevOps, com informações atualizadas e a '
                                                  'ferramenta usada nos fóruns de acompanhamento (40% · 40% · 20%).', False, TXT)],
                                            size=9.5, lh=11.5)], fill=PALE, prst=MSO_SHAPE.ROUNDED_RECTANGLE, adj=0.1,
               ins=(10, 4, 10, 4))


def g_monitoramento(s, x, y, w, h):
    kicker(s, x, y, w, 'A RÉGUA DE ESTABILIDADE · POR COMUNIDADE')
    gauge(s, x + 74, y + 112, 64, [(0, 0.9, LIGHT), (0.9, 1, GREEN)], meta=0.9, value='≥ 90%',
          label='em cada frente', meta_label='meta')
    tile(s, x + 160, y + 30, (w - 160) / 2 - 4, 58, '3 meses', 'seguidos na meta', big_size=16)
    tile(s, x + 160 + (w - 160) / 2 + 4, y + 30, (w - 160) / 2 - 4, 58, '0', 'desvio crítico sem plano', big_size=16)
    s.text(x + 160, y + 102, w - 160, [P('Apuração mensal nos meses 1 a 3; trimestral após a estabilização; '
                                        'de volta ao mensal se a aderência cair.', 9, False, TXT, lh=11)], check=False)
    yy = y + 146
    kicker(s, x, yy, w, 'AS 5 FRENTES AVALIADAS · ATENDIDO OU NÃO ATENDIDO')
    yy += 20
    fr = ['Ritos e fóruns', 'Papéis', 'Interfaces com o negócio', 'Ferramentas oficiais', 'Fluxo de backlog']
    cx = x
    for k, t in enumerate(fr):
        cw = tw(t, 8.5 / 0.84, True) + 18
        if cx + cw > x + w:
            cx, yy = x, yy + 24
        shape_text(s, cx, yy, cw, 19, [P(t, 8.5, True, NAVY, lh=10, align='c')], fill=MINT,
                   prst=MSO_SHAPE.ROUNDED_RECTANGLE, adj=0.5, ins=(0, 0, 0, 0))
        cx += cw + 6
    yy += 32
    chevrons(s, x, yy, w, 36, [('Verificar', 'o modelo continua aplicado?'), ('Identificar', 'perdas de aderência'),
                               ('Direcionar', 'ação corretiva a tempo')], size=9)


def g_squads(s, x, y, w, h):
    kicker(s, x, y, w, 'QUANDO A MEDIÇÃO COMEÇA')
    chevrons(s, x, y + 20, w, 40, [('Pré-implantação', 'painéis no Power BI'), ('Semanas 1 e 2', 'estabilizar registros'),
                                   ('4ª semana', 'acompanhamento oficial')], colors=[STEEL, STEEL, ORANGE], size=9)
    yy = y + 76
    kicker(s, x, yy, w, 'TRÊS NÚMEROS PARA O COMITÊ')
    yy += 20
    tw_ = (w - 16) / 3
    for k, (t, q) in enumerate((('Demandas atrasadas', 'o compromisso com o cliente'),
                                ('Lead time médio', 'do registro à conclusão'),
                                ('Em andamento por responsável', 'concentração de trabalho'))):
        tx = x + k * (tw_ + 8)
        card(s, tx, yy, tw_, 96, fill=WHITE, line=LINE)
        s.box(tx, yy, tw_, 4, fill=ORANGE if k == 0 else STEEL)
        s.text(tx + 8, yy + 10, tw_ - 16, [P(t, 9.5, True, NAVY, lh=11), P(q, 8, False, GREY, lh=9.5, sb=1)], check=False)
        for j, bh in enumerate((10, 16, 22, 14, 26)):
            s.box(tx + 10 + j * 14, yy + 86 - bh, 9, bh, fill=LIGHT)
        s.text(tx + 84, yy + 72, tw_ - 90, [P('a medir', 7.5, False, GREY, lh=9, align='r')], check=False)
    yy += 110
    shape_text(s, x, yy, w, h - (yy - y), [P(runs=[('Quatro dimensões no painel: ', True, NAVY),
                                                 ('eficiência do fluxo, volume e andamento, perfil das demandas e '
                                                  'distribuição do trabalho. Os primeiros resultados viram a referência.',
                                                  False, TXT)], size=9.5, lh=11.5)],
               fill=PALE, prst=MSO_SHAPE.ROUNDED_RECTANGLE, adj=0.1, ins=(10, 4, 10, 4))


def g_pessoas(s, x, y, w, h):
    kicker(s, x, y, w, 'ONBOARDING · DO PRIMEIRO DIA AO GATE')
    chevrons(s, x, y + 20, w, 40, [('Dia 1', 'vídeo e buddy'), ('Etapa 1', 'o modelo, 2 a 4 semanas'),
                                   ('Gate', '8 perguntas'), ('Etapa 2', 'ágil e gestão da mudança')],
             colors=[STEEL, STEEL, ORANGE, NAVY], size=9)
    yy = y + 78
    kicker(s, x, yy, w, 'AVALIAÇÃO MATRICIAL · COMO A NOTA SE COMPÕE')
    yy += 22
    w70 = (w - 4) * 0.7
    shape_text(s, x, yy, w70, 26, [P('70% · 1 a 3 metas individuais', 9.5, True, WHITE, lh=11, align='c')], fill=NAVY,
               ins=(0, 0, 0, 0))
    shape_text(s, x + w70 + 4, yy, w - w70 - 4, 26, [P('30% · contribuição à Comunidade', 9.5, True, NAVY, lh=11, align='c')],
               fill=MINT, ins=(0, 0, 0, 0))
    s.text(x, yy + 32, w, [P('Mais as 3 metas comuns ONS. Avaliação pelo Gerente Imediato, com input estruturado do '
                             'Líder de Comunidade. Competências não entram na média.', 9, False, TXT, lh=11)], check=False)
    yy += 68
    for k, (t, d, cor) in enumerate((('FASE 1 · PRÓXIMO CICLO', 'Metas 70/30, input do Líder e regra para DTA', NAVY),
                                     ('FASE 2 · CICLOS SEGUINTES', 'Formulário da área cliente, NPS e calibragem cruzada', STEEL))):
        tx = x + k * (w / 2 + 2)
        card(s, tx, yy, w / 2 - 4, h - (yy - y), fill=WHITE, line=LINE)
        s.box(tx, yy, 4, h - (yy - y), fill=cor)
        s.text(tx + 12, yy + 8, w / 2 - 24, [P(t, 8, True, cor, lh=10, spc=0.8), P(d, 9, False, TXT, lh=11, sb=3)], check=False)


def g_gmo(s, x, y, w, h):
    kicker(s, x, y, w, 'QUATRO ÍNDICES COM META E SEMÁFORO')
    zones = [(0, 0.5, RED), (0.5, 0.75, AMBER), (0.75, 1, GREEN)]
    gw = w / 4
    for k, (sig, nome, meta) in enumerate((('IEC', 'Comunicação', 80), ('IES', 'Stakeholders', 75), ('ICI', 'Impactos', 70),
                                           ('IPT', 'Capacitação', 80))):
        cx = x + gw * k + gw / 2
        gauge(s, cx, y + 78, 34, zones, meta=meta / 100, thick=0.34, value=None)
        s.text(cx - gw / 2, y + 60, gw, [P(f'≥ {meta}', 13, True, NAVY, lh=15, align='c')], check=False)
        s.text(cx - gw / 2, y + 90, gw, [P(f'{sig} · {nome}', 8, True, STEEL, lh=9.5, align='c')], check=False)
    s.text(x, y + 108, w, [P('Verde ≥ 75 · amarelo 50 a 74 · vermelho < 50. Ao lado, o termômetro P·E·A: 0,30 P + 0,40 E + 0,30 A.',
                             8.5, False, GREY, lh=10, align='c')], check=False)
    yy = y + 134
    kicker(s, x, yy, w, 'O CICLO QUE A FE RODA TODO MÊS')
    yy += 20
    chevrons(s, x, yy, w, 40, [('Medir', 'sem. 1'), ('Ler', 'sem. 2 · comitê'), ('Agir', 'sem. 3 e 4'),
                               ('Comunicar', 'fim do mês')], colors=[STEEL, NAVY, ORANGE, STEEL], size=8.5)
    s.text(x, yy + 48, w, [P('A medida mais longe da meta vira a ação do mês seguinte, com dono.', 9, True, NAVY, lh=11,
                             align='c')], check=False)


def g_processos(s, x, y, w, h):
    kicker(s, x, y, w, 'UM CICLO, CINCO PROCESSOS · ONDE CADA UM ESTÁ')
    cx, cy, R = x + w / 2, y + 150, 98
    nodes = [('Antecipa', 'Estratégia e inovação', 3), ('Decide', 'Gestão do portfólio', 2),
             ('Assegura', 'Contratos e fornecedores', 2), ('Garante', 'Governança e conformidade', 1),
             ('Sustenta', 'Capacitação e conhecimento', 1)]
    nw, nh = 104, 46
    for k, (verbo, nome, lvl) in enumerate(nodes):
        th = math.radians(-90 + k * 72)
        nx, ny = cx + R * math.cos(th), cy + R * math.sin(th)
        arrow(s, cx, cy, nx, ny, color=LINE, w=1, head=False)
    hub = shape_text(s, cx - 42, cy - 42, 84, 84, [P('Evolução das ferramentas', 8.5, True, WHITE, lh=10, align='c')],
                     fill=NAVY, prst=MSO_SHAPE.OVAL, ins=(6, 0, 6, 0))
    shadow(hub)
    for k, (verbo, nome, lvl) in enumerate(nodes):
        th = math.radians(-90 + k * 72)
        nx, ny = cx + R * math.cos(th) - nw / 2, cy + R * math.sin(th) - nh / 2
        c = card(s, nx, ny, nw, nh, fill=WHITE, line=LINE)
        s.text(nx + 8, ny + 5, nw - 16, [P(verbo.upper(), 7, True, ORANGE if lvl == 3 else STEEL, lh=8.5, spc=0.8),
                                         P(nome, 8.5, True, NAVY, lh=10)], check=False)
        for j in range(3):
            s.box(nx + 8 + j * 12, ny + nh - 11, 9, 5, fill=(ORANGE if lvl == 3 else STEEL) if j < lvl else LIGHT)
    s.text(x, y + h - 14, w, [P('Maturidade: diretrizes definidas · base estruturada · em execução inicial', 7.5, False, GREY,
                                lh=9, align='c')], check=False)


def g_slas(s, x, y, w, h):
    kicker(s, x, y, w, 'DA MEDIÇÃO AO COMPROMISSO · QUATRO DEGRAUS')
    steps = [('1', 'Consolidar a medição', 'baseline por Squad · ~3 meses de histórico'),
             ('2', 'Definir SLIs e SLOs', 'por serviço: funcionalidades e bugs'),
             ('3', 'Alinhar com as áreas', 'calibrar em piloto com DPL e DOP'),
             ('4', 'Formalizar os SLAs', 'exceções, escalonamento e revisão')]
    sw = (w - 18) / 4
    base = y + 206
    for k, (n, t, d) in enumerate(steps):
        sh_ = 70 + k * 30
        sx = x + k * (sw + 6)
        cor = [LIGHT, STEEL, SLATE, NAVY][k]
        s.box(sx, base - sh_, sw, sh_, fill=cor, prst=MSO_SHAPE.ROUNDED_RECTANGLE, adj=0.06)
        badge(s, sx + 8, base - sh_ + 8, 20, n, fill=ORANGE, size=9.5)
        s.text(sx + 6, base - sh_ + 34, sw - 12, [P(t, 9, True, NAVY if k == 0 else WHITE, lh=10.5),
                                                 P(d, 7.5, False, SLATE if k == 0 else LIGHT, lh=9, sb=2)], check=False)
    s.text(x, y + 16, w - 20, [P('histórico → meta interna (SLO) → compromisso (SLA)', 8, True, ORANGE, lh=9.5)], check=False)
    arrow(s, x, y + 32, x + w - 8, y + 32, color=ORANGE, w=1.5)
    yy = base + 10
    shape_text(s, x, yy, w, h - (yy - y), [P(runs=[('SLO ', True, NAVY), ('é meta interna, medida e validada. ', False, TXT),
                                                 ('SLA ', True, NAVY), ('é compromisso com DPL e DOP, por serviço.', False, TXT)],
                                            size=9.5, lh=11.5)], fill=PALE, prst=MSO_SHAPE.ROUNDED_RECTANGLE, adj=0.1,
               ins=(10, 4, 10, 4))


# Direções do Gerente Executivo: cada linha cita o fato do roadmap que a sustenta (slide de origem no comentário)
DIRECAO = {
    '01 · 02': [  # slides 4, 8, 11, 18 e 41
        ('Fechar as trilhas paralelas: toda demanda entra triada, formalizada e registrada no Azure DevOps.',
         'Qualquer que seja a origem. E-mail, conversa ou pedido direto ao especialista deixam de valer como entrada.'),
        ('Exigir o Azure DevOps nos fóruns de acompanhamento das comunidades.',
         'É critério de adoção da frente Ferramentas (20%) e pré-requisito da medição das Squads, que só começa na '
         '4ª semana de uso integral.'),
        ('Formalizar os líderes das Comunidades Técnicas e decidir sobre o PMO dedicado.',
         'Atribuições e responsabilidades dos líderes concluídas; PMO de suporte às Comunidades Técnicas avaliado '
         'conforme o modelo da Etapa 3.'),
    ],
    '03': [  # slides 8 e 9
        ('Aprovar a meta de 90% por frente, hoje uma proposta inicial.',
         'Sem meta aprovada não há régua: a FEG só declara estabilidade com 3 meses seguidos acima dela, em todas as '
         '5 frentes, por comunidade.'),
        ('Só reduzir a frequência depois de 3 meses estáveis.',
         'Apuração mensal nos meses 1 a 3; trimestral após a estabilização; de volta ao mensal na primeira queda de '
         'aderência.'),
        ('Manter 100% da apuração na FEG, com evidência objetiva por critério.',
         'Atendido ou não atendido, sem pontuação parcial; o responsável valida e nenhum desvio crítico fica sem '
         'plano de tratamento.'),
    ],
    '04': [  # slides 11 e 12
        ('Não cobrar desempenho antes da 4ª semana de Azure DevOps integral.',
         'As semanas 1 e 2 servem para estabilizar registros, estados e painéis; o acompanhamento oficial começa na '
         '4ª semana.'),
        ('Nomear quem analisa os painéis e com que periodicidade, em cada comunidade.',
         'Governança da medição: responsáveis, periodicidade e qualidade dos registros definidos antes da primeira '
         'leitura.'),
        ('Tratar a primeira leitura como linha de base, não como nota.',
         'Os primeiros resultados viram a referência; a partir deles, identificar gargalos e encaminhar ações de '
         'melhoria nas Squads.'),
    ],
    '05': [  # slides 17, 19, 20 e 23
        ('Tornar o gate das 8 perguntas a passagem obrigatória da Etapa 1 para a Etapa 2.',
         'Em 2 a 4 semanas, com vídeo, buddy e diagnóstico no dia 1; o novo integrante responde sem consultar o guia.'),
        ('Levar a Fase 1 da avaliação matricial ao próximo ciclo.',
         '1 a 3 metas individuais (70%) e ao menos 1 meta de contribuição à comunidade (30%), com input do Líder de '
         'Comunidade na nota final e regra para os profissionais DTA alocados na FE.'),
        ('Fechar as regras antes de abrir o ciclo.',
         'Alinhamento prévio entre Gerente Imediato e Líder de Comunidade, instância para divergências, Oracle HCM '
         'como ferramenta única e aderência medida por % de metas no prazo e % de feedbacks registrados.'),
    ],
    '06': [  # slide 36
        ('Nomear o dono de GMO de FEG, FEL, FEN e FER na semana 1.',
         'Um analista sênior por gerência, ~4h por semana nos meses 1 e 2 e ~2h depois. Decisão do Gerente Executivo '
         'com os quatro gerentes.'),
        ('Adotar o CMAK como régua do comitê mensal.',
         'Quatro índices com meta e semáforo e termômetro P·E·A ≥ 75 (meta proposta); índice abaixo da meta vira '
         'ficha de ação com dono no mês seguinte.'),
        ('Fixar o calendário da Onda 1.',
         'Comitê de abertura e workshop "GMO na prática" (4h) nas semanas 1 e 2; ponto de partida medido no fim do '
         'mês 2; 1ª leitura no comitê no mês 3.'),
    ],
    '07': [  # slides 41, 46, 50, 54 e 56
        ('Começar pelo portfólio: critérios de priorização e repriorização semestral.',
         'Entrada de iniciativas condicionada a prioridade e capacidade; o fórum semestral delibera sobre recursos '
         'financeiros, equipe e competências.'),
        ('Proteger o conhecimento crítico das ferramentas.',
         'Repositório técnico centralizado (GitHub) e documentação do Organon negociada com a HPPA. Metas: 100% dos '
         'conhecimentos críticos com ≥ 2 detentores e sucessor em toda posição crítica.'),
        ('Evoluir sobre o que já existe, sem estruturas paralelas.',
         'Controles contratuais e fluxo de demandas no Azure DevOps como base de contratos; fóruns e classificação '
         'de iniciativas mantidos no portfólio.'),
    ],
    '08': [  # slide 58
        ('Não assumir SLA antes de ~3 meses de histórico por Squad.',
         'Cycle time, lead time e backlog estabilizados formam a baseline. SLO é meta interna medida; SLA é '
         'compromisso com o negócio.'),
        ('Partir do catálogo da FE: novas funcionalidades e correção de bugs.',
         'SLOs por serviço e prioridade (ex.: tempo de resolução de bugs), validados com a FE e as Squads.'),
        ('Calibrar em piloto com DPL e DOP antes de formalizar.',
         'Só SLOs estáveis viram SLAs, com exceções, escalonamento e revisão periódica definidos.'),
    ],
}
for _f in FRENTES:
    _f['direcao'] = DIRECAO[_f['n']]

GRAFICOS = [g_fechamento, g_monitoramento, g_squads, g_pessoas, g_gmo, g_processos, g_slas]


# ------------------------------------------------------------------ slide de frente
def slide_frente(prs, layout, ref, f, idx, total, grafico):
    s = S(prs, layout, ref, idx, f['titulo'], f['sub'],
          f"Frente {f['n']} · {f['nome']}. Dono: {f['dono']}. Prazo: {f['prazo']}. Pergunta para o comitê: {f['pergunta']}")
    tag(s, f['n'].split(' ')[0], f"Frente {f['n']} · {f['nome']}", idx, total)
    yt, yb = 136, 448
    xl, wl = X0, 230
    xc, wc = xl + wl + 14, 352
    xr = xc + wc + 14
    wr = X1 - xr

    # esquerda: a entrega
    card(s, xl, yt, wl, yb - yt, fill=WHITE, line=LINE)
    s.box(xl, yt, wl, 30, fill=NAVY, prst=MSO_SHAPE.ROUNDED_RECTANGLE, adj=0.3)
    s.box(xl, yt + 16, wl, 14, fill=NAVY)
    s.text(xl + 14, yt + 9, wl - 28, [P('A ENTREGA', 8, True, ORANGE, lh=10, spc=1)], check=False)
    y = yt + 42
    for e in f['entrega']:
        y += s.text(xl + 14, y, wl - 28, [P(e, 11.5, True, NAVY, lh=14)]) + 8
    ty = yb - 70
    if y > ty - 6:
        WARN.append(f"{f['n']}: entrega encosta nos tiles ({y:.0f} > {ty - 6})")
    tw_ = (wl - 28 - 8) / 2
    for k, (lbl, val) in enumerate((('DONO', f['dono']), ('PRAZO', f['prazo']))):
        tx = xl + 14 + k * (tw_ + 8)
        s.box(tx, ty, tw_, 58, fill=PALE, prst=MSO_SHAPE.ROUNDED_RECTANGLE, adj=0.1)
        s.box(tx, ty, 3, 58, fill=ORANGE if k else STEEL)
        s.text(tx + 10, ty + 7, tw_ - 16, [P(lbl, 7.5, True, STEEL, lh=9, spc=1), P(val, 9, True, NAVY, lh=10.5, sb=3)],
               h=51, check=False)

    # centro: o mecanismo
    card(s, xc, yt, wc, yb - yt, fill=WHITE, line=LINE)
    grafico(s, xc + 14, yt + 14, wc - 28, yb - yt - 28)

    # direita: direção do GE
    card(s, xr, yt, wr, yb - yt, fill=NAVY, line=None)
    s.text(xr + 14, yt + 12, wr - 28, [P('DIREÇÃO DO GERENTE EXECUTIVO', 8, True, ORANGE, lh=10, spc=1)], check=False)
    ps = [[P(a, 10.5, True, WHITE, lh=12.5), P(b, 9, False, LIGHT, lh=10.8, sb=3)] for a, b in f['direcao']]
    hs = [H(p_, wr - 28 - 30) for p_ in ps]
    yy = yt + 38
    gap = max(10, min(30, (yb - 14 - yy - sum(hs)) / (len(hs) - 1)))
    for i, (p_, h) in enumerate(zip(ps, hs), start=1):
        badge(s, xr + 14, yy - 1, 20, str(i), fill=ORANGE, size=9.5)
        s.text(xr + 14 + 30, yy, wr - 28 - 30, p_)
        yy += h + gap
    if yy - gap > yb - 8:
        WARN.append(f"{f['n']}: direção passa ({yy - gap:.0f})")

    # balão: pergunta para o comitê
    by = yb + 12
    bub = s.box(X0 + 44, by, X1 - X0 - 44, 40, fill=PEACH, prst=MSO_SHAPE.ROUNDED_RECTANGULAR_CALLOUT, adj=0.16)
    bub.adjustments[0] = -0.46
    bub.adjustments[1] = -0.3
    badge(s, X0, by + 2, 36, '?', fill=ORANGE, size=18)
    s.text(X0 + 60, by, X1 - X0 - 76, [P(runs=[('NO COMITÊ, PERGUNTE:  ', True, ORANGE), (f['pergunta'], True, NAVY)],
                                          size=11.5, lh=14)], h=40, anchor='m')
    s.check(f"frente {f['n']}")


def main():
    src = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dist',
                                                             'Roadmap_Evolucao_Modelo_Frentes_GE_v2.pptx')
    prs = Presentation(src)
    layout = next(l for m in prs.slide_masters for l in m.slide_layouts if l.name == LAYOUT)
    ref = next(s for s in prs.slides if any(sh.name == 'Etiqueta secao_30' for sh in s.shapes))
    n_orig = len(prs.slides)
    total = len(FRENTES) + 1
    slide_timeline(prs, layout, ref, total)
    for i, (f, g) in enumerate(zip(FRENTES, GRAFICOS), start=1):
        slide_frente(prs, layout, ref, f, i, total, g)
    prune(prs, layout, n_orig)
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    prs.save(out)
    for w in WARN:
        print('ATENÇÃO:', w)
    print('ok', out)


if __name__ == '__main__':
    main()
