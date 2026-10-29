"""Avaliação de Desempenho: resumo do deck em 5 slides (narrativa, sem conteúdo novo).

Uso: python3 build_resumo.py <Avaliacao_de_Desempenho.pptx> [saida.pptx]

Todo o texto vem do deck original; os comentários indicam o slide de origem. Template, medida de texto e
checagem de sobreposição vêm de build_slides.py.
"""
import os
import sys

from pptx.enum.shapes import MSO_SHAPE

from build_slides import (DIST, GREYBLUE, LIGHT, LINE, MINT, NAVY, SLATE, STEEL, TINT, TXT, WARN, WHITE,
                          X0, X1, YB, P, Slide, build, chips, cols, paras_h)

KICK = '44709A'  # rótulos em caixa-alta: azul do tema escurecido para contraste
NB = ' '


def card(S, x, y, w, h, accent=None, fill=WHITE):
    S.box(x, y, w, h, fill=fill, line=None if fill == NAVY else LINE, shadow=True)
    if accent:
        S.box(x, y, w, 3, fill=accent)
    return (x, y, w, h)


def head(S, c, kick, title, dark=False, size=14):
    """Rótulo + título do cartão com filete; devolve o y onde o corpo começa."""
    x, y, w, _ = c
    h = S.text(x + 14, y + 13, w - 28, [P(kick, 7.5, True, MINT if dark else KICK, lh=9.5, spc=1.2),
                                         P(title, size, True, WHITE if dark else NAVY, lh=size * 1.2, sb=3)], inside=c)
    S.box(x + 14, y + 13 + h + 7, w - 28, 0.75, fill=SLATE if dark else LINE)
    return y + 13 + h + 7 + 11


def num(S, x, y, n, fill=NAVY, color=WHITE, d=20):
    s = S.box(x, y, d, d, fill=fill)
    S.shape_text(s, x, y, d, d, [P(str(n), 11, True, color, lh=13, align='c')], ins=(0, 0, 0, 0))


def sub(S, text):
    S.text(X0, 68, X1 - X0, [P(text, 11, False, TXT, lh=13.5)])


# ------------------------------------------------------------- 1. ponto de partida (slides 3, 5 e 15 do deck)
LEAD = ('Apresenta uma proposta de modelo de avaliação de desempenho para o novo contexto organizacional, definindo '
        'possíveis indicadores, critérios e dimensões para mensuração dos resultados das equipes e do modelo.')
PROPOSTA = [
    ('MODELO DE AVALIAÇÃO', [
        'Proposição de dimensões de avaliação de desempenho, alinhadas aos objetivos do novo modelo organizacional',
        'Estrutura sugerida considerando papéis, responsabilidades e resultados esperados']),
    ('INDICADORES E MÉTRICAS', [
        'Proposta de indicadores de desempenho aplicáveis às equipes e às frentes de atuação',
        'Sugestão de métricas para mensuração de resultados, produtividade e qualidade das entregas']),
    ('CRITÉRIOS DE AVALIAÇÃO', [
        'Proposição de critérios e parâmetros para avaliação do desempenho das equipes',
        'Direcionadores para interpretação dos resultados no contexto do modelo proposto']),
]
ATUAL = [
    ('INÍCIO DO CICLO', 'Elaboração de metas', ['2 a 4 metas ao ano', 'Gerente imediato e executivo aprovam']),
    ('MEIO DO CICLO', 'Repactuação das metas', ['Ajustes e revisões, se necessário', 'Gerente imediato e executivo aprovam']),
    ('FINAL DO CICLO', 'Avaliação e feedback', ['Autoavaliação', 'Avaliação final: superior imediato',
                                                 'Feedback formal: superior imediato']),
]


