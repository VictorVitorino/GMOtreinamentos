/**
 * 04_Agenda.gs — briefing da semana e prazos de contratos na agenda.
 *
 * Princípio: o código calcula, a IA redige. Conflitos de horário, janelas livres e datas são
 * calculados aqui, de forma exata. A IA só organiza o texto e sugere preparação.
 */

const PROMPT_AGENDA_ = [
  'Você prepara o briefing semanal de um advogado brasileiro a partir da agenda dele.',
  'Os conflitos de horário e as janelas livres já foram calculados pelo sistema: use-os como estão, sem recalcular.',
  '',
  'Regras:',
  '1. Use apenas os compromissos listados. Não invente compromissos, prazos ou pessoas.',
  '2. Não calcule prazos processuais nem afirme datas que não estejam na lista.',
  '3. Em "destaques", aponte no máximo cinco compromissos que pedem atenção e diga por quê.',
  '4. Em "preparacao", diga o que convém preparar antes de cada compromisso relevante.',
  '5. Em "foco", sugira o que encaixar nas janelas livres. Frases curtas e diretas.',
].join('\n');

const ESQUEMA_AGENDA_ = {
  type: 'object',
  additionalProperties: false,
  required: ['destaques', 'preparacao', 'foco'],
  properties: {
    destaques: { type: 'array', items: { type: 'string' } },
    preparacao: { type: 'array', items: { type: 'string' } },
    foco: { type: 'array', items: { type: 'string' } },
  },
};

function gerarBriefingSemanal() {
  comTrava_('gerarBriefingSemanal', function () {
    const hoje = new Date();
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const fim = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + CONFIG.AGENDA_DIAS);

    const eventos = CalendarApp.getDefaultCalendar().getEvents(inicio, fim).map(function (e) {
      const titulo = e.getTitle();
      return {
        // minimização: vão para a IA só título, horário e local; título sensível é ocultado
        titulo: termoVermelho_(titulo) ? '[compromisso reservado]' : titulo,
        inicio: e.getStartTime(), fim: e.getEndTime(), diaInteiro: e.isAllDayEvent(), local: e.getLocation() || '',
      };
    }).sort(function (a, b) { return a.inicio - b.inicio; });

    const conflitos = conflitosDeHorario_(eventos);
    const janelas = janelasLivres_(eventos, inicio, CONFIG.AGENDA_DIAS);
    const linhasEventos = eventos.map(linhaDoEvento_);
    const linhasConflitos = conflitos.map(function (c) { return linhaDoEvento_(c[0]) + '  ×  ' + linhaDoEvento_(c[1]); });
    const linhasJanelas = janelas.map(function (j) {
      return diaCurto_(j.inicio) + ' ' + dataHora_(j.inicio, 'HH:mm') + '–' + dataHora_(j.fim, 'HH:mm') + ' (' + j.minutos + ' min)';
    });

    let ia = { destaques: [], preparacao: [], foco: [] };
    if (eventos.length) {
      const mascara = novaMascara_();
      const resposta = chamarIA_({
        sistema: PROMPT_AGENDA_,
        mensagem: mascara.aplicar('COMPROMISSOS\n' + linhasEventos.join('\n') +
          '\n\nCONFLITOS DE HORÁRIO\n' + (linhasConflitos.join('\n') || 'nenhum') +
          '\n\nJANELAS LIVRES\n' + (linhasJanelas.join('\n') || 'nenhuma')),
        esquema: ESQUEMA_AGENDA_,
        esforco: CONFIG.ESFORCO_ROTINA,
      });
      if (resposta.ok) ia = mascara.remover(resposta.dados);
      else registrar_('Briefing sem texto da IA', resposta.motivo + ' · ' + resposta.detalhe);
    }

    const secao = function (titulo, itens) {
      if (!itens.length) return '';
      return '<h3>' + titulo + '</h3><ul>' + itens.map(function (i) { return '<li>' + escapar_(i) + '</li>'; }).join('') + '</ul>';
    };
    const periodo = dataHora_(inicio, 'dd/MM') + ' a ' + dataHora_(new Date(fim.getTime() - 1), 'dd/MM');
    const html = '<h2>Sua semana · ' + periodo + '</h2>' +
      secao('Destaques', ia.destaques) +
      secao('Conflitos de horário (calculados pelo sistema)', linhasConflitos) +
      secao('O que preparar', ia.preparacao) +
      secao('Janelas livres de ' + CONFIG.AGENDA_JANELA_MINIMA_MIN + ' min ou mais (calculadas pelo sistema)', linhasJanelas) +
      secao('Sugestão de foco', ia.foco) +
      secao('Todos os compromissos', linhasEventos) +
      '<p><small>Texto de destaques, preparação e foco redigido por IA a partir dos títulos da agenda. ' +
      'Prazos processuais não são calculados aqui: confira-os sempre no sistema do tribunal.</small></p>';

    // O briefing vai somente para o seu próprio endereço.
    MailApp.sendEmail({ to: usuario_(), subject: 'Briefing da semana · ' + periodo, htmlBody: html });
    registrar_('Briefing enviado', eventos.length + ' compromisso(s), ' + conflitos.length + ' conflito(s)');
    avisar_('Briefing enviado para ' + usuario_() + '.');
  });
}

