/**
 * 02_IA.gs — conversa com a API e guardrails comuns a todas as automações.
 * Você não precisa editar este arquivo.
 *
 * Guardrails que moram aqui:
 *   1. Mascarar antes de enviar — CPF, CNPJ, e-mail e telefone viram marcadores ([CPF_1]) e só
 *      voltam ao valor real dentro da sua conta Google. Nomes de pessoas NÃO são mascarados.
 *   2. Termos vermelhos — conteúdo com termo sensível não sai do seu ambiente.
 *   3. Sem trecho, sem achado — toda afirmação da IA sobre um documento precisa de um trecho
 *      literal, e o código confere se o trecho existe mesmo no texto.
 */

const API_URL_ = 'https://api.anthropic.com/v1/messages';
const API_VERSAO_ = '2026-10-21';
const API_RESERVA_ = 'server-side-fallback-2026-07-01';

// ── Chamada à API ────────────────────────────────────────────────────────

function chaveApi_() {
  const chave = PropertiesService.getUserProperties().getProperty('ANTHROPIC_API_KEY');
  if (!chave) throw new Error('Chave da API não configurada. Use o menu › 2 · Guardar chave da API.');
  return chave;
}

/** pedido = { sistema, mensagem, esquema, esforco }. A resposta sempre obedece ao esquema (JSON). */
function corpoDoPedido_(pedido) {
  return {
    model: CONFIG.MODELO,
    max_tokens: CONFIG.MAX_TOKENS,
    system: pedido.sistema,
    messages: [{ role: 'user', content: pedido.mensagem }],
    output_config: {
      effort: pedido.esforco || CONFIG.ESFORCO_ROTINA,
      format: { type: 'json_schema', schema: pedido.esquema },
    },
  };
}

/**
 * Pergunta à IA e espera a resposta. Devolve { ok: true, dados } ou { ok: false, motivo, detalhe }.
 * Motivos: sem_resposta (o Apps Script desiste de esperar por volta de 60 s), erro_api, recusa,
 * resposta_incompleta, json_invalido.
 */
function chamarIA_(pedido) {
  const corpo = corpoDoPedido_(pedido);
  corpo.fallbacks = 'default';  // se o modelo principal recusar o pedido, a API tenta o modelo reserva
  const opcoes = {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-api-key': chaveApi_(), 'anthropic-version': API_VERSAO_, 'anthropic-beta': API_RESERVA_ },
    payload: JSON.stringify(corpo),
    muteHttpExceptions: true,
  };
  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    let resposta;
    try {
      resposta = UrlFetchApp.fetch(API_URL_, opcoes);
    } catch (erro) {
      return { ok: false, motivo: 'sem_resposta', detalhe: String(erro && erro.message ? erro.message : erro) };
    }
    const codigo = resposta.getResponseCode();
    if (codigo === 200) return lerMensagem_(JSON.parse(resposta.getContentText()));
    const passageiro = codigo === 429 || codigo === 500 || codigo === 529;
    if (!passageiro || tentativa === 3) {
      return { ok: false, motivo: 'erro_api', detalhe: codigo + ' · ' + erroDaApi_(resposta.getContentText()) };
    }
    Utilities.sleep(2000 * tentativa);
  }
}

function erroDaApi_(texto) {
  try { return JSON.parse(texto).error.message; } catch (naoEJson) { return String(texto).slice(0, 200); }
}

function lerMensagem_(mensagem) {
  if (mensagem.stop_reason === 'refusal') {
    return { ok: false, motivo: 'recusa', detalhe: 'A IA recusou o pedido. Trate o documento manualmente.' };
  }
  if (mensagem.stop_reason === 'max_tokens') {
    return { ok: false, motivo: 'resposta_incompleta', detalhe: 'Resposta cortada. Aumente MAX_TOKENS ou divida o documento.' };
  }
  const blocos = mensagem.content || [];
  let inicio = 0;  // se houve troca para o modelo reserva, vale só o que veio depois da troca
  blocos.forEach(function (bloco, i) { if (bloco.type === 'fallback') inicio = i + 1; });
  const texto = blocos.slice(inicio)
    .filter(function (bloco) { return bloco.type === 'text'; })
    .map(function (bloco) { return bloco.text; }).join('');
  try {
    return { ok: true, dados: JSON.parse(texto) };
  } catch (naoEJson) {
    return { ok: false, motivo: 'json_invalido', detalhe: texto.slice(0, 200) };
  }
}

// ── Fila (processamento em segundo plano, sem limite de 60 s e pela metade do preço) ──

function enviarParaFila_(idPedido, pedido) {
  const resposta = UrlFetchApp.fetch(API_URL_ + '/batches', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-api-key': chaveApi_(), 'anthropic-version': API_VERSAO_ },
    payload: JSON.stringify({ requests: [{ custom_id: idPedido, params: corpoDoPedido_(pedido) }] }),
    muteHttpExceptions: true,
  });
  if (resposta.getResponseCode() !== 200) {
    throw new Error('A fila não aceitou o pedido: ' + resposta.getResponseCode() + ' · ' + erroDaApi_(resposta.getContentText()));
  }
  return JSON.parse(resposta.getContentText()).id;
}