def slide_partida(prs, layout, ref):
    S = Slide(prs, layout, ref, 'Ponto de partida: o modelo atual do ONS e a proposta para o novo contexto',
              'Objetivo da proposta (slide 3 do deck) e modelo atual de avaliação de desempenho do ONS (slides 5 e 15).')
    sub(S, LEAD)
    yp, lw = 108, 282
    c = card(S, X0, yp, lw, YB - yp, GREYBLUE)
    y0 = head(S, c, 'A PROPOSTA', 'Modelo, indicadores e critérios')
    grp = [[P(k, 8, True, KICK, lh=10, spc=1)] + [P(b, 10.5, False, TXT, lh=12.5, sb=5, bullet=STEEL) for b in bs]
           for k, bs in PROPOSTA]
    hs = [paras_h(g, lw - 28) for g in grp]
    gap = min(40, (YB - 20 - y0 - sum(hs)) / (len(grp) - 1))
    y = y0
    for g, h in zip(grp, hs):
        S.text(X0 + 14, y, lw - 28, g, inside=c)
        y += h + gap
    rx = X0 + lw + 12
    rw = X1 - rx
    S.text(rx, yp + 2, rw, [P('MODELO ATUAL DO ONS', 7.5, True, KICK, lh=9.5, spc=1.2),
                            P('Ciclo anual de avaliação', 14, True, NAVY, lh=17, sb=3)])
    ys, hh, cw = yp + 44, 134, (rw - 24) / 3
    for i, (k, t, its) in enumerate(ATUAL):
        x = rx + i * (cw + 12)
        cd = (x, ys, cw, hh)
        S.box(*cd, fill=WHITE, line=LINE, shadow=True)
        b = S.box(x, ys, cw, 22, fill=NAVY)
        S.shape_text(b, x, ys, cw, 22, [P(f'{i + 1} · {k}', 7.5, True, WHITE, lh=9.5, spc=1)], ins=(12, 0, 0, 0))
        S.text(x + 12, ys + 33, cw - 24, [P(t, 13, True, NAVY, lh=15.5)] +
               [P(b_, 10.5, False, TXT, lh=12.5, sb=6, bullet=STEEL) for b_ in its], inside=cd)
    pw = (rw - 12) / 2
    pil = [('PILAR DE RESULTADOS', 'Atingimento das metas estabelecidas', f'Média de 1{NB}a{NB}5', NAVY),
           ('PILAR DE DESENVOLVIMENTO', 'Cesta de competências (definida de acordo com a necessidade da área)',
            'Menos hábil, Hábil, Referência. Não entra na média', STEEL)]
    pp = lambda k, a, b: [P(k, 7, True, MINT, lh=9, spc=0.6), P(a, 10.5, True, WHITE, lh=12.5, sb=4),
                          P(b, 9.5, False, WHITE, lh=11.5, sb=4)]
    hp = max(paras_h(pp(k, a, b), pw - 24) for k, a, b, _ in pil) + 22
    ypil = ys + hh + 12
    for j, (k, a, b, cor) in enumerate(pil):
        x = rx + j * (pw + 12)
        S.box(x, ypil, pw, hp, fill=cor)
        S.text(x + 12, ypil + 11, pw - 24, pp(k, a, b), inside=(x, ypil, pw, hp))
    yc = ypil + hp + 12
    if YB - yc < 52:
        WARN.append(f'partida: faixa da área cliente sem espaço ({YB - yc:.0f})')
    fx = (rx, yc, rw, YB - yc)
    S.box(*fx, fill=TINT)
    S.text(rx + 14, yc, 90, [P('ÁREA CLIENTE', 7.5, True, KICK, lh=9.5, spc=1.2)], h=YB - yc, anchor='m', inside=fx)
    S.text(rx + 112, yc, rw - 126, [P('Hoje a avaliação pela área cliente ocorre de forma informal e não padronizada; o novo '
                                      'modelo estrutura o processo com métricas, escala e responsáveis definidos.',
                                      12, False, NAVY, lh=14.5)], h=YB - yc, anchor='m', inside=fx)
    S.check('slide partida')


# ------------------------------------------------------------- 2. premissas e ajustes (slides 7 e 10 do deck)
PREMISSAS_READ = [
    ('Modelo matricial', 'Profissionais respondem a dois vetores: o Líder de Comunidade (entrega) e o Gerente Funcional '
     '(desenvolvimento técnico e carreira), além de profissionais alocados entre diretorias.',
     'A avaliação precisa capturar ambas as dimensões.'),
    ('Papéis híbridos', 'POs, Líderes de Comunidade, Modeleiros e Desenvolvedores podem operar em squads multidisciplinares.',
     'A avaliação individual deve considerar a contribuição coletiva ao squad.'),
    ('Ciclo de inovação', 'Parte do trabalho é de exploração (Comunidades Técnicas, horizonte 2-3), com entregas de mais '
     'longo prazo e incerteza inerente incompatível com metas puramente quantitativas de curto prazo.', None),
    ('Orientação ao usuário', 'É necessário avaliar as squads sob a ótica do usuário.',
     'Entender se há pleno atendimento das expectativas tanto em qualidade, tempo de resposta e suporte.'),
    ('Diversidade de perfis', 'O DQQ inclui 14 perfis distintos (de Secretaria a Arquiteto e Especialista I), cada um com '
     'dinâmicas de trabalho e expectativas de entrega muito diferentes.', None),
]
AJUSTES = ['Adequação das competências ao contexto do modelo matricial',
           'Definição de ao menos uma meta voltada à contribuição coletiva para a comunidade',
           'Estruturação de formulário de percepção da área cliente sobre a atuação da equipe, com aplicação via Forms']


