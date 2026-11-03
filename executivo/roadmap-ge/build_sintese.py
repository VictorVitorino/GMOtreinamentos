"""Síntese gerencial do roadmap de monitoramento e evolução do Modelo de Operação, para o Gerente Executivo da FE.

Uso: python3 build_sintese.py <AM_Etapa_5_-_Roadmap_de_evolucao_do_modelo.pptx> [saida.pptx]

Três slides no template do próprio roadmap (layout AM_CONTEUDO e etiqueta de seção): plano de entrega,
painel de acompanhamento e agenda de decisões. Conteúdo só do roadmap (slides indicados nos comentários).
"""
import copy
import os
import re
import sys

from PIL import ImageFont
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, MSO_AUTO_SIZE, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Emu, Pt

SRC = sys.argv[1] if len(sys.argv) > 1 else None
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(
    os.path.dirname(os.path.abspath(__file__)), 'dist', 'Sintese_Gerencial_Roadmap_Evolucao_Modelo.pptx')
LAYOUT = 'AM_CONTEUDO'

NAVY, SLATE, STEEL, LIGHT, PALE, ORANGE, PEACH = '002A46', '33546D', '5E8AB3', 'CCD4DA', 'EEF2F5', 'F78C16', 'FDE8D0'
TXT, GREY, LINE, WHITE = '404040', '7C8893', 'D8D8D8', 'FFFFFF'
COND = 'Arial Nova Cond'
WARN = []
_f = {}


def tw(t, size, bold=False):
    k = 'Bold' if bold else 'Regular'
    if k not in _f:
        _f[k] = ImageFont.truetype(f'/usr/share/fonts/truetype/liberation/LiberationSans-{k}.ttf', 200)
    return _f[k].getlength(t) * size / 200 * 0.84 * 1.05


def nlines(runs, size, width):
    n, cur, sp = 1, 0.0, 0.0
    for t, b, _ in runs:
        for tok in re.findall(r'\S+|\s+', t):
            w = tw(tok, size, b)
            if tok.isspace():
                sp += w
                continue
            if cur and cur + sp + w > width:
                n, cur = n + 1, w
            else:
                cur += sp + w
            sp = 0.0
    return n


def E(pt):
    return Emu(int(round(pt * 12700)))


def P(text=None, size=10, bold=False, color=TXT, lh=None, sb=0, align='l', runs=None, spc=0):
    return dict(runs=runs or [(text, bold, color)], size=size, lh=lh or round(size * 1.2, 2), sb=sb, align=align, spc=spc)


def H(paras, w):
    return sum(nlines(p['runs'], p['size'], w) * p['lh'] + (p['sb'] if i else 0) for i, p in enumerate(paras))


