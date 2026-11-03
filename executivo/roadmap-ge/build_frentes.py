"""Roadmap de evolução do Modelo de Operação: um slide executivo por frente de trabalho, para o Gerente Executivo.

Uso: python3 build_frentes.py <AM_Etapa_5_-_Roadmap_de_evolucao_do_modelo.pptx> [saida.pptx]

Abre com o plano de entrega (8 ações, 3 horizontes, foco do Gerente Executivo) e segue com 7 frentes
(01 e 02 juntas no fechamento da Operação Assistida). Cada frente: a entrega, como saber que está funcionando,
a direção recomendada e a pergunta para o comitê. Tudo tirado do roadmap (slides indicados nos comentários).
"""
import os
import sys

from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE

from build_sintese import (GREY, LIGHT, LINE, NAVY, ORANGE, PALE, PEACH, SLATE, STEEL, TXT, WARN, WHITE, X0, X1,
                           E, H, P, S, prune, slide_plano, tw)

LAYOUT = 'AM_CONTEUDO'

# ------------------------------------------------------------------ abertura: plano de entrega com o foco do GE
PLANO = [
    ('FECHAR A\nOPERAÇÃO\nASSISTIDA', STEEL, [
        ('01', 'Adoção contínua do backlog e Azure DevOps', 'FEG',
         'Todo fórum de acompanhamento rodando a partir do Azure DevOps', [(0, 1)], '4 semanas'),
        ('02', 'Conclusão da implantação das Comunidades Técnicas', 'Comunidades Técnicas',
         'Líderes das Comunidades Técnicas formalizados e decisão sobre PMO dedicado', [(0, 0.5)], '2 semanas'),
    ]),
    ('MONITORAR\nO MODELO', SLATE, [
        ('03', 'Monitoramento do modelo operacional', 'FEG',
         'Confirmar a meta de 90% de aderência por frente', [(0, 3)], '3 meses'),
        ('04', 'Acompanhamento da performance das Squads', 'Líderes de Comunidade e FEG',
         'Primeiros resultados como referência, não como cobrança', [(0, 3)], '3 meses'),
    ]),
    ('EVOLUIR\nO MODELO', NAVY, [
        ('05', 'Gestão de pessoas', 'FEG e GP',
         'Gate de onboarding obrigatório e Fase 1 da avaliação no próximo ciclo', [(0, 2), (0, 6)],
         'Onboarding 2 meses · Avaliação 6 meses'),
        ('06', 'Continuidade da Gestão da Mudança', 'Gerentes e Líderes de Comunidade',
         'Donos de GMO nomeados na primeira semana e CMAK no comitê mensal', [(0, 6)], '6 meses'),
        ('07', 'Padronização e evolução dos processos de suporte', 'FEG',
         'Começar pelo portfólio e pelo conhecimento crítico', [(0, 12)], '12 meses'),
        ('08', 'Definição e alinhamento de SLAs com as áreas de negócio', 'Líderes de Comunidade',
         'SLA só depois de cerca de 3 meses de histórico por Squad', [(0, 12)], '12 meses'),
    ]),
]