/** Devolve { pronto: false } enquanto a fila trabalha, ou { pronto: true, resultado } no formato de chamarIA_. */
function consultarFila_(idLote) {
  const opcoes = { headers: { 'x-api-key': chaveApi_(), 'anthropic-version': API_VERSAO_ }, muteHttpExceptions: true };
  const consulta = UrlFetchApp.fetch(API_URL_ + '/batches/' + idLote, opcoes);
  if (consulta.getResponseCode() !== 200) {
    return { pronto: true, resultado: { ok: false, motivo: 'erro_api', detalhe: consulta.getResponseCode() + ' · ' + erroDaApi_(consulta.getContentText()) } };
  }
  const lote = JSON.parse(consulta.getContentText());
  if (lote.processing_status !== 'ended') return { pronto: false };
  const linhas = UrlFetchApp.fetch(lote.results_url, opcoes).getContentText().trim().split('\n');
  const item = JSON.parse(linhas[0]);
  if (item.result.type !== 'succeeded') {
    return { pronto: true, resultado: { ok: false, motivo: 'fila_' + item.result.type, detalhe: 'A fila não concluiu o pedido.' } };
  }
  return { pronto: true, resultado: lerMensagem_(item.result.message) };
}

// ── Guardrail 1 · Mascarar antes de enviar ───────────────────────────────

const PADROES_MASCARA_ = [
  ['EMAIL', /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g],
  // CNPJ formatado (inclusive o alfanumérico) ou 14 dígitos seguidos
  ['CNPJ', /(?<![A-Za-z0-9])[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/[A-Z0-9]{4}-\d{2}(?!\d)|(?<!\d)\d{14}(?!\d)/g],
  // CPF formatado ou 11 dígitos seguidos (um celular digitado sem pontuação cai aqui: é mascarado do mesmo jeito)
  ['CPF', /(?<!\d)\d{3}\.\d{3}\.\d{3}-\d{2}(?!\d)|(?<!\d)\d{11}(?!\d)/g],
  // Telefone com DDD: (19) 99999-0000, 19 3555-0100, +55 19 99999-0000
  ['TELEFONE', /(?<![\d.\/-])(?:\+55\s?)?(?:\(\d{2}\)\s?|\d{2}[\s-])9?\d{4}[-\s]?\d{4}(?!\d)/g],
];

/**
 * Cria uma máscara. aplicar(texto) troca dados por marcadores; remover(valor) desfaz a troca em
 * textos, listas e objetos. O mesmo dado recebe sempre o mesmo marcador dentro da mesma máscara.
 */
function novaMascara_() {
  const original = {};   // marcador → dado real
  const marcador = {};   // dado real → marcador
  const contagem = {};
  return {
    aplicar: function (texto) {
      let saida = String(texto === null || texto === undefined ? '' : texto);
      PADROES_MASCARA_.forEach(function (par) {
        const tipo = par[0];
        saida = saida.replace(par[1], function (achado) {
          if (!marcador[achado]) {
            contagem[tipo] = (contagem[tipo] || 0) + 1;
            marcador[achado] = '[' + tipo + '_' + contagem[tipo] + ']';
            original[marcador[achado]] = achado;
          }
          return marcador[achado];
        });
      });
      return saida;
    },
    remover: function remover(valor) {
      if (typeof valor === 'string') {
        return valor.replace(/\[(?:EMAIL|CNPJ|CPF|TELEFONE)_\d+\]/g, function (m) { return original[m] || m; });
      }
      if (Array.isArray(valor)) return valor.map(remover);
      if (valor && typeof valor === 'object') {
        const copia = {};
        Object.keys(valor).forEach(function (chave) { copia[chave] = remover(valor[chave]); });
        return copia;
      }
      return valor;
    },
  };
}

// ── Guardrail 2 · Termos vermelhos ───────────────────────────────────────

function semAcento_(texto) {
  return String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/** Devolve o primeiro termo sensível encontrado, ou texto vazio. */
function termoVermelho_(texto) {
  const base = semAcento_(texto);
  for (let i = 0; i < CONFIG.TERMOS_VERMELHOS.length; i++) {
    const alvo = semAcento_(CONFIG.TERMOS_VERMELHOS[i]).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp('(^|[^a-z0-9])' + alvo + '([^a-z0-9]|$)').test(base)) return CONFIG.TERMOS_VERMELHOS[i];
  }
  return '';
}

// ── Guardrail 3 · Sem trecho, sem achado ─────────────────────────────────

function compactar_(texto) {
  return String(texto)
    .replace(/[“”«»]/g, '"').replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-').replace(/­/g, '')
    .replace(/\s+/g, ' ').trim().toLowerCase();
}

/** O trecho citado pela IA existe, palavra por palavra, no documento? */
function trechoConfere_(trecho, documento) {
  const alvo = compactar_(trecho);
  return alvo.length >= 12 && compactar_(documento).indexOf(alvo) >= 0;
}

// ── Utilitários ──────────────────────────────────────────────────────────

/** Impressão digital do texto: muda se uma única vírgula mudar. */
function hash_(texto) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, texto, Utilities.Charset.UTF_8)
    .map(function (b) { return ((b + 256) % 256).toString(16).padStart(2, '0'); }).join('');
}

function escapar_(texto) {
  return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
