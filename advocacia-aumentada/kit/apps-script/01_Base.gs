/**
 * 01_Base.gs — planilha, pastas, menu, instalação e gatilhos.
 * Você não precisa editar este arquivo.
 */

/** Abas da planilha-CRM e seus cabeçalhos. */
const ABAS = {
  Painel: ['Indicador', 'Valor'],
  Clientes: ['ID', 'Nome', 'Tipo', 'Contato', 'Origem', 'Base legal (LGPD)', 'Entrada', 'Responsável', 'Observações'],
  Contratos: ['ID', 'Cliente', 'Parte representada', 'Arquivo', 'ID do arquivo', 'Tipo', 'Partes', 'Objeto', 'Valor',
    'Assinatura', 'Fim da vigência', 'Renovação automática', 'Limite para avisar', 'Foro', 'Resumo',
    'Riscos altos', 'Riscos médios', 'Riscos baixos', 'Lacunas', 'Status', 'Revisado por',
    'Versão', 'Hash', 'Verificado em', 'Evento na agenda', 'Fila'],
  Riscos: ['Contrato', 'Versão', 'Cláusula', 'Tema', 'Risco', 'Trecho literal', 'Por que importa', 'Recomendação',
    'Trecho confirmado', 'Decisão do advogado', 'Observação'],
  Historico: ['Data', 'Contrato', 'Versão', 'Autor', 'Hash', 'Alterações', 'Resumo', 'Alerta', 'Detalhe', 'Cópia (ID)'],
  Emails: ['Data', 'De', 'Assunto', 'Categoria', 'Urgência', 'Resumo', 'Prazo citado', 'Ação sugerida', 'Rascunho', 'Conversa'],
  Precedentes: ['Data', 'Documento', 'Tipo', 'Tribunal ou fonte', 'Identificação', 'Tese atribuída', 'Trecho da peça',
    'Trecho confirmado', 'Nº CNJ', 'Link oficial', 'Conferido por', 'Situação'],
  Playbook: ['Tema', 'Posição padrão', 'Aceitável', 'Inaceitável'],
  Log: ['Data', 'Usuário', 'Evento', 'Detalhe'],
};

/** Colunas de data e de número. Todas as outras são texto puro, para a planilha não "corrigir" valores como 3.2 ou 10/12. */
const FORMATOS = {
  'Data': 'dd/MM/yyyy hh:mm', 'Verificado em': 'dd/MM/yyyy hh:mm',
  'Entrada': 'dd/MM/yyyy', 'Assinatura': 'dd/MM/yyyy', 'Fim da vigência': 'dd/MM/yyyy', 'Limite para avisar': 'dd/MM/yyyy',
  'Versão': '0', 'Alterações': '0', 'Riscos altos': '0', 'Riscos médios': '0', 'Riscos baixos': '0',
};
const NOTA_IA = 'Conteúdo gerado por IA. Só vale depois da revisão do advogado.';
const COLUNAS_DA_IA = {
  Contratos: ['Tipo', 'Partes', 'Objeto', 'Valor', 'Assinatura', 'Fim da vigência', 'Limite para avisar', 'Foro', 'Resumo', 'Lacunas'],
  Riscos: ['Risco', 'Por que importa', 'Recomendação'],
  Historico: ['Resumo', 'Alerta'],
  Emails: ['Categoria', 'Urgência', 'Resumo', 'Ação sugerida'],
  Precedentes: ['Tese atribuída'],
};

const STATUS_CONTRATO = ['Em análise pela IA', 'Na fila da IA', 'Aguardando revisão', 'Revisão manual',
  'Revisado', 'Em negociação', 'Assinado', 'Encerrado'];
const DECISOES = ['Aceitar', 'Negociar', 'Recusar'];
const PASTAS = { raiz: 'Contratos · Advocacia Aumentada', entrada: '01_Entrada', analise: '02_Em_analise',
  versoes: '03_Versoes', assinados: '04_Assinados', manual: '99_Revisao_manual' };
const ETIQUETAS = { triado: 'IA-Triado', sigilo: 'IA-Sigilo', urgente: 'IA-Urgente',
  prazo_ou_intimacao: 'IA-Prazo', cliente_ativo: 'IA-Cliente', novo_contato: 'IA-Novo-contato',
  financeiro: 'IA-Financeiro', administrativo: 'IA-Administrativo', divulgacao: 'IA-Divulgacao' };