class S:
    def __init__(self, prs, layout, ref, n, title, sub, notes):
        self.sl = prs.slides.add_slide(layout)
        self.rects = []
        for ph in list(self.sl.placeholders):
            i = ph.placeholder_format.idx
            if i not in (109, 110):
                ph._element.getparent().remove(ph._element)
                continue
            ph.text_frame.text = title if i == 109 else sub
            for r in ph.text_frame.paragraphs[0].runs:
                r._r.get_or_add_rPr().set('lang', 'pt-BR')
        if tw(title, 27 / 0.84) > 864 + 1:
            WARN.append(f'título longo: {title}')
        # etiqueta de seção e número, como nos slides do roadmap
        tree = self.sl.shapes._spTree
        for sh in ref.shapes:
            if sh.name in ('Etiqueta secao_30', 'Etiqueta ponto_31', 'Texto_32', 'Nº 03') or sh.is_placeholder and \
                    sh.placeholder_format.idx == 4294967295:
                el = copy.deepcopy(sh._element)
                tree.append(el)
        for sh in self.sl.shapes:
            if sh.name == 'Texto_32':
                sh.text_frame.paragraphs[0].runs[0].text = 'Síntese gerencial · Gerente Executivo'
                for r in sh.text_frame.paragraphs[0].runs[1:]:
                    r.text = ''
            if sh.name == 'Nº 03':
                sh.text_frame.paragraphs[0].runs[0].text = f'{n:02d}'
        self.sl.notes_slide.notes_text_frame.text = notes

    def box(self, x, y, w, h, fill=None, line=None, lw=0.75, prst=MSO_SHAPE.RECTANGLE, adj=None):
        s = self.sl.shapes.add_shape(prst, E(x), E(y), E(w), E(h))
        st = s._element.find(qn('p:style'))
        if st is not None:
            s._element.remove(st)
        if fill:
            s.fill.solid()
            s.fill.fore_color.rgb = RGBColor.from_string(fill)
        else:
            s.fill.background()
        if line:
            s.line.color.rgb = RGBColor.from_string(line)
            s.line.width = Pt(lw)
        else:
            s.line.fill.background()
        if adj is not None:
            s.adjustments[0] = adj
        return s

    def text(self, x, y, w, paras, h=None, anchor='t', check=True):
        need = H(paras, w)
        hh = need if h is None else h
        if need > hh + 0.5:
            WARN.append(f'texto estoura ({need:.0f} > {hh:.0f}): {paras[0]["runs"][0][0][:40]}')
        tb = self.sl.shapes.add_textbox(E(x), E(y), E(w), E(hh))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.auto_size = MSO_AUTO_SIZE.NONE
        bp = tf._txBody.bodyPr
        for a in ('lIns', 'tIns', 'rIns', 'bIns'):
            bp.set(a, '0')
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
                rp = r._r.get_or_add_rPr()
                rp.set('lang', 'pt-BR')
                if p['spc']:
                    rp.set('spc', str(int(p['spc'] * 100)))
        if check:
            self.rects.append((paras[0]['runs'][0][0][:30], x, y, w, hh))
        return need

    def check(self, label):
        R = self.rects
        for i, (a, x, y, w, h) in enumerate(R):
            for b, x2, y2, w2, h2 in R[i + 1:]:
                if x < x2 + w2 - 0.5 and x2 < x + w - 0.5 and y < y2 + h2 - 0.5 and y2 < y + h - 0.5:
                    WARN.append(f'{label}: "{a}" sobrepõe "{b}"')
            if y + h > 508:
                WARN.append(f'{label}: "{a}" passa do rodapé ({y + h:.0f})')


X0, X1 = 48, 912

# ------------------------------------------------------------------ 1. plano de entrega (slides 3 e 4 do roadmap)
HORIZONTES = [
    ('FECHAR A\nOPERAÇÃO\nASSISTIDA', STEEL, [
        ('01', 'Adoção contínua do backlog e Azure DevOps', 'FEG',
         'Fluxo padronizado e demandas atualizadas no Azure DevOps, com qualidade da informação governada', [(0, 1)], '4 semanas'),
        ('02', 'Conclusão da implantação das Comunidades Técnicas', 'Comunidades Técnicas',
         'Ritos, papéis, responsabilidades e interfaces das Comunidades Técnicas consolidados', [(0, 0.5)], '2 semanas'),
    ]),
    ('MONITORAR\nO MODELO', SLATE, [
        ('03', 'Monitoramento do modelo operacional', 'FEG',
         'Aderência de cada comunidade às 5 frentes de adoção, apurada todo mês e com desvios tratados', [(0, 3)], '3 meses'),
        ('04', 'Acompanhamento da performance das Squads', 'Líderes de Comunidade e FEG',
         'Painel de indicadores no Power BI em uso a partir da 4ª semana de Azure DevOps integral', [(0, 3)], '3 meses'),
    ]),
    ('EVOLUIR\nO MODELO', NAVY, [
        ('05', 'Gestão de pessoas', 'FEG e GP',
         'Onboarding de novos profissionais institucionalizado; avaliação de desempenho matricial em uso',
         [(0, 2), (0, 6)], 'Onboarding 2 meses · Avaliação 6 meses'),
        ('06', 'Continuidade da Gestão da Mudança', 'Gerentes e Líderes de Comunidade',
         'GMO como processo da FE: um dono por gerência e quatro índices lidos no comitê mensal', [(0, 6)], '6 meses'),
        ('07', 'Padronização e evolução dos processos de suporte', 'FEG',
         'Cinco processos integrados: estratégia e inovação, portfólio, contratos, governança e conhecimento',
         [(0, 12)], '12 meses'),
        ('08', 'Definição e alinhamento de SLAs com as áreas de negócio', 'Líderes de Comunidade',
         'SLAs por serviço formalizados com DPL e DOP, a partir dos SLOs validados', [(0, 12)], '12 meses'),
    ]),
]


