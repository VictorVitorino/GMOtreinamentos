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

KICK = '44709A'  # rótulos em caixa-alta: azul do tema escurecido para contraste

# ---------------------------------------------------------------- slide 1: storytelling
LEAD = ('Na Operação Assistida, o modelo de avaliação de desempenho do ONS foi revisto para o novo contexto organizacional: '
        'uma proposta que define indicadores, critérios e dimensões para mensurar os resultados das equipes e do modelo, '
        'em que os profissionais respondem a dois vetores, o Líder de Comunidade e o Gerente Funcional.')  # slides 3 e 7

CAPITULOS = [
    ('01', 'PONTO DE PARTIDA', 'O modelo atual do ONS', '7A8D9C', [  # slides 5 e 15
        ('Ciclo anual: ', 'no início, elaboração de 2 a 4 metas ao ano, aprovadas pelo Gerente Imediato e pelo Executivo; '
         'no meio, repactuação com ajustes e revisões, se necessário; no final, autoavaliação, avaliação final pelo '
         'superior imediato e feedback formal.'),
        ('Dois pilares: ', 'o Pilar de Resultados mede o atingimento das metas estabelecidas (média de 1 a 5). O Pilar '
         'de Desenvolvimento avalia a cesta de competências (definida de acordo com a necessidade da área) na escala '
         'Menos hábil, Hábil e Referência, e não entra na média.'),
        ('Área cliente: ', 'a avaliação pela área cliente ocorre de forma informal e não padronizada.'),
    ]),
    ('02', 'O DESAFIO', 'Cinco premissas de readequação', STEEL, [  # slide 7
        ('Modelo matricial: ', 'profissionais respondem ao Líder de Comunidade (entrega) e ao Gerente Funcional '
         '(desenvolvimento técnico e carreira).'),
        ('Papéis híbridos: ', 'POs, Líderes de Comunidade, Modeleiros e Desenvolvedores em squads multidisciplinares; a '
         'avaliação individual deve considerar a contribuição coletiva.'),
        ('Ciclo de inovação: ', 'parte do trabalho é de exploração (Comunidades Técnicas, horizonte 2-3), com entregas de '
         'longo prazo e incerteza incompatíveis com metas puramente quantitativas de curto prazo.'),
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
        ('Base existente: ', 'metas do modelo atual do ONS e o catálogo de competências atual, adaptados ao contexto '
         'matricial e detalhados por perfil (DPL e DTA) e por papel.'),
    ]),
    ('04', 'O RESULTADO', 'O modelo proposto', NAVY, [  # slides 11, 13, 14, 15, 17, 20 e 21
        ('Metas em 70/30: ', '1 a 3 metas individuais (70%) e 1 meta de contribuição à Comunidade de Entrega (30%), além '
         'das 3 metas comuns ONS, na escala de 1 a 5, avaliadas pelo Gerente Imediato com input do Líder de Comunidade.'),
        ('Competências: ', 'cesta de 8 competências do catálogo, adequada ao contexto matricial.'),
        ('Área cliente: ', 'formulário de percepção com qualidade, tempo de resposta, suporte e valor percebido.'),
        ('Papéis: ', 'matriz RACI do fluxo e detalhamento de metas e avaliadores para 12 papéis da DPL (FE).'),
        ('Duas fases: ', 'o essencial entra no próximo ciclo, o avançado em ciclos seguintes.'),
    ]),
]