// ── Menu ─────────────────────────────────────────────────────────────────

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Advocacia Aumentada')
    .addItem('1 · Instalar (abas, pastas e etiquetas)', 'instalar')
    .addItem('2 · Guardar chave da API', 'guardarChaveApi')
    .addItem('3 · Ligar automações', 'ligarAutomacoes')
    .addItem('Desligar automações', 'desligarAutomacoes')
    .addSeparator()
    .addItem('Triar e-mails agora', 'triarEmails')
    .addItem('Gerar briefing da semana agora', 'gerarBriefingSemanal')
    .addItem('Processar contratos agora', 'processarContratos')
    .addItem('Verificar versões agora', 'verificarVersoes')
    .addItem('Lançar na agenda os prazos dos contratos revisados', 'lancarPrazosNaAgenda')
    .addItem('Auditar citações de um documento', 'auditarCitacoes')
    .addToUi();
}

// ── Instalação ───────────────────────────────────────────────────────────

function instalar() {
  const planilha = planilha_();
  const props = PropertiesService.getScriptProperties();
  props.setProperty('PLANILHA_ID', planilha.getId());

  Object.keys(ABAS).forEach(function (nome) {
    const aba = planilha.getSheetByName(nome) || planilha.insertSheet(nome);
    if (aba.getLastRow() === 0) {
      aba.appendRow(ABAS[nome]);
      aba.setFrozenRows(1);
      aba.getRange(1, 1, 1, ABAS[nome].length).setFontWeight('bold');
    }
  });
  if (aba_('Playbook').getLastRow() === 1) {
    PLAYBOOK_EXEMPLO.forEach(function (linha) { aba_('Playbook').appendRow(linha); });
  }

  if (!props.getProperty('PASTAS')) {
    const raiz = DriveApp.createFolder(PASTAS.raiz);
    const ids = { raiz: raiz.getId() };
    ['entrada', 'analise', 'versoes', 'assinados', 'manual'].forEach(function (chave) {
      ids[chave] = raiz.createFolder(PASTAS[chave]).getId();
    });
    props.setProperty('PASTAS', JSON.stringify(ids));
  }

  Object.keys(ETIQUETAS).forEach(etiqueta_);
  formatarAbas_();
  aplicarListas_();
  atualizarPainel_();
  registrar_('Instalação', 'Abas, pastas e etiquetas prontas');
  avisar_('Instalação concluída. Próximo passo: menu › 2 · Guardar chave da API.');
}

/** Formato de cada coluna e aviso, no cabeçalho, das colunas preenchidas por IA. */
function formatarAbas_() {
  Object.keys(ABAS).forEach(function (nome) {
    if (nome === 'Painel') return;
    const aba = aba_(nome);
    ABAS[nome].forEach(function (coluna, i) {
      aba.getRange(2, i + 1, aba.getMaxRows() - 1, 1).setNumberFormat(FORMATOS[coluna] || '@');
      if ((COLUNAS_DA_IA[nome] || []).indexOf(coluna) >= 0) aba.getRange(1, i + 1).setNote(NOTA_IA);
    });
  });
}

/** Listas suspensas e cores de risco: dão à planilha o comportamento de um CRM simples. */
function aplicarListas_() {
  const lista = function (nomeAba, coluna, valores) {
    const aba = aba_(nomeAba);
    const regra = SpreadsheetApp.newDataValidation().requireValueInList(valores, true).setAllowInvalid(true).build();
    aba.getRange(2, colunas_(nomeAba).indexOf(coluna) + 1, aba.getMaxRows() - 1, 1).setDataValidation(regra);
  };
  lista('Contratos', 'Status', STATUS_CONTRATO);
  lista('Riscos', 'Decisão do advogado', DECISOES);
  lista('Precedentes', 'Situação', ['Pendente', 'Confirmado', 'Descartado']);

  const riscos = aba_('Riscos');
  const faixa = riscos.getRange(2, colunas_('Riscos').indexOf('Risco') + 1, riscos.getMaxRows() - 1, 1);
  const cor = function (texto, fundo) {
    return SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(texto).setBackground(fundo).setRanges([faixa]).build();
  };
  riscos.setConditionalFormatRules([cor('alto', '#F4C7C3'), cor('medio', '#FCE8B2'), cor('baixo', '#D9EAD3')]);
}