# ------------------------------------------------------------------ frentes
# (número, nome da frente, título, subtítulo, entrega, dono, prazo, rótulo da coluna do meio, itens do meio,
#  recomendações, pergunta para o comitê, notas)
FRENTES = [
    dict(n='01 · 02', nome='Fechamento da Operação Assistida',  # slides 3, 4, 8, 11 e 41
         titulo='Fechamento: Azure DevOps como fonte única do trabalho',
         sub='Em até 4 semanas, toda demanda registrada e atualizada no Azure DevOps; em 2 semanas, as Comunidades '
             'Técnicas fecham a implantação de ritos, papéis e interfaces.',
         entrega=['Fluxo de demandas padronizado, com registros atualizados e qualidade da informação governada.',
                  'Comunidades Técnicas com ritos, papéis, responsabilidades e interfaces consolidados.'],
         dono='FEG (Azure DevOps) · Comunidades Técnicas', prazo='4 semanas · 2 semanas',
         meio_rot='COMO SABER QUE ESTÁ FUNCIONANDO',
         meio=[('Demandas no Azure DevOps', 'Toda demanda registrada na ferramenta oficial, sem trilhas paralelas.'),
               ('Informação atualizada', 'Estado, prioridade e responsável refletem a evolução real do trabalho.'),
               ('Fóruns sobre o Azure DevOps', 'O acompanhamento das comunidades roda a partir da própria ferramenta.')],
         direcao=[('Exigir que todo fórum de acompanhamento rode no Azure DevOps.',
                   'É um dos critérios de adoção do modelo e o que dá consistência aos dados.'),
                  ('Tratar o Azure DevOps como pré-requisito dos indicadores.',
                   'A medição oficial das Squads só começa na 4ª semana de uso integral.'),
                  ('Concluir o posicionamento dos líderes das Comunidades Técnicas.',
                   'E decidir sobre um PMO dedicado ao suporte a elas.')],
         pergunta='Alguma demanda ainda está sendo tratada fora do Azure DevOps?'),
    dict(n='03', nome='Monitoramento do modelo operacional',  # slides 7, 8 e 9
         titulo='Monitoramento: o modelo continua sendo aplicado?',
         sub='A FEG apura, todo mês e por comunidade, cinco frentes de adoção. A régua de estabilidade: 90% em cada '
             'frente, por três meses seguidos.',
         entrega=['Um mecanismo simples e recorrente para verificar a aplicação do modelo, identificar perdas de '
                  'aderência e corrigir antes que as práticas deixem de ser executadas.'],
         dono='FEG', prazo='3 meses de apuração mensal; depois, trimestral',
         meio_rot='A RÉGUA DE ESTABILIDADE',
         numeros=[('≥ 90%', 'em cada uma das 5 frentes, por comunidade'), ('3 meses', 'consecutivos na meta'),
                  ('0', 'desvio crítico sem plano de tratamento')],
         meio=[('5 frentes avaliadas', 'Ritos e fóruns · Papéis · Interfaces com o negócio · Ferramentas oficiais · '
                                       'Fluxo de backlog')],
         direcao=[('Confirmar a meta de 90%.', 'Hoje ela é uma proposta inicial; sem meta aprovada, não há régua.'),
                  ('Só espaçar a apuração após três meses estáveis.',
                   'E voltar ao acompanhamento mensal na primeira queda de aderência.'),
                  ('Exigir evidência objetiva em cada critério.',
                   'Atendido ou não atendido, sem pontuação parcial e validado pelo responsável.')],
         pergunta='Qual comunidade está abaixo de 90% e qual é o plano para voltar à meta?'),
    dict(n='04', nome='Performance das Squads',  # slides 11, 12 e 13
         titulo='Squads: primeiro medir o fluxo, depois cobrar',
         sub='Os indicadores entram em uso oficial a partir da 4ª semana de Azure DevOps integral, com painéis no '
             'Power BI. Os primeiros resultados viram a referência de desempenho.',
         entrega=['Painéis no Power BI com quatro dimensões: eficiência do fluxo, volume e andamento, perfil das '
                  'demandas e distribuição do trabalho.'],
         dono='Líderes de Comunidade e FEG', prazo='3 meses',
         meio_rot='TRÊS NÚMEROS PARA O COMITÊ',
         meio=[('Demandas atrasadas', 'Mostra o compromisso com as áreas clientes sendo cumprido ou não.'),
               ('Lead time médio', 'Do registro à conclusão: é a base dos futuros SLAs.'),
               ('Em andamento por responsável', 'Revela concentração de trabalho em poucas pessoas.')],
         direcao=[('Não cobrar desempenho nas duas primeiras semanas.',
                   'Esse é o período de estabilizar registros, estados e painéis.'),
                  ('Definir dono e periodicidade de análise em cada comunidade.',
                   'É a governança da medição prevista no roadmap.'),
                  ('Usar os primeiros resultados como linha de base.',
                   'A evolução das Squads passa a ser lida contra ela.')],
         pergunta='Onde está o gargalo de cada comunidade e quem está sobrecarregado?'),
    dict(n='05', nome='Gestão de pessoas',  # slides 16 a 20, 22 e 23
         titulo='Pessoas: onboarding no modelo e avaliação matricial',
         sub='Quem chega aprende como a FE funciona em 2 a 4 semanas; quem está passa a ser avaliado também pela '
             'contribuição à comunidade, já no próximo ciclo.',
         entrega=['Onboarding de novos profissionais institucionalizado: vídeo, guia de bolso e e-learning, com buddy.',
                  'Avaliação de desempenho matricial: metas 70/30 e input do Líder de Comunidade na nota.'],
         dono='FEG e GP', prazo='Onboarding 2 meses · Avaliação 6 meses',
         meio_rot='COMO SABER QUE ESTÁ FUNCIONANDO',
         meio=[('Gate do onboarding', 'O novo integrante responde às 8 perguntas sem consultar o guia.'),
               ('Metas formalizadas no prazo', 'Indicador de aderência dos primeiros ciclos da avaliação.'),
               ('Feedbacks registrados', 'Registrados no Oracle HCM, ferramenta única do processo.')],
         direcao=[('Tornar o gate das 8 perguntas obrigatório.', 'Com buddy desde o primeiro dia de cada integrante.'),
                  ('Aplicar a Fase 1 da avaliação no próximo ciclo.',
                   '1 a 3 metas individuais (70%) e ao menos 1 meta de contribuição à comunidade (30%).'),
                  ('Exigir alinhamento entre Gerente Imediato e Líder de Comunidade.',
                   'Antes de formalizar metas, com uma instância definida para divergências.')],
         pergunta='As metas do próximo ciclo foram pactuadas entre Gerente Imediato e Líder de Comunidade?'),
    dict(n='06', nome='Continuidade da Gestão da Mudança',  # slides 25 a 27, 33 e 36
         titulo='Gestão da Mudança: de projeto a processo da FE',
         sub='Um dono de GMO em cada gerência roda quatro frentes; o comitê mensal da FE lê quatro índices, decide e '
             'comunica. Em 6 meses, a GMO é rotina.',
         entrega=['GMO como processo da FE: dono por gerência, um número por frente e um comitê que lê, decide e '
                  'comunica todo mês.'],
         dono='Gerentes e Líderes de Comunidade', prazo='6 meses',
         meio_rot='OS QUATRO ÍNDICES DO COMITÊ',
         numeros=[('≥ 80', 'Comunicação (IEC)'), ('≥ 75', 'Cultura e stakeholders (IES)'), ('≥ 70', 'Impactos (ICI)'),
                  ('≥ 80', 'Capacitação (IPT)')],
         meio=[('Semáforo', 'Verde ≥ 75 · amarelo 50 a 74 · vermelho < 50, ao lado do termômetro P·E·A.')],
         direcao=[('Nomear o dono de GMO de FEG, FEL, FEN e FER.',
                   'Na semana 1: um analista sênior, com cerca de 4h por semana nos meses 1 e 2.'),
                  ('Adotar o CMAK como régua do comitê mensal.', 'Quatro índices com meta, semáforo e termômetro.'),
                  ('Fixar o calendário da primeira onda.',
                   'Comitê de abertura, workshop "GMO na prática" e corte do ponto de partida no fim do mês 2.')],
         pergunta='Qual medida está mais longe da meta e quem é o dono da ação deste mês?'),
    dict(n='07', nome='Processos de suporte',  # slides 38, 41, 46, 50, 52, 55 e 56
         titulo='Processos de suporte: um ciclo, cinco processos',
         sub='Estratégia antecipa, portfólio decide, contratos asseguram recursos, governança controla e conhecimento '
             'sustenta. Nenhum deve ser estruturado de forma isolada.',
         entrega=['Arquitetura integrada de processos em torno do ciclo de evolução das ferramentas eletroenergéticas.'],
         dono='FEG', prazo='12 meses',
         meio_rot='ONDE CADA PROCESSO ESTÁ',
         maturidade=[('Estratégia e inovação', 3, 'Estruturado e em execução inicial'),
                     ('Gestão do portfólio', 2, 'Estruturação base do processo'),
                     ('Contratos e fornecedores', 2, 'Estruturação base do processo'),
                     ('Governança e conformidade', 1, 'Macroprocesso e diretrizes definidos'),
                     ('Capacitação e conhecimento', 1, 'Macroprocesso e diretrizes definidos')],
         direcao=[('Começar pelo portfólio.',
                   'Critérios de priorização e repriorização semestral dão a régua para os demais processos.'),
                  ('Atacar a dependência de pessoas.',
                   'Todo conhecimento crítico com pelo menos dois detentores e sucessor nas posições críticas.'),
                  ('Aproveitar o que já existe.',
                   'Controles contratuais e o fluxo de demandas no Azure DevOps, sem criar estruturas paralelas.')],
         pergunta='Que conhecimento crítico das ferramentas hoje depende de uma única pessoa?'),
    dict(n='08', nome='SLAs com as áreas de negócio',  # slide 58
         titulo='SLAs: só prometer ao negócio o que já foi medido',
         sub='Quatro etapas levam da medição aos SLAs: baseline por Squad, SLOs por serviço, alinhamento com as áreas '
             'clientes e formalização com DPL e DOP.',
         entrega=['SLAs por serviço formalizados com DPL e DOP, com exceções, escalonamento e revisão periódica.'],
         dono='Líderes de Comunidade', prazo='12 meses',
         meio_rot='AS QUATRO ETAPAS',
         etapas=[('1', 'Consolidar a medição', 'Cerca de 3 meses de histórico → baseline por Squad'),
                 ('2', 'Definir SLIs e SLOs', 'Novas funcionalidades e correção de bugs → SLOs por serviço'),
                 ('3', 'Alinhar com a FE e as áreas', 'Calibrar em piloto → SLOs acordados'),
                 ('4', 'Formalizar os SLAs', 'Com DPL e DOP → SLAs formalizados')],
         direcao=[('Não assumir SLA antes de cerca de 3 meses de histórico.',
                   'O SLO é meta interna medida; o SLA é compromisso com o negócio.'),
                  ('Começar pelo catálogo da FE.', 'Novas funcionalidades e correção de bugs, por serviço e prioridade.'),
                  ('Calibrar em piloto com DPL e DOP.', 'Antes de formalizar, já com exceções e escalonamento.')],
         pergunta='Temos histórico suficiente para prometer este prazo ao negócio?'),
]