NUMEROS = [  # contagens do próprio deck: slides 7, 11, 13, 14, 20-21 e 11
    ('5', 'premissas de readequação'),
    ('4', 'ajustes essenciais da Fase 1'),
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
    yc, yb, pad = 108, 418, 12
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
        S.text(ix + 30, yc + 19, iw - 30, [P(kick, 7.5, True, MINT if dark else KICK, lh=9, spc=1.2)], inside=card)
        S.text(ix, yc + 38, iw, cab(head, dark), inside=card)
        S.box(ix, ycorpo - 6, iw, 0.75, fill=SLATE if dark else LINE)
        h = S.text(ix, ycorpo, iw, corpo(paras, dark), inside=card)
        if ycorpo + h > yb - 8:
            WARN.append(f'história: capítulo {num} estoura ({ycorpo + h:.0f} > {yb - 8})')
        if i < 3:
            S.box(x + w + 3.5, yc + 20, 7, 12, fill=GREYBLUE, prst=MSO_SHAPE.CHEVRON, adj=0.5)
    # a proposta em números
    ys = 428
    faixa = (X0, ys, X1 - X0, YB - ys)
    S.box(*faixa, fill=TINT)
    S.text(X0 + 14, ys + 16, 96, [P('A PROPOSTA', 7.5, True, KICK, lh=10, spc=1.2), P('EM NÚMEROS', 7.5, True, KICK, lh=10, spc=1.2)], inside=faixa)
    cw = (X1 - X0 - 124) / len(NUMEROS)
    for k, (n, lab) in enumerate(NUMEROS):
        cx = X0 + 124 + k * cw
        S.box(cx, ys + 10, 0.75, YB - ys - 20, fill=LINE)
        S.text(cx + 12, ys + 7, cw - 20, [P(n, 20, True, NAVY, lh=22), P(lab, 8.5, False, TXT, lh=10.5, sb=1)], inside=faixa)
    S.check('slide história')


# ---------------------------------------------------------------- slide 2: roadmap de implementação
PREMISSAS = [  # slide 13, sem prazo próprio no deck: bloco à parte da linha do tempo
    'Capacitar a liderança para garantir o cumprimento das metas conforme as regras estabelecidas',
    'Formalizar e comunicar os papéis do Gerente Imediato, do Líder de Comunidade e do avaliado',
    'Oracle HCM como ferramenta única para formalização de metas, acompanhamento e registro de feedbacks',
    'Alinhamento prévio entre Gerente Imediato e Líder de Comunidade antes da formalização das metas',
    'Governança e instância de resolução de divergências entre a avaliação do Gerente Imediato e o input do '
    'Líder de Comunidade',
    'Monitorar a aderência nos primeiros ciclos com indicadores de qualidade, ex.: % de metas formalizadas no prazo '
    'e % de feedbacks registrados',
]
PASSOS = [
    ('INÍCIO DO CICLO', 'Elaboração de metas', [  # slides 8, 11, 13 e 18
        '1 a 3 metas individuais (70%), aprovadas pelo Gerente Imediato, além das 3 metas comuns ONS',
        'Ao menos 1 meta de contribuição coletiva à Comunidade de Entrega (30%), definida com o Líder de Comunidade',
        'Profissionais DTA alocados na FE: metas associadas às entregas da DPL, input obrigatório do Líder de '
        'Comunidade da DPL e aprovação do Gerente Imediato da DTA',
    ]),
    ('MEIO E FINAL DO CICLO', 'Repactuação e avaliação final', [  # slides 8, 11 e 17
        'Repactuação considerando mudanças de backlog, realocações entre squads e evolução dos modelos; o Líder de '
        'Comunidade pode propor ajustes',
        'Input do Líder de Comunidade na nota final: a avaliação segue com o Gerente Funcional, com input estruturado',
        'Cesta de competências revisada (colaboração, integração e papéis no novo modelo), sem entrar na média',
        'Autoavaliação, avaliação final e feedback formal; na matriz RACI, o Gerente Executivo aprova a calibração '
        'e avaliação final',
    ]),
    ('REQUER MATURIDADE DO MODELO', 'Visão do cliente e calibragem cruzada', [  # slides 11 e 15
        'Formulário de percepção da área cliente: qualidade, tempo de resposta, suporte e valor percebido, escala de '
        '1 a 5 e campo aberto, aplicado ao final de cada ciclo',
        'O Líder de Comunidade desdobra o feedback coletivo do cliente em contribuições individuais',
        'NPS por Comunidade de Entrega para acompanhar a evolução da comunidade ao longo do tempo',
        'Calibragem cruzada entre Comunidades para garantir a consistência das notas no modelo matricial',
    ]),
]


def slide_roadmap_impl(prs, layout, ref):
    S = Slide(prs, layout, ref,
              'Roadmap de implementação: Fase 1 no próximo ciclo, Fase 2 nos ciclos seguintes',
              'Fase 1 no próximo ciclo de avaliação (elaboração de metas, repactuação e avaliação final) e Fase 2 em '
              'ciclos seguintes. À esquerda, as premissas de implementação da proposta.')
    S.text(X0, 68, X1 - X0, [P('A Fase 1 reúne os ajustes essenciais considerando o modelo matricial; a Fase 2 requer '
                              'maturidade do modelo ou ferramenta dedicada.', 11, False, TXT, lh=13.5)])  # slide 11
    # premissas de implementação: painel à parte, sem posição na linha do tempo
    px, pw = X0, 232
    pan = (px, 100, pw, YB - 100)
    S.box(*pan, fill=TINT)
    S.box(px, 100, pw, 3, fill=GREYBLUE)
    pi = px + 14
    h = S.text(pi, 114, pw - 28, [P('PROPOSTA A&M', 7.5, True, KICK, lh=9, spc=1.2),
                                  P('Premissas de implementação', 13, True, NAVY, lh=15.5, sb=3)], inside=pan)
    hb = S.text(pi, 114 + h + 12, pw - 28, [P(t, 9.5, False, TXT, lh=11.5, sb=8, bullet=STEEL) for t in PREMISSAS], inside=pan)
    if 114 + h + 12 + hb > YB - 10:
        WARN.append(f'roadmap: premissas estouram ({114 + h + 12 + hb:.0f})')
    # linha do tempo: três passos nas duas fases
    x0 = px + pw + 22
    gap = 18
    cw = (X1 - x0 - gap * 2) / 3
    C = [(x0 + i * (cw + gap), cw) for i in range(3)]
    yl = 102
    f1 = (C[0][0], C[1][0] + C[1][1] - C[0][0])
    for (x, w), label, cor in ((f1, 'FASE 1  ·  JÁ NO PRÓXIMO CICLO DE AVALIAÇÃO', GREYBLUE),
                               (C[2], 'FASE 2  ·  EVOLUÇÃO EM CICLOS SEGUINTES', MINT)):
        S.text(x, yl, w, [P(label, 8, True, NAVY, lh=10, spc=1)])
        S.box(x, yl + 13, w, 2.5, fill=cor)
    yn, dn = 130, 24
    S.box(x0, yn + dn / 2 - 1, X1 - x0 - 8, 2, fill=LIGHT)
    S.box(X1 - 8, yn + dn / 2 - 6, 8, 12, fill=LIGHT, prst=MSO_SHAPE.CHEVRON, adj=0.5)
    cab = lambda k, t: [P(k, 7.5, True, KICK, lh=9, spc=1.2), P(t, 13, True, NAVY, lh=15.5, sb=3)]
    yt = yn + dn + 10
    ybul = yt + max(paras_h(cab(k, t), cw) for k, t, _ in PASSOS) + 12
    for i, ((x, w), (k, t, itens)) in enumerate(zip(C, PASSOS)):
        fase2 = i == 2
        no = S.box(x, yn, dn, dn, fill=MINT if fase2 else NAVY, prst=MSO_SHAPE.OVAL)
        S.shape_text(no, x, yn, dn, dn, [P(str(i + 1), 11, True, NAVY if fase2 else WHITE, lh=13, align='c')], ins=(0, 0, 0, 0))
        if i:
            S.box(x - gap / 2, yt, 0.75, YB - yt, fill=LINE)
        S.text(x, yt, w, cab(k, t))
        h = S.text(x, ybul, w - 4, [P(t, 10, False, TXT, lh=12, sb=10, bullet=GREYBLUE if fase2 else STEEL) for t in itens])
        if ybul + h > YB - 6:
            WARN.append(f'roadmap: passo {i + 1} estoura ({ybul + h:.0f})')
    S.check('slide roadmap')


if __name__ == '__main__':
    build(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else os.path.join(DIST, 'Avaliacao_Desempenho_OA.pptx'),
          [slide_historia, slide_roadmap_impl])