function guardarChaveApi() {
  const ui = SpreadsheetApp.getUi();
  const resposta = ui.prompt('Chave da API',
    'Cole a chave da API. Ela fica guardada no seu perfil de usuário, fora da planilha.', ui.ButtonSet.OK_CANCEL);
  if (resposta.getSelectedButton() !== ui.Button.OK) return;
  const chave = resposta.getResponseText().trim();
  if (!chave) return;
  PropertiesService.getUserProperties().setProperty('ANTHROPIC_API_KEY', chave);
  registrar_('Chave da API guardada', 'Perfil de ' + usuario_());
  avisar_('Chave guardada. Próximo passo: menu › 3 · Ligar automações.');
}

// ── Gatilhos ─────────────────────────────────────────────────────────────

function ligarAutomacoes() {
  desligarAutomacoes();
  ScriptApp.newTrigger('triarEmails').timeBased().everyMinutes(30).create();
  ScriptApp.newTrigger('processarContratos').timeBased().everyMinutes(10).create();
  ScriptApp.newTrigger('verificarVersoes').timeBased().everyHours(1).create();
  ScriptApp.newTrigger('gerarBriefingSemanal').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(7).create();
  registrar_('Automações ligadas', 'E-mail 30 min · contratos 10 min · versões 1 h · briefing segunda 7h');
  avisar_('Automações ligadas.');
}

function desligarAutomacoes() {
  ScriptApp.getProjectTriggers().forEach(function (gatilho) { ScriptApp.deleteTrigger(gatilho); });
  registrar_('Automações desligadas', '');
}

/** Gatilho automático fora do horário configurado não trabalha. Chamada pelo menu (sem evento) sempre trabalha. */
function foraDoExpediente_(evento) {
  if (!evento) return false;
  const hora = Number(Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'H'));
  return hora < CONFIG.HORA_INICIO_AUTOMACOES || hora >= CONFIG.HORA_FIM_AUTOMACOES;
}

/** Evita duas execuções ao mesmo tempo e registra qualquer erro na aba Log. */
function comTrava_(nome, tarefa) {
  const trava = LockService.getScriptLock();
  if (!trava.tryLock(1000)) return;
  try {
    tarefa();
  } catch (erro) {
    registrar_('ERRO em ' + nome, erro && erro.message ? erro.message : erro);
    throw erro;
  } finally {
    trava.releaseLock();
  }
}

// ── Planilha ─────────────────────────────────────────────────────────────

function planilha_() {
  return SpreadsheetApp.getActiveSpreadsheet() ||
    SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('PLANILHA_ID'));
}

function aba_(nome) {
  const aba = planilha_().getSheetByName(nome);
  if (!aba) throw new Error('Aba "' + nome + '" não encontrada. Rode o menu › 1 · Instalar.');
  return aba;
}

function colunas_(nome) {
  const aba = aba_(nome);
  return aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];
}

/** Lê a aba como lista de registros. Cada registro guarda em _linha a posição na planilha. */
function lerTabela_(nome) {
  const valores = aba_(nome).getDataRange().getValues();
  const cabecalho = valores[0];
  return valores.slice(1).map(function (linha, i) {
    const registro = { _linha: i + 2 };
    cabecalho.forEach(function (coluna, j) { registro[coluna] = linha[j]; });
    return registro;
  });
}

/**
 * Texto vindo de fora (e-mail, contrato, resposta da IA) nunca pode virar fórmula na planilha.
 * O apóstrofo inicial faz a planilha tratar o conteúdo como texto e não aparece na célula.
 */
function seguro_(valor) {
  return typeof valor === 'string' && /^[=+\-@]/.test(valor) ? "'" + valor : valor;
}

function acrescentar_(nome, registro) {
  aba_(nome).appendRow(colunas_(nome).map(function (coluna) {
    return registro[coluna] === undefined ? '' : seguro_(registro[coluna]);
  }));
}

function atualizar_(nome, linha, campos) {
  const aba = aba_(nome);
  const cabecalho = colunas_(nome);
  Object.keys(campos).forEach(function (coluna) {
    const posicao = cabecalho.indexOf(coluna);
    if (posicao < 0) throw new Error('Coluna "' + coluna + '" não existe na aba ' + nome + '.');
    aba.getRange(linha, posicao + 1).setValue(seguro_(campos[coluna]));
  });
}

