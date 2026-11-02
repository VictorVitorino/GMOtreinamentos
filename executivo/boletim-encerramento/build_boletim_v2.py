"""Boletim Maestro de encerramento da Operação Assistida, versão 2: um slide editável, conteúdo reorganizado.

Uso: python3 build_boletim_v2.py <boletim_mensal.pptx> [saida.pptx]

Mantém do boletim mensal só a identidade: layout com logos, faixa BOLETIM e texto de abertura, ícones e rodapé.
O corpo é novo: abertura com números, a jornada mês a mês, o que vem agora e a mensagem do Marcelo Prais.
Fonte: status semanais do Comitê Gestor da Operação Assistida (13/07 a 30/10/2026).
"""
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

SRC = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(
    os.path.dirname(os.path.abspath(__file__)), 'dist', 'Boletim_Maestro_Encerramento_Operacao_Assistida_v2.pptx')

VERDE, VERDE_ESC, AMARELO, OLIVA = '486018', '3D5714', 'D4D300', '8A9B67'
TXT, TXT2, BORDA, CLARO, BRANCO = '55585B', '7B7E80', 'E2E4DF', 'F0F2EB', 'FFFFFF'
TIT, CORPO = 'Roboto', 'Arial'
W = 540
WARN = []

_f = {}


def tw(t, size, bold=False):
    k = 'Bold' if bold else 'Regular'
    if k not in _f:
        _f[k] = ImageFont.truetype(f'/usr/share/fonts/truetype/liberation/LiberationSans-{k}.ttf', 200)
    return _f[k].getlength(t) * size / 200 * 1.04


def nlines(text, size, width, bold=False):
    n = 0
    for par in text.split('\n'):
        n += 1
        cur = 0.0
        for w in re.findall(r'\S+', par):
            ww = tw(w, size, bold)
            sp = tw(' ', size, bold)
            if cur and cur + sp + ww > width:
                n += 1
                cur = ww
            else:
                cur += (sp if cur else 0) + ww
    return n


def E(pt):
    return Emu(int(round(pt * 12700)))


class Bol:
    def __init__(self, slide):
        self.s = slide

    def box(self, x, y, w, h, fill=None, line=None, lw=0.75, prst=MSO_SHAPE.RECTANGLE, radius=None):
        sh = self.s.shapes.add_shape(prst, E(x), E(y), E(w), E(h))
        st = sh._element.find(qn('p:style'))
        if st is not None:
            sh._element.remove(st)
        if fill:
            sh.fill.solid()
            sh.fill.fore_color.rgb = RGBColor.from_string(fill)
        else:
            sh.fill.background()
        if line:
            sh.line.color.rgb = RGBColor.from_string(line)
            sh.line.width = Pt(lw)
        else:
            sh.line.fill.background()
        if radius is not None:
            sh.adjustments[0] = radius
        return sh

    def text(self, x, y, w, paras, h=None, anchor='t', align='l'):
        """paras: lista de (runs, tamanho, entrelinha, espaço_antes); runs: lista de (texto, fonte, negrito, cor)."""
        need = 0
        for i, (runs, size, lh, sb) in enumerate(paras):
            t = ''.join(r[0] for r in runs)
            need += nlines(t, size, w, any(r[2] for r in runs)) * lh + (sb if i else 0)
        hh = need if h is None else h
        if need > hh + 0.5:
            WARN.append(f'texto estoura ({need:.0f} > {hh:.0f}): {paras[0][0][0][0][:40]}')
        tb = self.s.shapes.add_textbox(E(x), E(y), E(w), E(hh))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.auto_size = MSO_AUTO_SIZE.NONE
        bp = tf._txBody.bodyPr
        for a in ('lIns', 'tIns', 'rIns', 'bIns'):
            bp.set(a, '0')
        tf.vertical_anchor = {'t': MSO_ANCHOR.TOP, 'm': MSO_ANCHOR.MIDDLE, 'b': MSO_ANCHOR.BOTTOM}[anchor]
        for i, (runs, size, lh, sb) in enumerate(paras):
            p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            p.alignment = {'l': PP_ALIGN.LEFT, 'c': PP_ALIGN.CENTER, 'r': PP_ALIGN.RIGHT}[align]
            p.line_spacing = Pt(lh)
            p.space_before = Pt(sb if i else 0)
            for t, font, bold, cor in runs:
                r = p.add_run()
                r.text = t
                r.font.name, r.font.size, r.font.bold = font, Pt(size), bold
                r.font.color.rgb = RGBColor.from_string(cor)
                r._r.get_or_add_rPr().set('lang', 'pt-BR')
        return need

    def secao(self, y, titulo, icone):
        """Cabeçalho de seção no estilo dos boletins: círculo amarelo com ícone, título verde e filete."""
        self.box(6, y, 40, 40, fill=AMARELO, prst=MSO_SHAPE.OVAL)
        if icone is not None:
            icone.left, icone.top, icone.width, icone.height = E(10), E(y + 4), E(32), E(32)
            self.s.shapes._spTree.append(icone._element)  # traz o ícone para a frente do círculo
        self.text(56, y + 6, 420, [([(titulo, TIT, True, VERDE)], 16, 19, 0)])
        self.box(56, y + 30, 300, 1.2, fill=AMARELO)


