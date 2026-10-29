"""Projeto Spalla: acrescenta ao plano de GMO a estimativa de esforço (régua de cálculo) e um painel de cenários.

Uso: python3 build_esforco.py <Spalla_Plano_GMO_Matriz_Aumento_Atividades.xlsx> [saida.xlsx]

Abas novas:
  Painel de Esforço  botões (listas) de dedicação, porte do escopo e pessoas; indicadores e gráfico
  Régua de Esforço   regra de cálculo, premissas editáveis e horas por entregável da aba 2
As abas 1 e 2 não são alteradas. Tudo é fórmula: muda a premissa, o painel recalcula.
"""
import os
import sys

from openpyxl import load_workbook
from openpyxl.chart import BarChart, BubbleChart, LineChart, Reference, Series
from openpyxl.chart.label import DataLabelList
from openpyxl.comments import Comment
from openpyxl.formatting.rule import ColorScaleRule, DataBarRule, FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.workbook.defined_name import DefinedName
from openpyxl.worksheet.datavalidation import DataValidation

SRC = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(
    os.path.dirname(os.path.abspath(__file__)), 'dist', 'Spalla_Plano_GMO_Matriz_Aumento_Atividades.xlsx')

# Convenções do arquivo: Calibri, azul-marinho 002B40, azul-petróleo 12628B, azul-claro DCEAF3
NAVY, TEAL, PALE, WHITE = '002B40', '12628B', 'DCEAF3', 'FFFFFF'
INPUT_FILL, INPUT_FONT, LINK_FONT, GREY = 'FFF2CC', '0000FF', '008000', '7F7F7F'
F = 'Calibri'
P1, P2 = 'Plano de Trabalho', 'Plano GMO - Entregáveis'
PAINEL, REGUA = 'Painel de Esforço', 'Régua de Esforço'
QP, QR = f"'{PAINEL}'", f"'{REGUA}'"
thin = Side(style='thin', color='BFBFBF')
BOX = Border(left=thin, right=thin, top=thin, bottom=thin)
LINE_B = Border(bottom=thin)


def fill(c):
    return PatternFill('solid', fgColor=c)


def put(ws, ref, value, size=11, bold=False, color='000000', bg=None, h='left', v='center', wrap=True, fmt=None,
        italic=False, border=None):
    c = ws[ref]
    c.value = value
    c.font = Font(name=F, size=size, bold=bold, color=color, italic=italic)
    c.alignment = Alignment(horizontal=h, vertical=v, wrap_text=wrap)
    if bg:
        c.fill = fill(bg)
    if fmt:
        c.number_format = fmt
    if border:
        c.border = border
    return c


def band(ws, rng, value, size=11, bg=TEAL, color=WHITE, bold=True, h='left', height=None):
    ws.merge_cells(rng)
    first = rng.split(':')[0]
    put(ws, first, value, size=size, bold=bold, color=color, bg=bg, h=h)
    for row in ws[rng]:
        for c in row:
            c.fill = fill(bg)
    if height:
        ws.row_dimensions[ws[first].row].height = height


def name(wb, nm, ref):
    wb.defined_names[nm] = DefinedName(nm, attr_text=ref)


def entrada(c, fmt=None):
    c.font = Font(name=F, size=11, bold=True, color=INPUT_FONT)
    c.fill = fill(INPUT_FILL)
    c.border = BOX
    c.alignment = Alignment(horizontal='center', vertical='center')
    if fmt:
        c.number_format = fmt


