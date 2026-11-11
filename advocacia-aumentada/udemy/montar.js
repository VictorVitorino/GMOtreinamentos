#!/usr/bin/env node
/* Monta a agenda do curso a partir de agenda.json.

   Uso:  node montar.js [dados.json] [--artefato caminho.html]

   Gera, na pasta do arquivo de dados:
     agenda-udemy.html   página completa, abre em qualquer navegador
     README.md           espelho em texto
   Com --artefato, grava também a versão sem <html>/<head>/<body>, usada para publicar a página.
   Confere números de sessão, minutos e ferramentas, e para se algo não fechar. */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const iArt = args.indexOf('--artefato');
const saidaArtefato = iArt >= 0 ? args[iArt + 1] : null;
const entrada = path.resolve(args.find((a, i) => !a.startsWith('--') && (iArt < 0 || i !== iArt + 1)) || path.join(__dirname, 'agenda.json'));
const pasta = path.dirname(entrada);
const A = JSON.parse(fs.readFileSync(entrada, 'utf8'));

// ---------- ícones ----------
const ICONES = {
  escudo: '<path d="M12 3l7 2.6v5.3c0 4.4-2.9 8.1-7 9.6-4.1-1.5-7-5.2-7-9.6V5.6L12 3z"/><path d="M9 11.8l2.1 2.1L15 10"/>',
  mapa: '<path d="M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4z"/><path d="M9 4v14M15 6v14"/>',
  lista: '<path d="M4 6.5l1.6 1.6L8.4 5.3M4 12.5l1.6 1.6 2.8-2.8M4 18.5l1.6 1.6 2.8-2.8M12 7h8M12 13h8M12 19h8"/>',
  versao: '<circle cx="6" cy="5.5" r="2"/><circle cx="6" cy="18.5" r="2"/><circle cx="18" cy="7.5" r="2"/><path d="M6 7.5v9M18 9.5c0 4.5-12 3-12 7"/>',
  pasta: '<path d="M3.5 7a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
  agenda: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4M7.5 14h2.5M13.8 14h2.7M7.5 17.4h2.5"/>',
  mensagem: '<path d="M5 4.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4.5 3.5V16.5H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"/><path d="M7.5 9h9M7.5 12.5h5.5"/>',
  lupa: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5M8.2 10.7l1.7 1.7 2.9-3.1"/>',
  molde: '<path d="M8 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2M9 9h6M9 12h6M9 15h3.5"/>',
  cartao: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="8" cy="11" r="1.8"/><path d="M12.5 10.5H18M12.5 14h4M6 15h4"/>',
  slides: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4M8.5 20h7M7 12.5l3-3 2.5 2 4.5-4.5"/>',
  cerebro: '<path d="M12 5.5a3 3 0 0 0-5.5 1.3A3 3 0 0 0 5 12a3 3 0 0 0 2 5.3 3 3 0 0 0 5 1.2M12 5.5a3 3 0 0 1 5.5 1.3A3 3 0 0 1 19 12a3 3 0 0 1-2 5.3 3 3 0 0 1-5 1.2M12 5.5v13"/>',
  pagina: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4.5"/>',
  planilha: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9.5h18M3 14.8h18M9 4v16M15 4v16"/>',
  formulario: '<rect x="4" y="3" width="16" height="18" rx="2"/><rect x="7.5" y="7" width="3" height="3" rx=".5"/><path d="M13 8.5h3.5M7.5 14h9M7.5 17.5h6"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.6 6.6L12 13l8.4-6.4"/>',
  contrato: '<path d="M6 3h8.5L19 7.5V21H6z"/><path d="M14.5 3v4.5H19M9 11h7M9 14.3h7M9 18c.9-1.4 1.9-1.4 2.8 0s1.9 1.4 2.8 0"/>',
  painel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7.5 16v-3M12 16V8.5M16.5 16v-5"/>',
  sozinho: '<path d="M20 12a8 8 0 1 1-2.35-5.65"/><path d="M20 4.5v4h-4"/><path d="M12 8v4l2.6 2.4"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  seta: '<path d="M9 6l6 6-6 6"/>',
};

