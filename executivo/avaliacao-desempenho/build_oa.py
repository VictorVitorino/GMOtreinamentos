"""Avaliação de Desempenho na Operação Assistida: storytelling (método e modelo) e roadmap de implementação.

Uso: python3 build_oa.py <Avaliacao_de_Desempenho.pptx> [saida.pptx]

Todo o conteúdo vem do deck original (os comentários indicam o slide de origem). Template, medida de texto
e checagem de sobreposição vêm de build_slides.py.
"""
import os
import sys

from pptx.enum.shapes import MSO_SHAPE

from build_slides import (DIST, GREYBLUE, LIGHT, LINE, MINT, NAVY, SLATE, STEEL, TINT, TXT, WARN, WHITE,
                          X0, X1, YB, P, Slide, build, cols, paras_h)

# ---------------------------------------------------------------- slide 1: storytelling
LEAD = ('Na Operação Assistida, o modelo de avaliação de desempenho do ONS foi revisto para o novo contexto organizacional: '
        'uma proposta que define indicadores, critérios e dimensões para mensurar os resultados das equipes e do modelo, '
        'em que os profissionais respondem a dois vetores, o Líder de Comunidade e o Gerente Funcional.')  # slides 3 e 7

CAPITULOS = [
    ('01', 'PONTO DE PARTIDA', 'O modelo atual do ONS', GREYBLUE, [  # slides 5 e 15
        ('Ciclo anual. ', 'No início, elaboração de 2 a 4 metas ao ano, aprovadas pelo gerente imediato e pelo executivo; '
         'no meio, repactuação com ajustes e revisões, se necessário; no final, autoavaliação, avaliação final pelo '
         'superior imediato e feedback formal.'),
        ('Dois pilares. ', 'O Pilar de Resultados mede o atingimento das metas estabelecidas (média de 1 a 5). O Pilar de '
         'Desenvolvimento avalia a cesta de competências, definida de acordo com a necessidade da área (Menos hábil, '
         'Hábil, Referência), e não entra na média.'),
        ('Área cliente. ', 'A avaliação pela área cliente ocorre de forma informal e não padronizada.'),
    ]),
    ('02', 'O DESAFIO', 'Cinco premissas de readequação', STEEL, [  # slide 7
        ('Modelo matricial: ', 'profissionais respondem ao Líder de Comunidade (entrega) e ao Gerente Funcional '
         '(desenvolvimento técnico e carreira).'),
        ('Papéis híbridos: ', 'POs, Líderes de Comunidade, Modeleiros e Desenvolvedores em squads multidisciplinares; a '
         'avaliação individual deve considerar a contribuição coletiva.'),
        ('Ciclo de inovação: ', 'trabalho de exploração (horizonte 2-3), incompatível com metas puramente quantitativas de '
         'curto prazo.'),
        ('Orientação ao usuário: ', 'avaliar as squads sob a ótica do usuário, em qualidade, tempo de resposta e suporte.'),
        ('Diversidade de perfis: ', '14 perfis distintos no DQQ, de Secretaria a Arquiteto e Especialista I.'),
    ]),
    ('03', 'O MÉTODO', 'Como a proposta foi construída', SLATE, [  # slides 3, 13, 14, 18, 20 e 21
        ('Modelo de avaliação: ', 'dimensões alinhadas aos objetivos do novo modelo organizacional, considerando papéis, '
         'responsabilidades e resultados esperados.'),
        ('Indicadores e métricas: ', 'aplicáveis às equipes e às frentes de atuação, para mensurar resultados, '
         'produtividade e qualidade das entregas.'),
        ('Critérios de avaliação: ', 'critérios, parâmetros e direcionadores para interpretar os resultados no contexto '
         'do modelo proposto.'),
        ('Base existente: ', 'metas do modelo atual do ONS e catálogo de competências já existente, adaptados ao contexto '
         'matricial e detalhados por perfil (DPL e DTA) e por papel.'),
    ]),
    ('04', 'O RESULTADO', 'O modelo proposto', NAVY, [  # slides 11, 13, 14, 15, 17, 20 e 21
        ('Metas em 70/30: ', '1 a 3 metas individuais (70%) e 1 meta de contribuição à Comunidade de Entrega (30%), além '
         'das 3 metas comuns ONS, na escala de 1 a 5, avaliadas pelo gerente imediato com input do Líder de Comunidade.'),
        ('Competências: ', 'cesta de 8 competências do catálogo, adequada ao contexto matricial.'),
        ('Área cliente: ', 'formulário de percepção com qualidade, tempo de resposta, suporte e valor percebido.'),
        ('Papéis: ', 'matriz RACI do fluxo, com metas e avaliadores definidos para 12 papéis.'),
        ('Duas fases: ', 'o essencial entra no próximo ciclo, o avançado em ciclos seguintes.'),
    ]),
]

NUMEROS = [  # contagens do próprio deck: slides 7, 10, 13, 14, 20-21 e 11
    ('5', 'premissas de readequação'),
    ('3', 'ajustes essenciais no fluxo atual'),
    ('70/30', 'metas individuais e de contribuição à Comunidade'),
    ('8', 'competências na cesta da FE'),
    ('12', 'papéis com metas e avaliadores'),
    ('2', 'fases de implantação'),
]