# ---------------------------------------------------------------- régua: horas de referência por entregável
# (ID, linha na aba 2 ou None, mês início, mês fim, h fixas, h/área, h/público, h/marco, h/semana, origem do período)
# Meses: 1 = out/26 ... 6 = mar/27. Horas: estimativa de referência para calibrar com a GP.
LINHAS = [
    ('GMO-00', None, 1, 6, 0, 0, 0, 0, 2, 'Esforço de gestão do próprio plano, ao longo de todo o período',
     'Status semanal, preparação e participação nos fóruns do projeto: ~2h por semana'),
    ('GMO-01', 7, 1, 2, 8, 3, 0, 2, 0, 'Aba 1, frente 1: out–nov/2026',
     'Modelo da matriz (8h); por área, 1h de conversa + 1h de consolidação + 1h de validação; 2h de atualização por marco'),
    ('GMO-02', 8, 1, 1, 6, 1, 0.5, 0, 0, 'Aba 2: antes do plano de comunicação',
     'Estrutura do mapa (6h); 1h por área para indicar públicos; 30 min por público para segmentar e definir abordagem'),
    ('GMO-03', 9, 1, 5, 12, 0, 0.5, 4, 0, 'Aba 1, frentes 5 e 6: out/2026–mar/2027 (linha de base e reavaliação)',
     'Instrumento de prontidão (12h); 30 min por público para recorte; 4h por marco para aplicar e consolidar o pulso'),
    ('GMO-04', 10, 1, 2, 4, 1, 0, 0, 0.5, 'Aba 1, frente 2: out–nov/2026',
     'Quadro de pendências (4h); 1h por área para impactos e orientação; 30 min por semana de acompanhamento'),
    ('GMO-05', 11, 2, 4, 8, 2, 0, 0, 0, 'Aba 2: antes da entrada em vigor (estimado nov–jan)',
     'Guia de papéis a partir do desenho A&M (8h); 2h por área para traduzir e validar com o gestor'),
    ('GMO-06', 12, 1, 4, 4, 0.5, 0, 1, 0, 'Aba 1, frente 4: out/2026–jan/2027',
     'Planilha de cobertura (4h); 30 min por área para coletar ausências; 1h de revisão antes de cada marco'),
    ('GMO-07', 13, 1, 3, 4, 0, 0, 2, 0.5, 'Aba 1, frente 3: out–dez/2026',
     'TI executa; a GP só acompanha: checklist (4h), 2h por marco e 30 min por semana de follow-up'),
    ('GMO-08', 14, 1, 6, 12, 0, 1, 0, 2, 'Aba 2: pré-transição, transição e estabilização',
     'Plano de comunicação (12h); 1h por público para adaptar mensagem e canal; ~2h por semana de produção e disparo'),
    ('GMO-09', 15, 1, 4, 6, 1, 0, 2, 0, 'Aba 2: antes de comunicações e marcos críticos',
     'Kit de mensagens para líderes (6h); 1h por área de alinhamento; 2h por marco de mobilização'),
    ('GMO-10', 16, 2, 6, 4, 0, 0, 0, 1.5, 'Aba 1, frente 6: nov/2026–mar/2027',
     'Canal e FAQ (4h); ~1h30 por semana para registrar, responder e encaminhar dúvidas'),
    ('GMO-11', 17, 2, 4, 12, 1, 1.5, 0, 0.5, 'Aba 2: planejamento antes da entrada em vigor (estimado nov–jan)',
     'Matriz público x conteúdo (12h); 1h por área de levantamento; 1h30 por público para trilha e agenda; 30 min por semana de presença'),
    ('GMO-12', 18, 1, 2, 6, 0, 0, 0, 0, 'Aba 1, frente 5: out–nov/2026',
     'Alinhar calendário e emitir parecer sobre a pesquisa existente (6h)'),
    ('GMO-13', 19, 2, 3, 6, 0, 0, 0, 1.5, 'Aba 1, frente 7: nov–dez/2026',
     'Backlog priorizado (6h); ~1h30 por semana para cobrar donos e atualizar status'),
    ('GMO-14', 20, 1, 6, 10, 0, 0, 3, 0.5, 'Aba 2: linha de base, transição e estabilização',
     'Painel e regras de cálculo (10h); 3h por marco de medição; 30 min por semana de atualização'),
    ('GMO-15', 21, 1, 6, 8, 0, 0, 6, 1, 'Aba 2: antes de cada marco da transição',
     'Roteiro integrado (8h); 6h por marco para go/no-go e handover; 1h por semana de integração das frentes'),
    ('GMO-16', 22, 6, 6, 8, 1, 0, 0, 0, 'Aba 1, frente 8: mar/2027',
     'Relatório de fechamento (8h); 1h por área para transferir pendências à rotina'),
]
CATS = ['Coordenação do plano', 'Diagnóstico e impactos', 'Pessoas e estrutura', 'Tecnologia e processos',
        'Comunicação e engajamento', 'Capacitação', 'Clima e percepção', 'Gestão de riscos e ações',
        'Mensuração e adoção', 'Governança e implantação', 'Sustentação']
MESES = ['Out/26', 'Nov/26', 'Dez/26', 'Jan/27', 'Fev/27', 'Mar/27']
PORTES = ['Pequeno', 'Médio', 'Grande']
DIRECIONADORES = [  # (rótulo, nome, pequeno, médio, grande, explicação)
    ('Áreas / gerências impactadas', 'N_AREAS', 5, 10, 20, 'Cada área pede levantamento, validação e acompanhamento próprios'),
    ('Públicos (grupos de stakeholders)', 'N_PUBLICOS', 8, 15, 30, 'Cada público pede mensagem, canal, escuta e capacitação próprios'),
    ('Marcos da transição (viradas, go/no-go)', 'N_MARCOS', 3, 4, 6, 'Cada marco pede preparação, checagem de prontidão e atualização'),
]