// ---------- conferência ----------
const erros = [];
if (A.modulos.length !== 3) erros.push('A agenda precisa de exatamente 3 módulos.');
const vistos = new Set();
A.modulos.forEach((m) => {
  m.minutos = m.sessoes.reduce((t, s) => t + s.minutos, 0);
  m.sessoes.forEach((s) => {
    ['numero', 'nome', 'faz', 'conquista', 'minutos'].forEach((c) => { if (!s[c]) erros.push(`Sessão ${s.numero || '?'} sem "${c}".`); });
    if (!String(s.numero).startsWith(m.numero + '.')) erros.push(`Sessão ${s.numero} fora do módulo ${m.numero}.`);
    if (vistos.has(s.numero)) erros.push(`Sessão ${s.numero} repetida.`);
    vistos.add(s.numero);
    if (s.icone && !ICONES[s.icone]) erros.push(`Sessão ${s.numero}: ícone desconhecido "${s.icone}".`);
    (s.ferramentas || []).forEach((f) => { if (!A.ferramentas[f]) erros.push(`Sessão ${s.numero}: ferramenta sem descrição "${f}".`); });
  });
});
const todas = A.modulos.flatMap((m) => m.sessoes);
const totalMin = todas.reduce((t, s) => t + s.minutos, 0);
if (totalMin > 480) erros.push(`O curso passa de 8 horas (${totalMin} min).`);
if (erros.length) { console.error('A agenda não fecha:\n- ' + erros.join('\n- ')); process.exit(1); }

