'use strict';
/**
 * simulador.js — imita, em memória, os serviços do Google usados pelo kit.
 * Serve para testar a LÓGICA dos scripts fora do Google (node rodar-testes.js).
 * Não substitui o teste numa conta Google real: permissões, cotas e conversão de PDF só existem lá.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const TIPOS = {
  GOOGLE_DOCS: 'application/vnd.google-apps.document',
  PLAIN_TEXT: 'text/plain',
  PDF: 'application/pdf',
  MICROSOFT_WORD: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

/**
 * @param {object} op  agora: instante fixo para "new Date()"; responder(url, opcoes): resposta da API simulada;
 *                     respostaDoMenu: texto devolvido por ui.prompt.
 */
function criarAmbiente(op) {
  const estado = {
    abas: {}, arquivos: {}, pastas: {}, etiquetas: {}, conversas: [], eventos: [], eventosCriados: [],
    chamadas: [], emailsEnviados: [], enviosPeloGmail: [], gatilhos: [], avisos: [], formulas: [],
    propsScript: {}, propsUsuario: {},
  };
  let sequencia = 0;
  const novoId = function (prefixo) { return prefixo + String(++sequencia).padStart(6, '0') + 'abcdefghijklmnopqrstuv'; };

  // Relógio fixo: dentro do kit, "new Date()" devolve sempre o mesmo instante.
  const AGORA = op.agora.getTime();
  class DataFixa extends Date {
    constructor() { if (arguments.length === 0) super(AGORA); else super(...arguments); }
    static now() { return AGORA; }
  }

  // ── Planilha ──
  class Aba {
    constructor(nome) { this.nome = nome; this.dados = []; this.formatos = {}; this.notas = {}; }
    getName() { return this.nome; }
    getLastRow() { return this.dados.length; }
    getLastColumn() { return this.dados.reduce(function (m, l) { return Math.max(m, l.length); }, 0); }
    getMaxRows() { return 1000; }
    appendRow(linha) { const r = this.dados.length + 1; const aba = this; linha.forEach(function (v, j) { aba.gravar(r, j + 1, v); }); return this; }
    /** Imita a planilha de verdade: apóstrofo inicial = texto; "=" inicial = fórmula; texto com cara de número vira número. */
    gravar(r, c, v) {
      this.garantir(r, c);
      if (typeof v === 'string') {
        if (v.charAt(0) === "'") v = v.slice(1);
        else if (v.charAt(0) === '=') estado.formulas.push(v);
        else if (this.formatos[c] !== '@' && /^\s*-?\d+([.,]\d+)?\s*$/.test(v)) v = Number(v.replace(',', '.'));
      }
      this.dados[r - 1][c - 1] = v;
    }
    setFrozenRows() {}
    setConditionalFormatRules() {}
    garantir(r, c) {
      while (this.dados.length < r) this.dados.push([]);
      while (this.dados[r - 1].length < c) this.dados[r - 1].push('');
    }
    getDataRange() { return this.getRange(1, 1, Math.max(this.getLastRow(), 1), Math.max(this.getLastColumn(), 1)); }
    getRange(r, c, nr, nc) {
      const aba = this;
      nr = nr || 1; nc = nc || 1;
      return {
        getValues() {
          const saida = [];
          for (let i = 0; i < nr; i++) {
            const linha = [];
            for (let j = 0; j < nc; j++) {
              const v = (aba.dados[r - 1 + i] || [])[c - 1 + j];
              linha.push(v === undefined ? '' : v);
            }
            saida.push(linha);
          }
          return saida;
        },
        setValue(v) { aba.gravar(r, c, v); return this; },
        setValues(vs) {
          vs.forEach(function (l, i) { l.forEach(function (v, j) { aba.gravar(r + i, c + j, v); }); });
          return this;
        },
        setNumberFormat(formato) { for (let j = 0; j < nc; j++) aba.formatos[c + j] = formato; return this; },
        setNote(nota) { aba.notas[c] = nota; return this; },
        clearContent() {
          for (let i = 0; i < nr; i++) for (let j = 0; j < nc; j++) if (aba.dados[r - 1 + i]) aba.dados[r - 1 + i][c - 1 + j] = '';
          return this;
        },
        setFontWeight() { return this; },
        setDataValidation() { return this; },
      };
    }
  }
  const planilha = {
    getId() { return 'planilha0001abcdefghijklmnopqrstuv'; },
    getSheetByName(nome) { return estado.abas[nome] || null; },
    insertSheet(nome) { estado.abas[nome] = new Aba(nome); return estado.abas[nome]; },
    toast(mensagem) { estado.avisos.push(mensagem); },
  };
  const encadeavel = function () {
    const alvo = {};
    return new Proxy(alvo, { get(_, nome) { return nome === 'build' ? function () { return {}; } : function () { return this; }.bind(new Proxy(alvo, this)); } });
  };
  const ui = {
    ButtonSet: { OK_CANCEL: 'OK_CANCEL' }, Button: { OK: 'OK' },
    createMenu() { const m = { addItem() { return m; }, addSeparator() { return m; }, addToUi() {} }; return m; },
    prompt() { return { getSelectedButton() { return 'OK'; }, getResponseText() { return op.respostaDoMenu || ''; } }; },
  };
  const SpreadsheetApp = {
    getActiveSpreadsheet() { return planilha; },
    openById() { return planilha; },
    getUi() { return ui; },
    newDataValidation: encadeavel,
    newConditionalFormatRule: encadeavel,
  };

  // ── Drive e Docs ──
  class Arquivo {
    constructor(nome, conteudo, tipo, pasta) {
      this.id = novoId('arquivo'); this.nome = nome; this.conteudo = conteudo; this.tipo = tipo; this.pasta = pasta;
      this.atualizado = new Date(AGORA); this.lixeira = false;
      estado.arquivos[this.id] = this;
      if (pasta) pasta.arquivos.push(this);
    }
    getId() { return this.id; }
    getName() { return this.nome; }
    setName(nome) { this.nome = nome; return this; }
    getMimeType() { return this.tipo; }
    getUrl() { return 'https://drive.google.com/file/d/' + this.id; }
    getLastUpdated() { return this.atualizado; }
    getBlob() { const a = this; return { getDataAsString() { return a.conteudo; }, getName() { return a.nome; } }; }
    sairDaPasta() { if (this.pasta) this.pasta.arquivos = this.pasta.arquivos.filter((x) => x !== this); }
    moveTo(pasta) { this.sairDaPasta(); pasta.arquivos.push(this); this.pasta = pasta; return this; }
    setTrashed(valor) { this.lixeira = valor; if (valor) { this.sairDaPasta(); this.pasta = null; } return this; }
  }
  class Pasta {
    constructor(nome) { this.id = novoId('pasta'); this.nome = nome; this.arquivos = []; estado.pastas[this.id] = this; }
    getId() { return this.id; }
    getName() { return this.nome; }
    createFolder(nome) { return new Pasta(nome); }
    createFile(nome, conteudo, tipo) { return new Arquivo(nome, conteudo, tipo, this); }
    getFiles() { const lista = this.arquivos.slice(); let i = 0; return { hasNext() { return i < lista.length; }, next() { return lista[i++]; } }; }
  }
  const acharArquivo = function (id) {
    const a = estado.arquivos[id];
    if (!a || a.lixeira) throw new Error('Arquivo não encontrado: ' + id);
    return a;
  };
  const DriveApp = {
    createFolder(nome) { return new Pasta(nome); },
    getFolderById(id) { return estado.pastas[id]; },
    getFileById: acharArquivo,
  };
  const DocumentApp = {
    openById(id) {
      const a = acharArquivo(id);
      if (a.tipo !== TIPOS.GOOGLE_DOCS) throw new Error('O arquivo não é um Google Docs.');
      return { getName() { return a.nome; }, getBody() { return { getText() { return a.conteudo; } }; } };
    },
  };
  const Drive = {
    Files: {
      // Conversão simulada: o Google Docs temporário recebe o mesmo texto do PDF ou do Word.
      create(recurso, blob) { return { id: new Arquivo(recurso.name, blob.getDataAsString(), recurso.mimeType, null).id }; },
      get() { return { lastModifyingUser: { displayName: 'Pessoa que editou (simulada)' } }; },
    },
  };

  // ── Gmail, Agenda e e-mail ──
  class Conversa {
    constructor(m) { this.id = novoId('conversa'); this.m = m; this.etiquetas = []; this.rascunhos = []; }
    getMessages() {
      const m = this.m;
      return [{ getSubject() { return m.assunto; }, getFrom() { return m.de; }, getPlainBody() { return m.corpo; }, getDate() { return new Date(AGORA); } }];
    }
    addLabel(etiqueta) { if (this.etiquetas.indexOf(etiqueta.nome) < 0) this.etiquetas.push(etiqueta.nome); return this; }
    createDraftReply(corpo) { this.rascunhos.push(corpo); return {}; }
    getPermalink() { return 'https://mail.google.com/mail/u/0/#inbox/' + this.id; }
  }
  const GmailApp = {
    search(consulta, inicio, maximo) {
      return estado.conversas.filter(function (c) {
        return c.etiquetas.indexOf('IA-Triado') < 0 && c.etiquetas.indexOf('IA-Sigilo') < 0;
      }).slice(inicio, inicio + maximo);
    },
    getUserLabelByName(nome) { return estado.etiquetas[nome] || null; },
    createLabel(nome) { estado.etiquetas[nome] = { nome: nome, getName() { return nome; } }; return estado.etiquetas[nome]; },
    sendEmail() { estado.enviosPeloGmail.push(Array.from(arguments)); },
  };
  const MailApp = { sendEmail(mensagem) { estado.emailsEnviados.push(mensagem); } };
  const CalendarApp = {
    getDefaultCalendar() {
      return {
        getEvents(de, ate) {
          return estado.eventos.filter(function (e) { return e.fim > de && e.inicio < ate; }).map(function (e) {
            return {
              getTitle() { return e.titulo; }, getStartTime() { return e.inicio; }, getEndTime() { return e.fim; },
              isAllDayEvent() { return !!e.diaInteiro; }, getLocation() { return e.local || ''; },
            };
          });
        },
        createAllDayEvent(titulo, data, opcoes) {
          const criado = { id: novoId('evento'), titulo: titulo, data: data, descricao: (opcoes || {}).description, lembretes: [] };
          estado.eventosCriados.push(criado);
          return { addPopupReminder(min) { criado.lembretes.push(min); return this; }, getId() { return criado.id; } };
        },
      };
    },
  };

  // ── Demais serviços ──
  const UrlFetchApp = {
    fetch(url, opcoes) {
      const chamada = { url: url, opcoes: opcoes || {}, corpo: opcoes && opcoes.payload ? JSON.parse(opcoes.payload) : null };
      estado.chamadas.push(chamada);
      const r = op.responder(chamada);  // pode lançar erro para simular falta de resposta
      return { getResponseCode() { return r.codigo; }, getContentText() { return r.texto; } };
    },
  };
  const dois = function (n) { return String(n).padStart(2, '0'); };
  const Utilities = {
    DigestAlgorithm: { SHA_256: 'sha256' },
    Charset: { UTF_8: 'utf8' },
    computeDigest(algoritmo, texto) {
      return Array.from(crypto.createHash('sha256').update(String(texto), 'utf8').digest()).map(function (b) { return b > 127 ? b - 256 : b; });
    },
    formatDate(data, fuso, formato) {
      return formato.split("'").map(function (parte, i) {
        if (i % 2) return parte;  // texto entre aspas simples
        return parte.replace(/yyyy|MM|dd|HH|mm|H/g, function (t) {
          return { yyyy: String(data.getFullYear()), MM: dois(data.getMonth() + 1), dd: dois(data.getDate()),
            HH: dois(data.getHours()), mm: dois(data.getMinutes()), H: String(data.getHours()) }[t];
        });
      }).join('');
    },
    sleep() {},
  };
  const propriedades = function (guarda) {
    return { getProperty(k) { return guarda[k] === undefined ? null : guarda[k]; }, setProperty(k, v) { guarda[k] = String(v); } };
  };
  const PropertiesService = {
    getScriptProperties() { return propriedades(estado.propsScript); },
    getUserProperties() { return propriedades(estado.propsUsuario); },
  };
  const Session = {
    getEffectiveUser() { return { getEmail() { return 'advogada@escritorio.example'; } }; },
    getScriptTimeZone() { return 'America/Sao_Paulo'; },
  };
  const LockService = { getScriptLock() { return { tryLock() { return true; }, releaseLock() {} }; } };
  const ScriptApp = {
    WeekDay: { MONDAY: 'MONDAY' },
    newTrigger(funcao) {
      const g = { funcao: funcao, regra: [] };
      const passo = function (nome) { return function (valor) { g.regra.push(nome + (valor === undefined ? '' : ':' + valor)); return construtor; }; };
      const construtor = { timeBased: passo('timeBased'), everyMinutes: passo('everyMinutes'), everyHours: passo('everyHours'),
        onWeekDay: passo('onWeekDay'), atHour: passo('atHour'), create() { estado.gatilhos.push(g); return g; } };
      return construtor;
    },
    getProjectTriggers() { return estado.gatilhos.slice(); },
    deleteTrigger(g) { estado.gatilhos = estado.gatilhos.filter(function (x) { return x !== g; }); },
  };

  const globais = { Date: DataFixa, SpreadsheetApp, DriveApp, DocumentApp, Drive, GmailApp, MailApp, CalendarApp, UrlFetchApp,
    Utilities, PropertiesService, Session, LockService, ScriptApp, MimeType: TIPOS, console };
  const contexto = vm.createContext(globais);
  const pastaDoKit = path.join(__dirname, '..');
  fs.readdirSync(pastaDoKit).filter(function (f) { return f.endsWith('.gs'); }).sort().forEach(function (f) {
    vm.runInContext(fs.readFileSync(path.join(pastaDoKit, f), 'utf8'), contexto, { filename: f });
  });

  return {
    estado: estado,
    TIPOS: TIPOS,
    /** Avalia uma expressão dentro do kit: kit('VALIDAR_CNJ("...")'), kit('CONFIG'). */
    kit(expressao) { return vm.runInContext(expressao, contexto); },
    aba(nome) { return estado.abas[nome]; },
    /** Linhas da aba como objetos, na mesma forma que o kit lê. */
    tabela(nome) { return vm.runInContext('lerTabela_(' + JSON.stringify(nome) + ')', contexto); },
    pasta(chave) { return estado.pastas[JSON.parse(estado.propsScript.PASTAS)[chave]]; },
    novaConversa(m) { const c = new Conversa(m); estado.conversas.push(c); return c; },
    novoArquivo(chavePasta, nome, conteudo, tipo) { return new Arquivo(nome, conteudo, tipo || TIPOS.PLAIN_TEXT, this.pasta(chavePasta)); },
    novoDocumento(nome, conteudo) { return new Arquivo(nome, conteudo, TIPOS.GOOGLE_DOCS, null); },
  };
}

module.exports = { criarAmbiente: criarAmbiente };