def tag(s, n, nome, texto=None):
    """Etiqueta de seção no estilo do roadmap, com largura ajustada ao texto."""
    texto = texto or f'Frente {n} · {nome}'
    largura = tw(texto, 9 / 0.84) + 8
    for sh in s.sl.shapes:
        if sh.name == 'Texto_32':
            sh.text_frame.paragraphs[0].runs[0].text = texto
            sh.width = E(largura)
        if sh.name == 'Etiqueta secao_30':
            sh.width = E(largura + 26)
        if sh.name == 'Nº 03':
            sh.text_frame.paragraphs[0].runs[0].text = n.split(' ')[0]


def slide_frente(prs, layout, ref, f, idx):
    s = S(prs, layout, ref, idx, f['titulo'], f['sub'],
          f"Frente {f['n']} · {f['nome']}. Dono: {f['dono']}. Prazo: {f['prazo']}. Pergunta para o comitê: {f['pergunta']}")
    tag(s, f['n'], f['nome'])
    yt, yb = 142, 454
    wa, wb, g = 232, 304, 14
    xa, xb = X0, X0 + 232 + g
    xc = xb + wb + g
    wc = X1 - xc

    # coluna A: a entrega, dono e prazo
    s.box(xa, yt, wa, yb - yt, fill=PALE)
    s.box(xa, yt, wa, 3, fill=ORANGE)
    y = yt + 14
    s.text(xa + 14, y, wa - 28, [P('A ENTREGA', 8, True, STEEL, spc=1)])
    y += 16
    for e in f['entrega']:
        y += s.text(xa + 14, y, wa - 28, [P(e, 12.5, True, NAVY, lh=15)]) + 10
    yr = yb - 92
    if y > yr - 6:
        WARN.append(f"{f['n']}: entrega encosta em dono/prazo ({y:.0f} > {yr - 6})")
    s.box(xa + 14, yr, wa - 28, 0.75, fill=LINE)
    s.text(xa + 14, yr + 10, wa - 28, [P('DONO', 8, True, STEEL, spc=1), P(f['dono'], 10.5, False, TXT, lh=12.5, sb=2)])
    s.text(xa + 14, yr + 48, wa - 28, [P('PRAZO', 8, True, STEEL, spc=1), P(f['prazo'], 10.5, False, TXT, lh=12.5, sb=2)])

    # coluna B: como saber que está funcionando
    s.text(xb, yt + 2, wb, [P(f['meio_rot'], 8, True, STEEL, spc=1)])
    y = yt + 22
    if 'numeros' in f:
        nn = f['numeros']
        nw = (wb - 8 * (len(nn) - 1)) / len(nn)
        hmax = 0
        for i, (v, lbl) in enumerate(nn):
            x = xb + i * (nw + 8)
            h = H([P(lbl, 9, False, TXT, lh=11)], nw - 12) + 44
            hmax = max(hmax, h)
        for i, (v, lbl) in enumerate(nn):
            x = xb + i * (nw + 8)
            s.box(x, y, nw, hmax, fill=WHITE, line=LINE)
            s.text(x + 6, y + 8, nw - 12, [P(v, 20 if len(nn) < 4 else 17, True, ORANGE, lh=24, align='c')])
            s.text(x + 6, y + 36, nw - 12, [P(lbl, 9, False, TXT, lh=11, align='c')])
        y += hmax + 14
    if 'maturidade' in f:
        niveis = ['Diretrizes', 'Base', 'Em execução']
        cw = 22
        xs = xb + wb - 3 * cw - 4
        for j, nv in enumerate(niveis):
            s.text(xs + j * cw - 6, y - 2, cw + 12, [P(nv, 6.5, True, GREY, lh=8, align='c')], check=False)
        y += 16
        for nome, lvl, desc in f['maturidade']:
            h = 46
            s.box(xb, y + h - 1, wb, 0.5, fill=LINE)
            s.text(xb, y + 6, xs - xb - 10, [P(nome, 10.5, True, NAVY, lh=12.5), P(desc, 9, False, GREY, lh=11, sb=2)])
            for j in range(3):
                s.box(xs + j * cw + 3, y + 14, cw - 6, 14, fill=(ORANGE if lvl == 3 else STEEL if lvl == 2 else SLATE)
                      if j < lvl else LIGHT)
            y += h
    if 'etapas' in f:
        for k, (n, t, d) in enumerate(f['etapas']):
            h = 64
            s.box(xb, y, wb, h - 8, fill=WHITE, line=LINE)
            s.box(xb, y, 4, h - 8, fill=STEEL if k < 3 else NAVY)
            s.text(xb + 14, y + 6, 22, [P(n, 18, True, ORANGE, lh=20)])
            s.text(xb + 40, y + 9, wb - 52, [P(t, 11, True, NAVY, lh=13), P(d, 9.5, False, TXT, lh=11.5, sb=3)])
            y += h
    itens = [[P(t, 12, True, NAVY, lh=14), P(d, 10.5, False, TXT, lh=12.8, sb=3)] for t, d in f.get('meio', [])]
    hs_m = [H(p_, wb - 18) for p_ in itens]
    gap_m = 16 if len(itens) < 2 else max(16, min(34, (yb - 10 - y - sum(hs_m)) / (len(itens) - 1)))
    for paras, h in zip(itens, hs_m):
        s.box(xb, y + 2, 3, h - 2, fill=STEEL)
        s.text(xb + 14, y, wb - 18, paras)
        y += h + gap_m
    if y > yb + 34:
        WARN.append(f"{f['n']}: coluna do meio passa ({y:.0f} > {yb})")

    # coluna C: direção do Gerente Executivo
    s.box(xc, yt, wc, yb - yt, fill=NAVY)
    s.text(xc + 16, yt + 14, wc - 32, [P('DIREÇÃO DO GERENTE EXECUTIVO', 8, True, ORANGE, spc=1)])
    ps = [[P(a, 12, True, WHITE, lh=14.5), P(b, 10.5, False, LIGHT, lh=12.8, sb=3)] for a, b in f['direcao']]
    hs = [H(p_, wc - 32 - 26) for p_ in ps]
    yy = yt + 40
    gap = max(12, min(40, (yb - 18 - yy - sum(hs)) / (len(hs) - 1)))
    for i, (p_, h) in enumerate(zip(ps, hs), start=1):
        s.text(xc + 16, yy - 2, 20, [P(str(i), 16, True, ORANGE, lh=17)])
        s.text(xc + 16 + 26, yy, wc - 32 - 26, p_)
        yy += h + gap
    if yy - gap > yb - 8:
        WARN.append(f"{f['n']}: direção passa ({yy - gap:.0f})")

    # pergunta para o comitê
    fy = yb + 12
    s.box(X0, fy, X1 - X0, 40, fill=PEACH)
    s.box(X0, fy, 3, 40, fill=ORANGE)
    s.text(X0 + 16, fy, X1 - X0 - 32, [P(runs=[('NO COMITÊ, PERGUNTE:  ', True, ORANGE), (f['pergunta'], True, NAVY)],
                                         size=11.5, lh=14)], h=40, anchor='m')
    s.check(f"frente {f['n']}")


def main():
    src = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dist',
                                                             'Roadmap_Evolucao_Modelo_Frentes_GE.pptx')
    prs = Presentation(src)
    layout = next(l for m in prs.slide_masters for l in m.slide_layouts if l.name == LAYOUT)
    ref = next(s for s in prs.slides if any(sh.name == 'Etiqueta secao_30' for sh in s.shapes))
    n_orig = len(prs.slides)
    s0 = slide_plano(prs, layout, ref, PLANO, 'FOCO DO GERENTE EXECUTIVO',
                     'Roadmap de evolução: oito ações em três horizontes',
                     'Quem responde por cada ação, em quanto tempo e onde o Gerente Executivo concentra a atenção')
    tag(s0, '00', '', 'Visão geral · Gerente Executivo')
    for i, f in enumerate(FRENTES, start=1):
        slide_frente(prs, layout, ref, f, i)
    prune(prs, layout, n_orig)
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    prs.save(out)
    for w in WARN:
        print('ATENÇÃO:', w)
    print('ok', out)


if __name__ == '__main__':
    main()