def p(runs, size=8, lh=None, sb=0):
    return (runs, size, lh or round(size * 1.25, 2), sb)


def r(t, bold=False, cor=TXT, font=CORPO):
    return (t, font, bold, cor)


NUMEROS = [('9', 'Comunidades em funcionamento: 6 de Entrega e 3 Técnicas'),
           ('100%', 'de aderência das Comunidades de Entrega a ritos, papéis e interfaces'),
           ('5', 'frentes de adoção acompanhadas em cada Comunidade'),
           ('3', 'treinamentos do novo modelo publicados no ONS Educa+')]
JORNADA = [
    ('01', 'Estrutura definida', 'Escopo, processos e integrações das Gerências e Comunidades detalhados com gerentes e '
                                 'líderes; processos herdados realocados.'),
    ('02', 'Modelo apropriado', 'Modelo apresentado às áreas clientes, lideranças diagnosticadas e Representantes de '
                                'Negócio formalizados nas Comunidades.'),
    ('03', 'Capacidades desenvolvidas', 'Trilha de capacitação no ONS Educa+, Guia de Bolso Interativo e Rede de '
                                        'Influenciadores sustentando a adoção.'),
    ('04', 'Modelo em operação', 'Azure DevOps em produção, backlog das Comunidades carregado e Comunidades de Entrega '
                                 'atuando com as áreas de negócio.'),
]
AGORA = [
    ('Consolidação do modelo', 'Roadmap de monitoramento e evolução do modelo.'),
    ('Comunidades Técnicas', 'Apresentação às áreas de negócio e acompanhamento da adoção.'),
    ('Iniciativas piloto', 'Base de dados EMT e modelo sandbox conduzidos no novo modelo.'),
]
MENSAGEM = [
    'O encerramento da operação assistida do Projeto Maestro representa um marco importante na jornada de '
    'fortalecimento da autonomia tecnológica do ONS.',
    'Ao longo dessa trajetória, avançamos na estruturação de um modelo de atuação mais integrado, colaborativo e '
    'preparado para responder, com agilidade e rigor técnico, aos desafios cada vez mais complexos do Sistema '
    'Interligado Nacional.',
    'Agradeço a todos os profissionais, lideranças e parceiros envolvidos pelo comprometimento, dedicação e '
    'contribuições ao longo dessa construção coletiva.',
    'Encerramos uma etapa, mas seguimos com a responsabilidade de consolidar as novas práticas, fortalecer nossas '
    'capacidades internas e ampliar nosso papel como orquestradores de um ecossistema tecnológico inovador.',
    'O futuro do FE será construído pela capacidade de transformar o modelo que desenhamos em resultados consistentes '
    'e duradouros.',
]


