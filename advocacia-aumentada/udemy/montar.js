#!/usr/bin/env node
/* Monta a agenda do curso a partir de agenda.json.

   Uso:  node montar.js [dados.json] [--artefato caminho.html]

   Gera, na pasta do arquivo de dados:
     agenda-udemy.html   página completa, abre em qualquer navegador
     README.md           espelho em texto
   Com --artefato, grava também a versão sem <html>/<head>/<body>, usada para publicar a página.
   O script confere somas, números de sessão, ferramentas e cobertura, e interrompe se algo não fechar. */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const iArt = args.indexOf('--artefato');
const saidaArtefato = iArt >= 0 ? args[iArt + 1] : null;
const entrada = path.resolve(args.find((a, i) => !a.startsWith('--') && (iArt < 0 || i !== iArt + 1)) || path.join(__dirname, 'agenda.json'));
const pastaSaida = path.dirname(entrada);
const A = JSON.parse(fs.readFileSync(entrada, 'utf8'));

// ---------- vocabulário ----------
const GANHOS = { apresentacao: 'Apresentação', organizacao: 'Organização', clientela: 'Clientela' };
const FERRAMENTAS = {
  'IA (conversa)': { filtro: 'ia', rotulo: 'IA' }, 'IA (API)': { filtro: 'ia', rotulo: 'IA' },
  Planilhas: { filtro: 'planilhas', rotulo: 'Planilhas' }, 'Formulários': { filtro: 'formularios', rotulo: 'Formulários' },
  Docs: { filtro: 'docs', rotulo: 'Docs' }, Gmail: { filtro: 'gmail', rotulo: 'Gmail' }, Agenda: { filtro: 'agenda', rotulo: 'Agenda' },
  Drive: { filtro: 'drive', rotulo: 'Drive' }, 'Apps Script': { filtro: 'apps-script', rotulo: 'Apps Script' }, Painel: { filtro: 'painel', rotulo: 'Painel' },
};
const FRENTES = {
  planilhas: ['Planilhas', 'planilha'], paineis: ['Painéis', 'painel'], apps_script: ['Google Apps Script', 'script'],
  automacao_email: ['Automação de e-mail', 'email'], automacao_agenda: ['Automação de agenda', 'agenda'],
  automacao_analise_contrato: ['Análise de contrato automatizada', 'contrato'], analise_riscos: ['Análise de riscos', 'escudo'],
  gestao_casos: ['Gestão de casos', 'lista'], plataforma_contratos: ['Plataforma de contratos', 'contrato'],
  plataforma_clientes: ['Plataforma de clientes', 'formulario'],
};
const SIMBOLOS = {
  pagina: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4.5"/>',
  painel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7.5 16v-3M12 16V8.5M16.5 16v-5"/>',
  planilha: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9.5h18M3 14.8h18M9 4v16M15 4v16"/>',
  script: '<path d="M8.5 8L4.5 12l4 4M15.5 8l4 4-4 4M13.5 5.5l-3 13"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.6 6.6L12 13l8.4-6.4"/>',
  agenda: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4M7.5 14h2.5M13.8 14h2.7M7.5 17.4h2.5"/>',
  formulario: '<rect x="4" y="3" width="16" height="18" rx="2"/><rect x="7.5" y="7" width="3" height="3" rx=".5"/><path d="M13 8.5h3.5M7.5 14h9M7.5 17.5h6"/>',
  contrato: '<path d="M6 3h8.5L19 7.5V21H6z"/><path d="M14.5 3v4.5H19M9 11h7M9 14.3h7M9 18c.9-1.4 1.9-1.4 2.8 0s1.9 1.4 2.8 0"/>',
  lista: '<path d="M4 6.5l1.6 1.6L8.4 5.3M4 12.5l1.6 1.6 2.8-2.8M4 18.5l1.6 1.6 2.8-2.8M12 7h8M12 13h8M12 19h8"/>',
  tempo: '<path d="M3 12h18M6 12V7.5M12 12v4.5M18 12V7.5"/><circle cx="6" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="18" cy="12" r="1.7"/>',
  mensagem: '<path d="M5 4.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4.5 3.5V16.5H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"/><path d="M7.5 9h9M7.5 12.5h5.5"/>',
  cartao: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="8" cy="11" r="1.8"/><path d="M12.5 10.5H18M12.5 14h4M6 15h4"/>',
  calculo: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7.5h8M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01"/>',
  slides: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4M8.5 20h7M7 12.5l3-3 2.5 2 4.5-4.5"/>',
  escudo: '<path d="M12 3l7 2.6v5.3c0 4.4-2.9 8.1-7 9.6-4.1-1.5-7-5.2-7-9.6V5.6L12 3z"/><path d="M9 11.8l2.1 2.1L15 10"/>',
  funil: '<path d="M4 5h16l-6 7v6l-4 2v-8L4 5z"/>',
  lupa: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5M8.2 10.7l1.7 1.7 2.9-3.1"/>',
  molde: '<path d="M8 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2M9 9h6M9 12h6M9 15h3.5"/>',
  sozinho: '<path d="M20 12a8 8 0 1 1-2.35-5.65"/><path d="M20 4.5v4h-4"/><path d="M12 8v4l2.6 2.4"/>',
};