def slide_plano(prs, layout, ref, horizontes=None, col='ENTREGA ESPERADA',
                title='Plano de entrega: oito ações em três horizontes',
                sub='O que a FE recebe de cada ação, quem responde por ela e em quanto tempo'):
    horizontes = horizontes or HORIZONTES
    s = S(prs, layout, ref, 1, title, sub,
          'Síntese das 8 ações do roadmap de monitoramento e evolução do Modelo de Operação. Fechamento da Operação '
          'Assistida em até 1 mês; monitoramento nos 3 primeiros meses; evolução do modelo em 6 a 12 meses.')
    cH, cA, cD, cE = 74, 176, 104, 248
    g = 8
    xA = X0 + cH + g
    xD = xA + 28 + cA + g
    xE = xD + cD + g
    xG = xE + cE + g
    mw = (X1 - xG) / 12
    y0 = 128
    for x, w, t in ((xA, 28 + cA, 'AÇÃO'), (xD, cD, 'RESPONSÁVEL'), (xE, cE, col)):
        s.text(x, y0, w, [P(t, 8, True, STEEL, spc=1)])
    for m in range(12):
        s.text(xG + m * mw, y0, mw, [P(f'M{m + 1}', 8, True, STEEL, align='c')])
    y = y0 + 18
    s.box(X0, y - 4, X1 - X0, 0.75, fill=NAVY)
    rows = []
    for _, _, acoes in horizontes:
        for a in acoes:
            hh = max(H([P(a[1], 10, True, NAVY, lh=12)], cA), H([P(a[2], 9.5, False, TXT, lh=11.5)], cD),
                     H([P(a[3], 9.5, False, TXT, lh=11.5)], cE), 24)
            rows.append(hh)
    pad = max(10, min(24, (500 - y - sum(rows)) / len(rows)))
    rows = [r + pad for r in rows]
    total = sum(rows)
    for m in range(13):
        s.box(xG + m * mw, y0 + 14, 0.4, y + total - y0 - 14, fill=LINE)
    if y + total > 506:
        WARN.append(f'plano: tabela passa ({y + total:.0f})')
    k = 0
    for hz, cor, acoes in horizontes:
        hz_h = sum(rows[k:k + len(acoes)])
        s.box(X0, y, cH, hz_h - 3, fill=PALE)
        s.box(X0, y, 3, hz_h - 3, fill=cor)
        s.text(X0 + 10, y, cH - 14, [P(hz, 8.5, True, cor, lh=10.5, spc=0.5)], h=hz_h - 3, anchor='m')
        for a in acoes:
            n, acao, dono, entrega, barras, prazo = a
            h = rows[k]
            k += 1
            num = s.box(xA, y + (h - 20) / 2, 20, 20, fill=cor, prst=MSO_SHAPE.OVAL)
            num.text_frame.text = n
            p0 = num.text_frame.paragraphs[0]
            p0.alignment = PP_ALIGN.CENTER
            p0.runs[0].font.size, p0.runs[0].font.bold, p0.runs[0].font.name = Pt(8.5), True, COND
            p0.runs[0].font.color.rgb = RGBColor.from_string(WHITE)
            bp = num.text_frame._txBody.bodyPr
            for att in ('lIns', 'tIns', 'rIns', 'bIns'):
                bp.set(att, '0')
            num.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE
            s.text(xA + 28, y, cA, [P(acao, 10, True, NAVY, lh=12)], h=h - 2, anchor='m')
            s.text(xD, y, cD, [P(dono, 9.5, False, TXT, lh=11.5)], h=h - 2, anchor='m')
            s.text(xE, y, cE, [P(entrega, 9.5, False, TXT, lh=11.5)], h=h - 2, anchor='m')
            bh = 9 if len(barras) > 1 else 14
            for j, (ini, dur) in enumerate(barras):
                by = y + (h - bh * len(barras) - 3 * (len(barras) - 1)) / 2 + j * (bh + 3)
                s.box(xG + ini * mw + 1, by, dur * mw - 2, bh, fill=cor)
            dur_max = max(d for _, d in barras)
            lx = xG + dur_max * mw + 4
            if dur_max < 10:
                s.text(lx, y, X1 - lx, [P(prazo, 8.5, False, GREY, lh=10)], h=h - 2, anchor='m', check=False)
            else:
                s.text(xG + 4, y, 120, [P(prazo, 8.5, True, WHITE, lh=10)], h=h - 2, anchor='m', check=False)
            s.box(xA, y + h - 1, X1 - xA, 0.5, fill=LINE)
            y += h
    s.check('plano')
    return s