def slide_premissas(prs, layout, ref):
    S = Slide(prs, layout, ref, 'Cinco premissas pedem a readequação, com três ajustes essenciais',
              'Premissas de readequação (slide 7 do deck) e ajustes essenciais para o novo modelo (slide 10).')
    sub(S, 'Premissas de readequação e os principais ajustes propostos no fluxo atual de avaliação de desempenho.')
    yp, lw, gap = 108, 566, 8
    ch = (YB - yp - gap * 4) / 5
    for i, (t, a, b) in enumerate(PREMISSAS_READ):
        y = yp + i * (ch + gap)
        c = (X0, y, lw, ch)
        S.box(*c, fill=WHITE, line=LINE, shadow=True)
        S.box(X0, y, 3, ch, fill=MINT)
        num(S, X0 + 16, y + (ch - 22) / 2, i + 1, NAVY, WHITE, 22)
        paras = [P(t, 12, True, NAVY, lh=14.5), P(a, 10, False, TXT, lh=12, sb=3)]
        if b:
            paras.append(P(b, 10, True, SLATE, lh=12, sb=3))
        h = paras_h(paras, lw - 64 - 14)
        if h > ch - 8:
            WARN.append(f'premissas: cartão {i + 1} estoura ({h:.0f} > {ch - 8:.0f})')
        S.text(X0 + 52, y + (ch - h) / 2, lw - 64, paras, inside=c)
    rx = X0 + lw + 14
    rw = X1 - rx
    c = card(S, rx, yp, rw, YB - yp, MINT, NAVY)
    y0 = head(S, c, 'O QUE MUDA', 'Ajustes essenciais para o novo modelo', dark=True)
    S.text(rx + 14, y0 - 2, rw - 28, [P('Principais ajustes propostos no fluxo atual de avaliação de desempenho', 9.5, False, LIGHT, lh=11.5)], inside=c)
    y = y0 + 34
    hs = [paras_h([P(a, 12, True, WHITE, lh=14.5)], rw - 28 - 36) for a in AJUSTES]
    gap2 = min(60, (YB - 30 - y - sum(hs)) / (len(AJUSTES) - 1))
    for n, (a, h) in enumerate(zip(AJUSTES, hs), start=1):
        num(S, rx + 14, y, n, MINT, NAVY, 24)
        S.text(rx + 14 + 36, y + 1, rw - 28 - 36, [P(a, 12, True, WHITE, lh=14.5)], inside=c)
        y += max(h, 24) + gap2
    S.check('slide premissas')


# ------------------------------------------------------------- 3. modelo proposto (slides 8, 13 e 14 do deck)
FUTURO = [
    ('INÍCIO DO CICLO', 'Elaboração de metas', '2 a 4 metas ao ano, sendo ao menos 1 meta de contribuição coletiva à Comunidade.'),
    ('MEIO DO CICLO', 'Repactuação das metas', 'Considerando mudanças de backlog, realocações entre squads e evolução dos '
     'modelos. O Líder de Comunidade pode propor ajustes.'),
    ('FINAL DO CICLO', 'Avaliação e feedback', 'Autoavaliação, avaliação final e feedback formal.'),
]
METAS = [
    ('70%', 'Metas individuais', f'1{NB}a{NB}3 metas por ciclo, na mesma lógica vigente. Aprovadas pelo Gerente Imediato.',
     'Mantém o foco em entrega individual'),
    ('30%', 'Meta de contribuição à Comunidade de Entrega', '1 meta coletiva por ciclo, definida junto com o Líder de '
     'Comunidade, conforme a estratégia tecnológica definida. Avaliação da área cliente com a ponderação final do gestor.',
     'Reforça o modelo de colaboração matricial'),
    ('', 'Metas comuns ONS', '3 metas comuns por ciclo, definidas institucionalmente e aplicáveis a todo o ONS.', None),
]