// ---------- conferência ----------
const erros = [];
if (A.modulos.length !== 3) erros.push('A agenda precisa de exatamente 3 módulos.');
const numeros = new Set();
A.modulos.forEach((m) => {
  m.minutos = m.sessoes.reduce((t, s) => t + s.minutos, 0);
  m.sessoes.forEach((s) => {
    ['numero', 'nome', 'dor', 'o_que_constroi', 'entregavel', 'ganho'].forEach((c) => { if (!s[c]) erros.push(`Sessão ${s.numero || '?'} sem "${c}".`); });
    if (!Number.isInteger(s.minutos) || s.minutos < 3 || s.minutos > 20) erros.push(`Sessão ${s.numero}: minutos fora do intervalo (${s.minutos}).`);
    if (numeros.has(s.numero)) erros.push(`Sessão ${s.numero} repetida.`);
    numeros.add(s.numero);
    if (!String(s.numero).startsWith(m.numero + '.')) erros.push(`Sessão ${s.numero} está no módulo ${m.numero}.`);
    (s.ganhos || []).forEach((g) => { if (!GANHOS[g]) erros.push(`Sessão ${s.numero}: ganho desconhecido "${g}".`); });
    (s.ferramentas || []).forEach((f) => { if (!FERRAMENTAS[f]) erros.push(`Sessão ${s.numero}: ferramenta desconhecida "${f}".`); });
    if (s.peca && !SIMBOLOS[s.peca]) erros.push(`Sessão ${s.numero}: peça desconhecida "${s.peca}".`);
  });
});
(A.mapa_dores || []).forEach((d) => d.sessoes.forEach((n) => { if (!numeros.has(n)) erros.push(`Mapa de dores cita a sessão ${n}, que não existe.`); }));
(A.cobertura || []).forEach((c) => {
  if (!FRENTES[c.frente] && !GANHOS[c.frente]) erros.push(`Cobertura: frente desconhecida "${c.frente}".`);
  c.sessoes.forEach((n) => { if (!numeros.has(n)) erros.push(`Cobertura de ${c.frente} cita a sessão ${n}, que não existe.`); });
});
if ((A.cobertura || []).length) {
  Object.keys(FRENTES).forEach((f) => {
    const c = A.cobertura.find((x) => x.frente === f);
    if (!c || !c.sessoes.length) erros.push(`Nenhuma sessão cobre "${FRENTES[f][0]}".`);
  });
}
const totalMin = A.modulos.reduce((t, m) => t + m.minutos, 0);
const todas = A.modulos.flatMap((m) => m.sessoes);
const totalSessoes = todas.length;
const totalAuto = todas.filter((s) => (s.automacao || '').trim()).length;
if (totalMin > 480) erros.push(`O curso passa de 8 horas (${totalMin} min).`);
if (erros.length) { console.error('A agenda não fecha:\n- ' + erros.join('\n- ')); process.exit(1); }

// ---------- utilidades ----------
const esc = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (min) => { const h = Math.floor(min / 60), m = min % 60; return h ? `${h} h${m ? ' ' + String(m).padStart(2, '0') + ' min' : ''}` : `${m} min`; };
const idSessao = (n) => 's-' + String(n).replace('.', '-');
const ico = (nome, classe = 'ico') => `<svg class="${classe}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-${nome}"/></svg>`;
const etiquetas = (s) => [...new Set([...(s.ganhos || []), ...(s.ferramentas || []).map((f) => FERRAMENTAS[f].filtro)])];
const conta = (chave) => todas.filter((s) => etiquetas(s).includes(chave)).length;
const ferramentasDaSessao = (s) => [...new Set((s.ferramentas || []).map((f) => (f === 'IA (API)' ? 'IA pela API' : FERRAMENTAS[f].rotulo)))];
const chipSessao = (n) => `<a class="c${String(n).split('.')[0]}" href="#${idSessao(n)}">${esc(n)}</a>`;