def build_regua(wb):
    ws = wb.create_sheet(REGUA)
    ws.sheet_view.showGridLines = False
    ws.sheet_view.zoomScale = 85
    for col, w in zip('ABCDEFGHIJKLMNOPQRS', [10, 24, 34, 8, 8, 8, 9, 9, 9, 9, 9, 12, 13, 11, 9, 34, 12, 9, 58]):
        ws.column_dimensions[col].width = w
    band(ws, 'A1:S1', 'PROJETO SPALLA | RÉGUA DE ESFORÇO GMO — COMO AS HORAS SÃO CALCULADAS', 18, NAVY, height=39)
    band(ws, 'A2:S2', 'Estimativa de referência para dimensionar o esforço de GMO antes de conhecer o número real de áreas. '
         'Células amarelas com número azul são premissas e podem ser alteradas; o resto é cálculo. '
         'O painel (aba anterior) lê tudo daqui.', 10, PALE, '203849', bold=False, height=35)

    band(ws, 'A4:V4', '1. A REGRA (a conta em uma linha)', 11, TEAL, height=22)
    regras = [
        'HORAS DE CADA ENTREGÁVEL = horas fixas (montar o produto uma vez) + horas por área × nº de áreas + horas por público × nº de '
        'públicos + horas por marco × nº de marcos + horas por semana × semanas em que o entregável fica ativo.',
        'CAPACIDADE DO TIME = pessoas × horas por dia × dias úteis por mês × meses do período × produtividade (parte do dia que vira '
        'entrega, descontados reuniões gerais e imprevistos).',
        'LEITURA = cobertura (capacidade ÷ esforço). 100% ou mais: o time dá conta. Entre 70% e 99%: apertado. Abaixo de 70%: falta gente.',
    ]
    for i, t in enumerate(regras):
        r = 5 + i
        ws.merge_cells(f'A{r}:S{r}')
        put(ws, f'A{r}', t, 10.5, color='203849')
        ws.row_dimensions[r].height = 30

    band(ws, 'A9:V9', '2. PREMISSAS (amarelo = pode alterar)', 11, TEAL, height=22)
    prem = [
        ('Meses do período (out/2026 a mar/2027, abas 1 e 2)', 'MESES', 6, '0'),
        ('Dias úteis por mês', 'DIAS_MES', 21, '0'),
        ('Semanas por mês', 'SEM_MES', '=52/12', '0.00'),
        ('Produtividade: parte das horas do dia que vira entrega', 'PROD', 1, '0%'),
        ('Horas efetivas por dia, GMO full-time', 'H_FULL', 6, '0'),
        ('Horas efetivas por dia, GMO part-time', 'H_PART', 3, '0'),
    ]
    for i, (lbl, nm, v, fmt) in enumerate(prem):
        r = 10 + i
        ws.merge_cells(f'A{r}:C{r}')
        put(ws, f'A{r}', lbl, 10.5)
        c = ws[f'D{r}']
        c.value = v
        if isinstance(v, str):
            put(ws, f'D{r}', v, 10.5, h='center', fmt=fmt, border=BOX)
        else:
            entrada(c, fmt)
        ws.merge_cells(f'D{r}:E{r}')
        name(wb, nm, f"{QR}!$D${r}")
    ws['D13'].comment = Comment('100% porque as 6h por dia já são tempo efetivo de trabalho. Reduza se houver perdas.', 'A&M')
    # lido do painel
    for i, (lbl, nm, ref) in enumerate([('Dedicação escolhida no painel', 'CENARIO', f"={QP}!$D$5"),
                                        ('Porte escolhido no painel', 'PORTE', f"={QP}!$D$6"),
                                        ('Pessoas de GMO no time (painel)', 'PESSOAS', f"={QP}!$D$7")]):
        r = 16 + i
        ws.merge_cells(f'A{r}:C{r}')
        put(ws, f'A{r}', lbl, 10.5)
        put(ws, f'D{r}', ref, 10.5, bold=True, color=LINK_FONT, h='center', border=BOX)
        ws.merge_cells(f'D{r}:E{r}')
        name(wb, nm, f"{QR}!$D${r}")

    # porte do escopo
    put(ws, 'G10', 'Direcionador de esforço', 10, True, WHITE, NAVY)
    ws.merge_cells('G10:J10')
    for c_, t in zip('KLMN', PORTES + ['Valor real']):
        put(ws, f'{c_}10', t, 10, True, WHITE, NAVY, h='center')
    put(ws, 'O10', 'Usado', 10, True, WHITE, TEAL, h='center')
    put(ws, 'P10', 'Por que pesa no esforço', 10, True, WHITE, NAVY)
    ws.merge_cells('P10:S10')
    ws['N10'].comment = Comment('Quando souber o número real, digite aqui: ele passa a valer no lugar do porte escolhido.', 'A&M')
    for i, (lbl, nm, p, m, g, why) in enumerate(DIRECIONADORES):
        r = 11 + i
        ws.merge_cells(f'G{r}:J{r}')
        put(ws, f'G{r}', lbl, 10.5, border=LINE_B)
        for c_, v in zip('KLM', (p, m, g)):
            entrada(ws[f'{c_}{r}'], '0')
            ws[f'{c_}{r}'].value = v
        entrada(ws[f'N{r}'], '0')
        put(ws, f'O{r}', f'=IF(N{r}<>"",N{r},INDEX(K{r}:M{r},MATCH(PORTE,$K$10:$M$10,0)))', 11, True, NAVY, PALE, 'center',
            fmt='0', border=BOX)
        name(wb, nm, f"{QR}!$O${r}")
        ws.merge_cells(f'P{r}:S{r}')
        put(ws, f'P{r}', why, 10, color='404040', border=LINE_B)
    put(ws, 'G14', 'Valor real em branco = vale o porte escolhido no painel.', 9, italic=True, color=GREY)
    ws.merge_cells('G14:S14')

    # tabela por entregável
    band(ws, 'A20:S20', '3. ESFORÇO POR ENTREGÁVEL (entregáveis da aba 2; horas de referência, calibrar com a GP)', 11, TEAL, height=22)
    heads = ['ID', 'Categoria', 'Entregável de GMO', 'Mês início', 'Mês fim', 'Meses ativos', 'Horas fixas',
             'Horas por área', 'Horas por público', 'Horas por marco', 'Horas por semana', 'Horas do produto',
             'Horas de acompanhamento', 'TOTAL (h)', 'Dias de trabalho', 'De onde vem o período', 'Impacto (prioridade, aba 2)',
             'Peso do impacto', 'Racional da estimativa (por que essas horas)']
    notas = {
        'G': 'Montar o produto uma vez: desenho, modelo, primeira versão e validação.',
        'H': 'Multiplica pelo nº de áreas: levantamento, conversa com gestor e validação por área.',
        'I': 'Multiplica pelo nº de públicos: segmentar, adaptar mensagem, conteúdo ou escuta por público.',
        'J': 'Multiplica pelo nº de marcos: preparar, checar prontidão e atualizar o produto a cada marco.',
        'K': 'Rotina enquanto o entregável está ativo: acompanhamento, reuniões, atualização e reporte.',
        'L': '= fixas + por área × áreas + por público × públicos + por marco × marcos',
        'M': '= horas por semana × meses ativos × semanas por mês',
        'D': '1 = out/26, 2 = nov/26, 3 = dez/26, 4 = jan/27, 5 = fev/27, 6 = mar/27',
        'R': 'Alta = 3, Média = 2, Baixa = 1. Usado no tamanho da bolha do gráfico de densidade.',
        'F': 'Tempo do entregável: quantos meses ele fica ativo. É o eixo do tempo no gráfico de densidade.',
    }
    for i, t in enumerate(heads):
        col = chr(ord('A') + i)
        put(ws, f'{col}21', t, 9.5, True, WHITE, NAVY if col not in 'N' else TEAL, h='center', border=BOX)
        if col in notas:
            ws[f'{col}21'].comment = Comment(notas[col], 'A&M')
    ws.row_dimensions[21].height = 42
    first = 22
    for k, (gid, row2, ini, fim, hf, ha, hp, hm, hs, origem, racional) in enumerate(LINHAS):
        r = first + k
        put(ws, f'A{r}', gid, 10, True, TEAL, border=BOX)
        if row2:
            put(ws, f'B{r}', f"='{P2}'!B{row2}", 10, color=LINK_FONT, border=BOX)
            put(ws, f'C{r}', f"='{P2}'!C{row2}", 10, color=LINK_FONT, border=BOX)
        else:
            put(ws, f'B{r}', 'Coordenação do plano', 10, border=BOX)
            put(ws, f'C{r}', 'Coordenação do plano de GMO (status, fóruns e reporte)', 10, border=BOX)
        for col, v in zip('DEGHIJK', (ini, fim, hf, ha, hp, hm, hs)):
            ws[f'{col}{r}'].value = v
            entrada(ws[f'{col}{r}'], '0')
        put(ws, f'F{r}', f'=E{r}-D{r}+1', 10, h='center', fmt='0', border=BOX)
        put(ws, f'L{r}', f'=G{r}+H{r}*N_AREAS+I{r}*N_PUBLICOS+J{r}*N_MARCOS', 10, h='center', fmt='#,##0', border=BOX)
        put(ws, f'M{r}', f'=K{r}*F{r}*SEM_MES', 10, h='center', fmt='#,##0', border=BOX)
        put(ws, f'N{r}', f'=L{r}+M{r}', 10.5, True, NAVY, PALE, 'center', fmt='#,##0', border=BOX)
        put(ws, f'O{r}', f'=N{r}/H_FULL', 10, h='center', fmt='0.0', border=BOX)
        put(ws, f'P{r}', origem, 9, color='404040', border=BOX)
        if row2:
            put(ws, f'Q{r}', f"='{P2}'!I{row2}", 10, color=LINK_FONT, h='center', border=BOX)
        else:
            ws[f'Q{r}'].value = 'Média'
            entrada(ws[f'Q{r}'])
        put(ws, f'R{r}', f'=IF(Q{r}="Alta",3,IF(Q{r}="Média",2,1))', 10, h='center', fmt='0', border=BOX)
        put(ws, f'S{r}', racional, 9, color='404040', border=BOX)
        ws.row_dimensions[r].height = 36
    last = first + len(LINHAS) - 1
    tot = last + 1
    put(ws, f'A{tot}', 'TOTAL', 11, True, WHITE, NAVY)
    ws.merge_cells(f'A{tot}:K{tot}')
    for col in 'LMNO':
        put(ws, f'{col}{tot}', f'=SUM({col}{first}:{col}{last})', 11, True, WHITE, NAVY, 'center',
            fmt='0.0' if col == 'O' else '#,##0')
    for col in 'PQRS':
        put(ws, f'{col}{tot}', '', bg=NAVY)
    name(wb, 'ESFORCO_TOTAL', f"{QR}!$N${tot}")
    ws.row_dimensions[tot].height = 24
    ws.conditional_formatting.add(f'N{first}:N{last}', DataBarRule(start_type='num', start_value=0, end_type='max',
                                                                   color='9DC3E6'))

    # resumo por categoria
    r0 = tot + 3
    band(ws, f'A{r0}:S{r0}', '4. RESUMO POR CATEGORIA', 11, TEAL, height=22)
    for col, t in zip('BCDE', ['Categoria', '', 'Horas', '% do total']):
        put(ws, f'{col}{r0 + 1}', t, 10, True, WHITE, NAVY, h='center')
    ws.merge_cells(f'B{r0 + 1}:C{r0 + 1}')
    cat_rows = []
    for i, cat in enumerate(CATS):
        r = r0 + 2 + i
        ws.merge_cells(f'B{r}:C{r}')
        put(ws, f'B{r}', cat, 10.5, border=LINE_B)
        put(ws, f'D{r}', f'=SUMIF($B${first}:$B${last},B{r},$N${first}:$N${last})', 10.5, True, NAVY, h='center',
            fmt='#,##0', border=LINE_B)
        put(ws, f'E{r}', f'=IF(ESFORCO_TOTAL=0,0,D{r}/ESFORCO_TOTAL)', 10.5, h='center', fmt='0%', border=LINE_B)
        cat_rows.append(r)
    rc = cat_rows[-1] + 1
    put(ws, f'B{rc}', 'Conferência (deve bater com o total)', 9, italic=True, color=GREY)
    ws.merge_cells(f'B{rc}:C{rc}')
    put(ws, f'D{rc}', f'=SUM(D{cat_rows[0]}:D{cat_rows[-1]})-ESFORCO_TOTAL', 9, italic=True, color=GREY, h='center',
        fmt='#,##0;-#,##0;"ok"')

    # capacidade
    r1 = rc + 3
    band(ws, f'A{r1}:S{r1}', '5. CAPACIDADE DO TIME DE GMO', 11, TEAL, height=22)
    cap = [
        ('Horas por dia no regime escolhido', 'H_DIA', '=IF(CENARIO="Full-time",H_FULL,H_PART)', '0'),
        ('Capacidade de 1 pessoa por mês (h)', 'CAP_PESSOA_MES', '=H_DIA*DIAS_MES*PROD', '#,##0'),
        ('Capacidade de 1 pessoa no período (h)', 'CAP_PESSOA', '=CAP_PESSOA_MES*MESES', '#,##0'),
        ('Capacidade do time no período (h)', 'CAP_TIME', '=CAP_PESSOA*PESSOAS', '#,##0'),
        ('Capacidade de 1 pessoa full-time no período (h) — base do FTE', 'CAP_FTE', '=H_FULL*DIAS_MES*PROD*MESES', '#,##0'),
        ('Cobertura do esforço', 'COBERTURA', '=IF(ESFORCO_TOTAL=0,0,CAP_TIME/ESFORCO_TOTAL)', '0%'),
        ('FTE necessários (pessoas full-time equivalentes)', 'FTE', '=IF(CAP_FTE=0,0,ESFORCO_TOTAL/CAP_FTE)', '0.0'),
        ('Pessoas necessárias no regime escolhido', 'PESSOAS_NEC', '=IF(CAP_PESSOA=0,0,ESFORCO_TOTAL/CAP_PESSOA)', '0.0'),
        ('Horas que faltam (negativo = sobra)', 'GAP', '=ESFORCO_TOTAL-CAP_TIME', '#,##0'),
    ]
    for i, (lbl, nm, f_, fmt) in enumerate(cap):
        r = r1 + 1 + i
        ws.merge_cells(f'A{r}:C{r}')
        put(ws, f'A{r}', lbl, 10.5, border=LINE_B)
        put(ws, f'D{r}', f_, 11, True, NAVY, PALE, 'center', fmt=fmt, border=BOX)
        ws.merge_cells(f'D{r}:E{r}')
        name(wb, nm, f"{QR}!$D${r}")
    ws.freeze_panes = 'D22'
    return ws, tot, first, last