def slide_modelo(prs, layout, ref):
    S = Slide(prs, layout, ref, 'O modelo proposto: metas em 70/30 e competências em pilares separados',
              'Fluxo futuro (slide 8 do deck), pilar de resultados adaptado (slide 13) e pilar de desenvolvimento (slide 14).')
    sub(S, 'Proposta A&M para avaliação de desempenho considerando o modelo matricial.')
    yp, yb, g = 108, 428, 12
    wa, wb = 236, 330
    wc = X1 - X0 - wa - wb - 2 * g
    # A: fluxo futuro
    ca = card(S, X0, yp, wa, yb - yp, GREYBLUE)
    y = head(S, ca, 'CICLO ANUAL', 'Fluxo futuro')
    hs = [paras_h([P(k, 7, True, KICK, lh=9, spc=1), P(t, 11.5, True, NAVY, lh=14, sb=1), P(d, 9.5, False, TXT, lh=11.5, sb=2)], wa - 28 - 30)
          for k, t, d in FUTURO]
    gp = min(44, (yb - 16 - y - sum(hs)) / (len(hs) - 1))
    for n, ((k, t, d), h) in enumerate(zip(FUTURO, hs), start=1):
        num(S, X0 + 14, y, n, GREYBLUE, WHITE, 20)
        S.text(X0 + 44, y, wa - 58, [P(k, 7, True, KICK, lh=9, spc=1), P(t, 11.5, True, NAVY, lh=14, sb=1),
                                      P(d, 9.5, False, TXT, lh=11.5, sb=2)], inside=ca)
        y += h + gp
    # B: pilar de resultados
    xb = X0 + wa + g
    cb = card(S, xb, yp, wb, yb - yp, STEEL)
    y = head(S, cb, 'PILAR DE RESULTADOS', f'Atingimento das metas · média de 1{NB}a{NB}5')
    iw = wb - 28
    w70 = iw * 0.7
    for sx, sw, f, c_, t in ((xb + 14, w70 - 1, NAVY, WHITE, '70%'), (xb + 14 + w70 + 1, iw - w70 - 1, MINT, NAVY, '30%')):
        s = S.box(sx, y, sw, 20, fill=f)
        S.shape_text(s, sx, y, sw, 20, [P(t, 10.5, True, c_, lh=12, align='c')], ins=(0, 0, 0, 0))
    y += 30
    for pct, t, d, tag in METAS:
        paras = [P(t, 11, True, NAVY, lh=13), P(d, 9.5, False, TXT, lh=11.5, sb=2)]
        if tag:
            paras.append(P(tag, 9.5, True, SLATE, lh=11.5, sb=2))
        S.box(xb + 14, y + 1, 3, paras_h(paras, iw - 12) - 2, fill=MINT if pct == '30%' else NAVY if pct else GREYBLUE)
        y += S.text(xb + 26, y, iw - 12, paras, inside=cb) + 9
    S.text(xb + 14, y - 1, iw, [P('Todas na escala 1-5, avaliadas pelo gerente imediato com input do Líder de Comunidade.',
                                  9.5, True, NAVY, lh=11.5)], inside=cb)
    if y + 12 > yb - 8:
        WARN.append(f'modelo: pilar de resultados estoura ({y + 12:.0f} > {yb - 8})')
    # C: pilar de desenvolvimento
    xc = xb + wb + g
    cc = card(S, xc, yp, wc, yb - yp, SLATE)
    y = head(S, cc, 'PILAR DE DESENVOLVIMENTO', 'Competências · não entra na média')
    iw = wc - 28
    y += S.text(xc + 14, y - 2, iw, [P('A partir do catálogo de competências já existentes', 9.5, False, TXT, lh=11.5)], inside=cc) + 8
    for rot, its, fill, line, cor in (
            ('ESSENCIAIS A TODOS', ['Confiança', 'Foco nos resultados', 'Colaboração'], LIGHT, None, NAVY),
            ('ESSENCIAL A GESTORES E LÍDERES', ['Formação de equipes eficientes'], LIGHT, None, NAVY),
            ('ELETIVA A GESTORES E LÍDERES', ['Visão estratégica'], WHITE, STEEL, SLATE),
            ('ELETIVAS A TODOS', ['Gerenciamento da complexidade', 'Orientação para a ação', 'Inovação*'], WHITE, STEEL, SLATE)):
        y += S.text(xc + 14, y, iw, [P(rot, 7, True, KICK, lh=9, spc=0.8)], inside=cc) + 3
        y += chips(S, xc + 14, y, iw, its, fill, line, cor, card=cc) + 9
    y += S.text(xc + 14, y - 3, iw, [P('*Exceto líderes e gestores', 8.5, False, TXT, lh=10.5)], inside=cc) + 8
    S.text(xc + 14, y, 46, [P('ESCALA', 7, True, KICK, lh=9, spc=0.8)], h=15, anchor='m', inside=cc)
    sw = (iw - 50) / 3
    for k, (t, f, c_) in enumerate((('Menos hábil', LIGHT, NAVY), ('Hábil', GREYBLUE, WHITE), ('Referência', STEEL, WHITE))):
        s = S.box(xc + 14 + 50 + k * (sw + 2), y, sw, 15, fill=f, prst=MSO_SHAPE.PENTAGON if k < 2 else MSO_SHAPE.RECTANGLE,
                  adj=0.35 if k < 2 else None)
        S.shape_text(s, 0, 0, sw, 15, [P(t, 8.5, True, c_, lh=10, align='c')], ins=(0, 0, 4 if k < 2 else 0, 0))
    if y + 15 > yb - 8:
        WARN.append(f'modelo: pilar de desenvolvimento estoura ({y + 15:.0f} > {yb - 8})')
    # sugestão A&M
    fy = yb + 10
    fx = (X0, fy, X1 - X0, YB - fy)
    S.box(*fx, fill=NAVY)
    S.text(X0 + 16, fy, 96, [P('SUGESTÃO A&M', 7.5, True, MINT, lh=10, spc=1.2)], h=YB - fy, anchor='m', inside=fx)
    S.text(X0 + 120, fy, X1 - X0 - 136, [P('A meta de contribuição pode ser implementada de duas formas: (i) como meta adicional '
                                           'do indivíduo, voltada à contribuição para a comunidade de Entrega; ou (ii) incorporada '
                                           'às metas comuns ONS já existentes, com o formulário de feedback da área cliente '
                                           'integrando essas metas.', 9.5, False, WHITE, lh=11.5)],
           h=YB - fy, anchor='m', inside=fx)
    S.check('slide modelo')