// ---------- estilo ----------
const CSS = `
/* Layout: uma coluna. No topo, a caixa de ferramentas mostra onde cada frente é ensinada.
   Cada módulo é um bloco de cor com a dor maior, sobre uma folha de sessões em três tempos:
   a dor, o que você constrói (e o que passa a rodar sozinho), o que você ganha. */
:root {
  --mesa: #F3EFEE; --folha: #FFFFFF; --folha-2: #F8F5F4; --linha: #DED7D5; --linha-forte: #8E8684;
  --tinta: #161B2C; --tinta-2: #535A6C;
  --azul: #27468C; --azul-suave: #EAF0FB; --rubi: #9D1A30; --rubi-suave: #F9EBED; --latao: #7D5A14; --latao-suave: #F6EEDC;
  --verde: #1D6A49; --verde-suave: #E5F3EC;
  --sobre-cor: #FFFFFF;
  --f-titulo: "Libre Caslon Display", "Libre Caslon Text", Georgia, serif;
  --f-serif: "Libre Caslon Text", Georgia, "Times New Roman", serif;
  --f-texto: "Source Sans 3", "Source Sans Pro", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --mesa: #0F131D; --folha: #171C29; --folha-2: #1E2433; --linha: #2C3345; --linha-forte: #6C7590;
    --tinta: #F0EAE5; --tinta-2: #A8AEBE;
    --azul: #9DB6F2; --azul-suave: #1A2440; --rubi: #F2798C; --rubi-suave: #37151E; --latao: #D9B466; --latao-suave: #2E2410;
    --verde: #6FCB9F; --verde-suave: #12301F;
    --sobre-cor: #10141E; color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --mesa: #0F131D; --folha: #171C29; --folha-2: #1E2433; --linha: #2C3345; --linha-forte: #6C7590;
  --tinta: #F0EAE5; --tinta-2: #A8AEBE;
  --azul: #9DB6F2; --azul-suave: #1A2440; --rubi: #F2798C; --rubi-suave: #37151E; --latao: #D9B466; --latao-suave: #2E2410;
  --verde: #6FCB9F; --verde-suave: #12301F;
  --sobre-cor: #10141E; color-scheme: dark;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--mesa); color: var(--tinta); font-family: var(--f-texto); font-size: 16px; line-height: 1.5; -webkit-font-smoothing: antialiased; }
h1, h2, h3, p, dl, dd, ul, ol, blockquote { margin: 0; }
ul, ol { padding: 0; list-style: none; }
img { max-width: 100%; }
[hidden] { display: none !important; }
a { color: inherit; }
:focus-visible { outline: 2px solid var(--rubi); outline-offset: 3px; }
.pagina { max-width: 1120px; margin: 0 auto; padding-block: 44px 72px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: flex; flex-direction: column; gap: 40px; }
.rotulo { font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--tinta-2); line-height: 1.3; }
.ico { width: 20px; height: 20px; flex: none; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }

.abre { display: flex; flex-direction: column; gap: 18px; }
.abre h1 { font-family: var(--f-titulo); font-weight: 400; font-size: clamp(2.2rem, 5.6vw, 3.6rem); line-height: 1.04; letter-spacing: -.012em; text-wrap: balance; }
.abre .sub { font-family: var(--f-serif); font-style: italic; font-size: clamp(1.05rem, 2vw, 1.25rem); color: var(--tinta-2); margin-top: -8px; }
.promessa { font-family: var(--f-serif); font-size: clamp(1.06rem, 2vw, 1.26rem); line-height: 1.5; max-width: 64ch; }
.fatos { display: grid; grid-template-columns: repeat(auto-fit, minmax(128px, 1fr)); border-block: 1px solid var(--linha); }
.fatos div { padding: 12px 16px 12px 0; display: flex; flex-direction: column; gap: 2px; }
.fatos dd { font-family: var(--f-serif); font-size: 1.5rem; font-weight: 700; line-height: 1.25; font-variant-numeric: tabular-nums; }
.compasso { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 10px; color: var(--tinta-2); font-size: .97rem; }
.compasso b { color: var(--tinta); font-weight: 700; }
.compasso i { font-style: normal; color: var(--linha-forte); }
.jogo { color: var(--tinta-2); font-size: .97rem; max-width: 72ch; margin-top: -8px; }

.bloco h2 { font-family: var(--f-titulo); font-weight: 400; font-size: clamp(1.5rem, 3vw, 1.9rem); line-height: 1.15; text-wrap: balance; }
.bloco > p { margin-top: 8px; color: var(--tinta-2); max-width: 72ch; }

.caixa { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 32px; margin-top: 16px; border-top: 1px solid var(--linha); }
.caixa li { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px 0; border-bottom: 1px solid var(--linha); min-width: 0; }
.caixa .frente { display: flex; align-items: center; gap: 10px; font-weight: 600; min-width: 0; }
.caixa .frente .ico { color: var(--tinta-2); }
.chips { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }
.chips a { font-size: .8rem; font-weight: 700; font-variant-numeric: tabular-nums; text-decoration: none; padding: 3px 10px; border-radius: 999px; border: 1px solid currentColor; }
.chips .c1 { color: var(--azul); } .chips .c2 { color: var(--rubi); } .chips .c3 { color: var(--latao); }
.legenda { display: flex; flex-wrap: wrap; gap: 6px 18px; margin-top: 12px; font-size: .86rem; color: var(--tinta-2); }
.legenda span::before { content: ""; display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; vertical-align: -1px; background: var(--cor); }

.filtro { display: flex; flex-direction: column; gap: 10px; }
.filtro .linha-f { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.filtro .rotulo { min-width: 132px; }
.filtro button { font: inherit; font-size: .9rem; font-weight: 600; line-height: 1.2; padding: 7px 13px; border-radius: 999px; border: 1px solid var(--linha-forte); background: transparent; color: var(--tinta); cursor: pointer; }
.filtro button span { font-weight: 400; margin-left: 6px; font-variant-numeric: tabular-nums; color: var(--tinta-2); }
.filtro button[aria-pressed="true"] { background: var(--tinta); color: var(--mesa); border-color: var(--tinta); }
.filtro button[aria-pressed="true"] span { color: inherit; }
.filtro output { font-size: .88rem; color: var(--tinta-2); }

.modulo { display: flex; flex-direction: column; border: 1px solid var(--linha); border-radius: 6px; overflow: hidden; background: var(--folha); }
.m1 { --cor: var(--azul); --cor-suave: var(--azul-suave); }
.m2 { --cor: var(--rubi); --cor-suave: var(--rubi-suave); }
.m3 { --cor: var(--latao); --cor-suave: var(--latao-suave); }
.modulo-cab { background: var(--cor); color: var(--sobre-cor); display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 1fr); gap: 30px; padding: 28px; }
.modulo-cab .rotulo { color: inherit; opacity: .85; }
.modulo-cab h2 { font-family: var(--f-titulo); font-weight: 400; font-size: clamp(1.7rem, 3.2vw, 2.3rem); line-height: 1.08; margin-top: 8px; text-wrap: balance; }
.modulo-cab .para { margin-top: 10px; font-size: .93rem; }
.fala { font-family: var(--f-serif); font-style: italic; font-size: clamp(1.15rem, 2.1vw, 1.42rem); line-height: 1.38; margin-top: 8px; text-wrap: pretty; }
.leva .sistema { display: flex; gap: 10px; align-items: flex-start; font-weight: 700; font-size: 1.08rem; line-height: 1.3; margin-top: 8px; }
.leva .sistema .ico { margin-top: 2px; }
.leva .ganho { margin-top: 8px; font-size: .93rem; }
.leva .conta { margin-top: 12px; padding-top: 10px; border-top: 1px solid currentColor; font-size: .86rem; font-variant-numeric: tabular-nums; }

.trilho-cab, .sessao { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr) minmax(0, 1.5fr) minmax(0, 1.05fr); column-gap: 30px; }
.trilho-cab { padding: 11px 28px; background: var(--folha-2); border-bottom: 1px solid var(--linha); }
.sessao { padding: 20px 28px; border-top: 1px solid var(--linha); scroll-margin-top: 16px; transition: opacity .2s; }
.trilho-cab + .sessao { border-top: 0; }
.sessao.fora { opacity: .25; }
.sessao:target { background: var(--cor-suave); }
.s-num { font-family: var(--f-serif); font-weight: 700; font-size: .98rem; color: var(--cor); font-variant-numeric: tabular-nums; }
.s-id h3 { font-size: 1.03rem; font-weight: 700; line-height: 1.3; margin-top: 2px; text-wrap: balance; }
.s-meta { display: flex; flex-wrap: wrap; gap: 4px 10px; margin-top: 8px; font-size: .84rem; color: var(--tinta-2); }
.s-min { font-variant-numeric: tabular-nums; font-weight: 700; color: var(--tinta); }
.s-ferr { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
.s-ferr span { font-size: .74rem; font-weight: 600; color: var(--tinta-2); background: var(--folha-2); border: 1px solid var(--linha); border-radius: 3px; padding: 1px 6px; }
.s-req { margin-top: 8px; font-size: .82rem; color: var(--tinta-2); }
.s-dor { font-family: var(--f-serif); font-style: italic; font-size: 1.04rem; line-height: 1.45; text-wrap: pretty; }
.s-faz, .s-ganho { position: relative; min-width: 0; }
.s-faz::before, .s-ganho::before { content: "\\2192"; position: absolute; left: -22px; top: 0; color: var(--linha-forte); }
.s-faz p, .s-ganho p { font-size: .95rem; }
.s-auto { display: flex; gap: 8px; align-items: flex-start; margin-top: 10px; padding: 8px 10px; border-radius: 4px; background: var(--verde-suave); color: var(--verde); font-size: .9rem !important; font-weight: 600; line-height: 1.4; }
.s-auto .ico { width: 18px; height: 18px; margin-top: 1px; }
.peca { display: inline-flex; align-items: center; gap: 7px; margin-top: 10px; padding: 5px 11px 5px 8px; border-radius: 4px; background: var(--cor-suave); color: var(--cor); font-weight: 700; font-size: .9rem !important; line-height: 1.25; }
.peca .ico { width: 18px; height: 18px; }
.s-pratica { margin-top: 10px; font-size: .86rem !important; color: var(--tinta-2); }
.s-pratica b { color: var(--tinta); font-weight: 700; }
.s-cuidado { margin-top: 6px; font-size: .86rem !important; color: var(--tinta-2); }
.s-ganho .s-frase { font-weight: 600; }
.s-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.s-tags span { font-size: .68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--tinta-2); border: 1px solid var(--linha); border-radius: 3px; padding: 2px 6px; }
.rot-m { display: none; }

.mapa-lista { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); column-gap: 30px; margin-top: 16px; border-top: 1px solid var(--linha); }
.mapa-lista li { display: flex; flex-direction: column; gap: 8px; padding: 14px 0; border-bottom: 1px solid var(--linha); }
.mapa-lista q { font-family: var(--f-serif); font-style: italic; quotes: "\\201C" "\\201D"; }
.mapa-lista .chips { justify-content: flex-start; }
.notas { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px 32px; border-top: 1px solid var(--linha); padding-top: 24px; }
.notas h3 { font-size: .95rem; font-weight: 700; }
.notas ul { margin-top: 8px; display: flex; flex-direction: column; gap: 6px; }
.notas li { font-size: .92rem; color: var(--tinta-2); padding-left: 14px; position: relative; }
.notas li::before { content: ""; position: absolute; left: 0; top: .62em; width: 5px; height: 5px; border-radius: 50%; background: var(--linha-forte); }
.rodape { font-size: .84rem; color: var(--tinta-2); }
.relatorio { border-top: 2px solid var(--tinta); padding-top: 28px; }
.tabela { overflow-x: auto; margin-top: 16px; background: var(--folha); border: 1px solid var(--linha); border-radius: 6px; }
.tabela table { width: 100%; min-width: 680px; border-collapse: collapse; font-size: .93rem; }
.tabela th, .tabela td { text-align: left; vertical-align: top; padding: 11px 14px; border-bottom: 1px solid var(--linha); }
.tabela th { font-size: .7rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--tinta-2); background: var(--folha-2); }
.tabela .n { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
.tabela tfoot td { font-weight: 700; border-bottom: 0; }
.tabela .mudo { color: var(--tinta-2); font-size: .85rem; }
.rel-fatos { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 0 24px; margin-top: 18px; border-top: 1px solid var(--linha); }
.rel-fatos div { padding: 12px 0; border-bottom: 1px solid var(--linha); display: flex; flex-direction: column; gap: 3px; }
.rel-fatos dd { font-weight: 600; }
.rel-leva { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px 32px; margin-top: 20px; }
.rel-leva h3 { font-size: .95rem; font-weight: 700; }
.rel-leva p { margin-top: 6px; font-size: .92rem; color: var(--tinta-2); }

@media (max-width: 900px) {
  .pagina { padding-block: 28px 56px; gap: 32px; }
  .caixa { grid-template-columns: minmax(0, 1fr); }
  .modulo-cab { grid-template-columns: minmax(0, 1fr); gap: 20px; padding: 22px 18px; }
  .trilho-cab { display: none; }
  .sessao { grid-template-columns: minmax(0, 1fr); row-gap: 14px; padding: 20px 18px; }
  .rot-m { display: block; margin-bottom: 4px; }
  .s-faz::before, .s-ganho::before { display: none; }
  .filtro .rotulo { min-width: 0; width: 100%; }
}
@media (prefers-reduced-motion: reduce) { .sessao { transition: none; } }
`;