# ------------------------------------------------------------------ 2. painel (slides 8, 9, 11-12, 26-27, 33 e 58)
LEITURAS = [
    ('1', 'Aderência ao modelo', 'O modelo continua sendo aplicado?'),
    ('2', 'Performance das Squads', 'As entregas fluem?'),
    ('3', 'Gestão da Mudança', 'As pessoas aderiram?'),
    ('4', 'Nível de serviço', 'O negócio está sendo atendido?'),
]
LINHAS = [
    ('O QUE MEDIR', [
        '5 frentes por comunidade: ritos e fóruns, papéis, interfaces com o negócio, ferramentas oficiais e fluxo de backlog',
        'Cycle time e lead time, backlog e demandas atrasadas, demandas por prioridade e carga por responsável',
        '4 índices: Comunicação, Stakeholders, Impactos e Capacitação, mais o termômetro P·E·A',
        'SLOs por serviço (novas funcionalidades e correção de bugs), que viram SLAs com DPL e DOP',
    ]),
    ('RÉGUA', [
        '≥ 90% em cada frente, por 3 meses seguidos, e nenhum desvio crítico sem plano',
        'Primeiros resultados viram a referência; cerca de 3 meses de histórico formam a baseline',
        'Metas de 70 a 80 por índice; semáforo verde ≥ 75, amarelo 50–74, vermelho < 50',
        'SLOs validados com as áreas clientes antes de virar SLA',
    ]),
    ('CADÊNCIA E QUEM REPORTA', [
        'Mensal nos meses 1 a 3, depois trimestral · FEG',
        'Periódica, a partir da 4ª semana de Azure DevOps integral, no Power BI · Líderes de Comunidade e FEG',
        'Comitê mensal da FE · donos de GMO de cada gerência',
        'Revisão periódica, com exceções e escalonamento definidos · Líderes de Comunidade',
    ]),
    ('QUANDO AGIR', [
        'Queda de aderência: volta ao acompanhamento mensal',
        'Gargalos e atrasos: ações de melhoria encaminhadas',
        'A medida mais longe da meta vira a ação do mês seguinte, com dono',
        'Desvio de nível de serviço: escalonamento previsto no SLA',
    ]),
]