def main():
    prs = Presentation(SRC)
    lst = prs.slides._sldIdLst
    for sid in list(lst)[1:]:
        prs.part.drop_rel(sid.rId)
        lst.remove(sid)
    s = prs.slides[0]
    s._element.attrib.pop('show', None)
    by_id = {}

    def walk(shapes):
        for x in shapes:
            yield x
            if x.shape_type == 6:
                yield from walk(x.shapes)
    for x in walk(s.shapes):
        by_id[x.shape_id] = x
    porta, alvo, lampada = by_id[6], by_id[20], by_id[177]
    data = by_id[67]
    manter = {6, 20, 177, 67, 169, 171, 23}
    for x in list(s.shapes):
        if x.shape_id not in manter:
            x._element.getparent().remove(x._element)
    B = Bol(s)
    data.text_frame.paragraphs[0].runs[0].text = 'Outubro/26'

    # 1. abertura
    y = 240
    B.secao(y, 'OPERAÇÃO ASSISTIDA CONCLUÍDA', porta)
    hi = B.text(56, y + 38, 460, [p([r('O novo Modelo de Operação da FE está em funcionamento. ', True, VERDE),
                                r('Gerências e Comunidades estruturadas, governança ativa e ferramentas oficiais em '
                                  'produção: a etapa se encerra com o modelo pronto para ser consolidado na rotina.')],
                               9.5, 12)])
    ty, th, gap = y + 38 + hi + 10, 70, 8
    tw_ = (W - 36 - 3 * gap) / 4
    for i, (n, leg) in enumerate(NUMEROS):
        x = 18 + i * (tw_ + gap)
        B.box(x, ty, tw_, th, fill=VERDE_ESC if i == 1 else BRANCO, line=None if i == 1 else BORDA,
              prst=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.12)
        dark = i == 1
        B.text(x + 6, ty + 7, tw_ - 12, [p([r(n, True, AMARELO if dark else VERDE, TIT)], 22, 24)], align='c')
        B.text(x + 6, ty + 33, tw_ - 12, [p([r(leg, False, BRANCO if dark else TXT)], 7.8, 9.4)], align='c')

    # 2. jornada
    y = ty + th + 18
    B.secao(y, 'O QUE CONSTRUÍMOS', alvo)
    jy = y + 46
    B.box(18, jy + 11, W - 36, 2, fill=AMARELO)
    cw = (W - 36 - 3 * gap) / 4
    hj = 0
    for i, (m, t, d) in enumerate(JORNADA):
        x = 18 + i * (cw + gap)
        B.box(x + cw / 2 - 20, jy, 40, 24, fill=VERDE if i < 3 else VERDE_ESC, prst=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.5)
        B.text(x + cw / 2 - 20, jy, 40, [p([r(m, True, BRANCO, TIT)], 9, 11)], h=24, anchor='m', align='c')
        hj = max(hj, B.text(x + 4, jy + 34, cw - 8, [p([r(t, True, VERDE_ESC)], 9.6, 11.5),
                                                     p([r(d, False, TXT)], 8.3, 10.3, 3)]))
    # 3. e agora
    y = jy + 34 + hj + 20
    B.secao(y, 'PRÓXIMOS PASSOS', lampada)
    ay = y + 44
    aw = (W - 36 - 2 * gap) / 3
    ah = 52
    for i, (t, d) in enumerate(AGORA):
        x = 18 + i * (aw + gap)
        B.box(x, ay, aw, ah, fill=CLARO, prst=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.15)
        B.box(x, ay + 8, 3, ah - 16, fill=AMARELO)
        B.text(x + 12, ay, aw - 20, [p([r(t, True, VERDE_ESC)], 9.4, 11.2), p([r(d, False, TXT)], 8.2, 10, 2)], h=ah, anchor='m')

    # 4. mensagem
    my = ay + ah + 16
    mh = 936 - my
    B.box(18, my, W - 36, mh, fill=VERDE_ESC, prst=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.05)
    B.text(30, my + 2, 40, [p([r('“', True, AMARELO, 'Georgia')], 44, 44)])
    corpo = [p([r(m, False, BRANCO)], 8.8, 11, 5 if i else 0) for i, m in enumerate(MENSAGEM)]
    corpo.append(p([r('Marcelo Prais', True, AMARELO)], 9.6, 11.5, 9))
    corpo.append(p([r('Gerente Executivo de Ferramentas Eletroenergéticas | ONS', False, 'E8EBC7')], 8.2, 10, 1))
    B.text(64, my + 12, W - 36 - 64, [p([r('MENSAGEM DE ENCERRAMENTO', True, AMARELO, TIT)], 9, 11)])
    need = B.text(64, my + 32, W - 36 - 64 - 16, corpo)
    if my + 32 + need > 936 - 10:
        WARN.append(f'mensagem estoura ({my + 32 + need:.0f})')
    print('folga na mensagem:', round(936 - 10 - (my + 32 + need)))

    # rodapé por cima de tudo
    tree = s.shapes._spTree
    for i in (169, 171):
        tree.append(by_id[i]._element)
    os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)
    prs.save(OUT)
    for w in WARN:
        print('ATENÇÃO:', w)
    print('ok', OUT, 'mensagem de', my, 'a 936')


main()