# ------------------------------------------------------------- 4. quem avalia (slides 15, 17 e 18 do deck)
ATORES = ['GERENTE EXECUTIVO', 'GERENTE', 'LÍDER DA COMUNIDADE', 'REP. DO NEGÓCIO (CLIENTE)', 'AVALIADO']
RACI = [
    ('Elaboração das metas para o ciclo ou repactuação', 'C', 'A', 'C', '-', 'R'),
    ('Avaliação do desenvolvimento', 'I', 'R', 'C', '-', 'C'),
    ('Auto avaliação', '-', 'I', 'I', '-', 'R'),
    ('Avaliação de resultados (metas)', 'I', 'R', 'C', '-', 'I'),
    ('Feedback representante negócio (formulário)', 'I', 'I', 'I', 'R', 'I'),
    ('Calibração e avaliação final', 'A', 'R', 'C', '-', 'I'),
    ('Feedback formal', 'I', 'R', 'C', '-', 'I'),
]
PERFIS = [
    ('Elaboração e repactuação de metas',
     'Metas associadas às entregas da DPL. Input obrigatório do Líder de Comunidade e aprovação do Gerente Imediato.',
     'Metas associadas às entregas da DPL. Input obrigatório do Líder de Comunidade da DPL e aprovação do Gerente Imediato da DTA.'),
    ('Metas de percepção da área cliente',
     'Formulário da área cliente compõe a meta coletiva da comunidade; nota individual ponderada pelo gestor imediato.',
     '3 metas coletivas comuns a todo o ONS, avaliadas pela área cliente: a nota final deriva dessas 3 metas.'),
    ('Avaliação de desenvolvimento', 'Líder da Comunidade da DPL',
     'Gerente imediato da DTA com input obrigatório do Líder de Comunidade da DPL'),
    ('Avaliação de resultados', 'Líder da Comunidade da DPL',
     'Gerente imediato da DTA com input obrigatório do Líder de Comunidade da DPL'),
    ('Avaliação final', 'Líder e Gerente imediato', 'Gerente imediato da DTA'),
]
FORM = [
    ('QUALIDADE', 'As entregas do squad corresponderam ao que foi acordado em termos de qualidade técnica?', 'Modeleiro e Desenvolvedor'),
    ('TEMPO DE RESPOSTA', 'Os prazos foram cumpridos ou, quando não, a área foi comunicada com antecedência?', 'Product Owner'),
    ('SUPORTE', 'Quando surgiram dúvidas ou problemas, o suporte foi ágil e resolutivo?', 'Product Owner e Desenvolvedor'),
    ('VALOR PERCEBIDO', 'As entregas do squad foram úteis para o trabalho da sua área no ciclo?', 'Product Owner e Líder de Comunidade'),
    ('CAMPO ABERTO (QUALITATIVO)', 'O que o squad poderia ter feito diferente para atender melhor às necessidades da sua área?', None),
]


