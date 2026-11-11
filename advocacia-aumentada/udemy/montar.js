#!/usr/bin/env node
/* Monta a página da agenda do curso a partir de agenda.json.

   Uso:  node montar.js [dados.json] [--artefato caminho.html]

   Gera, na pasta do arquivo de dados:
     agenda-udemy.html   página completa, abre em qualquer navegador
     README.md           espelho em texto
   Com --artefato, grava também a versão sem <html>/<head>/<body>, usada para publicar a página.
   Confere números, minutos, ícones e ferramentas; para se algo não fechar. */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const iArt = args.indexOf('--artefato');
const saidaArtefato = iArt >= 0 ? args[iArt + 1] : null;
const entrada = path.resolve(args.find((a, i) => !a.startsWith('--') && (iArt < 0 || i !== iArt + 1)) || path.join(__dirname, 'agenda.json'));
const pasta = path.dirname(entrada);
const A = JSON.parse(fs.readFileSync(entrada, 'utf8'));

// ---------- ícones (traço, 24 x 24) ----------
const I = {
  escudo: '<path d="M12 3l7 2.6v5.3c0 4.4-2.9 8.1-7 9.6-4.1-1.5-7-5.2-7-9.6V5.6L12 3z"/><path d="M9 11.8l2.1 2.1L15 10"/>',
  mapa: '<path d="M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4z"/><path d="M9 4v14M15 6v14"/>',
  lista: '<path d="M4 6.5l1.6 1.6L8.4 5.3M4 12.5l1.6 1.6 2.8-2.8M4 18.5l1.6 1.6 2.8-2.8M12 7h8M12 13h8M12 19h8"/>',
  versao: '<circle cx="6" cy="5.5" r="2"/><circle cx="6" cy="18.5" r="2"/><circle cx="18" cy="7.5" r="2"/><path d="M6 7.5v9M18 9.5c0 4.5-12 3-12 7"/>',
  pasta: '<path d="M3.5 7a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
  agenda: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4M7.5 14h2.5M13.8 14h2.7M7.5 17.4h2.5"/>',
  mensagem: '<path d="M5 4.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4.5 3.5V16.5H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"/><path d="M7.5 9h9M7.5 12.5h5.5"/>',
  lupa: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
  molde: '<path d="M8 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2M9 9h6M9 12h6M9 15h3.5"/>',
  cartao: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="8" cy="11" r="1.8"/><path d="M12.5 10.5H18M12.5 14h4M6 15h4"/>',
  estrela: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
  paleta: '<path d="M12 3a9 9 0 0 0 0 18c1.4 0 2-1 2-2s-.8-1.5-.8-2.5S14 15 15 15h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1.1"/><circle cx="10.5" cy="7.5" r="1.1"/><circle cx="15" cy="8" r="1.1"/>',
  slides: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4M8.5 20h7M7 12.5l3-3 2.5 2 4.5-4.5"/>',
  cerebro: '<path d="M12 5.5a3 3 0 0 0-5.5 1.3A3 3 0 0 0 5 12a3 3 0 0 0 2 5.3 3 3 0 0 0 5 1.2M12 5.5a3 3 0 0 1 5.5 1.3A3 3 0 0 1 19 12a3 3 0 0 1-2 5.3 3 3 0 0 1-5 1.2M12 5.5v13"/>',
  pagina: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4.5"/>',
  planilha: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9.5h18M3 14.8h18M9 4v16M15 4v16"/>',
  formulario: '<rect x="4" y="3" width="16" height="18" rx="2"/><rect x="7.5" y="7" width="3" height="3" rx=".5"/><path d="M13 8.5h3.5M7.5 14h9M7.5 17.5h6"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.6 6.6L12 13l8.4-6.4"/>',
  contrato: '<path d="M6 3h8.5L19 7.5V21H6z"/><path d="M14.5 3v4.5H19M9 11h7M9 14.3h7M9 18c.9-1.4 1.9-1.4 2.8 0s1.9 1.4 2.8 0"/>',
  painel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7.5 16v-3M12 16V8.5M16.5 16v-5"/>',
  relogio: '<circle cx="12" cy="13" r="7"/><path d="M12 9.5V13l2.5 1.5M5 4.5L3 6.5M19 4.5l2 2"/>',
  trofeu: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M9.5 17h5"/>',
  alvo: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".9"/>',
  pessoa: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>',
  predio: '<path d="M5 21V5l7-2 7 2v16M3 21h18M9 8h1.5M13.5 8H15M9 12h1.5M13.5 12H15M10.5 21v-4h3v4"/>',
  nuvem: '<path d="M7 18.5a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.4 1.6A3.8 3.8 0 0 1 17.5 18.5z"/>',
  claude: '<path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6L6 18"/>',
  video: '<rect x="3" y="6.5" width="12.5" height="11" rx="2"/><path d="M15.5 10.5l5-3v9l-5-3"/>',
  codigo: '<path d="M8.5 8L4.5 12l4 4M15.5 8l4 4-4 4M13.5 5.5l-3 13"/>',
  plugue: '<path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0z"/><path d="M12 16v5"/>',
  peca: '<path d="M10 4h4v2.4a1.6 1.6 0 1 0 3.2 0V4H20v6.2h-2.4a1.6 1.6 0 1 0 0 3.2H20V20h-6.2v-2.4a1.6 1.6 0 1 0-3.2 0V20H4v-6.6h2.4a1.6 1.6 0 1 0 0-3.2H4V4z"/>',
  balao: '<path d="M4 20l1.4-4.2A8 8 0 1 1 8.2 18.6z"/>',
  chave: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l2.5 2.5M14 9l2 2"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  livros: '<path d="M5 4h4v16H5zM10 4h4v16h-4zM15.4 4.6l3.8 1-3.4 14.8-3.9-.9z"/>',
  grafico: '<path d="M4 20h16M7 16v-4M12 16V7M17 16v-7"/>',
  terminal: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M7 9.5l3 2.5-3 2.5M12.5 15h4.5"/>',
  fluxo: '<circle cx="5" cy="12" r="2.2"/><circle cx="19" cy="6" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="M7.2 12h4.3M11.5 12c2 0 2.5-6 5.3-6M11.5 12c2 0 2.5 6 5.3 6"/>',
  seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  luz: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  cadeado: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  moeda: '<circle cx="12" cy="12" r="8.5"/><path d="M14.6 9.4c-.5-.9-1.5-1.4-2.6-1.4-1.4 0-2.6.8-2.6 2s1.2 1.7 2.6 2 2.6.8 2.6 2-1.2 2-2.6 2c-1.1 0-2.1-.5-2.6-1.4M12 6.6V8M12 16v1.4"/>',
};

// ---------- conferência ----------
const erros = [];
if (A.modulos.length !== 3) erros.push('A agenda precisa de exatamente 3 módulos.');
const vistos = new Set();
A.modulos.forEach((m) => {
  m.minutos = m.aulas.reduce((t, a) => t + a.minutos, 0);
  m.aulas.forEach((a) => {
    ['numero', 'nome', 'o_que_e', 'conquista', 'missao', 'minutos'].forEach((c) => { if (!a[c]) erros.push(`Aula ${a.numero || '?'} sem "${c}".`); });
    if (!a.roteiro || a.roteiro.length < 3) erros.push(`Aula ${a.numero}: "roteiro" precisa de pelo menos 3 passos.`);
    if (!String(a.numero).startsWith(m.numero + '.')) erros.push(`Aula ${a.numero} fora do módulo ${m.numero}.`);
    if (vistos.has(a.numero)) erros.push(`Aula ${a.numero} repetida.`);
    vistos.add(a.numero);
    if (!I[a.icone]) erros.push(`Aula ${a.numero}: ícone desconhecido "${a.icone}".`);
    (a.ferramentas || []).forEach((f) => { if (!A.ferramentas[f]) erros.push(`Aula ${a.numero}: ferramenta sem cadastro "${f}".`); });
  });
  if (m.painel) {
    if (!m.painel.titulo || !m.painel.texto || !(m.painel.blocos || []).length) erros.push(`Módulo ${m.numero}: painel sem título, texto ou blocos.`);
    (m.painel.blocos || []).forEach((b) => {
      if (!I[b.icone]) erros.push(`Painel, bloco ${b.nome}: ícone desconhecido "${b.icone}".`);
      if (!m.aulas.some((a) => a.numero === b.aula)) erros.push(`Painel, bloco ${b.nome}: aula ${b.aula} não existe no módulo ${m.numero}.`);
    });
  }
});
(A.aprofundamentos || []).forEach((x) => x.ferramentas.forEach((f) => { if (!A.ferramentas[f]) erros.push(`Aprofundamento ${x.nome}: ferramenta sem cadastro "${f}".`); }));
(A.medicao ? A.medicao.indicadores : []).forEach((x) => { if (!I[x.icone]) erros.push(`Indicador ${x.nome}: ícone desconhecido.`); });
(A.projeto_final ? A.projeto_final.roteiro : []).forEach((x) => { if (!I[x.icone]) erros.push(`Roteiro: ícone desconhecido "${x.icone}".`); });
Object.entries(A.ferramentas).forEach(([n, f]) => { if (!I[f.icone]) erros.push(`Ferramenta ${n}: ícone desconhecido "${f.icone}".`); });
const aulas = A.modulos.flatMap((m) => m.aulas);
if (A.sistema) {
  (A.sistema.pecas || []).forEach((x) => {
    if (!I[x.icone]) erros.push(`Sistema, peça ${x.nome}: ícone desconhecido "${x.icone}".`);
    if (!vistos.has(x.aula)) erros.push(`Sistema, peça ${x.nome}: aula ${x.aula} não existe.`);
  });
  if ((A.sistema.pecas || []).length !== 3) erros.push('Sistema: são três peças.');
}
const totalMin = aulas.reduce((t, a) => t + a.minutos, 0);
if (totalMin > 480) erros.push(`O curso passa de 8 horas (${totalMin} min).`);
if (erros.length) { console.error('A agenda não fecha:\n- ' + erros.join('\n- ')); process.exit(1); }