def slide_historia(prs, layout, ref):
    S = Slide(prs, layout, ref, 'Avaliação de Desempenho: o que foi construído na Operação Assistida',
              'Ponto de partida (modelo atual do ONS), o desafio (cinco premissas de readequação), o método (modelo de '
              'avaliação, indicadores e métricas, critérios de avaliação) e o resultado: o modelo proposto, em duas fases.')
    S.text(X0, 68, X1 - X0, [P(LEAD, 11, False, TXT, lh=13.5)])
    C = cols(4, 14)
    yc, yb, pad = 110, 404, 12
    iw = C[0][1] - 2 * pad
    cab = lambda head, dark: [P(head, 12.5, True, WHITE if dark else NAVY, lh=14.5)]
    corpo = lambda paras, dark: [P(runs=[(a, True, MINT if dark else NAVY), (b, False, WHITE if dark else TXT)],
                                   size=10, lh=12, sb=6) for a, b in paras]
    ycorpo = yc + 38 + max(paras_h(cab(c[2], False), iw) for c in CAPITULOS) + 10
    for i, ((x, w), (num, kick, head, cor, paras)) in enumerate(zip(C, CAPITULOS)):
        dark = i == 3
        card = (x, yc, w, yb - yc)
        S.box(*card, fill=NAVY if dark else WHITE, line=None if dark else LINE, shadow=True)
        S.box(x, yc, w, 3, fill=MINT if dark else cor)
        ix = x + pad
        S.text(ix, yc + 13, 28, [P(num, 17, True, MINT if dark else cor, lh=19)], inside=card)
        S.text(ix + 30, yc + 19, iw - 30, [P(kick, 7.5, True, MINT if dark else STEEL, lh=9, spc=1.2)], inside=card)
        S.text(ix, yc + 38, iw, cab(head, dark), inside=card)
        S.box(ix, ycorpo - 6, iw, 0.75, fill=SLATE if dark else LINE)
        h = S.text(ix, ycorpo, iw, corpo(paras, dark), inside=card)
        if ycorpo + h > yb - 8:
            WARN.append(f'história: capítulo {num} estoura ({ycorpo + h:.0f} > {yb - 8})')
        if i < 3:
            S.box(x + w + 3.5, yc + 20, 7, 12, fill=GREYBLUE, prst=MSO_SHAPE.CHEVRON, adj=0.5)
    # a proposta em números
    ys = 414
    faixa = (X0, ys, X1 - X0, YB - ys)
    S.box(*faixa, fill=TINT)
    S.text(X0 + 14, ys + 22, 96, [P('A PROPOSTA EM NÚMEROS', 7.5, True, STEEL, lh=10, spc=1.2)], inside=faixa)
    cw = (X1 - X0 - 124) / len(NUMEROS)
    for k, (n, lab) in enumerate(NUMEROS):
        cx = X0 + 124 + k * cw
        S.box(cx, ys + 14, 0.75, YB - ys - 28, fill=LINE)
        S.text(cx + 12, ys + 10, cw - 20, [P(n, 22, True, NAVY, lh=25), P(lab, 8.5, False, TXT, lh=10.5, sb=1)], inside=faixa)
    S.check('slide história')


# ---------------------------------------------------------------- slide 2: roadmap de implementação
PASSOS = [
    ('PREMISSAS DE IMPLEMENTAÇÃO', 'Liderança, papéis e ferramenta', [  # slide 13
        'Capacitar a liderança para garantir o cumprimento das metas conforme as regras estabelecidas',
        'Formalizar e comunicar os papéis do gerente imediato, do Líder de Comunidade e do avaliado',
        'Oracle HCM como ferramenta única para formalização de metas, acompanhamento e registro de feedbacks',
        'Governança e instância de resolução de divergências entre a avaliação do Gerente Imediato e o input do '
        'Líder de Comunidade',
    ]),
    ('INÍCIO DO CICLO', 'Elaboração de metas', [  # slides 11, 13 e 18
        'Alinhamento prévio entre Gerente Imediato e Líder de Comunidade antes da formalização, evitando conflitos '
        'de prioridade',
        '1 a 3 metas individuais (70%) e 1 meta de contribuição à Comunidade de Entrega (30%), além das 3 metas '
        'comuns ONS',
        'Cesta de competências revisada para refletir colaboração, integração e papéis no novo modelo',
        'Profissionais DTA alocados na FE: metas associadas às entregas da DPL, input obrigatório do Líder de '
        'Comunidade da DPL e aprovação do Gerente Imediato da DTA',
    ]),
    ('MEIO E FINAL DO CICLO', 'Repactuação e avaliação final', [  # slides 8, 11, 13 e 17
        'Repactuação diante de mudanças de backlog, realocações entre squads e evolução dos modelos; o Líder de '
        'Comunidade pode propor ajustes',
        'Avaliação com o Gerente Funcional e input estruturado do Líder de Comunidade na nota final, na escala de 1 a 5',
        'Calibração e avaliação final aprovadas pelo Gerente Executivo, seguidas do feedback formal',
        'Competências avaliadas como Menos hábil, Hábil ou Referência, sem entrar na média',
    ]),
    ('REQUER MATURIDADE DO MODELO', 'Visão do cliente e calibragem', [  # slides 11 e 15
        'Formulário de percepção da área cliente: qualidade, tempo de resposta, suporte e valor percebido, escala de '
        '1 a 5 e campo aberto, aplicado ao final de cada ciclo',
        'O Líder de Comunidade desdobra o feedback coletivo do cliente em contribuições individuais',
        'NPS por Comunidade de Entrega para acompanhar a evolução da comunidade ao longo do tempo',
        'Calibragem cruzada entre Comunidades para garantir a consistência das notas no modelo matricial',
    ]),
]