def slide_avaliadores(prs, layout, ref):
    S = Slide(prs, layout, ref, 'Quem avalia: papéis na RACI, perfis DPL e DTA e a visão da área cliente',
              'Matriz RACI (slide 17 do deck), perfis avaliados (slide 18) e formulário de percepção da área cliente (slide 15).')
    sub(S, 'Fluxograma e matriz RACI, perfis avaliados e formulário de percepção da área cliente (representante do negócio).')
    yp, yt, g = 108, 356, 12
    # RACI
    lab, cwid = 196, 36
    wr = 14 + lab + 5 * cwid + 14
    c = card(S, X0, yp, wr, yt - yp, STEEL)
    y = head(S, c, 'FLUXOGRAMA E MATRIZ RACI', 'Atividades do ciclo e seus atores', size=13)
    gx = X0 + 14 + lab
    S.box(gx, y - 3, cwid, 28 + len(RACI) * 18 + 4, fill=TINT)  # coluna do Gerente Executivo
    for j, a in enumerate(ATORES):
        S.text(gx + j * cwid, y, cwid, [P(a, 5.5, True, KICK, lh=7, align='c')], h=24, anchor='m', inside=c)
    y += 28
    fills = {'R': (SLATE, WHITE, None), 'A': (NAVY, WHITE, None), 'C': (LIGHT, NAVY, None), 'I': (WHITE, SLATE, GREYBLUE)}
    for lbl, *vals in RACI:
        S.box(X0 + 14, y - 1, wr - 28, 0.5, fill=LINE)
        S.text(X0 + 14, y, lab - 6, [P(lbl, 9, False, NAVY, lh=11)], h=17, anchor='m', inside=c)
        for j, v in enumerate(vals):
            cx = gx + j * cwid + (cwid - 14) / 2
            if v == '-':
                S.text(gx + j * cwid, y, cwid, [P('–', 9, False, GREYBLUE, lh=11, align='c')], h=17, anchor='m', inside=c)
            else:
                f, tc, ln = fills[v]
                s = S.box(cx, y + 1.5, 14, 14, fill=f, line=ln, lw=0.75)
                S.shape_text(s, cx, y + 1.5, 14, 14, [P(v, 8, True, tc, lh=9.5, align='c')], ins=(0, 0, 0, 0))
        y += 18
    S.text(X0 + 14, y + 5, wr - 28, [P('R — Responsável • A — Aprovador • C — Consultado • I — Informado', 8, False, TXT, lh=10)], inside=c)
    if y + 16 > yt - 6:
        WARN.append(f'avaliadores: RACI estoura ({y + 16:.0f} > {yt - 6})')
    # perfis
    xp = X0 + wr + g
    wp = X1 - xp
    c2 = card(S, xp, yp, wp, yt - yp, SLATE)
    y = head(S, c2, 'PERFIS AVALIADOS', 'Profissionais DPL e DTA', size=13)
    lw_ = 92
    cw2 = (wp - 28 - lw_ - 8) / 2
    for k, (t, s_, f, tc) in enumerate((('PROFISSIONAIS DPL', 'Totalmente alocados na DPL', NAVY, WHITE),
                                        ('PROFISSIONAIS DTA', 'Alocado majoritariamente/parcial na DPL', STEEL, WHITE))):
        x = xp + 14 + lw_ + 4 + k * (cw2 + 4)
        b = S.box(x, y - 3, cw2, 26, fill=f)
        S.text(x + 6, y - 3, cw2 - 12, [P(t, 7.5, True, WHITE, lh=9, spc=0.8, align='c'), P(s_, 8, False, WHITE, lh=9.5, align='c')],
               h=26, anchor='m', inside=(x, y - 3, cw2, 26))
    y += 30
    for lbl, a, b_ in PERFIS:
        h = max(paras_h([P(a, 9, False, TXT, lh=11)], cw2 - 4), paras_h([P(b_, 9, False, TXT, lh=11)], cw2 - 4), 11)
        S.box(xp + 14, y - 3, wp - 28, 0.5, fill=LINE)
        S.text(xp + 14, y, lw_ - 6, [P(lbl, 8.5, True, NAVY, lh=10)], inside=c2)
        S.text(xp + 14 + lw_ + 4 + 2, y, cw2 - 4, [P(a, 9, False, TXT, lh=11)], inside=c2)
        S.text(xp + 14 + lw_ + 4 + cw2 + 4 + 2, y, cw2 - 4, [P(b_, 9, False, TXT, lh=11)], inside=c2)
        y += h + 6
    if y > yt - 6:
        WARN.append(f'avaliadores: perfis estoura ({y:.0f} > {yt - 6})')
    # formulário
    fy = yt + g
    c3 = (X0, fy, X1 - X0, YB - fy)
    S.box(*c3, fill=WHITE, line=LINE, shadow=True)
    S.box(X0, fy, X1 - X0, 3, fill=MINT)
    lw3 = 212
    S.text(X0 + 14, fy + 13, lw3 - 14, [P('FORMULÁRIO DA ÁREA CLIENTE', 7.5, True, KICK, lh=9.5, spc=1.2),
                                         P('Percepção do representante do negócio', 13, True, NAVY, lh=15.5, sb=3),
                                         P(f'Escala de 1{NB}a{NB}5 + campo aberto, aplicado ao final de cada ciclo, com prazo definido.',
                                           9.5, False, TXT, lh=11.5, sb=5)], inside=c3)
    S.box(X0 + lw3 + 2, fy + 14, 0.75, YB - fy - 28, fill=LINE)
    cx0 = X0 + lw3 + 14
    n = len(FORM)
    cw3 = (X1 - 14 - cx0 - 8 * (n - 1)) / n
    for i, (m, q, r) in enumerate(FORM):
        x = cx0 + i * (cw3 + 8)
        paras = [P(m, 8, True, NAVY, lh=10, spc=0.6), P(q, 9, False, TXT, lh=11, sb=3)]
        if r:
            paras += [P('RESPONSÁVEL PRIMÁRIO', 6.5, True, KICK, lh=8, spc=0.6, sb=5), P(r, 8.5, True, SLATE, lh=10, sb=1)]
        S.text(x, fy + 14, cw3, paras, inside=c3)
    S.check('slide avaliadores')