// ---------- utilidades ----------
const esc = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (min) => { const h = Math.floor(min / 60), m = min % 60; return h ? `${h} h${m ? ' ' + String(m).padStart(2, '0') : ''}` : `${m} min`; };
const idA = (n) => 'a-' + String(n).replace('.', '-');
const ico = (nome, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-${nome}"/></svg>`;
const nomesF = Object.keys(A.ferramentas);
const modulosDe = (f) => A.modulos.filter((m) => m.aulas.some((a) => a.ferramentas.includes(f))).map((m) => m.numero);
const ROTULO_PLANO = { gratis: 'Grátis', pago: 'Pago', misto: 'Grátis e pago' };

// ---------- estilo ----------
const CSS = `
/* Layout: página única. Topo escuro com o prédio do escritório (uma janela por aula, acende quando a aula é feita).
   Depois: o curso, a jornada em três andares, a agenda em colunas (aula | o que é e o que vamos apresentar | ferramentas | tempo),
   as conquistas, o projeto final, as ferramentas e o resumo. */
:root {
  --fundo: #F3F5F9; --cartao: #FFFFFF; --cartao-2: #F7F9FC; --linha: #E2E7EF; --tinta: #121A2B; --tinta-2: #5A6478;
  --noite: #0F1B33; --noite-2: #182848; --noite-3: #233862; --noite-tinta: #F2F5FB; --noite-sub: #B3C0D9;
  --vidro: #1D2D52; --vidro-borda: #34497A;
  --m1: #2F5FE3; --m1-s: #EAF0FE; --m2: #B3264F; --m2-s: #FCEEF2; --m3: #0B8770; --m3-s: #E2F5F0;
  --ouro: #D9961A; --ouro-s: #FDF3DF; --sobre-ouro: #2A1C02;
  --f-titulo: "Bricolage Grotesque", "Source Sans 3", system-ui, sans-serif;
  --f-texto: "Source Sans 3", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --fundo: #0B1120; --cartao: #131B2D; --cartao-2: #172138; --linha: #263149; --tinta: #EDF1F8; --tinta-2: #A7B1C5;
    --noite: #0A1226; --noite-2: #121E3A; --noite-3: #1D2E55;
    --m1: #8EA9F8; --m1-s: #1A2547; --m2: #F290AC; --m2-s: #3A1626; --m3: #5FCFB8; --m3-s: #0F2F29;
    --ouro: #F2C15B; --ouro-s: #33270F; --sobre-ouro: #2A1C02;
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --fundo: #0B1120; --cartao: #131B2D; --cartao-2: #172138; --linha: #263149; --tinta: #EDF1F8; --tinta-2: #A7B1C5;
  --noite: #0A1226; --noite-2: #121E3A; --noite-3: #1D2E55;
  --m1: #8EA9F8; --m1-s: #1A2547; --m2: #F290AC; --m2-s: #3A1626; --m3: #5FCFB8; --m3-s: #0F2F29;
  --ouro: #F2C15B; --ouro-s: #33270F; --sobre-ouro: #2A1C02;
  color-scheme: dark;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 76px; }
body { margin: 0; background: var(--fundo); color: var(--tinta); font-family: var(--f-texto); font-size: 17px; line-height: 1.55; -webkit-font-smoothing: antialiased; }
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 30; background: var(--noite); }
h1, h2, h3, p, ul, ol, dl, dd, figure { margin: 0; }
ul, ol { padding: 0; list-style: none; }
[hidden] { display: none !important; }
a { color: inherit; }
button { font: inherit; color: inherit; }
:focus-visible { outline: 3px solid var(--ouro); outline-offset: 3px; border-radius: 6px; }
.ico { width: 20px; height: 20px; flex: none; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.m1 { --cor: var(--m1); --cor-s: var(--m1-s); }
.m2 { --cor: var(--m2); --cor-s: var(--m2-s); }
.m3 { --cor: var(--m3); --cor-s: var(--m3-s); }
.faixa { padding-left: max(20px, env(safe-area-inset-left, 0px)); padding-right: max(20px, env(safe-area-inset-right, 0px)); }
.miolo { max-width: 1160px; margin: 0 auto; }
.secao { padding-block: 72px 8px; }
.olho { font-size: .82rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--tinta-2); }
.secao h2 { font-family: var(--f-titulo); font-weight: 700; font-size: clamp(1.8rem, 3.6vw, 2.5rem); line-height: 1.1; letter-spacing: -.015em; margin-top: 8px; text-wrap: balance; }
.secao .intro { margin-top: 10px; color: var(--tinta-2); font-size: 1.08rem; max-width: 62ch; }

/* navegação */
.nav { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 20; background: var(--noite); border-bottom: 1px solid var(--noite-3); }
.nav .miolo { display: flex; align-items: center; gap: 18px; min-height: 60px; }
.nav .marca { font-family: var(--f-titulo); font-weight: 700; color: var(--noite-tinta); white-space: nowrap; text-decoration: none; font-size: 1.02rem; }
.nav ul { display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; margin-left: auto; }
.nav ul::-webkit-scrollbar { display: none; }
.nav a.item { display: block; white-space: nowrap; padding: 7px 12px; border-radius: 999px; color: var(--noite-sub); text-decoration: none; font-size: .92rem; font-weight: 600; }
.nav a.item:hover { color: var(--noite-tinta); background: var(--noite-2); }
.nav a.item[aria-current="true"] { color: var(--noite); background: var(--noite-tinta); }

/* topo */
.topo { background: var(--noite); color: var(--noite-tinta); background-image: radial-gradient(rgba(255,255,255,.07) 1px, transparent 1.2px); background-size: 22px 22px; }
.topo .miolo { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, .85fr); gap: 56px; align-items: center; padding-block: 64px 72px; }
.selo-curso { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 999px; background: var(--noite-2); border: 1px solid var(--noite-3); color: var(--noite-sub); font-size: .86rem; font-weight: 600; }
.selo-curso b { color: var(--ouro); }
.topo h1 { font-family: var(--f-titulo); font-weight: 800; font-size: clamp(2.5rem, 5.4vw, 4rem); line-height: 1.02; letter-spacing: -.025em; margin-top: 18px; }
.topo .chamada { font-family: var(--f-titulo); font-weight: 600; font-size: clamp(1.25rem, 2.4vw, 1.6rem); line-height: 1.25; margin-top: 16px; color: var(--noite-tinta); max-width: 26ch; }
.topo .chamada em { font-style: normal; color: var(--ouro); }
.topo .apoio { margin-top: 14px; color: var(--noite-sub); max-width: 52ch; }
.numeros { display: flex; flex-wrap: wrap; gap: 14px 34px; margin-top: 28px; }
.numeros div { display: flex; flex-direction: column; }
.numeros b { font-family: var(--f-titulo); font-size: 2rem; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
.numeros span { font-size: .88rem; color: var(--noite-sub); margin-top: 6px; }
.acoes { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
.botao { display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 10px; font-weight: 700; text-decoration: none; border: 0; cursor: pointer; }
.botao.ouro { background: var(--ouro); color: var(--sobre-ouro); }
.botao.vazado { border: 1.5px solid var(--noite-3); color: var(--noite-tinta); background: transparent; }
.botao.vazado:hover { background: var(--noite-2); }

/* o prédio */
.predio { width: 100%; max-width: 430px; margin: 0 auto; }
.placa { display: flex; align-items: center; justify-content: center; gap: 8px; background: var(--ouro); color: var(--sobre-ouro); font-family: var(--f-titulo); font-weight: 800; font-size: .86rem; letter-spacing: .14em; text-transform: uppercase; padding: 10px; border-radius: 12px 12px 0 0; }
.andar { display: grid; grid-template-columns: 92px minmax(0, 1fr); align-items: center; gap: 12px; padding: 14px; background: var(--noite-2); border: 1px solid var(--noite-3); border-top: 0; }
.andar .qual { display: flex; flex-direction: column; line-height: 1.15; text-decoration: none; }
.andar .qual b { font-family: var(--f-titulo); font-size: 1.5rem; font-weight: 800; color: var(--cor); }
.andar .qual span { font-size: .78rem; color: var(--noite-sub); font-weight: 600; }
.janelas { display: flex; gap: 6px; }
.janela { flex: 1; height: 38px; min-width: 0; border-radius: 5px; background: var(--vidro); border: 1px solid var(--vidro-borda); transition: background .35s, box-shadow .35s, border-color .35s; display: block; }
.janela:hover { border-color: var(--noite-tinta); }
.janela.acesa, .predio.pronto .janela { background: var(--cor); border-color: var(--cor); box-shadow: 0 0 14px var(--cor); }
.terreo .janelas { align-items: flex-end; }
.porta { flex: 1.3; height: 52px; border-radius: 6px 6px 0 0; background: var(--ouro); opacity: .9; }
.calcada { height: 12px; background: var(--noite-3); border-radius: 0 0 10px 10px; }
.progresso { margin-top: 16px; text-align: center; color: var(--noite-sub); font-size: .92rem; }
.progresso b { color: var(--noite-tinta); font-variant-numeric: tabular-nums; }
.predio .botao { margin: 12px auto 0; display: flex; width: fit-content; font-size: .9rem; padding: 9px 16px; }

/* o curso */
.cards4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-top: 28px; }
.card { background: var(--cartao); border: 1px solid var(--linha); border-radius: 16px; padding: 22px; display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.card .ico-bola { width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; background: var(--ouro-s); color: var(--ouro); }
.card .ico-bola .ico { width: 24px; height: 24px; }
.card h3 { font-size: 1.08rem; font-weight: 700; }
.card p { color: var(--tinta-2); font-size: .97rem; }
.antes-depois { margin-top: 18px; background: var(--cartao); border: 1px solid var(--linha); border-radius: 16px; overflow: hidden; }
.antes-depois .cab, .antes-depois li { display: grid; grid-template-columns: minmax(0, 1fr) 40px minmax(0, 1fr); align-items: center; gap: 12px; padding: 14px 22px; }
.antes-depois .cab { background: var(--cartao-2); font-size: .8rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--tinta-2); }
.antes-depois li { border-top: 1px solid var(--linha); }
.antes-depois .antes { color: var(--tinta-2); }
.antes-depois .depois { font-weight: 700; }
.antes-depois .seta { color: var(--ouro); justify-self: center; }

/* jornada */
.jornada { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-top: 28px; position: relative; }
.etapa { background: var(--cartao); border: 1px solid var(--linha); border-radius: 16px; padding: 22px; display: flex; flex-direction: column; gap: 10px; text-decoration: none; min-width: 0; transition: transform .2s, border-color .2s; }
.etapa:hover { transform: translateY(-2px); border-color: var(--cor); }
.etapa .topo-e { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.etapa .n { width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; background: var(--cor); color: var(--cartao); font-family: var(--f-titulo); font-weight: 800; font-size: 1.3rem; }
.etapa .andar-r { font-size: .8rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--cor); }
.etapa h3 { font-family: var(--f-titulo); font-size: 1.3rem; font-weight: 700; line-height: 1.2; }
.etapa p { color: var(--tinta-2); font-size: .96rem; }
.etapa .meta-e { margin-top: auto; padding-top: 10px; border-top: 1px solid var(--linha); display: flex; justify-content: space-between; font-size: .9rem; color: var(--tinta-2); }
.etapa .meta-e b { color: var(--tinta); }

/* módulos e agenda */
.modulo { margin-top: 28px; }
.mod-cab { background: var(--cor-s); border-radius: 20px; padding: 28px; display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 22px; align-items: start; }
.mod-cab .grande { width: 72px; height: 72px; border-radius: 18px; background: var(--cor); color: var(--cartao); display: grid; place-items: center; font-family: var(--f-titulo); font-weight: 800; font-size: 2.2rem; }
.mod-cab .rot { font-size: .8rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--cor); }
.mod-cab h2 { margin-top: 4px; }
.mod-cab .dor { margin-top: 10px; font-size: 1.08rem; color: var(--tinta-2); font-style: italic; }
.mod-cab .fim { margin-top: 14px; display: flex; gap: 10px; align-items: flex-start; font-size: 1rem; }
.mod-cab .fim .ico { color: var(--cor); margin-top: 3px; }
.mod-cab .meta { margin-top: 12px; display: flex; flex-wrap: wrap; gap: 6px 22px; font-size: .92rem; color: var(--tinta-2); }
.mod-cab .meta b { color: var(--tinta); font-variant-numeric: tabular-nums; }
.grade-cab, .aula { display: grid; grid-template-columns: 84px minmax(0, 1fr) 220px 64px; gap: 22px; }
.grade-cab { padding: 22px 22px 10px; font-size: .78rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--tinta-2); }
.grade-cab span:last-child { text-align: right; }
.aulas { display: flex; flex-direction: column; gap: 12px; }
.aula { background: var(--cartao); border: 1px solid var(--linha); border-radius: 16px; padding: 20px 22px; align-items: start; scroll-margin-top: 84px; transition: border-color .2s; }
.aula.feita { border-color: var(--cor); }
.feito { width: 60px; height: 60px; border-radius: 16px; border: 2px solid var(--cor); background: var(--cartao); color: var(--cor); cursor: pointer; display: grid; place-items: center; font-family: var(--f-titulo); font-weight: 800; font-size: 1.15rem; font-variant-numeric: tabular-nums; }
.feito .ico { display: none; width: 28px; height: 28px; stroke-width: 2.4; }
.feito[aria-pressed="true"] { background: var(--cor); color: var(--cartao); }
.feito[aria-pressed="true"] .n { display: none; }
.feito[aria-pressed="true"] .ico { display: block; }
.aula h3 { font-family: var(--f-titulo); font-size: 1.22rem; font-weight: 700; line-height: 1.25; }
.aula .oque { margin-top: 4px; color: var(--tinta-2); }
.aula .rot { margin-top: 14px; font-size: .78rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--tinta-2); }
.aula .apr { margin-top: 6px; display: grid; gap: 4px; }
.aula .apr li { display: flex; gap: 8px; align-items: flex-start; }
.aula .apr .ico { width: 18px; height: 18px; color: var(--cor); margin-top: 4px; stroke-width: 2.2; }
.aula .fichas { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 8px; }
.ficha { display: inline-flex; align-items: center; gap: 7px; padding: 5px 12px 5px 9px; border-radius: 999px; font-size: .88rem; font-weight: 700; line-height: 1.3; }
.ficha .ico { width: 17px; height: 17px; }
.ficha.conq { background: var(--cor-s); color: var(--cor); }
.aula.feita .ficha.conq { background: var(--cor); color: var(--cartao); }
.ficha.miss { background: var(--ouro-s); color: var(--tinta); font-weight: 600; }
.ficha.miss .ico { color: var(--ouro); }
.ferr-col { display: flex; flex-direction: column; gap: 8px; }
.ferr-col li { display: flex; align-items: center; gap: 9px; font-size: .94rem; font-weight: 600; }
.ferr-col .ico-f { width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center; background: var(--cartao-2); border: 1px solid var(--linha); flex: none; }
.ferr-col .ico-f .ico { width: 17px; height: 17px; }
.tempo { text-align: right; font-family: var(--f-titulo); font-weight: 700; font-size: 1.05rem; white-space: nowrap; font-variant-numeric: tabular-nums; }
.tempo small { display: block; font-family: var(--f-texto); font-weight: 400; font-size: .78rem; color: var(--tinta-2); }
.ferr-col .rot-m, .tempo-m { display: none; }
.roteiro-aula { margin-top: 8px; display: grid; gap: 7px; }
.roteiro-aula li { display: flex; gap: 10px; align-items: flex-start; }
.passo-n { flex: none; width: 22px; height: 22px; margin-top: 2px; border-radius: 50%; display: grid; place-items: center; background: var(--cor-s); color: var(--cor); font-weight: 700; font-size: .78rem; font-variant-numeric: tabular-nums; }
.atencao { margin-top: 12px; display: flex; gap: 8px; align-items: flex-start; font-size: .9rem; color: var(--tinta-2); background: var(--cartao-2); border: 1px solid var(--linha); border-radius: 10px; padding: 9px 12px; }
.atencao .ico { color: var(--ouro); width: 18px; height: 18px; margin-top: 2px; }
.regra { margin-top: 12px; display: inline-flex; gap: 8px; align-items: center; padding: 8px 14px; border-radius: 12px; background: var(--cartao); color: var(--cor); font-weight: 700; font-size: .93rem; line-height: 1.35; }
.regra .ico { width: 18px; height: 18px; }
.a-topo { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.tempo-m { font-family: var(--f-titulo); font-weight: 700; white-space: nowrap; font-variant-numeric: tabular-nums; }
.dica { display: flex; align-items: center; gap: 10px; margin-top: 18px; padding: 10px 14px; border-radius: 10px; background: var(--ouro-s); font-size: .93rem; }
.dica .ico { color: var(--ouro); }

/* o painel do escritório: modelo dentro do módulo */
.vitrine { margin-top: 22px; display: grid; grid-template-columns: minmax(0, .78fr) minmax(0, 1.22fr); gap: 28px; align-items: center; background: var(--cartao); border: 1px solid var(--linha); border-radius: 20px; padding: 26px; scroll-margin-top: 84px; }
.vitrine .olho { color: var(--cor); }
.vitrine h3 { font-family: var(--f-titulo); font-size: 1.55rem; font-weight: 800; line-height: 1.15; margin-top: 6px; }
.vitrine .v-txt > p:not(.olho) { margin-top: 10px; color: var(--tinta-2); }
.vitrine .v-placar { font-weight: 700; }
.vitrine .v-placar b { color: var(--tinta); font-variant-numeric: tabular-nums; }
.v-botao { margin-top: 14px; display: inline-flex; align-items: center; gap: 8px; padding: 9px 14px; border-radius: 10px; border: 1.5px solid var(--linha); background: var(--cartao); color: var(--tinta); font-weight: 700; font-size: .92rem; cursor: pointer; }
.v-botao:hover { border-color: var(--cor); }
.v-botao .ico { color: var(--cor); }
.tela { background: var(--noite); border: 1px solid var(--noite-3); border-radius: 16px; padding: 12px; }
.tela-barra { display: flex; align-items: center; gap: 10px; padding: 2px 4px 12px; color: var(--noite-sub); font-size: .84rem; font-weight: 600; }
.tela-barra .pontos { display: flex; gap: 5px; }
.tela-barra .pontos i { width: 9px; height: 9px; border-radius: 50%; background: var(--noite-3); display: block; }
.tela-barra .so-voce { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
.tela-barra .so-voce .ico { width: 15px; height: 15px; }
.blocos { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.bloco { background: var(--noite-2); border: 1px dashed var(--noite-3); border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 6px; min-width: 0; color: var(--noite-sub); transition: border-color .35s, box-shadow .35s; }
.bloco .b-ico { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: var(--vidro); color: var(--noite-sub); transition: background .35s, color .35s; }
.bloco .b-ico .ico { width: 19px; height: 19px; }
.bloco b { color: var(--noite-tinta); font-size: 1rem; line-height: 1.2; }
.bloco small { font-size: .84rem; line-height: 1.35; }
.bloco .b-aula { margin-top: auto; align-self: flex-start; display: inline-flex; align-items: center; gap: 5px; font-size: .76rem; font-weight: 700; text-decoration: none; padding: 2px 9px; border-radius: 999px; border: 1px solid var(--noite-3); color: var(--noite-sub); white-space: nowrap; }
.bloco .b-aula .ico { width: 13px; height: 13px; display: none; }
.bloco.acesa, .tela.pronto .bloco { border: 1px solid var(--cor); box-shadow: 0 0 16px color-mix(in srgb, var(--cor) 55%, transparent); }
.bloco.acesa .b-ico, .tela.pronto .bloco .b-ico { background: var(--cor); color: var(--cartao); }
.bloco.acesa .b-aula, .tela.pronto .bloco .b-aula { background: var(--cor); border-color: var(--cor); color: var(--cartao); }
.bloco.acesa .b-aula .ico, .tela.pronto .bloco .b-aula .ico { display: block; }
.v-nota { margin-top: 10px; font-size: .86rem; color: var(--noite-sub); padding: 0 4px; }

/* o sistema: três peças e os indicadores */
.pecas { display: grid; grid-template-columns: minmax(0, 1fr) 96px minmax(0, 1fr) 96px minmax(0, 1fr); align-items: stretch; margin-top: 28px; }
.peca { background: var(--cartao); border: 1px solid var(--linha); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 8px; min-width: 0; text-decoration: none; transition: border-color .2s; }
.peca:hover { border-color: var(--ouro); }
.peca .ico-bola { width: 46px; height: 46px; border-radius: 12px; display: grid; place-items: center; background: var(--ouro-s); color: var(--ouro); }
.peca .ico-bola .ico { width: 25px; height: 25px; }
.peca h3 { font-family: var(--f-titulo); font-size: 1.15rem; font-weight: 700; line-height: 1.2; }
.peca p { color: var(--tinta-2); font-size: .96rem; }
.peca .na-aula { margin-top: auto; padding-top: 6px; font-size: .82rem; font-weight: 700; color: var(--tinta); }
.elo { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; color: var(--ouro); text-align: center; font-size: .78rem; font-weight: 700; line-height: 1.2; padding: 0 4px; }
.elo .ico { width: 26px; height: 26px; }
.elo span { color: var(--tinta-2); }
.sistema-tela { margin-top: 18px; }
.sistema-tela .tela-barra .so-voce { color: var(--noite-sub); }
.kpis-m { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.kpi-m { background: var(--noite-2); border: 1px solid var(--noite-3); border-radius: 12px; padding: 14px; min-width: 0; }
.kpi-m small { display: block; color: var(--noite-sub); font-size: .86rem; }
.kpi-m b { display: block; margin: 6px 0 6px; font-family: var(--f-titulo); font-size: 1.9rem; font-weight: 800; line-height: 1.05; color: var(--noite-tinta); white-space: nowrap; }
.kpi-m span { display: block; color: var(--noite-sub); font-size: .88rem; line-height: 1.35; }

/* conquistas */
.medalhas { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; margin-top: 28px; }
.medalha { background: var(--cartao); border: 1px solid var(--linha); border-radius: 16px; padding: 18px 12px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; text-decoration: none; min-width: 0; }
.medalha .disco { width: 58px; height: 58px; border-radius: 50%; display: grid; place-items: center; border: 2px dashed var(--linha); color: var(--tinta-2); background: var(--cartao-2); }
.medalha .disco .ico { width: 26px; height: 26px; }
.medalha b { font-size: .92rem; line-height: 1.25; }
.medalha small { font-size: .78rem; color: var(--tinta-2); }
.medalha.ganha .disco { border: 0; background: var(--cor); color: var(--cartao); box-shadow: 0 0 0 5px var(--cor-s); }
.placar { margin-top: 14px; font-weight: 700; color: var(--tinta-2); }
.placar b { color: var(--tinta); font-variant-numeric: tabular-nums; }

/* projeto final */
.final { margin-top: 28px; background: var(--noite); color: var(--noite-tinta); border-radius: 24px; padding: 36px; display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: 36px; align-items: center; }
.final .trofeu { width: 64px; height: 64px; border-radius: 18px; background: var(--ouro); color: var(--sobre-ouro); display: grid; place-items: center; }
.final .trofeu .ico { width: 34px; height: 34px; }
.final h2 { font-family: var(--f-titulo); font-weight: 800; font-size: clamp(1.6rem, 3vw, 2.2rem); line-height: 1.12; margin-top: 18px; }
.final p { margin-top: 12px; color: var(--noite-sub); }
.roteiro { display: grid; gap: 10px; counter-reset: passo; }
.roteiro li { display: grid; grid-template-columns: 36px 36px minmax(0, 1fr); align-items: center; gap: 12px; padding: 12px 14px; background: var(--noite-2); border: 1px solid var(--noite-3); border-radius: 12px; }
.roteiro li::before { counter-increment: passo; content: counter(passo); font-family: var(--f-titulo); font-weight: 800; color: var(--ouro); font-size: 1.15rem; text-align: center; }
.roteiro .ico { color: var(--noite-sub); }

/* ferramentas */
.ferramentas { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; margin-top: 28px; }
.ferramenta { background: var(--cartao); border: 1px solid var(--linha); border-radius: 16px; padding: 16px; display: grid; grid-template-columns: 44px minmax(0, 1fr); gap: 4px 12px; align-items: start; min-width: 0; }
.ferramenta .ico-f { width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; background: var(--cartao-2); border: 1px solid var(--linha); grid-row: span 3; }
.ferramenta .ico-f .ico { width: 22px; height: 22px; }
.ferramenta h3 { font-size: 1rem; font-weight: 700; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px; }
.ferramenta p { font-size: .92rem; color: var(--tinta-2); }
.plano { font-size: .74rem; font-weight: 700; padding: 2px 8px; border-radius: 999px; border: 1px solid var(--linha); color: var(--tinta-2); white-space: nowrap; }
.plano.gratis { color: var(--m3); border-color: var(--m3); }
.plano.pago { color: var(--m2); border-color: var(--m2); }
.plano.misto { color: var(--m1); border-color: var(--m1); }
.mods { display: flex; gap: 6px; margin-top: 4px; }
.mods a { white-space: nowrap; font-size: .74rem; font-weight: 700; text-decoration: none; padding: 1px 8px; border-radius: 999px; background: var(--cor-s); color: var(--cor); }
.tabela { margin-top: 18px; overflow-x: auto; background: var(--cartao); border: 1px solid var(--linha); border-radius: 16px; }
.tabela table { width: 100%; min-width: 600px; border-collapse: collapse; font-size: .96rem; }
.tabela th, .tabela td { text-align: left; vertical-align: top; padding: 13px 18px; border-bottom: 1px solid var(--linha); }
.tabela th { font-size: .78rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--tinta-2); background: var(--cartao-2); }
.tabela tbody tr:last-child td { border-bottom: 0; }
.tabela tfoot td { font-weight: 700; border-top: 1px solid var(--linha); border-bottom: 0; }
.tabela .n { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
.tabela .bola-m { display: inline-grid; place-items: center; width: 28px; height: 28px; border-radius: 8px; background: var(--cor); color: var(--cartao); font-weight: 800; margin-right: 10px; vertical-align: middle; }
.aprof { margin-top: 26px; padding: 22px; border: 1.5px dashed var(--linha); border-radius: 16px; }
.aprof-lista { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; margin-top: 12px; }
.aprof-item { background: var(--cartao); border: 1px solid var(--linha); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.aprof-item h3 { font-size: 1.02rem; font-weight: 700; }
.aprof-item p { font-size: .94rem; color: var(--tinta-2); }
.aprof-meta { display: flex; flex-wrap: wrap; gap: 6px 14px; }
.aprof-meta span { display: inline-flex; align-items: center; gap: 6px; font-size: .86rem; font-weight: 600; color: var(--tinta); }
.aprof-meta .ico { width: 16px; height: 16px; }
.aprof-precisa { font-size: .84rem !important; }
.mods a.apr { background: var(--cartao-2); color: var(--tinta-2); border: 1px dashed var(--linha); }
.medidas { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-top: 28px; }
.medida { background: var(--cartao); border: 1px solid var(--linha); border-radius: 16px; padding: 22px; display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.medida .ico-bola { width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; background: var(--m3-s); color: var(--m3); }
.medida .ico-bola .ico { width: 24px; height: 24px; }
.medida h3 { font-size: 1.08rem; font-weight: 700; }
.medida p { color: var(--tinta-2); font-size: .97rem; }
.regua { margin-top: auto; padding-top: 12px; border-top: 1px solid var(--linha); display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.regua span { display: flex; flex-direction: column; gap: 2px; }
.regua small { font-size: .78rem; color: var(--tinta-2); }
.regua b { font-size: .95rem; font-weight: 600; color: var(--tinta-2); border-bottom: 1.5px dashed var(--linha); padding-bottom: 2px; }
.nota { margin-top: 16px; font-size: .95rem; color: var(--tinta-2); }
.rodape { padding-block: 40px 64px; color: var(--tinta-2); font-size: .88rem; }

@media (max-width: 1080px) {
  .topo .miolo { grid-template-columns: minmax(0, 1fr); gap: 44px; padding-block: 48px 56px; }
  .cards4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .medidas { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grade-cab { display: none; }
  .aula { grid-template-columns: 64px minmax(0, 1fr); gap: 14px 18px; }
  .aula .num-col { grid-row: 1 / span 2; }
  .aula .ferr-col { grid-column: 2; }
  .aula .tempo { display: none; }
  .tempo-m { display: inline; }
  .ferr-col { flex-direction: row; flex-wrap: wrap; gap: 8px 14px; }
  .ferr-col .rot-m { display: block; font-size: .78rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--tinta-2); width: 100%; }
  .final { grid-template-columns: minmax(0, 1fr); padding: 28px; }
  .vitrine { grid-template-columns: minmax(0, 1fr); gap: 20px; }
  .pecas { grid-template-columns: minmax(0, 1fr); }
  .elo { flex-direction: row; padding: 10px 0; }
  .elo .ico { transform: rotate(90deg); }
  .kpis-m { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 720px) {
  body { font-size: 16px; }
  .nav .marca { display: none; }
  .nav ul { margin-left: 0; }
  .secao { padding-block: 52px 4px; }
  .cards4, .jornada, .medidas { grid-template-columns: minmax(0, 1fr); }
  .antes-depois .cab { display: none; }
  .antes-depois li { grid-template-columns: minmax(0, 1fr); gap: 4px; }
  .antes-depois .seta { justify-self: start; transform: rotate(90deg); }
  .mod-cab { grid-template-columns: minmax(0, 1fr); padding: 22px; }
  .mod-cab .grande { width: 56px; height: 56px; font-size: 1.7rem; border-radius: 14px; }
  .aula { grid-template-columns: 50px minmax(0, 1fr); gap: 12px 14px; padding: 16px; }
  .aula .num-col { grid-row: auto; }
  .aula .ferr-col { grid-column: 1 / -1; }
  .feito { width: 50px; height: 50px; border-radius: 14px; font-size: 1rem; }
  .a-topo { flex-direction: column; gap: 2px; }
  .tempo-m { font-size: .88rem; color: var(--tinta-2); }
  .numeros { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
  .andar { grid-template-columns: 74px minmax(0, 1fr); padding: 12px 10px; gap: 8px; }
  .janelas { gap: 4px; }
  .janela { height: 32px; }
  .final { padding: 22px; border-radius: 18px; }
  .roteiro li { grid-template-columns: 28px 28px minmax(0, 1fr); padding: 10px 12px; }
  .vitrine { padding: 18px; border-radius: 16px; }
  .blocos { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .bloco { padding: 10px; }
  .sistema-tela .tela-barra { flex-wrap: wrap; row-gap: 2px; }
  .sistema-tela .tela-barra .so-voce { margin-left: 0; flex-basis: 100%; white-space: normal; }
  .kpi-m { padding: 12px; }
  .kpi-m b { font-size: 1.5rem; }
  .tela-barra .pontos { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .janela, .etapa, .aula, .bloco, .bloco .b-ico { transition: none; }
}
`;

// ---------- partes da página ----------
const andar = (m) => `
        <div class="andar m${m.numero}${m.numero === 1 ? ' terreo' : ''}">
          <a class="qual" href="#modulo-${m.numero}"><b>${m.numero}º</b><span>${esc(m.andar)}</span></a>
          <div class="janelas">${m.aulas.map((a) => `<a class="janela" href="#${idA(a.numero)}" data-janela="${esc(a.numero)}" title="${esc(a.numero)} · ${esc(a.nome)}" aria-label="Aula ${esc(a.numero)}: ${esc(a.nome)}"></a>`).join('')}${m.numero === 1 ? '<span class="porta" aria-hidden="true"></span>' : ''}</div>
        </div>`;

const topo = `
  <header class="topo faixa" id="curso-topo">
    <div class="miolo">
      <div>
        <span class="selo-curso">${ico('video')}Curso gravado · <b>3 módulos</b></span>
        <h1>${esc(A.titulo)}</h1>
        <p class="chamada">${A.destaque ? esc(A.chamada).replace(esc(A.destaque), '<em>' + esc(A.destaque) + '</em>') : esc(A.chamada)}</p>
        <p class="apoio">${esc(A.apoio)}</p>
        <div class="numeros">
          <div><b>${aulas.length}</b><span>aulas</span></div>
          <div><b>${fmt(totalMin)}</b><span>de vídeo</span></div>
          <div><b>${aulas.length}</b><span>conquistas</span></div>
          <div><b>${nomesF.length}</b><span>ferramentas</span></div>
        </div>
        <div class="acoes">
          <a class="botao ouro" href="#agenda">Ver a agenda ${ico('seta')}</a>
          <a class="botao vazado" href="#projeto-final">O que você apresenta no fim</a>
        </div>
      </div>
      <figure class="predio" id="predio" aria-label="O seu escritório: uma janela por aula">
        <div class="placa">${ico('predio')}Seu escritório</div>${[...A.modulos].reverse().map(andar).join('')}
        <div class="calcada"></div>
        <p class="progresso"><b id="janelas-acesas">0</b> de ${aulas.length} janelas acesas. Marque as aulas feitas e acenda o seu escritório.</p>
        <button type="button" class="botao vazado" id="ver-pronto" aria-pressed="false">${ico('luz')}<span>Ver o prédio completo</span></button>
      </figure>
    </div>
  </header>`;

const SIS = A.sistema;
const nav = `
  <nav class="nav faixa" aria-label="Seções">
    <div class="miolo">
      <a class="marca" href="#curso-topo">${esc(A.titulo)}</a>
      <ul>
        <li><a class="item" href="#curso">O curso</a></li>
        <li><a class="item" href="#agenda">Jornada</a></li>${SIS ? `
        <li><a class="item" href="#sistema">Sistema</a></li>` : ''}${A.modulos.map((m) => `
        <li><a class="item" href="#modulo-${m.numero}">Módulo ${m.numero}</a></li>`).join('')}
        <li><a class="item" href="#conquistas">Conquistas</a></li>
        <li><a class="item" href="#projeto-final">Projeto final</a></li>
        <li><a class="item" href="#ganho">Ganho</a></li>
        <li><a class="item" href="#ferramentas">Ferramentas</a></li>
        <li><a class="item" href="#resumo">Resumo</a></li>
      </ul>
    </div>
  </nav>`;

const curso = `
  <section class="secao faixa" id="curso" aria-labelledby="t-curso">
    <div class="miolo">
      <p class="olho">O curso</p>
      <h2 id="t-curso">Você sai com um escritório montado, não com uma lista de prompts</h2>
      <p class="intro">Cada aula configura ou constrói uma peça do seu escritório, ou do jurídico da sua empresa. No fim, as peças trabalham juntas.</p>
      <div class="cards4">${A.curso.map((c) => `
        <article class="card"><span class="ico-bola">${ico(c.icone)}</span><h3>${esc(c.titulo)}</h3><p>${esc(c.texto)}</p></article>`).join('')}
      </div>
      <div class="antes-depois">
        <div class="cab"><span>Hoje</span><span></span><span>No fim do curso</span></div>
        <ul>${A.antes_depois.map((x) => `
          <li><span class="antes">${esc(x.antes)}</span><span class="seta">${ico('seta')}</span><span class="depois">${esc(x.depois)}</span></li>`).join('')}
        </ul>
      </div>
    </div>
  </section>`;

const jornada = `
  <section class="secao faixa" id="agenda" aria-labelledby="t-jornada">
    <div class="miolo">
      <p class="olho">A jornada</p>
      <h2 id="t-jornada">Montar, trabalhar, automatizar</h2>
      <p class="intro">A ordem tem uma lógica: primeiro você monta o local de trabalho, sem nenhum dado de cliente; depois trabalha com casos no ambiente pronto; por fim automatiza as rotinas, com a aprovação sempre sua.</p>
      <div class="jornada">${A.modulos.map((m) => `
        <a class="etapa m${m.numero}" href="#modulo-${m.numero}">
          <span class="topo-e"><span class="n">${m.numero}</span><span class="andar-r">${m.numero}º andar · ${esc(m.andar)}</span></span>
          <h3>${esc(m.nome)}</h3>
          <p>${esc(m.resultado)}</p>
          <span class="meta-e"><span><b>${m.aulas.length}</b> aulas</span><span><b>${fmt(m.minutos)}</b></span></span>
        </a>`).join('')}
      </div>
    </div>
  </section>`;

const sistema = !SIS ? '' : `
  <section class="secao faixa" id="sistema" aria-labelledby="t-sistema">
    <div class="miolo">
      <p class="olho">O sistema que você constrói</p>
      <h2 id="t-sistema">${esc(SIS.titulo)}</h2>
      <p class="intro">${esc(SIS.texto)}</p>
      <div class="pecas">${SIS.pecas.map((x, i) => `
        <a class="peca" href="#${idA(x.aula)}"><span class="ico-bola">${ico(x.icone)}</span><h3>${esc(x.nome)}</h3><p>${esc(x.papel)}</p><span class="na-aula">Aula ${esc(x.aula)}</span></a>${i < SIS.pecas.length - 1 ? `
        <div class="elo" aria-hidden="true">${ico('seta')}<span>${esc((SIS.ligacoes || [])[i] || '')}</span></div>` : ''}`).join('')}
      </div>
      <div class="tela sistema-tela">
        <div class="tela-barra"><span class="pontos" aria-hidden="true"><i></i><i></i><i></i></span><span>${esc(SIS.indicadores_titulo)}</span><span class="so-voce">${esc(SIS.indicadores_nota)}</span></div>
        <div class="kpis-m">${SIS.indicadores.map((k) => `
          <div class="kpi-m"><small>${esc(k.nome)}</small><b>${esc(k.exemplo)}</b><span>${esc(k.pergunta)}</span></div>`).join('')}
        </div>
      </div>${SIS.nota ? `
      <p class="nota">${esc(SIS.nota)}</p>` : ''}
    </div>
  </section>`;

const aula = (a, m) => `
          <li class="aula" id="${idA(a.numero)}">
            <div class="num-col">
              <button type="button" class="feito" id="feito-${idA(a.numero)}" data-aula="${esc(a.numero)}" aria-pressed="false" aria-label="Marcar a aula ${esc(a.numero)} como feita"><span class="n">${esc(a.numero)}</span>${ico('check')}</button>
            </div>
            <div>
              <div class="a-topo"><h3>${esc(a.nome)}</h3><span class="tempo-m">${a.minutos} min</span></div>
              <p class="oque">${esc(a.o_que_e)}</p>
              <p class="rot">O que vamos apresentar</p>
              <ol class="roteiro-aula">${a.roteiro.map((x, i) => `<li><span class="passo-n">${i + 1}</span><span>${esc(x)}</span></li>`).join('')}</ol>${a.atencao ? `<p class="atencao">${ico('escudo')}<span>${esc(a.atencao)}</span></p>` : ''}
              <p class="fichas"><span class="ficha conq">${ico(a.icone)}${esc(a.conquista)}</span><span class="ficha miss">${ico('alvo')}Missão: ${esc(a.missao)}</span></p>
            </div>
            <ul class="ferr-col"><li class="rot-m">Ferramentas</li>${a.ferramentas.map((f) => `<li><span class="ico-f">${ico(A.ferramentas[f].icone)}</span>${esc(f)}</li>`).join('')}</ul>
            <p class="tempo">${a.minutos} min<small>de vídeo</small></p>
          </li>`;

const aprof = `
      <div class="aprof" id="aprofundamentos">
        <p class="olho">Aprofundamentos opcionais, fora da carga principal</p>
        <div class="aprof-lista">${(A.aprofundamentos || []).map((x) => `
          <article class="aprof-item"><h3>${esc(x.nome)}</h3><p>${esc(x.texto)}</p><p class="aprof-meta">${x.ferramentas.map((f) => `<span>${ico(A.ferramentas[f].icone)}${esc(f)}</span>`).join('')}</p><p class="aprof-precisa">Precisa de: ${esc(x.precisa)}</p></article>`).join('')}
        </div>
      </div>`;

const vitrine = (m) => !m.painel ? '' : `
      <div class="vitrine" id="painel-m${m.numero}">
        <div class="v-txt">
          <p class="olho">O que este módulo constrói</p>
          <h3>${esc(m.painel.titulo)}</h3>
          <p>${esc(m.painel.texto)}</p>
          <p class="v-placar"><b id="blocos-acesos">0</b> de ${m.painel.blocos.length} blocos ligados. Cada bloco liga quando você marca a aula que o alimenta.</p>
          <button type="button" class="v-botao" id="ver-painel" aria-pressed="false">${ico('luz')}<span>Ver o painel ligado</span></button>
        </div>
        <div class="tela" id="tela-painel">
          <div class="tela-barra"><span class="pontos" aria-hidden="true"><i></i><i></i><i></i></span><span>${esc(m.painel.titulo)}</span><span class="so-voce">${ico('cadeado')}só você acessa</span></div>
          <ul class="blocos">${m.painel.blocos.map((b) => `
            <li class="bloco" data-bloco="${esc(b.aula)}"><span class="b-ico">${ico(b.icone)}</span><b>${esc(b.nome)}</b><small>${esc(b.mostra)}</small><a class="b-aula" href="#${idA(b.aula)}">${ico('check')}aula ${esc(b.aula)}</a></li>`).join('')}
          </ul>${m.painel.nota ? `
          <p class="v-nota">${esc(m.painel.nota)}</p>` : ''}
        </div>
      </div>`;

const modulo = (m) => `
  <section class="secao faixa modulo-sec m${m.numero}" id="modulo-${m.numero}" aria-labelledby="t-m${m.numero}">
    <div class="miolo">
      <header class="mod-cab">
        <span class="grande">${m.numero}</span>
        <div>
          <p class="rot">Módulo ${m.numero} · ${m.numero}º andar · ${esc(m.andar)}</p>
          <h2 id="t-m${m.numero}">${esc(m.nome)}</h2>
          <p class="dor">“${esc(m.dor)}”</p>${m.regra ? `<p class="regra">${ico('alvo')}<span>${esc(m.regra)}</span></p>` : ''}
          <p class="fim">${ico('check')}<span><b>No fim do módulo:</b> ${esc(m.resultado)}</span></p>
          <p class="meta"><span><b>${m.aulas.length}</b> aulas</span><span><b>${fmt(m.minutos)}</b> de vídeo</span><span>Precisa de: ${esc(m.precisa)}</span></p>
        </div>
      </header>${vitrine(m)}
      <p class="dica">${ico('check')}<span>Terminou uma aula? Toque no número dela: a janela do prédio acende e a conquista entra na sua coleção.</span></p>
      <div class="grade-cab" aria-hidden="true"><span>Aula</span><span>O que é e o que vamos apresentar</span><span>Ferramentas</span><span>Tempo</span></div>
      <ol class="aulas">${m.aulas.map((a) => aula(a, m)).join('')}
      </ol>${m.numero === 3 && (A.aprofundamentos || []).length ? aprof : ''}
    </div>
  </section>`;

const conquistas = `
  <section class="secao faixa" id="conquistas" aria-labelledby="t-conq">
    <div class="miolo">
      <p class="olho">Entregáveis</p>
      <h2 id="t-conq">${aulas.length} conquistas, uma por aula</h2>
      <p class="intro">Cada conquista é uma peça pronta do seu escritório. Marque as aulas feitas e veja a sua coleção crescer.</p>
      <p class="placar"><b id="placar">0</b> de ${aulas.length} conquistas</p>
      <div class="medalhas">${A.modulos.map((m) => m.aulas.map((a) => `
        <a class="medalha m${m.numero}" href="#${idA(a.numero)}" data-medalha="${esc(a.numero)}"><span class="disco">${ico(a.icone)}</span><b>${esc(a.conquista)}</b><small>Aula ${esc(a.numero)}</small></a>`).join('')).join('')}
      </div>
    </div>
  </section>`;

const PF = A.projeto_final;
const final = `
  <section class="secao faixa" id="projeto-final" aria-labelledby="t-final">
    <div class="miolo">
      <div class="final">
        <div>
          <span class="trofeu">${ico('trofeu')}</span>
          <h2 id="t-final">${esc(PF.titulo)}</h2>
          <p>${esc(PF.texto)}</p>
        </div>
        <ol class="roteiro">${PF.roteiro.map((r) => `
          <li>${ico(r.icone)}<span>${esc(r.texto)}</span></li>`).join('')}
        </ol>
      </div>
    </div>
  </section>`;

const MED = A.medicao;
const medicao = !MED ? '' : `
  <section class="secao faixa" id="ganho" aria-labelledby="t-ganho">
    <div class="miolo">
      <p class="olho">Ganho de valor</p>
      <h2 id="t-ganho">${esc(MED.titulo)}</h2>
      <p class="intro">${esc(MED.texto)}</p>
      <div class="medidas">${MED.indicadores.map((x, i) => `
        <article class="medida"><span class="ico-bola">${ico(x.icone)}</span><h3>${esc(x.nome)}</h3><p>${esc(x.como)}</p><div class="regua"><span><small>${esc(MED.antes || 'Antes')}</small><b>a preencher</b></span><span><small>${esc(MED.depois || 'Depois')}</small><b>a preencher</b></span></div></article>`).join('')}
      </div>
      <p class="nota">${esc(MED.nota)}</p>
    </div>
  </section>`;

const ferramentas = `
  <section class="secao faixa" id="ferramentas" aria-labelledby="t-ferr">
    <div class="miolo">
      <p class="olho">Ferramentas incorporadas</p>
      <h2 id="t-ferr">Tudo o que entra no seu escritório</h2>
      <p class="intro">Tudo no navegador. A etiqueta ao lado do nome mostra se a ferramenta é grátis ou paga; M1, M2 e M3 levam ao módulo onde ela aparece.</p>
      <div class="ferramentas">${nomesF.map((f) => { const F = A.ferramentas[f]; return `
        <article class="ferramenta"><span class="ico-f">${ico(F.icone)}</span><h3>${esc(f)} <span class="plano ${F.tipo}">${esc(F.plano)}</span></h3><p>${esc(F.faz)}</p><span class="mods">${modulosDe(f).length ? modulosDe(f).map((n) => `<a class="m${n}" href="#modulo-${n}" aria-label="Módulo ${n}">M${n}</a>`).join('') : '<a class="apr" href="#aprofundamentos">Aprofundamento</a>'}</span></article>`; }).join('')}
      </div>
      <div class="tabela"><table>
        <thead><tr><th>Modelo do Claude</th><th>Perfil</th><th>Quando usar na advocacia</th></tr></thead>
        <tbody>${A.modelos.map((l) => `<tr><td style="white-space:nowrap"><b>${esc(l.modelo)}</b></td><td>${esc(l.perfil)}</td><td>${esc(l.usos)}</td></tr>`).join('')}</tbody>
      </table></div>
    </div>
  </section>`;

const resumo = `
  <section class="secao faixa" id="resumo" aria-labelledby="t-res">
    <div class="miolo">
      <p class="olho">Relatório</p>
      <h2 id="t-res">O curso em uma tabela</h2>
      <div class="tabela"><table>
        <thead><tr><th>Módulo</th><th>No fim, você tem</th><th class="n">Aulas</th><th class="n">Vídeo</th></tr></thead>
        <tbody>${A.modulos.map((m) => `
          <tr class="m${m.numero}"><td style="min-width:220px"><span class="bola-m">${m.numero}</span><b>${esc(m.nome)}</b></td><td>${esc(m.resultado)}</td><td class="n">${m.aulas.length}</td><td class="n">${fmt(m.minutos)}</td></tr>`).join('')}
        </tbody>
        <tfoot><tr><td>Total</td><td>${aulas.length} conquistas, as rotinas e o painel do escritório</td><td class="n">${aulas.length}</td><td class="n">${fmt(totalMin)}</td></tr></tfoot>
      </table></div>
    </div>
  </section>
  <footer class="faixa rodape"><div class="miolo">${esc(A.rodape)}</div></footer>`;

const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${Object.keys(I).map((k) => `<symbol id="i-${k}" viewBox="0 0 24 24">${I[k]}</symbol>`).join('')}</defs></svg>`;

const script = `
<script>
(function () {
  var CHAVE = 'agenda-ia-adv:feitas';
  var feitas = {};
  try { feitas = JSON.parse(localStorage.getItem(CHAVE) || '{}') || {}; } catch (e) { feitas = {}; }
  var botoes = [].slice.call(document.querySelectorAll('.feito'));
  var blocos = [].slice.call(document.querySelectorAll('[data-bloco]'));
  function atualizar() {
    var n = 0;
    botoes.forEach(function (b) {
      var a = b.getAttribute('data-aula'), on = !!feitas[a];
      if (on) n += 1;
      b.setAttribute('aria-pressed', String(on));
      b.closest('.aula').classList.toggle('feita', on);
      var j = document.querySelector('[data-janela="' + a + '"]'); if (j) j.classList.toggle('acesa', on);
      var m = document.querySelector('[data-medalha="' + a + '"]'); if (m) m.classList.toggle('ganha', on);
    });
    document.getElementById('janelas-acesas').textContent = n;
    document.getElementById('placar').textContent = n;
    var nb = 0;
    blocos.forEach(function (bl) { var on = !!feitas[bl.getAttribute('data-bloco')]; if (on) nb += 1; bl.classList.toggle('acesa', on); });
    var pb = document.getElementById('blocos-acesos'); if (pb) pb.textContent = nb;
  }
  botoes.forEach(function (b) {
    b.addEventListener('click', function () {
      var a = b.getAttribute('data-aula');
      feitas[a] = !feitas[a];
      try { localStorage.setItem(CHAVE, JSON.stringify(feitas)); } catch (e) {}
      atualizar();
    });
  });
  var pronto = document.getElementById('ver-pronto');
  pronto.addEventListener('click', function () {
    var on = pronto.getAttribute('aria-pressed') !== 'true';
    pronto.setAttribute('aria-pressed', String(on));
    document.getElementById('predio').classList.toggle('pronto', on);
    pronto.querySelector('span').textContent = on ? 'Voltar ao meu progresso' : 'Ver o prédio completo';
  });
  var verPainel = document.getElementById('ver-painel');
  if (verPainel) verPainel.addEventListener('click', function () {
    var on = verPainel.getAttribute('aria-pressed') !== 'true';
    verPainel.setAttribute('aria-pressed', String(on));
    document.getElementById('tela-painel').classList.toggle('pronto', on);
    verPainel.querySelector('span').textContent = on ? 'Voltar ao meu progresso' : 'Ver o painel ligado';
  });
  var itens = [].slice.call(document.querySelectorAll('.nav a.item'));
  var alvos = itens.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function marcar() {
    var y = window.scrollY + 120, atual = -1;
    alvos.forEach(function (s, i) { if (s && s.offsetTop <= y) atual = i; });
    itens.forEach(function (a, i) {
      if (i === atual) { a.setAttribute('aria-current', 'true'); } else { a.removeAttribute('aria-current'); }
    });
    if (atual >= 0 && itens[atual].scrollIntoView && window.innerWidth < 1080) {
      var ul = itens[atual].closest('ul');
      ul.scrollLeft = itens[atual].offsetLeft - 16;
    }
  }
  window.addEventListener('scroll', marcar, { passive: true });
  atualizar(); marcar();
})();
</script>`;

const cabeca = `<title>Agenda IA Aplicada a Advogados</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Source+Sans+3:wght@400;600;700&display=swap">
<style>${CSS}</style>`;

const corpo = `${sprite}${nav}${topo}
<main>${curso}${jornada}${sistema}${A.modulos.map(modulo).join('')}${conquistas}${final}${medicao}${ferramentas}${resumo}
</main>${script}`;

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
const cel = (t) => String(t || '').replace(/\|/g, '\\|');
const md = [`# ${A.titulo}`, '', `**${A.chamada}**`, '', A.apoio, '', `3 módulos · ${aulas.length} aulas · ${fmt(totalMin)} de vídeo · ${aulas.length} conquistas · ${nomesF.length} ferramentas`, '',
  'A página é [agenda-udemy.html](agenda-udemy.html). Ela e este arquivo saem de [agenda.json](agenda.json) pelo script [montar.js](montar.js) (`node montar.js`).', '',
  '## O curso', '', ...A.curso.map((c) => `- **${c.titulo}.** ${c.texto}`), '', '| Hoje | No fim do curso |', '|---|---|', ...A.antes_depois.map((x) => `| ${cel(x.antes)} | ${cel(x.depois)} |`), ''];