// ---------- página ----------
function sessao(s) {
  const tags = (s.ganhos || []).map((g) => `<span>${GANHOS[g]}</span>`).join('');
  const ferr = ferramentasDaSessao(s).map((f) => `<span>${esc(f)}</span>`).join('');
  return `
      <article class="sessao" id="${idSessao(s.numero)}" role="listitem" data-tags="${etiquetas(s).join(' ')}">
        <div class="s-id">
          <span class="s-num">${esc(s.numero)}</span>
          <h3>${esc(s.nome)}</h3>
          <p class="s-meta"><span class="s-min">${s.minutos} min</span></p>${ferr ? `
          <p class="s-ferr">${ferr}</p>` : ''}${s.requisito ? `
          <p class="s-req">Precisa de: ${esc(s.requisito)}</p>` : ''}
        </div>
        <div class="s-d"><span class="rotulo rot-m">A dor</span><p class="s-dor">“${esc(s.dor)}”</p></div>
        <div class="s-faz"><span class="rotulo rot-m">O que você constrói</span>
          <p>${esc(s.o_que_constroi)}</p>${(s.automacao || '').trim() ? `
          <p class="s-auto">${ico('sozinho')}<span>Passa a rodar sozinho: ${esc(s.automacao)}</span></p>` : ''}
          <p class="peca">${ico(s.peca || 'pagina')}<span>${esc(s.entregavel)}</span></p>${s.pratica ? `
          <p class="s-pratica"><b>${esc(s.pratica)}.</b> ${esc(s.dinamica || '')}</p>` : (s.dinamica ? `
          <p class="s-pratica">${esc(s.dinamica)}</p>` : '')}${s.cuidado ? `
          <p class="s-cuidado">Cuidado: ${esc(s.cuidado)}</p>` : ''}
        </div>
        <div class="s-ganho"><span class="rotulo rot-m">O que você ganha</span>
          <p class="s-frase">${esc(s.ganho)}</p>${tags ? `
          <p class="s-tags">${tags}</p>` : ''}
        </div>
      </article>`;
}