# ------------------------------------------------------------- 5. implementação (slides 11 e 13 do deck)
FASE1 = [
    ('Adequação das competências ao contexto matricial',
     'Cesta de competências revisada para refletir colaboração, integração e papéis no novo modelo'),
    ('Ao menos 1 meta de contribuição coletiva (30%)',
     'Definida com o Líder de Comunidade. Reforça o trabalho conjunto sem perder o foco individual.'),
    ('Input do Líder de Comunidade na nota final',
     'Avaliação segue com o Gerente Funcional, mas com input estruturado do Líder de Comunidade'),
    ('Regra clara para profissionais DTA alocados na FE', 'Avaliação pelo Gerente DTA com input do Líder DPL'),
]
FASE2 = [
    ('Formulário de percepção da área cliente',
     'Avaliação estruturada do representante do negócio sobre a atuação do squad (qualidade, tempo, suporte, valor)'),
    ('NPS por Comunidade de Entrega',
     'Indicador agregado de satisfação para acompanhar evolução da comunidade ao longo do tempo'),
    ('Calibragem cruzada entre Comunidades',
     'Fóruns de calibragem entre gerentes para garantir consistência das notas no modelo matricial'),
]
PREMISSAS_IMPL = [
    'Capacitar a liderança para que seja responsável por garantir o cumprimento das metas conforme as regras estabelecidas',
    'Formalizar e comunicar com clareza os papéis e responsabilidades de cada ator dentro do modelo (gerente imediato, '
    'líder de comunidade e avaliado)',
    'Adotar o Oracle HCM como ferramenta única para formalização de metas, acompanhamento e registro de feedbacks',
    'Garantir alinhamento prévio entre Gerente Imediato e Líder de Comunidade antes da formalização das metas, evitando '
    'conflitos de prioridade no modelo matricial',
    'Definir governança e instância de resolução de divergências entre avaliações do Gerente Imediato e input do Líder de Comunidade',
    'Monitorar a aderência ao modelo nos primeiros ciclos, com indicadores de qualidade (ex.: % de metas formalizadas no '
    'prazo, % de feedbacks registrados)',
]


