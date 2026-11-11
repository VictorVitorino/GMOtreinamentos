/**
 * ADVOCACIA AUMENTADA · Kit de automações para Google Workspace
 * 00_Config.gs — o único arquivo que você precisa editar.
 *
 * Regra do kit: a IA propõe, o advogado dispõe.
 * Nenhuma função envia e-mail a terceiros, assina, protocola ou apaga documento.
 * O que a IA produz fica como rascunho no Gmail ou como linha "Aguardando revisão" na planilha.
 */
const CONFIG = {

  // ── 1. Assistente de IA ────────────────────────────────────────────────
  MODELO: 'claude-opus-5-5',     // modelo usado em todas as automações
  ESFORCO_ROTINA: 'low',         // e-mails, briefing e resumo de alterações: resposta rápida
  ESFORCO_CONTRATO: 'high',      // leitura de contrato: mais cuidadosa e mais lenta
  MAX_TOKENS: 16000,             // teto de tamanho de cada resposta
  MODO_CONTRATOS: 'imediato',    // 'imediato' responde na hora; 'fila' analisa em segundo plano pela metade do preço

  // ── 2. Escritório ──────────────────────────────────────────────────────
  PARTE_REPRESENTADA_PADRAO: 'CONTRATANTE',  // de que lado o escritório costuma estar
  HORA_INICIO_AUTOMACOES: 7,     // os gatilhos automáticos só trabalham neste horário
  HORA_FIM_AUTOMACOES: 20,
  AVISAR_ALERTAS_POR_EMAIL: true, // alerta de alteração desfavorável vai para o SEU e-mail

  // ── 3. E-mail ──────────────────────────────────────────────────────────
  EMAIL_BUSCA: 'in:inbox is:unread newer_than:2d -label:IA-Triado -label:IA-Sigilo',
  EMAIL_MAX_POR_RODADA: 8,
  EMAIL_MAX_CARACTERES: 6000,    // minimização: só o começo de cada mensagem vai para a IA
  EMAIL_CRIAR_RASCUNHO: true,
  AVISO_RASCUNHO: '[RASCUNHO GERADO POR IA — REVISE E APAGUE ESTA LINHA ANTES DE ENVIAR]',

  // ── 4. Agenda ──────────────────────────────────────────────────────────
  AGENDA_DIAS: 7,                // quantos dias o briefing cobre
  AGENDA_INICIO_EXPEDIENTE: 9,
  AGENDA_FIM_EXPEDIENTE: 18,
  AGENDA_JANELA_MINIMA_MIN: 90,  // menor intervalo livre que vale como "janela de foco"

  // ── 5. Contratos ───────────────────────────────────────────────────────
  CONTRATOS_POR_RODADA: 2,
  CONTRATO_MIN_CARACTERES: 300,  // abaixo disso o arquivo provavelmente é imagem sem texto
  MAX_ALTERACOES_PARA_RESUMO: 80,

  // ── 6. Guardrail de entrada ────────────────────────────────────────────
  // Se um destes termos aparecer, o conteúdo NÃO é enviado à IA e segue para tratamento manual.
  // A lista é um ponto de partida: ajuste à realidade do escritório.
  TERMOS_VERMELHOS: [
    'segredo de justiça', 'sigilo médico', 'prontuário', 'laudo médico', 'dados de saúde',
    'HIV', 'criança', 'adolescente', 'menor de idade', 'violência doméstica',
    'medida protetiva', 'inquérito policial', 'investigação criminal', 'colaboração premiada',
  ],
};

/** Posições do escritório-exemplo. A instalação copia esta tabela para a aba "Playbook", onde você edita. */
const PLAYBOOK_EXEMPLO = [
  ['Vigência e renovação', 'Renovação automática só com aviso de até 30 dias', 'Aviso de até 60 dias', 'Aviso acima de 60 dias ou renovação por prazo maior que o inicial'],
  ['Preço e reajuste', 'Reajuste anual por um único índice oficial (IPCA)', 'Outro índice oficial, desde que único', 'Escolha do maior entre dois índices; reajuste unilateral ou extraordinário'],
  ['Atraso no pagamento', 'Multa de 2% e juros de 1% ao mês', 'Multa de até 5%', 'Multa acima de 5%, juros acima de 1% ao mês ou suspensão sem aviso'],
  ['Nível de serviço', 'Disponibilidade mínima de 99,5% com crédito por descumprimento', 'Disponibilidade de 99% com crédito', 'Sem meta, meta abaixo de 99% ou descumprimento sem consequência'],
  ['Limitação de responsabilidade', 'Limite de 12 mensalidades; sem limite para dados pessoais, dolo e culpa grave', 'Limite de 12 mensalidades com teto próprio e maior para incidentes com dados', 'Limite inferior a 12 mensalidades; exclusão de perda de dados; limite aplicado a incidentes com dados pessoais'],
  ['Proteção de dados', 'Papéis definidos (controlador e operador), incidente comunicado em até 2 dias úteis, suboperador só com anuência, devolução e eliminação ao fim', 'Comunicação de incidente em até 3 dias úteis', 'Cláusula genérica, sem prazo de comunicação ou com suboperador sem anuência'],
  ['Rescisão', 'Rescisão imotivada por qualquer parte com aviso de 30 dias, sem multa', 'Multa de até 20% das mensalidades restantes, igual para as duas partes', 'Multa só para o cliente ou acima de 20%'],
  ['Dados e portabilidade', 'Exportação gratuita dos dados em formato aberto por 90 dias após o fim', 'Exportação com custo fixado no próprio contrato', 'Taxa indefinida ou retenção dos dados'],
  ['Confidencialidade', 'Sigilo recíproco por 5 anos após o término', 'Sigilo recíproco por 2 anos', 'Sem prazo ou sem reciprocidade'],
  ['Foro', 'Foro do domicílio do cliente', 'Arbitragem ou foro neutro', 'Foro exclusivo na sede da outra parte, distante do cliente'],
];