/** Trilha de auditoria: tudo que o kit faz deixa uma linha na aba Log. */
function registrar_(evento, detalhe) {
  acrescentar_('Log', { 'Data': new Date(), 'Usuário': usuario_(), 'Evento': evento, 'Detalhe': String(detalhe || '').slice(0, 500) });
}

function avisar_(mensagem) {
  try { planilha_().toast(mensagem, 'Advocacia Aumentada', 8); } catch (semTela) { /* execução por gatilho */ }
}

function usuario_() { return Session.getEffectiveUser().getEmail(); }

function pasta_(chave) {
  const ids = JSON.parse(PropertiesService.getScriptProperties().getProperty('PASTAS') || '{}');
  if (!ids[chave]) throw new Error('Pastas não criadas. Rode o menu › 1 · Instalar.');
  return DriveApp.getFolderById(ids[chave]);
}

function etiqueta_(chave) {
  const nome = ETIQUETAS[chave];
  return GmailApp.getUserLabelByName(nome) || GmailApp.createLabel(nome);
}

/** Verdadeiro para datas válidas, venham de onde vierem. */
function ehData_(valor) {
  return Object.prototype.toString.call(valor) === '[object Date]' && !isNaN(valor);
}

function dataHora_(data, formato) {
  return Utilities.formatDate(data, Session.getScriptTimeZone(), formato);
}

// ── Painel ───────────────────────────────────────────────────────────────

const ROTULOS_CATEGORIA = { prazo_ou_intimacao: 'prazo ou intimação', cliente_ativo: 'cliente', novo_contato: 'novo contato',
  financeiro: 'financeiro', administrativo: 'administrativo', divulgacao: 'divulgação' };

/** O painel da planilha: e-mails e precedentes (a central do escritório) e contratos, em uma só aba. */
function atualizarPainel_() {
  const agora = new Date();
  const seteDias = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - 7);
  const contar = function (lista, teste) { return lista.filter(teste).length; };
  const emails = lerTabela_('Emails').filter(function (e) { return ehData_(e['Data']) && e['Data'] >= seteDias; });
  const precedentes = lerTabela_('Precedentes');
  const contratos = lerTabela_('Contratos').filter(function (c) { return c['ID']; });
  const riscos = lerTabela_('Riscos');

  const linhas = [['Atualizado em', dataHora_(agora, 'dd/MM/yyyy HH:mm')], ['E-mails triados nos últimos 7 dias', emails.length]];
  Object.keys(ROTULOS_CATEGORIA).forEach(function (categoria) {
    linhas.push(['· ' + ROTULOS_CATEGORIA[categoria], contar(emails, function (e) { return e['Categoria'] === categoria; })]);
  });
  linhas.push(['· urgentes', contar(emails, function (e) { return e['Urgência'] === 'alta'; })]);
  linhas.push(['· com rascunho de resposta', contar(emails, function (e) { return e['Rascunho'] === 'sim'; })]);
  linhas.push(['Precedentes pendentes de conferência', contar(precedentes, function (p) { return p['Situação'] === 'Pendente'; })]);
  linhas.push(['Precedentes confirmados', contar(precedentes, function (p) { return p['Situação'] === 'Confirmado'; })]);
  linhas.push(['Contratos cadastrados', contratos.length]);
  STATUS_CONTRATO.forEach(function (status) {
    linhas.push(['· ' + status, contratos.filter(function (c) { return c['Status'] === status; }).length]);
  });
  linhas.push(['Riscos altos sem decisão do advogado', riscos.filter(function (r) {
    return r['Risco'] === 'alto' && !r['Decisão do advogado'];
  }).length]);
  linhas.push(['Trechos não confirmados no texto', riscos.filter(function (r) {
    return String(r['Trecho confirmado']).indexOf('NÃO') === 0;
  }).length]);
  contratos.filter(function (c) { return ehData_(c['Limite para avisar']) && c['Limite para avisar'] >= agora; })
    .sort(function (a, b) { return a['Limite para avisar'] - b['Limite para avisar']; })
    .slice(0, 5)
    .forEach(function (c) {
      linhas.push(['Avisar não renovação · ' + c['ID'], dataHora_(c['Limite para avisar'], 'dd/MM/yyyy')]);
    });
  const painel = aba_('Painel');
  if (painel.getLastRow() > 1) painel.getRange(2, 1, painel.getLastRow() - 1, 2).clearContent();
  painel.getRange(2, 1, linhas.length, 2).setValues(linhas);
}