function modulo(m) {
  const autos = m.sessoes.filter((s) => (s.automacao || '').trim()).length;
  return `
  <section class="modulo m${m.numero}" id="modulo-${m.numero}" aria-labelledby="m${m.numero}-t">
    <header class="modulo-cab">
      <div>
        <p class="rotulo">Módulo ${m.numero} · ${esc(m.nivel)}${m.eixo ? ' · ' + esc(m.eixo) : ''}</p>
        <h2 id="m${m.numero}-t">${esc(m.nome)}</h2>
        <p class="para">${esc(m.para_quem)}</p>
      </div>
      <blockquote>
        <p class="rotulo">A dor do módulo</p>
        <p class="fala">“${esc(m.dor_do_modulo)}”</p>
      </blockquote>
      <div class="leva">
        <p class="rotulo">Você constrói e leva</p>
        <p class="sistema">${ico(m.peca_sistema || 'painel')}<span>${esc(m.sistema)}</span></p>
        <p class="ganho">${esc(m.ganho_do_modulo)}</p>
        <p class="conta">${m.sessoes.length} sessões · ${fmt(m.minutos)}${autos ? ` · ${autos} ${autos === 1 ? 'automação' : 'automações'}` : ''} · ${esc(m.requisitos)}</p>
      </div>
    </header>
    <div role="list">
      <div class="trilho-cab" aria-hidden="true"><span class="rotulo">Sessão</span><span class="rotulo">A dor</span><span class="rotulo">O que você constrói</span><span class="rotulo">O que você ganha</span></div>${m.sessoes.map(sessao).join('')}
    </div>
  </section>`;
}