def slide_implementacao(prs, layout, ref):
    S = Slide(prs, layout, ref, 'Implementação em duas fases, apoiada em seis premissas',
              'Abordagem em duas fases (slide 11 do deck) e premissas de implementação (slide 13).')
    sub(S, 'Adotamos uma abordagem em duas fases: o essencial entra no próximo ciclo, o avançado em ciclos seguintes.')
    yp, g = 108, 12
    w1, w2 = 290, 262
    w3 = X1 - X0 - w1 - w2 - 2 * g
    for x, w, kick, title, subt, itens, cor, tc in (
            (X0, w1, 'FASE 1', 'Já no próximo ciclo de avaliação', 'Ajustes essenciais considerando o modelo matricial:', FASE1, GREYBLUE, WHITE),
            (X0 + w1 + g, w2, 'FASE 2', 'Evolução em ciclos seguintes', 'Requer maturidade do modelo ou ferramenta dedicada:', FASE2, MINT, NAVY)):
        c = (x, yp, w, YB - yp)
        S.box(*c, fill=WHITE, line=LINE, shadow=True)
        S.box(x, yp, w, 62, fill=cor)
        S.text(x + 14, yp + 9, w - 28, [P(kick, 8, True, NAVY if cor == MINT else WHITE, lh=10, spc=2),
                                         P(title, 14, True, tc, lh=17, sb=3)], h=46, anchor='m', inside=c)
        y = yp + 62 + 11
        y += S.text(x + 14, y, w - 28, [P(subt, 9.5, True, NAVY, lh=11.5)], inside=c) + 10
        hs = [paras_h([P(a, 11, True, NAVY, lh=13), P(b, 9.5, False, TXT, lh=11.5, sb=2)], w - 28 - 30) for a, b in itens]
        gp = min(26, (YB - 20 - y - sum(hs)) / (len(itens) - 1))
        for n, ((a, b), h) in enumerate(zip(itens, hs), start=1):
            num(S, x + 14, y, n, cor, tc, 20)
            S.text(x + 44, y, w - 58, [P(a, 11, True, NAVY, lh=13), P(b, 9.5, False, TXT, lh=11.5, sb=2)], inside=c)
            y += h + gp
        if y - gp > YB - 8:
            WARN.append(f'implementação: {kick} estoura ({y - gp:.0f})')
    x3 = X0 + w1 + w2 + 2 * g
    c = card(S, x3, yp, w3, YB - yp, MINT, NAVY)
    y = head(S, c, 'PREMISSAS DE IMPLEMENTAÇÃO', 'O que sustenta as duas fases', dark=True)
    hs = [paras_h([P(t, 9.5, False, WHITE, lh=11.5)], w3 - 28 - 26) for t in PREMISSAS_IMPL]
    gp = min(20, (YB - 20 - y - sum(hs)) / (len(hs) - 1))
    for n, (t, h) in enumerate(zip(PREMISSAS_IMPL, hs), start=1):
        S.text(x3 + 14, y, 18, [P(str(n), 11, True, MINT, lh=13)], inside=c)
        S.text(x3 + 14 + 22, y + 0.5, w3 - 28 - 22, [P(t, 9.5, False, WHITE, lh=11.5)], inside=c)
        y += h + gp
    if y - gp > YB - 8:
        WARN.append(f'implementação: premissas estouram ({y - gp:.0f})')
    S.check('slide implementação')


if __name__ == '__main__':
    build(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else os.path.join(DIST, 'Avaliacao_Desempenho_Resumo.pptx'),
          [slide_partida, slide_premissas, slide_modelo, slide_avaliadores, slide_implementacao])