def slide_painel(prs, layout, ref):
    s = S(prs, layout, ref, 2, 'Painel do Gerente Executivo: quatro leituras do modelo',
          'O que medir em cada leitura, a régua, a cadência e o sinal que pede ação',
          'Quatro leituras resumem o acompanhamento: aderência ao modelo (FEG), performance das Squads (Power BI), '
          'índices de Gestão da Mudança (comitê mensal) e nível de serviço (SLOs e SLAs).')
    lw, g = 104, 8
    cw = (X1 - X0 - lw - 4 * g) / 4
    y = 128
    hh = max(H([P(q, 9.5, False, WHITE, lh=11.5)], cw - 20) for _, _, q in LEITURAS) + 40
    for i, (n, t, q) in enumerate(LEITURAS):
        x = X0 + lw + g + i * (cw + g)
        s.box(x, y, cw, hh, fill=NAVY if i else NAVY)
        s.text(x + 10, y + 8, 18, [P(n, 18, True, ORANGE, lh=20)])
        s.text(x + 30, y + 10, cw - 40, [P(t, 11.5, True, WHITE, lh=13.5)])
        s.text(x + 10, y + 30, cw - 20, [P(q, 9.5, False, LIGHT, lh=11.5)])
    y += hh + 6
    alts = [max(H([P(v, 10, False, TXT, lh=12.2)], cw - 16) for v in vals) for _, vals in LINHAS]
    pad = max(14, min(34, (500 - y - sum(alts)) / len(alts)))
    for k, ((rot, vals), a) in enumerate(zip(LINHAS, alts)):
        rh = a + pad
        if k % 2 == 0:
            s.box(X0, y, X1 - X0, rh, fill=PALE)
        s.text(X0 + 8, y, lw - 12, [P(rot, 8, True, STEEL, lh=10, spc=0.8)], h=rh, anchor='m')
        for i, v in enumerate(vals):
            x = X0 + lw + g + i * (cw + g)
            s.text(x + 8, y, cw - 16, [P(v, 10, k == 1, NAVY if k == 1 else TXT, lh=12.2)], h=rh, anchor='m')
        y += rh
    if y > 506:
        WARN.append(f'painel passa ({y:.0f})')
    s.check('painel')


# ------------------------------------------------------------------ 3. agenda de decisões (slides 9, 25, 27, 41, 46 e 58)
RITMO = [
    ('MENSAL', 'Comitê da FE', 'Lê os índices de Gestão da Mudança, o termômetro P·E·A e a aderência ao modelo; decide e comunica.'),
    ('MENSAL', 'Fórum de portfólio', 'Acompanha a evolução das iniciativas e os indicadores de prospecção.'),
    ('TRIMESTRAL', 'Aderência ao modelo', 'Após a estabilização, a FEG passa a apurar a cada trimestre.'),
    ('SEMESTRAL', 'Repriorização do portfólio', 'Revisa prioridades e alocação de recursos com os critérios formalizados.'),
]
DECISOES = [
    ('Nomear os donos de GMO de cada gerência', 'e aprovar metas e semáforo dos quatro índices no comitê de abertura.'),
    ('Confirmar a meta de aderência', 'de 90% por frente, hoje uma proposta inicial.'),
    ('Formalizar os líderes das Comunidades Técnicas', 'e avaliar um PMO dedicado ao suporte a elas.'),
    ('Aprovar os critérios de priorização', 'de novas iniciativas e o ciclo semestral de repriorização do portfólio.'),
    ('Validar os SLOs com DPL e DOP', 'antes de serem formalizados como SLAs.'),
]