const caixa = !(A.cobertura || []).length ? '' : `
  <section class="bloco" aria-labelledby="caixa-t">
    <h2 id="caixa-t">${esc(A.caixa_titulo || 'A caixa de ferramentas do escritório')}</h2>
    <p>${esc(A.caixa_texto || 'Onde cada frente é ensinada. Toque no número para ir à sessão.')}</p>
    <ul class="caixa">${Object.keys(FRENTES).map((f) => {
      const c = A.cobertura.find((x) => x.frente === f);
      return `
      <li><span class="frente">${ico(FRENTES[f][1])}<span>${FRENTES[f][0]}</span></span><span class="chips">${c.sessoes.map(chipSessao).join('')}</span></li>`;
    }).join('')}
    </ul>
    <p class="legenda">${A.modulos.map((m) => `<span class="m${m.numero}">Módulo ${m.numero} · ${esc(m.nome)}</span>`).join('')}</p>
  </section>`;

const botoesGanho = Object.keys(GANHOS).map((g) => `<button type="button" id="ver-${g}" data-filtro="${g}" aria-pressed="false">${GANHOS[g]}<span>${conta(g)}</span></button>`).join('\n      ');
const filtrosFerr = [...new Set(Object.values(FERRAMENTAS).map((f) => f.filtro))].filter((k) => conta(k) > 0);
const rotuloFiltro = (k) => Object.values(FERRAMENTAS).find((f) => f.filtro === k).rotulo;
const botoesFerr = filtrosFerr.map((k) => `<button type="button" id="ver-${k}" data-filtro="${k}" aria-pressed="false">${rotuloFiltro(k)}<span>${conta(k)}</span></button>`).join('\n      ');
const temFiltro = todas.some((s) => etiquetas(s).length);
const filtro = !temFiltro ? '' : `
  <div class="filtro" role="group" aria-label="Destacar sessões">
    <div class="linha-f">
      <span class="rotulo">Ver por ganho</span>
      <button type="button" id="ver-tudo" data-filtro="tudo" aria-pressed="true">Tudo<span>${totalSessoes}</span></button>
      ${botoesGanho}
    </div>${botoesFerr ? `
    <div class="linha-f">
      <span class="rotulo">Ver por ferramenta</span>
      ${botoesFerr}
    </div>` : ''}
    <output id="filtro-status" aria-live="polite"></output>
  </div>`;

const mapa = !(A.mapa_dores || []).length ? '' : `
  <section class="bloco" aria-labelledby="mapa-t">
    <h2 id="mapa-t">${esc(A.mapa_titulo || 'A mesma dor volta em mais de uma sessão')}</h2>
    <p>${esc(A.mapa_texto || 'A relação não é de um para um: uma dor grande pede mais de uma peça, e uma peça boa alivia mais de uma dor.')}</p>
    <ul class="mapa-lista">${A.mapa_dores.map((d) => `
      <li><q>${esc(d.dor)}</q><span class="chips">${d.sessoes.map(chipSessao).join('')}</span></li>`).join('')}
    </ul>
  </section>`;