// ---------- utilidades ----------
const esc = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (min) => { const h = Math.floor(min / 60), m = min % 60; return h ? `${h} h${m ? ' ' + String(m).padStart(2, '0') : ''}` : `${m} min`; };
const id = (n) => 's-' + String(n).replace('.', '-');
const ico = (nome, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-${nome}"/></svg>`;
const robos = todas.filter((s) => s.automacao);
const usos = (f) => todas.filter((s) => (s.ferramentas || []).includes(f)).map((s) => s.numero);

// ---------- estilo ----------
const CSS = `
/* Layout: menu lateral fixo (módulos, entregáveis, ferramentas, resumo) e uma vista por vez.
   Cada módulo é uma trilha de sessões: título, o que você faz e a conquista. O detalhe abre ao clicar. */
:root {
  --fundo: #F5F6F8; --cartao: #FFFFFF; --linha: #E1E4EA; --tinta: #151B27; --tinta-2: #586174;
  --lado: #15203A; --lado-tinta: #EEF1F7; --lado-2: #AEB8CC; --lado-ativo: #24345A;
  --m1: #2D58CF; --m1-s: #EAF0FD; --m2: #9A2242; --m2-s: #FAEDF1; --m3: #0E7466; --m3-s: #E2F3F0;
  --f-titulo: "Source Serif 4", Georgia, "Times New Roman", serif;
  --f-texto: "Source Sans 3", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --fundo: #0E121B; --cartao: #161C29; --linha: #283044; --tinta: #ECEFF5; --tinta-2: #A6AFC0;
    --lado: #0A0F1A; --lado-tinta: #EEF1F7; --lado-2: #97A2B8; --lado-ativo: #1C2A47;
    --m1: #93ADF6; --m1-s: #1A2440; --m2: #F193AB; --m2-s: #3A1724; --m3: #6FD1C1; --m3-s: #10302B;
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --fundo: #0E121B; --cartao: #161C29; --linha: #283044; --tinta: #ECEFF5; --tinta-2: #A6AFC0;
  --lado: #0A0F1A; --lado-tinta: #EEF1F7; --lado-2: #97A2B8; --lado-ativo: #1C2A47;
  --m1: #93ADF6; --m1-s: #1A2440; --m2: #F193AB; --m2-s: #3A1724; --m3: #6FD1C1; --m3-s: #10302B;
  color-scheme: dark;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--fundo); color: var(--tinta); font-family: var(--f-texto); font-size: 17px; line-height: 1.6; -webkit-font-smoothing: antialiased; }
h1, h2, h3, p, ul, ol, dl, dd { margin: 0; }
ul, ol { padding: 0; list-style: none; }
[hidden] { display: none !important; }
a { color: inherit; }
button { font: inherit; }
:focus-visible { outline: 2px solid var(--m1); outline-offset: 3px; }
.ico { width: 20px; height: 20px; flex: none; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }

.app { display: grid; grid-template-columns: 290px minmax(0, 1fr); min-height: 100vh; }
.m1 { --cor: var(--m1); --cor-s: var(--m1-s); }
.m2 { --cor: var(--m2); --cor-s: var(--m2-s); }
.m3 { --cor: var(--m3); --cor-s: var(--m3-s); }

/* menu lateral */
.lado { position: sticky; top: 0; height: 100vh; overflow-y: auto; background: var(--lado); color: var(--lado-tinta); padding-block: 32px; padding-left: max(22px, env(safe-area-inset-left, 0px)); padding-right: 22px; display: flex; flex-direction: column; gap: 28px; }
.marca h1 { font-family: var(--f-titulo); font-weight: 600; font-size: 1.45rem; line-height: 1.2; }
.marca p { margin-top: 8px; font-size: .93rem; line-height: 1.5; color: var(--lado-2); }
.marca .total { margin-top: 12px; font-size: .85rem; color: var(--lado-2); font-variant-numeric: tabular-nums; }
.menu { display: flex; flex-direction: column; gap: 4px; }
.menu .sep { height: 1px; background: rgba(255,255,255,.12); margin: 10px 4px; }
.menu a { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; text-decoration: none; color: var(--lado-tinta); }
.menu a:hover { background: var(--lado-ativo); }
.menu a[aria-current="page"] { background: var(--lado-ativo); box-shadow: inset 3px 0 0 var(--lado-tinta); }
.menu .bola { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; flex: none; font-weight: 700; font-size: .9rem; background: rgba(255,255,255,.1); }
.menu .bola .ico { width: 17px; height: 17px; }
.menu .txt { display: flex; flex-direction: column; min-width: 0; line-height: 1.3; }
.menu .txt b { font-weight: 600; font-size: .96rem; }
.menu .txt small { font-size: .8rem; color: var(--lado-2); }
.menu .prog { margin-left: auto; font-size: .78rem; color: var(--lado-2); font-variant-numeric: tabular-nums; }

/* conteúdo */
.conteudo { padding-block: 48px 80px; padding-left: max(24px, env(safe-area-inset-left, 0px)); padding-right: max(24px, env(safe-area-inset-right, 0px)); }
.vista { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px; }
.cab .etapa { font-size: .85rem; font-weight: 700; color: var(--cor, var(--tinta-2)); letter-spacing: .02em; }
.cab h2 { font-family: var(--f-titulo); font-weight: 600; font-size: clamp(1.8rem, 4vw, 2.4rem); line-height: 1.15; margin-top: 6px; text-wrap: balance; }
.cab .dor { margin-top: 12px; font-size: 1.12rem; color: var(--tinta-2); }
.cab .dor q { quotes: "\\201C" "\\201D"; font-style: italic; }
.fim { display: flex; gap: 14px; align-items: flex-start; padding: 16px 18px; background: var(--cor-s); border-radius: 10px; }
.fim .ico { color: var(--cor); margin-top: 3px; }
.fim p { font-size: .98rem; }
.fim b { color: var(--cor); }
.meta { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: .9rem; color: var(--tinta-2); }
.meta b { color: var(--tinta); font-variant-numeric: tabular-nums; }

/* trilha de sessões */
.trilha { display: flex; flex-direction: column; }
.passo { position: relative; display: grid; grid-template-columns: 44px minmax(0, 1fr); gap: 0 16px; padding-bottom: 14px; }
.passo::before { content: ""; position: absolute; left: 21px; top: 44px; bottom: 0; width: 2px; background: var(--linha); }
.passo:last-child::before { display: none; }
.feito { width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--cor); background: var(--cartao); color: var(--cor); display: grid; place-items: center; cursor: pointer; font-weight: 700; font-variant-numeric: tabular-nums; position: relative; z-index: 1; }
.feito .ico { display: none; width: 22px; height: 22px; }
.feito[aria-pressed="true"] { background: var(--cor); color: var(--cartao); }
.feito[aria-pressed="true"] .n { display: none; }
.feito[aria-pressed="true"] .ico { display: block; }
.passo details { background: var(--cartao); border: 1px solid var(--linha); border-radius: 12px; min-width: 0; }
.passo summary { list-style: none; cursor: pointer; padding: 16px 18px; display: flex; flex-direction: column; gap: 6px; }
.passo summary::-webkit-details-marker { display: none; }
.passo .topo { display: flex; align-items: baseline; gap: 12px; justify-content: space-between; }
.passo h3 { font-size: 1.08rem; font-weight: 700; line-height: 1.35; }
.passo .min { font-size: .85rem; color: var(--tinta-2); white-space: nowrap; font-variant-numeric: tabular-nums; }
.passo .faz { color: var(--tinta-2); font-size: .98rem; }
.selo { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; margin-top: 4px; padding: 4px 12px 4px 8px; border-radius: 999px; border: 1.5px solid var(--cor); color: var(--cor); font-weight: 700; font-size: .86rem; line-height: 1.3; }
.selo .ico { width: 17px; height: 17px; }
.passo.ok .selo { background: var(--cor); color: var(--cartao); }
.abrir { display: inline-flex; align-items: center; gap: 4px; font-size: .84rem; color: var(--tinta-2); margin-top: 2px; }
.abrir .ico { width: 15px; height: 15px; transition: transform .2s; }
details[open] .abrir .ico { transform: rotate(90deg); }
.detalhe { padding: 2px 18px 18px; display: grid; gap: 12px; border-top: 1px solid var(--linha); padding-top: 14px; margin: 0 0 0; }
.detalhe div { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 12px; font-size: .95rem; }
.detalhe dt { color: var(--tinta-2); font-size: .86rem; padding-top: 2px; }
.detalhe .auto { color: var(--m3); font-weight: 600; }

/* entregáveis, ferramentas e resumo */
.grupo h3 { font-size: 1.05rem; font-weight: 700; display: flex; align-items: center; gap: 10px; }
.grupo h3 span { width: 12px; height: 12px; border-radius: 50%; background: var(--cor); }
.entregas { margin-top: 12px; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }
.entregas li { display: flex; gap: 10px; align-items: center; padding: 12px 14px; background: var(--cartao); border: 1px solid var(--linha); border-radius: 10px; min-width: 0; }
.entregas .ico { color: var(--cor); }
.entregas b { font-size: .95rem; display: block; line-height: 1.3; }
.entregas small { color: var(--tinta-2); font-size: .8rem; }
.ferr { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px; }
.ferr li { padding: 16px 18px; background: var(--cartao); border: 1px solid var(--linha); border-radius: 12px; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.ferr h3 { font-size: 1.02rem; font-weight: 700; }
.ferr p { font-size: .94rem; color: var(--tinta-2); }
.ferr .plano { font-size: .84rem; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.chips a { font-size: .78rem; font-weight: 700; text-decoration: none; padding: 2px 9px; border-radius: 999px; border: 1px solid var(--cor); color: var(--cor); font-variant-numeric: tabular-nums; }
.tabela { overflow-x: auto; background: var(--cartao); border: 1px solid var(--linha); border-radius: 12px; }
.tabela table { width: 100%; min-width: 560px; border-collapse: collapse; font-size: .95rem; }
.tabela th, .tabela td { text-align: left; vertical-align: top; padding: 12px 16px; border-bottom: 1px solid var(--linha); }
.tabela th { font-size: .8rem; font-weight: 700; color: var(--tinta-2); }
.tabela tr:last-child td { border-bottom: 0; }
.tabela .n { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
.tabela tfoot td { font-weight: 700; border-top: 1px solid var(--linha); }
.robos { display: grid; gap: 8px; }
.robos li { display: flex; gap: 10px; align-items: flex-start; font-size: .96rem; }
.robos .ico { color: var(--m3); margin-top: 3px; }
.rodape { font-size: .84rem; color: var(--tinta-2); }

@media (max-width: 880px) {
  .app { grid-template-columns: minmax(0, 1fr); }
  .lado { position: sticky; top: env(safe-area-inset-top, 0px); height: auto; z-index: 5; padding-block: 12px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); gap: 10px; }
  body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 10; background: var(--lado); }
  .marca p, .marca .total { display: none; }
  .marca h1 { font-size: 1.1rem; }
  .menu { flex-direction: row; overflow-x: auto; gap: 6px; scrollbar-width: none; }
  .menu .sep { display: none; }
  .menu a { flex: none; padding: 7px 12px; border: 1px solid rgba(255,255,255,.18); border-radius: 999px; }
  .menu a[aria-current="page"] { box-shadow: none; background: var(--lado-tinta); color: var(--lado); }
  .menu .bola, .menu .txt small, .menu .prog { display: none; }
  .conteudo { padding-block: 28px 64px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
  .detalhe div { grid-template-columns: minmax(0, 1fr); gap: 2px; }
  .ferr { grid-template-columns: minmax(0, 1fr); }
}
@media (prefers-reduced-motion: reduce) { .abrir .ico { transition: none; } }
`;

// ---------- página ----------
const linhaDet = (rotulo, valor, cls = '') => valor ? `<div><dt>${rotulo}</dt><dd${cls ? ` class="${cls}"` : ''}>${valor}</dd></div>` : '';

function passo(s, m) {
  const det = [
    linhaDet('Por quê', s.dor ? `“${esc(s.dor)}”` : ''),
    linhaDet('A prática', s.pratica ? `<b>${esc(s.pratica)}.</b> ${esc(s.jogo || '')}` : ''),
    linhaDet('Roda sozinho', s.automacao ? esc(s.automacao) : '', 'auto'),
    linhaDet('Ferramentas', (s.ferramentas || []).map(esc).join(' · ')),
    linhaDet('Precisa de', esc(s.precisa)),
    linhaDet('Cuidado', esc(s.cuidado)),
  ].join('');
  return `
        <li class="passo" id="${id(s.numero)}">
          <button type="button" class="feito" id="feito-${id(s.numero)}" data-sessao="${esc(s.numero)}" aria-pressed="false" aria-label="Marcar a sessão ${esc(s.numero)} como feita"><span class="n">${esc(s.numero.split('.')[1])}</span>${ico('check')}</button>
          <details>
            <summary>
              <span class="topo"><h3>${esc(s.nome)}</h3><span class="min">${s.minutos} min</span></span>
              <span class="faz">${esc(s.faz)}</span>
              <span class="selo">${ico(s.icone || 'check')}${esc(s.conquista)}</span>
              <span class="abrir">Ver detalhes ${ico('seta')}</span>
            </summary>
            <dl class="detalhe">${det}</dl>
          </details>
        </li>`;
}

function vistaModulo(m) {
  return `
    <section class="vista m${m.numero}" id="modulo-${m.numero}" data-vista aria-labelledby="t-m${m.numero}">
      <header class="cab">
        <p class="etapa">Módulo ${m.numero} de 3</p>
        <h2 id="t-m${m.numero}">${esc(m.nome)}</h2>
        <p class="dor"><q>${esc(m.dor)}</q></p>
      </header>
      <div class="fim">${ico('check')}<p><b>No fim do módulo:</b> ${esc(m.resultado)}</p></div>
      <p class="meta"><span><b>${m.sessoes.length}</b> sessões</span><span><b>${fmt(m.minutos)}</b> de vídeo</span><span>${esc(m.precisa)}</span></p>
      <ol class="trilha">${m.sessoes.map((s) => passo(s, m)).join('')}
      </ol>
    </section>`;
}

const vistaEntregas = `
    <section class="vista" id="entregaveis" data-vista aria-labelledby="t-ent" hidden>
      <header class="cab">
        <p class="etapa">O que você leva</p>
        <h2 id="t-ent">Entregáveis</h2>
        <p class="dor">Cada sessão termina com uma peça do escritório pronta. Marque as sessões feitas e veja as conquistas se acenderem.</p>
      </header>${A.modulos.map((m) => `
      <div class="grupo m${m.numero}">
        <h3><span></span>Módulo ${m.numero} · ${esc(m.nome)}</h3>
        <ul class="entregas">${m.sessoes.map((s) => `
          <li>${ico(s.icone || 'check')}<span><b>${esc(s.conquista)}</b><small>Sessão ${esc(s.numero)}</small></span></li>`).join('')}
        </ul>
      </div>`).join('')}
    </section>`;

const nomesF = Object.keys(A.ferramentas);
const corDe = (n) => 'm' + String(n).split('.')[0];
const vistaFerr = `
    <section class="vista" id="ferramentas" data-vista aria-labelledby="t-fer" hidden>
      <header class="cab">
        <p class="etapa">O que entra no seu escritório</p>
        <h2 id="t-fer">Ferramentas incorporadas</h2>
        <p class="dor">Tudo no navegador, nada instalado no computador.</p>
      </header>
      <ul class="ferr">${nomesF.map((f) => `
        <li><h3>${esc(f)}</h3><p>${esc(A.ferramentas[f].faz)}</p><p class="plano"><b>Plano:</b> ${esc(A.ferramentas[f].plano)}</p><span class="chips">${usos(f).map((n) => `<a class="${corDe(n)}" href="#${id(n)}">${esc(n)}</a>`).join('')}</span></li>`).join('')}
      </ul>${A.modelos ? `
      <div class="grupo">
        <h3>Qual modelo do Claude para qual trabalho</h3>
        <div class="tabela" style="margin-top:12px"><table>
          <thead><tr><th>Modelo</th><th>Perfil</th><th>Na advocacia</th></tr></thead>
          <tbody>${A.modelos.map((l) => `<tr><td style="white-space:nowrap"><b>${esc(l.modelo)}</b></td><td>${esc(l.perfil)}</td><td>${esc(l.usos)}</td></tr>`).join('')}</tbody>
        </table></div>
        <p class="rodape" style="margin-top:10px">Comece pelo menor que resolve. Os maiores gastam mais do limite do plano, e a disponibilidade depende do plano.</p>
      </div>` : ''}
    </section>`;

const vistaResumo = `
    <section class="vista" id="resumo" data-vista aria-labelledby="t-res" hidden>
      <header class="cab">
        <p class="etapa">Relatório</p>
        <h2 id="t-res">Resumo do curso</h2>
      </header>
      <div class="tabela"><table>
        <thead><tr><th>Módulo</th><th>No fim, você tem</th><th class="n">Sessões</th><th class="n">Vídeo</th></tr></thead>
        <tbody>${A.modulos.map((m) => `
          <tr><td><b>${m.numero} · ${esc(m.nome)}</b></td><td>${esc(m.resultado)}</td><td class="n">${m.sessoes.length}</td><td class="n">${fmt(m.minutos)}</td></tr>`).join('')}
        </tbody>
        <tfoot><tr><td>Total</td><td>${todas.length} conquistas</td><td class="n">${todas.length}</td><td class="n">${fmt(totalMin)}</td></tr></tfoot>
      </table></div>${robos.length ? `
      <div class="grupo">
        <h3>No fim do curso, isto roda sozinho</h3>
        <ul class="robos" style="margin-top:12px">${robos.map((s) => `
          <li>${ico('sozinho')}<span><b>${esc(s.conquista)}:</b> ${esc(s.automacao)}.</span></li>`).join('')}
        </ul>
      </div>` : ''}
      <div class="grupo">
        <h3>Do que o aluno precisa</h3>
        <ul class="robos" style="margin-top:12px">${A.modulos.map((m) => `
          <li>${ico('check')}<span><b>Módulo ${m.numero}:</b> ${esc(m.precisa)}</span></li>`).join('')}
        </ul>
      </div>
      <p class="rodape">${esc(A.rodape || '')}</p>
    </section>`;

const menu = `
      <nav class="menu" aria-label="Agenda">${A.modulos.map((m) => `
        <a href="#modulo-${m.numero}" class="m${m.numero}" data-ir="modulo-${m.numero}"><span class="bola">${m.numero}</span><span class="txt"><b>Módulo ${m.numero}</b><small>${esc(m.nome)}</small></span><span class="prog" data-prog="${m.numero}">0/${m.sessoes.length}</span></a>`).join('')}
        <span class="sep" aria-hidden="true"></span>
        <a href="#entregaveis" data-ir="entregaveis"><span class="bola">${ico('check')}</span><span class="txt"><b>Entregáveis</b><small>${todas.length} conquistas</small></span></a>
        <a href="#ferramentas" data-ir="ferramentas"><span class="bola">${ico('molde')}</span><span class="txt"><b>Ferramentas incorporadas</b><small>${nomesF.length} ferramentas</small></span></a>
        <a href="#resumo" data-ir="resumo"><span class="bola">${ico('painel')}</span><span class="txt"><b>Resumo</b><small>o curso em uma tela</small></span></a>
      </nav>`;

const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${Object.keys(ICONES).map((k) => `<symbol id="i-${k}" viewBox="0 0 24 24">${ICONES[k]}</symbol>`).join('')}</defs></svg>`;

const script = `
<script>
(function () {
  var CHAVE = 'agenda-ia-adv:feitas';
  var feitas = {};
  try { feitas = JSON.parse(localStorage.getItem(CHAVE) || '{}') || {}; } catch (e) { feitas = {}; }
  var vistas = [].slice.call(document.querySelectorAll('[data-vista]'));
  var links = [].slice.call(document.querySelectorAll('[data-ir]'));
  function mostrar() {
    var h = (location.hash || '').slice(1);
    var alvo = document.getElementById(h);
    var vista = alvo && alvo.hasAttribute('data-vista') ? alvo : (alvo ? alvo.closest('[data-vista]') : null);
    if (!vista) vista = vistas[0];
    vistas.forEach(function (v) { v.hidden = v !== vista; });
    links.forEach(function (a) { if (a.getAttribute('data-ir') === vista.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    if (alvo && alvo !== vista) { var d = alvo.querySelector('details'); if (d) d.open = true; alvo.scrollIntoView({ block: 'center' }); }
    else window.scrollTo(0, 0);
  }
  function contar() {
    [1, 2, 3].forEach(function (n) {
      var bts = document.querySelectorAll('#modulo-' + n + ' .feito');
      var ok = [].filter.call(bts, function (b) { return b.getAttribute('aria-pressed') === 'true'; }).length;
      var el = document.querySelector('[data-prog="' + n + '"]');
      if (el) el.textContent = ok + '/' + bts.length;
    });
  }
  [].forEach.call(document.querySelectorAll('.feito'), function (b) {
    var s = b.getAttribute('data-sessao');
    function pintar() { var on = !!feitas[s]; b.setAttribute('aria-pressed', String(on)); b.closest('.passo').classList.toggle('ok', on); }
    pintar();
    b.addEventListener('click', function () {
      feitas[s] = !feitas[s];
      try { localStorage.setItem(CHAVE, JSON.stringify(feitas)); } catch (e) {}
      pintar(); contar();
    });
  });
  window.addEventListener('hashchange', mostrar);
  contar(); mostrar();
})();
</script>`;

const cabeca = `<title>Agenda IA Aplicada a Advogados</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,600&display=swap">
<style>${CSS}</style>`;

const corpo = `${sprite}
<div class="app">
  <aside class="lado">
    <div class="marca">
      <h1>${esc(A.titulo)}</h1>
      <p>${esc(A.promessa)}</p>
      <p class="total">3 módulos · ${todas.length} sessões · ${fmt(totalMin)} de vídeo</p>
    </div>${menu}
  </aside>
  <main class="conteudo">${A.modulos.map(vistaModulo).join('')}${vistaEntregas}${vistaFerr}${vistaResumo}
  </main>
</div>${script}`;

const pagina = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${cabeca}
</head>
<body>
${corpo}
</body>
</html>
`;
fs.writeFileSync(path.join(pasta, 'agenda-udemy.html'), pagina);
if (saidaArtefato) fs.writeFileSync(saidaArtefato, cabeca + '\n' + corpo + '\n');

// ---------- espelho em texto ----------
const md = [`# ${A.titulo}`, '', A.promessa, '', `3 módulos · ${todas.length} sessões · ${fmt(totalMin)} de vídeo`, '',
  'A página é [agenda-udemy.html](agenda-udemy.html). Este arquivo e a página saem de [agenda.json](agenda.json) pelo script [montar.js](montar.js) (`node montar.js`).', ''];
A.modulos.forEach((m) => {
  md.push(`## Módulo ${m.numero} · ${m.nome}`, '', `> "${m.dor}"`, '', `**No fim do módulo:** ${m.resultado}`, '', `${m.sessoes.length} sessões · ${fmt(m.minutos)} · ${m.precisa}`, '');
  m.sessoes.forEach((s) => md.push(`${s.numero}. **${s.nome}** (${s.minutos} min). ${s.faz} Conquista: *${s.conquista}*.`));
  md.push('');
});
md.push('## Entregáveis', '');
A.modulos.forEach((m) => md.push(`- **Módulo ${m.numero}:** ${m.sessoes.map((s) => s.conquista).join(' · ')}`));
md.push('', '## Ferramentas incorporadas', '', '| Ferramenta | O que faz no curso | Plano | Sessões |', '|---|---|---|---|');
nomesF.forEach((f) => md.push(`| ${f} | ${A.ferramentas[f].faz} | ${A.ferramentas[f].plano} | ${usos(f).join(', ')} |`));
if (A.modelos) {
  md.push('', '### Qual modelo para qual trabalho', '', '| Modelo | Perfil | Na advocacia |', '|---|---|---|');
  A.modelos.forEach((l) => md.push(`| ${l.modelo} | ${l.perfil} | ${l.usos} |`));
}
md.push('', '## Resumo', '', '| Módulo | No fim, você tem | Sessões | Vídeo |', '|---|---|---:|---:|');
A.modulos.forEach((m) => md.push(`| ${m.numero} · ${m.nome} | ${m.resultado} | ${m.sessoes.length} | ${fmt(m.minutos)} |`));
md.push(`| **Total** | ${todas.length} conquistas | ${todas.length} | ${fmt(totalMin)} |`, '');
if (robos.length) { md.push('**No fim do curso, isto roda sozinho:**', '', ...robos.map((s) => `- ${s.conquista}: ${s.automacao}.`), ''); }
md.push(A.rodape || '', '');
fs.writeFileSync(path.join(pasta, 'README.md'), md.join('\n'));

console.log(`Agenda montada: ${todas.length} sessões, ${fmt(totalMin)} (${totalMin} min), ${robos.length} automações.`);
A.modulos.forEach((m) => console.log(`  Módulo ${m.numero}: ${m.sessoes.length} sessões, ${m.minutos} min`));