def slide_agenda(prs, layout, ref):
    s = S(prs, layout, ref, 3, 'Agenda do Gerente Executivo: ritmo de gestão e decisões',
          'Os fóruns que sustentam o acompanhamento e cinco decisões que destravam o plano',
          'Ritmo: comitê mensal da FE, fórum mensal de portfólio, apuração trimestral de aderência após estabilização e '
          'repriorização semestral do portfólio. Cinco decisões do Gerente Executivo destravam o plano.')
    y0 = 128
    lw = 400
    s.text(X0, y0, lw, [P('RITMO DE GESTÃO', 8, True, STEEL, spc=1)])
    y = y0 + 18
    fy = 506 - 44
    alts = [max(H([P(f, 11, True, NAVY, lh=13), P(d, 10, False, TXT, lh=12, sb=2)], lw - 98), 30) for _, f, d in RITMO]
    pad = max(14, min(40, (fy - 12 - y - sum(alts)) / len(alts)))
    for (cad, forum, d), a in zip(RITMO, alts):
        h = a + pad
        s.box(X0, y, lw, h - 6, fill=PALE)
        s.box(X0, y, 3, h - 6, fill=STEEL)
        s.text(X0 + 12, y, 74, [P(cad, 8.5, True, STEEL, lh=10, spc=0.8)], h=h - 6, anchor='m')
        s.text(X0 + 90, y, lw - 98, [P(forum, 11, True, NAVY, lh=13), P(d, 10, False, TXT, lh=12, sb=2)], h=h - 6,
               anchor='m')
        y += h
    rx = X0 + lw + 24
    rw = X1 - rx
    s.box(rx, y0, rw, fy - 12 - y0, fill=NAVY)
    s.text(rx + 18, y0 + 16, rw - 36, [P('DECISÕES DO GERENTE EXECUTIVO', 8, True, ORANGE, spc=1)])
    yy = y0 + 42
    ps = [[P(runs=[(a + ' ', True, WHITE), (b, False, LIGHT)], size=11, lh=13.5)] for a, b in DECISOES]
    hs = [H(p_, rw - 36 - 30) for p_ in ps]
    gap = max(12, min(30, (fy - 12 - 16 - yy - sum(hs)) / (len(hs) - 1)))
    for i, (paras, h) in enumerate(zip(ps, hs), start=1):
        s.text(rx + 18, yy - 2, 22, [P(f'{i}', 16, True, ORANGE, lh=17)])
        s.text(rx + 18 + 30, yy, rw - 36 - 30, paras)
        yy += h + gap
    if yy - gap > fy - 12:
        WARN.append(f'decisões passam ({yy:.0f})')
    s.box(X0, fy, X1 - X0, 40, fill=PEACH)
    s.box(X0, fy, 3, 40, fill=ORANGE)
    s.text(X0 + 16, fy, X1 - X0 - 32, [P(runs=[('Mudar é um evento. Sustentar é gestão. ', True, NAVY),
                                              ('A Gestão da Mudança deixa de ser projeto e vira processo da FE, com dono, '
                                               'número e ritual.', False, TXT)], size=11, lh=13.5)], h=40, anchor='m')
    s.check('agenda')


def prune(prs, layout, n_orig):
    lst = prs.slides._sldIdLst
    for sid in list(lst)[:n_orig]:
        prs.part.drop_rel(sid.rId)
        lst.remove(sid)
    keep = layout.slide_master
    mlst = prs.part._element.find(qn('p:sldMasterIdLst'))
    for mid in list(mlst):
        rid = mid.get(qn('r:id'))
        if prs.part.related_part(rid) is not keep.part:
            prs.part.drop_rel(rid)
            mlst.remove(mid)
    for lay in list(keep.slide_layouts):
        if lay.part is not layout.part:
            keep.slide_layouts.remove(lay)


def main():
    prs = Presentation(SRC)
    layout = next(l for m in prs.slide_masters for l in m.slide_layouts if l.name == LAYOUT)
    ref = next(s for s in prs.slides if any(sh.name == 'Etiqueta secao_30' for sh in s.shapes))
    n_orig = len(prs.slides)
    for fn in (slide_plano, slide_painel, slide_agenda):
        fn(prs, layout, ref)
    prune(prs, layout, n_orig)
    os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)
    prs.save(OUT)
    for w in WARN:
        print('ATENÇÃO:', w)
    print('ok', OUT)


if __name__ == '__main__':
    main()