if (SIS) md.push(`## ${SIS.titulo}`, '', SIS.texto, '', '| Peça | O que faz | Aula |', '|---|---|---|', ...SIS.pecas.map((x) => `| ${cel(x.nome)} | ${cel(x.papel)} | ${x.aula} |`), '', `**${SIS.indicadores_titulo}** (${SIS.indicadores_nota.toLowerCase()})`, '', '| Indicador | Exemplo | Pergunta que responde |', '|---|---|---|', ...SIS.indicadores.map((k) => `| ${cel(k.nome)} | ${cel(k.exemplo)} | ${cel(k.pergunta)} |`), '', ...(SIS.nota ? [SIS.nota, ''] : []));
A.modulos.forEach((m) => {
  md.push(`## Módulo ${m.numero} · ${m.nome}`, '', `> "${m.dor}"`, '', ...(m.regra ? [`**${m.regra}**`, ''] : []), `**No fim do módulo:** ${m.resultado}`, '', `${m.aulas.length} aulas · ${fmt(m.minutos)} · Precisa de: ${m.precisa}`, '');
  if (m.painel) md.push(`### ${m.painel.titulo}`, '', m.painel.texto, '', '| Bloco | O que mostra | Liga na aula |', '|---|---|---|', ...m.painel.blocos.map((b) => `| ${cel(b.nome)} | ${cel(b.mostra)} | ${b.aula} |`), '', ...(m.painel.nota ? [m.painel.nota, ''] : []));
  md.push('| Aula | O que é | O que vamos apresentar | Conquista e missão | Ferramentas | Tempo |', '|---|---|---|---|---|---:|');
  m.aulas.forEach((a) => md.push(`| **${a.numero} ${cel(a.nome)}** | ${cel(a.o_que_e)} | ${a.roteiro.map((x, i) => `${i + 1}. ${cel(x)}`).join('<br>')} | ${cel(a.conquista)}<br>*Missão: ${cel(a.missao)}* | ${a.ferramentas.map(cel).join(', ')} | ${a.minutos} min |`));
  md.push('');
});
if ((A.aprofundamentos || []).length) md.push('## Aprofundamentos opcionais', '', ...A.aprofundamentos.map((x) => `- **${x.nome}.** ${x.texto} Ferramentas: ${x.ferramentas.join(', ')}. Precisa de: ${x.precisa}.`), '');
md.push(`## ${PF.titulo}`, '', PF.texto, '', ...PF.roteiro.map((r, i) => `${i + 1}. ${r.texto}`), '');
if (MED) md.push(`## ${MED.titulo}`, '', MED.texto, '', `| Indicador | Como medir | ${MED.antes || 'Antes'} | ${MED.depois || 'Depois'} |`, '|---|---|---|---|', ...MED.indicadores.map((x) => `| ${x.nome} | ${x.como} | | |`), '', MED.nota, '');
md.push('## Ferramentas incorporadas', '', '| Ferramenta | Para que serve | Plano | Módulos |', '|---|---|---|---|', ...nomesF.map((f) => `| ${f} | ${A.ferramentas[f].faz} | ${A.ferramentas[f].plano} | ${modulosDe(f).join(', ')} |`), '');
md.push('| Modelo do Claude | Perfil | Quando usar na advocacia |', '|---|---|---|', ...A.modelos.map((l) => `| ${l.modelo} | ${l.perfil} | ${l.usos} |`), '');
md.push('## Resumo', '', '| Módulo | No fim, você tem | Aulas | Vídeo |', '|---|---|---:|---:|', ...A.modulos.map((m) => `| ${m.numero} · ${m.nome} | ${cel(m.resultado)} | ${m.aulas.length} | ${fmt(m.minutos)} |`), `| **Total** | ${aulas.length} conquistas, as rotinas e o painel do escritório | ${aulas.length} | ${fmt(totalMin)} |`, '', A.rodape, '');
fs.writeFileSync(path.join(pasta, 'README.md'), md.join('\n'));

console.log(`Agenda montada: ${aulas.length} aulas, ${fmt(totalMin)} (${totalMin} min).`);
A.modulos.forEach((m) => console.log(`  Módulo ${m.numero}: ${m.aulas.length} aulas, ${m.minutos} min`));