function linhaDoEvento_(e) {
  const quando = e.diaInteiro
    ? diaCurto_(e.inicio) + ' dia inteiro'
    : diaCurto_(e.inicio) + ' ' + dataHora_(e.inicio, 'HH:mm') + '–' + dataHora_(e.fim, 'HH:mm');
  return quando + ' · ' + e.titulo + (e.local ? ' (' + e.local + ')' : '');
}

/** "seg 16/11" — dia da semana em português, no fuso do projeto. */
function diaCurto_(data) {
  return ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'][data.getDay()] + ' ' + dataHora_(data, 'dd/MM');
}

/** Pares de compromissos com horário sobreposto. Compromissos de dia inteiro não contam. */
function conflitosDeHorario_(eventos) {
  const comHora = eventos.filter(function (e) { return !e.diaInteiro; });
  const pares = [];
  for (let i = 0; i < comHora.length; i++) {
    for (let j = i + 1; j < comHora.length; j++) {
      if (comHora[j].inicio < comHora[i].fim && comHora[i].inicio < comHora[j].fim) pares.push([comHora[i], comHora[j]]);
    }
  }
  return pares;
}

/** Intervalos sem compromisso, de segunda a sexta, dentro do expediente configurado. */
function janelasLivres_(eventos, primeiroDia, dias) {
  const janelas = [];
  for (let d = 0; d < dias; d++) {
    const dia = new Date(primeiroDia.getFullYear(), primeiroDia.getMonth(), primeiroDia.getDate() + d);
    if (dia.getDay() === 0 || dia.getDay() === 6) continue;
    const abre = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), CONFIG.AGENDA_INICIO_EXPEDIENTE);
    const fecha = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), CONFIG.AGENDA_FIM_EXPEDIENTE);
    let livreDesde = abre;
    eventos.filter(function (e) { return !e.diaInteiro && e.fim > abre && e.inicio < fecha; })
      .forEach(function (e) {
        if (e.inicio > livreDesde) guardarJanela_(janelas, livreDesde, e.inicio);
        if (e.fim > livreDesde) livreDesde = e.fim;
      });
    if (fecha > livreDesde) guardarJanela_(janelas, livreDesde, fecha);
  }
  return janelas;
}

function guardarJanela_(janelas, inicio, fim) {
  const minutos = Math.round((fim - inicio) / 60000);
  if (minutos >= CONFIG.AGENDA_JANELA_MINIMA_MIN) janelas.push({ inicio: inicio, fim: fim, minutos: minutos });
}

// ── Prazos de contratos ──────────────────────────────────────────────────

/**
 * Cria eventos de dia inteiro para o fim da vigência e para o último dia de aviso de não renovação.
 * Só entra na agenda o contrato com Status "Revisado" e a coluna "Revisado por" preenchida:
 * a data foi lida pela IA, mas quem responde por ela é o advogado.
 */
function lancarPrazosNaAgenda() {
  comTrava_('lancarPrazosNaAgenda', function () {
    const agenda = CalendarApp.getDefaultCalendar();
    let lancados = 0;
    let pendentes = 0;
    lerTabela_('Contratos').forEach(function (c) {
      if (c['Status'] !== 'Revisado' || c['Evento na agenda']) return;
      if (!c['Revisado por']) { pendentes++; return; }
      const descricao = 'Contrato ' + c['ID'] + ' · ' + c['Objeto'] + '\nData lida por IA e revisada por ' + c['Revisado por'] +
        '.\nConfira no contrato: ' + c['Arquivo'];
      const ids = [];
      [['Fim da vigência', 'Fim da vigência'], ['Limite para avisar', 'Último dia para avisar a não renovação']].forEach(function (par) {
        const data = c[par[0]];
        if (!ehData_(data)) return;
        const evento = agenda.createAllDayEvent('[Contrato ' + c['ID'] + '] ' + par[1], data, { description: descricao });
        evento.addPopupReminder(10080);  // 7 dias antes
        evento.addPopupReminder(1440);   // 1 dia antes
        ids.push(evento.getId());
      });
      if (!ids.length) return;
      atualizar_('Contratos', c._linha, { 'Evento na agenda': ids.join(' | ') });
      registrar_('Prazos lançados na agenda', c['ID'] + ' · revisado por ' + c['Revisado por']);
      lancados++;
    });
    avisar_(lancados + ' contrato(s) lançado(s) na agenda.' +
      (pendentes ? ' ' + pendentes + ' aguardando o preenchimento de "Revisado por".' : ''));
  });
}