def slide_roadmap_impl(prs, layout, ref):
    S = Slide(prs, layout, ref,
              'Roadmap de implementação: Fase 1 no próximo ciclo, Fase 2 nos ciclos seguintes',
              'Premissas de implementação, Fase 1 no próximo ciclo de avaliação (elaboração de metas, repactuação e '
              'avaliação final) e Fase 2 em ciclos seguintes, com a aderência monitorada nos primeiros ciclos.')
    S.text(X0, 68, X1 - X0, [P('A Fase 1 reúne os ajustes essenciais considerando o modelo matricial; a Fase 2 requer '
                              'maturidade do modelo ou ferramenta dedicada.', 11, False, TXT, lh=13.5)])  # slide 11
    C = cols(4, 16)
    yl = 102
    f1 = (C[1][0], C[2][0] + C[2][1] - C[1][0])
    for (x, w), label, cor in ((C[0], 'PREPARAÇÃO', LIGHT), (f1, 'FASE 1  ·  JÁ NO PRÓXIMO CICLO DE AVALIAÇÃO', GREYBLUE),
                               (C[3], 'FASE 2  ·  EVOLUÇÃO EM CICLOS SEGUINTES', MINT)):
        S.text(x, yl, w, [P(label, 8, True, NAVY, lh=10, spc=1)])
        S.box(x, yl + 13, w, 2.5, fill=cor)
    # linha do tempo com os quatro passos
    yn, dn = 130, 24
    S.box(X0, yn + dn / 2 - 1, X1 - X0 - 8, 2, fill=LIGHT)
    S.box(X1 - 8, yn + dn / 2 - 6, 8, 12, fill=LIGHT, prst=MSO_SHAPE.CHEVRON, adj=0.5)
    w0 = C[0][1]
    cab = lambda k, t: [P(k, 7.5, True, STEEL, lh=9, spc=1.2), P(t, 13, True, NAVY, lh=15.5, sb=3)]
    yt = yn + dn + 10
    ybul = yt + max(paras_h(cab(k, t), w0) for k, t, _ in PASSOS) + 12
    yfim = 428
    for i, ((x, w), (k, t, itens)) in enumerate(zip(C, PASSOS)):
        fase2 = i == 3
        no = S.box(x, yn, dn, dn, fill=MINT if fase2 else NAVY, prst=MSO_SHAPE.OVAL)
        S.shape_text(no, x, yn, dn, dn, [P(str(i + 1), 11, True, NAVY if fase2 else WHITE, lh=13, align='c')], ins=(0, 0, 0, 0))
        if i:
            S.box(x - 8.4, yt, 0.75, yfim - yt, fill=LINE)
        S.text(x, yt, w, cab(k, t))
        h = S.text(x, ybul, w - 6, [P(t, 10, False, TXT, lh=12, sb=9, bullet=GREYBLUE if fase2 else STEEL) for t in itens])
        if ybul + h > yfim:
            WARN.append(f'roadmap: passo {i + 1} estoura ({ybul + h:.0f} > {yfim})')
    # aderência nos primeiros ciclos (premissa do slide 13)
    yb_ = 438
    faixa = (X0, yb_, X1 - X0, YB - yb_)
    S.box(*faixa, fill=NAVY)
    S.text(X0 + 16, yb_ + 12, 230, [P('MONITORAR A ADERÊNCIA AO MODELO NOS PRIMEIROS CICLOS', 8, True, MINT, lh=11, spc=1)],
           inside=faixa)
    kx = X0 + 270
    for kpi in ('% de metas formalizadas no prazo', '% de feedbacks registrados'):
        kw = 210
        s = S.box(kx, yb_ + 11, kw, YB - yb_ - 22, fill=WHITE)
        S.shape_text(s, kx, yb_ + 11, kw, YB - yb_ - 22, [P(kpi, 11, True, NAVY, align='c')], ins=(0, 0, 0, 0))
        kx += kw + 12
    S.check('slide roadmap')


if __name__ == '__main__':
    build(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else os.path.join(DIST, 'Avaliacao_Desempenho_OA.pptx'),
          [slide_historia, slide_roadmap_impl])