def build_painel(wb, tot, ws_r, first, last):
    ws = wb.create_sheet(PAINEL, 2)
    ws.sheet_view.showGridLines = False
    ws.sheet_view.zoomScale = 85
    ws.column_dimensions['A'].width = 2
    for col in 'BCDEFGHIJK':
        ws.column_dimensions[col].width = 15
    band(ws, 'B1:K1', 'PROJETO SPALLA | PAINEL DE ESFORÇO GMO', 18, NAVY, height=39)
    band(ws, 'B2:K2', 'Quanto trabalho o plano de GMO exige e se o time dá conta. Escolha nos botões amarelos; os números '
         'vêm da aba "Régua de Esforço", onde estão a regra e as premissas.', 10, PALE, '203849', bold=False, height=32)

    band(ws, 'B4:K4', '1. ESCOLHA O CENÁRIO', 11, TEAL, height=22)
    ctrls = [('Dedicação do GMO', 'Full-time', '="= "&H_DIA&" horas por dia por pessoa"'),
             ('Porte do escopo', 'Médio', '="= "&N_AREAS&" áreas, "&N_PUBLICOS&" públicos e "&N_MARCOS&" marcos de transição"'),
             ('Pessoas de GMO no time', 1, '="pessoa(s) dedicada(s) ao plano de GMO, de out/2026 a mar/2027"')]
    for i, (lbl, v, note) in enumerate(ctrls):
        r = 5 + i
        ws.merge_cells(f'B{r}:C{r}')
        put(ws, f'B{r}', lbl, 11, True, NAVY)
        ws.merge_cells(f'D{r}:E{r}')
        ws[f'D{r}'].value = v
        entrada(ws[f'D{r}'], '0')
        ws[f'D{r}'].font = Font(name=F, size=12, bold=True, color=INPUT_FONT)
        for c_ in ('E',):
            ws[f'{c_}{r}'].fill = fill(INPUT_FILL)
            ws[f'{c_}{r}'].border = BOX
        ws.merge_cells(f'F{r}:K{r}')
        put(ws, f'F{r}', note, 10, color='404040', italic=True)
        ws.row_dimensions[r].height = 24
    dv1 = DataValidation(type='list', formula1='"Full-time,Part-time"', allow_blank=False)
    dv2 = DataValidation(type='list', formula1='"Pequeno,Médio,Grande"', allow_blank=False)
    dv3 = DataValidation(type='whole', operator='between', formula1='1', formula2='10', allow_blank=False)
    for dv, ref in ((dv1, 'D5'), (dv2, 'D6'), (dv3, 'D7')):
        dv.add(ref)
        ws.add_data_validation(dv)
    ws['D5'].comment = Comment('Clique e escolha: Full-time (6h efetivas/dia) ou Part-time (3h/dia). As horas ficam na aba Régua.', 'A&M')
    ws['D6'].comment = Comment('Enquanto não se sabe o nº real de áreas, escolha o porte. O nº real pode ser digitado '
                               'na aba Régua de Esforço, coluna "Valor real".', 'A&M')

    band(ws, 'B9:K9', '2. RESULTADO DO CENÁRIO', 11, TEAL, height=22)
    tiles = [
        ('ESFORÇO PREVISTO', '=ESFORCO_TOTAL', '#,##0" h"', '=ROUND(ESFORCO_TOTAL/H_FULL,0)&" dias de trabalho de "&H_FULL&"h"'),
        ('CAPACIDADE DO TIME', '=CAP_TIME', '#,##0" h"', '=PESSOAS&" pessoa(s) × "&H_DIA&"h/dia × "&MESES&" meses"'),
        ('COBERTURA', '=COBERTURA', '0%', '=IF(COBERTURA>=1,"Suficiente",IF(COBERTURA>=0.7,"Apertado","Insuficiente"))'),
        ('FTE NECESSÁRIOS', '=FTE', '0.0', '="pessoas 100% dedicadas por "&MESES&" meses"'),
        ('PESSOAS NO REGIME', '=PESSOAS_NEC', '0.0', '="pessoas em "&LOWER(CENARIO)&" para cobrir tudo"'),
    ]
    for i, (lbl, f_, fmt, note) in enumerate(tiles):
        c0 = chr(ord('B') + 2 * i)
        c1 = chr(ord(c0) + 1)
        for r, val, size, bold, color in ((10, lbl, 9.5, True, TEAL), (11, f_, 28, True, NAVY), (12, note, 9.5, False, '404040')):
            ws.merge_cells(f'{c0}{r}:{c1}{r}')
            put(ws, f'{c0}{r}', val, size, bold, color, PALE, 'center', fmt=fmt if r == 11 else None)
            ws[f'{c1}{r}'].fill = fill(PALE)
    ws.row_dimensions[10].height = 22
    ws.row_dimensions[11].height = 46
    ws.row_dimensions[12].height = 30
    green, amber, red = 'C6EFCE', 'FFEB9C', 'FFC7CE'
    for rng in ('F11', 'F12'):
        ws.conditional_formatting.add(rng, FormulaRule(formula=['COBERTURA>=1'], fill=fill(green)))
        ws.conditional_formatting.add(rng, FormulaRule(formula=['AND(COBERTURA>=0.7,COBERTURA<1)'], fill=fill(amber)))
        ws.conditional_formatting.add(rng, FormulaRule(formula=['COBERTURA<0.7'], fill=fill(red)))
    ws.merge_cells('B14:K14')
    put(ws, 'B14', '=IF(COBERTURA>=1,"SUFICIENTE: o time previsto cobre o esforço estimado ("&ROUND(COBERTURA*100,0)&"% de cobertura).",'
        'IF(COBERTURA>=0.7,"APERTADO: ","INSUFICIENTE: ")&"o plano pede "&ROUND(ESFORCO_TOTAL,0)&" h e o time entrega "'
        '&ROUND(CAP_TIME,0)&" h no período. Faltam "&ROUND(GAP,0)&" h, ou "&ROUND(GAP/CAP_PESSOA,1)&" pessoa(s) a mais em "'
        '&LOWER(CENARIO)&".")', 12, True, NAVY, h='center')
    ws.row_dimensions[14].height = 34
    for rule, c_ in (('COBERTURA>=1', green), ('AND(COBERTURA>=0.7,COBERTURA<1)', amber), ('COBERTURA<0.7', red)):
        ws.conditional_formatting.add('B14:K14', FormulaRule(formula=[rule], fill=fill(c_)))

    band(ws, 'B16:K16', '3. FULL-TIME x PART-TIME (mesmo porte e mesmo nº de pessoas)', 11, TEAL, height=22)
    ws.merge_cells('B17:E17')
    put(ws, 'B17', 'Indicador', 10, True, WHITE, NAVY)
    for c0, t in (('F', 'Full-time'), ('H', 'Part-time')):
        ws.merge_cells(f'{c0}17:{chr(ord(c0) + 1)}17')
        put(ws, f'{c0}17', t, 10, True, WHITE, NAVY, 'center')
    ws.merge_cells('J17:K17')
    put(ws, 'J17', 'Como ler', 10, True, WHITE, NAVY)
    comp = [
        ('Horas por dia, por pessoa', '=H_FULL', '=H_PART', '0', 'Dedicação diária ao plano'),
        ('Capacidade do time no período (h)', '=H_FULL*DIAS_MES*PROD*MESES*PESSOAS', '=H_PART*DIAS_MES*PROD*MESES*PESSOAS',
         '#,##0', 'Horas que o time consegue entregar'),
        ('Cobertura do esforço', '=IF(ESFORCO_TOTAL=0,0,F19/ESFORCO_TOTAL)', '=IF(ESFORCO_TOTAL=0,0,H19/ESFORCO_TOTAL)', '0%',
         '100% = dá conta'),
        ('Pessoas necessárias para cobrir tudo', '=IF(F19=0,0,ESFORCO_TOTAL/(F19/PESSOAS))',
         '=IF(H19=0,0,ESFORCO_TOTAL/(H19/PESSOAS))', '0.0', 'No mesmo prazo de 6 meses'),
        ('Meses para 1 pessoa fazer tudo sozinha', '=ESFORCO_TOTAL/(H_FULL*DIAS_MES*PROD)', '=ESFORCO_TOTAL/(H_PART*DIAS_MES*PROD)',
         '0.0', '="O plano tem "&MESES&" meses"'),
    ]
    for i, (lbl, ff, fp, fmt, how) in enumerate(comp):
        r = 18 + i
        ws.merge_cells(f'B{r}:E{r}')
        put(ws, f'B{r}', lbl, 10.5, border=LINE_B)
        for c0, f_ in (('F', ff), ('H', fp)):
            ws.merge_cells(f'{c0}{r}:{chr(ord(c0) + 1)}{r}')
            put(ws, f'{c0}{r}', f_, 12, True, NAVY, h='center', fmt=fmt, border=LINE_B)
        ws.merge_cells(f'J{r}:K{r}')
        put(ws, f'J{r}', how, 9.5, italic=True, color='404040', border=LINE_B)
        ws.row_dimensions[r].height = 22
    for c0 in ('F20', 'H20'):
        ws.conditional_formatting.add(c0, FormulaRule(formula=[f'{c0}>=1'], fill=fill(green)))
        ws.conditional_formatting.add(c0, FormulaRule(formula=[f'AND({c0}>=0.7,{c0}<1)'], fill=fill(amber)))
        ws.conditional_formatting.add(c0, FormulaRule(formula=[f'{c0}<0.7'], fill=fill(red)))

    band(ws, 'B24:K24', '4. ONDE ESTÁ O ESFORÇO (horas por categoria de entregável)', 11, TEAL, height=22)
    ws.merge_cells('B25:E25')
    put(ws, 'B25', 'Categoria', 10, True, WHITE, NAVY)
    for c0, t in (('F', 'Horas'), ('G', '% do total'), ('H', 'Dias de trabalho')):
        put(ws, f'{c0}25', t, 10, True, WHITE, NAVY, 'center')
    cat0 = tot + 5  # primeira linha do resumo por categoria na régua
    for i, cat in enumerate(CATS):
        r = 26 + i
        rr = cat0 + i
        ws.merge_cells(f'B{r}:E{r}')
        put(ws, f'B{r}', f'={QR}!B{rr}', 10.5, color=LINK_FONT, border=LINE_B)
        put(ws, f'F{r}', f'={QR}!D{rr}', 11, True, NAVY, h='center', fmt='#,##0', border=LINE_B)
        put(ws, f'G{r}', f'={QR}!E{rr}', 10.5, h='center', fmt='0%', border=LINE_B)
        put(ws, f'H{r}', f'=F{r}/H_FULL', 10.5, h='center', fmt='0', border=LINE_B)
    rt = 26 + len(CATS)
    ws.merge_cells(f'B{rt}:E{rt}')
    put(ws, f'B{rt}', 'TOTAL', 11, True, WHITE, NAVY)
    put(ws, f'F{rt}', f'=SUM(F26:F{rt - 1})', 11, True, WHITE, NAVY, 'center', fmt='#,##0')
    put(ws, f'G{rt}', f'=SUM(G26:G{rt - 1})', 11, True, WHITE, NAVY, 'center', fmt='0%')
    put(ws, f'H{rt}', f'=SUM(H26:H{rt - 1})', 11, True, WHITE, NAVY, 'center', fmt='0')
    ws.conditional_formatting.add(f'F26:F{rt - 1}', DataBarRule(start_type='num', start_value=0, end_type='max', color='9DC3E6'))
    put(ws, 'I26', 'As barras mostram o peso de cada categoria. Comunicação, transição e coordenação '
        'são contínuas: somam horas toda semana, por isso pesam mais.', 9.5, italic=True, color='404040', v='top')
    ws.merge_cells('I26:K30')

    # 6. densidade: tempo x esforço x impacto
    rd = rt + 3
    band(ws, f'B{rd}:K{rd}', '5. DENSIDADE DAS ATIVIDADES: TEMPO x ESFORÇO x IMPACTO', 11, TEAL, height=22)
    ws.merge_cells(f'B{rd + 1}:K{rd + 1}')
    put(ws, f'B{rd + 1}', 'Cada bolha é um entregável. Eixo horizontal: tempo (meses em que fica ativo, dentro dos 6 meses do plano). '
        'Eixo vertical: horas previstas. Tamanho e cor: impacto (prioridade da aba 2): vermelho = alta, laranja = média, '
        'cinza = baixa. Quanto mais para cima e para a direita, mais pesado e longo.',
        9.5, italic=True, color='404040')
    ws.row_dimensions[rd + 1].height = 28
    cores = {'Alta': 'C00000', 'Média': 'ED7D31', 'Baixa': 'A5A5A5'}
    prio = {r: wb[P2][f'I{r}'].value for r in range(7, 23)}
    bub = BubbleChart()
    bub.style = 18
    bub.title = 'Densidade das atividades de GMO'
    for k, linha in enumerate(LINHAS):
        r = first + k
        s_ = Series(values=Reference(ws_r, min_col=14, min_row=r), xvalues=Reference(ws_r, min_col=6, min_row=r),
                    zvalues=Reference(ws_r, min_col=18, min_row=r), title=linha[0])
        cor = cores.get(prio.get(linha[1]) if linha[1] else 'Média', 'ED7D31')
        s_.graphicalProperties.solidFill = cor
        s_.graphicalProperties.line.solidFill = WHITE
        s_.dLbls = DataLabelList()
        s_.dLbls.showSerName = True
        s_.dLbls.showVal = False
        s_.dLbls.showBubbleSize = False
        s_.dLbls.position = 'ctr'
        bub.series.append(s_)
    bub.bubbleScale = 22
    bub.legend = None
    bub.x_axis.title = 'Tempo: meses em que o entregável fica ativo (de 6 meses do plano)'
    bub.y_axis.title = 'Esforço previsto (h)'
    bub.x_axis.scaling.min, bub.x_axis.scaling.max = 0, 7
    bub.x_axis.majorUnit = 1
    bub.y_axis.scaling.min = 0
    bub.x_axis.delete = False
    bub.y_axis.delete = False
    bub.height, bub.width = 11, 26
    ws.add_chart(bub, f'B{rd + 2}')

    ws.freeze_panes = 'A4'
    return ws


def main():
    wb = load_workbook(SRC)
    if PAINEL in wb.sheetnames or REGUA in wb.sheetnames:
        raise SystemExit('o arquivo já tem as abas de esforço')
    ws_r, tot, first, last = build_regua(wb)
    build_painel(wb, tot, ws_r, first, last)
    wb.active = 2
    os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)
    wb.save(OUT)
    print('ok', OUT)


main()