// ---------- relatório simples ----------
const comFerr = (f) => todas.filter((s) => (s.ferramentas || []).includes(f));
const sessoesApi = comFerr('IA (API)').map((s) => s.numero);
const nIA = todas.filter((s) => (s.ferramentas || []).some((f) => f.startsWith('IA'))).length;
const frentesCobertas = Object.keys(FRENTES).filter((f) => ((A.cobertura || []).find((x) => x.frente === f) || { sessoes: [] }).sessoes.length).length;
const primeiro = A.modulos[0].sessoes[0];
const REL = {
  modulos: A.modulos.map((m) => ({ m, autos: m.sessoes.filter((s) => (s.automacao || '').trim()).length })),
  fatos: [
    ['Frentes pedidas cobertas', `${frentesCobertas} de ${Object.keys(FRENTES).length}`],
    ['Primeiro resultado', `no minuto ${primeiro.minutos}`],
    ['Sessões com Apps Script', String(comFerr('Apps Script').length)],
    ['Sessões com IA', String(nIA)],
    ['Pedem chave de API', sessoesApi.length ? `${sessoesApi.join(' e ')}, com caminho sem chave` : 'nenhuma'],
  ],
};
const relatorio = `
  <section class="bloco relatorio" aria-labelledby="rel-t">
    <h2 id="rel-t">Relatório da agenda</h2>
    <p>O curso em uma tela: o que cada módulo entrega, quanto dura e do que o aluno precisa.</p>
    <div class="tabela"><table>
      <thead><tr><th>Módulo</th><th>O aluno leva</th><th class="n">Sessões</th><th class="n">Vídeo</th><th class="n">Automações</th><th>Precisa de</th></tr></thead>
      <tbody>${REL.modulos.map(({ m, autos }) => `
        <tr><td><b>${m.numero} · ${esc(m.nome)}</b><br><span class="mudo">${esc(m.nivel)}</span></td><td>${esc(m.sistema)}</td><td class="n">${m.sessoes.length}</td><td class="n">${fmt(m.minutos)}</td><td class="n">${autos}</td><td>${esc(m.requisitos)}</td></tr>`).join('')}
      </tbody>
      <tfoot><tr><td>Total</td><td>3 sistemas</td><td class="n">${totalSessoes}</td><td class="n">${fmt(totalMin)}</td><td class="n">${totalAuto}</td><td></td></tr></tfoot>
    </table></div>
    <dl class="rel-fatos">${REL.fatos.map(([k, v]) => `<div><dt class="rotulo">${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <div class="rel-leva">${A.modulos.map((m) => `
      <div><h3>No módulo ${m.numero}, o aluno sai com</h3><p>${m.sessoes.map((s) => esc(s.entregavel)).join(' · ')}</p></div>`).join('')}
    </div>
  </section>`;

const N = A.notas || {};
const NOTAS = [['precisa', 'O que o aluno precisa'], ['cuidados', 'Regras que valem para tudo'], ['extras', 'Para ir além, fora da minutagem'], ['producao', 'O que falta para gravar']];
const notas = !Object.keys(N).length ? '' : `
  <section class="notas" aria-label="Notas da agenda">${NOTAS.filter(([k]) => (N[k] || []).length).map(([k, t]) => `
    <div><h3>${t}</h3><ul>${N[k].map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}
  </section>`;

const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${Object.keys(SIMBOLOS).map((k) => `<symbol id="i-${k}" viewBox="0 0 24 24">${SIMBOLOS[k]}</symbol>`).join('')}</defs></svg>`;

const script = !temFiltro ? '' : `
<script>
(function () {
  var botoes = [].slice.call(document.querySelectorAll('.filtro button'));
  var sessoes = [].slice.call(document.querySelectorAll('.sessao'));
  var status = document.getElementById('filtro-status');
  function aplicar(f, nome) {
    var n = 0;
    sessoes.forEach(function (s) {
      var dentro = f === 'tudo' || (' ' + s.getAttribute('data-tags') + ' ').indexOf(' ' + f + ' ') >= 0;
      s.classList.toggle('fora', !dentro);
      if (dentro) n += 1;
    });
    botoes.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filtro') === f)); });
    status.textContent = f === 'tudo' ? '' : n + ' de ' + sessoes.length + ' sessões com ' + nome;
  }
  botoes.forEach(function (b) {
    b.addEventListener('click', function () { aplicar(b.getAttribute('data-filtro'), b.firstChild.textContent.trim()); });
  });
})();
</script>`;

const cabeca = `<title>${esc(A.titulo_da_pagina || 'Agenda IA Aplicada a Advogados')}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@400;600;700&display=swap">
<style>${CSS}</style>`;

const corpo = `${sprite}
<main class="pagina">
  <header class="abre">
    <p class="rotulo">${esc(A.rotulo || 'Curso gravado · Agenda')}</p>
    <h1>${esc(A.titulo)}</h1>${A.subtitulo ? `
    <p class="sub">${esc(A.subtitulo)}</p>` : ''}
    <p class="promessa">${esc(A.promessa)}</p>
    <dl class="fatos">
      <div><dt class="rotulo">Módulos</dt><dd>3</dd></div>
      <div><dt class="rotulo">Sessões</dt><dd>${totalSessoes}</dd></div>
      <div><dt class="rotulo">Vídeo</dt><dd>${fmt(totalMin)}</dd></div>
      <div><dt class="rotulo">Automações</dt><dd>${totalAuto}</dd></div>
      <div><dt class="rotulo">Sistemas</dt><dd>3</dd></div>
    </dl>
    <p class="compasso"><span>Toda sessão anda em três tempos:</span> <b>a dor</b> <i>→</i> <b>o que você constrói</b> <i>→</i> <b>o que você ganha</b></p>${A.pratica_texto ? `
    <p class="jogo">${esc(A.pratica_texto)}</p>` : ''}
  </header>
${caixa}
${filtro}
${A.modulos.map(modulo).join('\n')}
${mapa}
${notas}
${relatorio}
  <p class="rodape">${esc(A.rodape || '')}</p>
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
fs.writeFileSync(path.join(pastaSaida, 'agenda-udemy.html'), pagina);
if (saidaArtefato) fs.writeFileSync(saidaArtefato, cabeca + '\n' + corpo + '\n');

// ---------- espelho em texto ----------
const cel = (t) => String(t || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const md = [];
md.push(`# ${A.titulo}`, '');
if (A.subtitulo) md.push(`*${A.subtitulo}*`, '');
md.push(`**${A.rotulo || 'Curso gravado · Agenda'}** · 3 módulos · ${totalSessoes} sessões · ${fmt(totalMin)} de vídeo · ${totalAuto} automações · um sistema por módulo`, '', A.promessa, '');
md.push('A página da agenda é [agenda-udemy.html](agenda-udemy.html). Este arquivo é o espelho em texto; os dois saem de [agenda.json](agenda.json) pelo script [montar.js](montar.js) (`node montar.js`).', '');
md.push('Toda sessão anda em três tempos: **a dor** → **o que você constrói** → **o que você ganha**.', '');
if ((A.cobertura || []).length) {
  md.push(`## ${A.caixa_titulo || 'A caixa de ferramentas do escritório'}`, '', '| Frente | Sessões |', '|---|---|');
  Object.keys(FRENTES).forEach((f) => { const c = A.cobertura.find((x) => x.frente === f); md.push(`| ${FRENTES[f][0]} | ${c.sessoes.join(', ')} |`); });
  md.push('');
}
A.modulos.forEach((m) => {
  md.push(`## Módulo ${m.numero} · ${m.nivel}${m.eixo ? ' · ' + m.eixo : ''} · ${m.nome}`, '');
  md.push(`- **A dor do módulo:** "${m.dor_do_modulo}"`, `- **Você constrói e leva:** ${m.sistema}`, `- **O que muda:** ${m.ganho_do_modulo}`, `- **Para quem:** ${m.para_quem}`, `- **Precisa de:** ${m.requisitos}`, `- **Tamanho:** ${m.sessoes.length} sessões, ${fmt(m.minutos)}`, '');
  md.push('| Sessão | A dor | O que você constrói e leva | O que você ganha | Ferramentas | Min |', '|---|---|---|---|---|---:|');
  m.sessoes.forEach((s) => {
    const faz = [cel(s.o_que_constroi), (s.automacao || '').trim() ? `Passa a rodar sozinho: ${cel(s.automacao)}` : '', `**Leva:** ${cel(s.entregavel)}`, s.pratica ? `*${cel(s.pratica)}.*` : '', s.cuidado ? `Cuidado: ${cel(s.cuidado)}` : ''].filter(Boolean).join('<br>');
    md.push(`| **${s.numero} ${cel(s.nome)}** | "${cel(s.dor)}" | ${faz} | ${cel(s.ganho)} | ${cel(ferramentasDaSessao(s).join(', '))}${s.requisito ? `<br>Precisa de: ${cel(s.requisito)}` : ''} | ${s.minutos} |`);
  });
  md.push('');
});
if ((A.mapa_dores || []).length) {
  md.push(`## ${A.mapa_titulo || 'A mesma dor volta em mais de uma sessão'}`, '', '| Dor | Sessões |', '|---|---|');
  A.mapa_dores.forEach((d) => md.push(`| "${cel(d.dor)}" | ${d.sessoes.join(', ')} |`));
  md.push('');
}
NOTAS.forEach(([k, t]) => { if ((N[k] || []).length) md.push(`## ${t}`, '', ...N[k].map((x) => `- ${x}`), ''); });
md.push('## Relatório da agenda', '', '| Módulo | O aluno leva | Sessões | Vídeo | Automações | Precisa de |', '|---|---|---:|---:|---:|---|');
REL.modulos.forEach(({ m, autos }) => md.push(`| ${m.numero} · ${cel(m.nome)} (${m.nivel}) | ${cel(m.sistema)} | ${m.sessoes.length} | ${fmt(m.minutos)} | ${autos} | ${cel(m.requisitos)} |`));
md.push(`| **Total** | 3 sistemas | ${totalSessoes} | ${fmt(totalMin)} | ${totalAuto} | |`, '');
REL.fatos.forEach(([k, v]) => md.push(`- **${k}:** ${v}`));
md.push('');
A.modulos.forEach((m) => md.push(`- **No módulo ${m.numero}, o aluno sai com:** ${m.sessoes.map((s) => s.entregavel).join(' · ')}`));
md.push('');
if (A.rodape) md.push(A.rodape, '');
fs.writeFileSync(path.join(pastaSaida, 'README.md'), md.join('\n'));

console.log(`Agenda montada: ${totalSessoes} sessões, ${fmt(totalMin)} (${totalMin} min), ${totalAuto} automações.`);
A.modulos.forEach((m) => console.log(`  Módulo ${m.numero}: ${m.sessoes.length} sessões, ${m.minutos} min`));
Object.keys(GANHOS).forEach((g) => console.log(`  ${GANHOS[g]}: ${conta(g)} sessões`));
filtrosFerr.forEach((k) => console.log(`  ${rotuloFiltro(k)}: ${conta(k)} sessões`));
