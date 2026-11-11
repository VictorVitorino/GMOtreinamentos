#!/usr/bin/env node
/* Monta a agenda do curso a partir de agenda.json.

   Uso:  node montar.js [dados.json] [--artefato caminho.html]

   Gera, nesta pasta:
     agenda-udemy.html   página completa, abre em qualquer navegador
     README.md           espelho em texto
   Com --artefato, grava também a versão sem <html>/<head>/<body>, usada para publicar a página.
   O script confere as somas de minutos e interrompe se algo não fechar. */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const iArt = args.indexOf('--artefato');
const saidaArtefato = iArt >= 0 ? args[iArt + 1] : null;
const entrada = args.find((a, i) => !a.startsWith('--') && (iArt < 0 || i !== iArt + 1)) || path.join(__dirname, 'agenda.json');
const pastaSaida = entrada === path.join(__dirname, 'agenda.json') ? __dirname : path.dirname(path.resolve(entrada));
const A = JSON.parse(fs.readFileSync(entrada, 'utf8'));

// ---------- conferência ----------
const erros = [];
const GANHOS = { apresentacao: 'Apresentação', organizacao: 'Organização', clientela: 'Clientela' };
const PECAS = ['pagina', 'painel', 'lista', 'tempo', 'mensagem', 'cartao', 'calculo', 'slides', 'escudo', 'funil', 'lupa', 'molde'];
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
    if (s.peca && !PECAS.includes(s.peca)) erros.push(`Sessão ${s.numero}: peça desconhecida "${s.peca}".`);
  });
});
(A.mapa_dores || []).forEach((d) => d.sessoes.forEach((n) => { if (!numeros.has(n)) erros.push(`Mapa de dores cita a sessão ${n}, que não existe.`); }));
const totalMin = A.modulos.reduce((t, m) => t + m.minutos, 0);
const totalSessoes = A.modulos.reduce((t, m) => t + m.sessoes.length, 0);
if (totalMin > 480) erros.push(`O curso passa de 8 horas (${totalMin} min).`);
if (erros.length) { console.error('A agenda não fecha:\n- ' + erros.join('\n- ')); process.exit(1); }

// ---------- utilidades ----------
const esc = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (min) => { const h = Math.floor(min / 60), m = min % 60; return h ? `${h} h${m ? ' ' + String(m).padStart(2, '0') + ' min' : ''}` : `${m} min`; };
const idSessao = (n) => 's-' + String(n).replace('.', '-');
const ico = (nome, classe = 'ico') => `<svg class="${classe}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-${nome}"/></svg>`;
const contagem = (g) => A.modulos.reduce((t, m) => t + m.sessoes.filter((s) => (s.ganhos || []).includes(g)).length, 0);

const SIMBOLOS = {
  pagina: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4.5"/>',
  painel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7.5 16v-3M12 16V8.5M16.5 16v-5"/>',
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
};

// ---------- estilo ----------
const CSS = `
/* Layout: uma coluna. Cada módulo é um bloco de cor com a dor maior, sobre uma folha de sessões.
   Cada sessão anda em três tempos, da esquerda para a direita: a dor, o que você constrói, o que você ganha. */
:root {
  --mesa: #F3EFEE; --folha: #FFFFFF; --folha-2: #F8F5F4; --linha: #DED7D5; --linha-forte: #8E8684;
  --tinta: #161B2C; --tinta-2: #535A6C;
  --azul: #27468C; --azul-suave: #EAF0FB; --rubi: #9D1A30; --rubi-suave: #F9EBED; --latao: #7D5A14; --latao-suave: #F6EEDC;
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
    --sobre-cor: #10141E; color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --mesa: #0F131D; --folha: #171C29; --folha-2: #1E2433; --linha: #2C3345; --linha-forte: #6C7590;
  --tinta: #F0EAE5; --tinta-2: #A8AEBE;
  --azul: #9DB6F2; --azul-suave: #1A2440; --rubi: #F2798C; --rubi-suave: #37151E; --latao: #D9B466; --latao-suave: #2E2410;
  --sobre-cor: #10141E; color-scheme: dark;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--mesa); color: var(--tinta); font-family: var(--f-texto); font-size: 16px; line-height: 1.5; -webkit-font-smoothing: antialiased; }
h1, h2, h3, p, dl, dd, ul, ol, blockquote { margin: 0; }
ul, ol { padding: 0; list-style: none; }
img { max-width: 100%; }
[hidden] { display: none !important; }
:focus-visible { outline: 2px solid var(--rubi); outline-offset: 3px; }
.pagina { max-width: 1120px; margin: 0 auto; padding-block: 44px 72px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: flex; flex-direction: column; gap: 40px; }
.rotulo { font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--tinta-2); line-height: 1.3; }
.ico { width: 20px; height: 20px; flex: none; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }

.abre { display: flex; flex-direction: column; gap: 18px; }
.abre h1 { font-family: var(--f-titulo); font-weight: 400; font-size: clamp(2.2rem, 5.6vw, 3.6rem); line-height: 1.04; letter-spacing: -.012em; text-wrap: balance; }
.promessa { font-family: var(--f-serif); font-size: clamp(1.06rem, 2vw, 1.26rem); line-height: 1.5; max-width: 62ch; }
.fatos { display: grid; grid-template-columns: repeat(auto-fit, minmax(128px, 1fr)); border-block: 1px solid var(--linha); }
.fatos div { padding: 12px 16px 12px 0; display: flex; flex-direction: column; gap: 2px; }
.fatos dd { font-family: var(--f-serif); font-size: 1.5rem; font-weight: 700; line-height: 1.25; font-variant-numeric: tabular-nums; }
.compasso { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 10px; color: var(--tinta-2); font-size: .97rem; }
.compasso b { color: var(--tinta); font-weight: 700; }
.compasso i { font-style: normal; color: var(--linha-forte); }
.jogo { color: var(--tinta-2); font-size: .97rem; max-width: 72ch; margin-top: -8px; }

.filtro { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.filtro .rotulo { margin-right: 4px; }
.filtro button { font: inherit; font-size: .9rem; font-weight: 600; line-height: 1.2; padding: 8px 14px; border-radius: 999px; border: 1px solid var(--linha-forte); background: transparent; color: var(--tinta); cursor: pointer; }
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

.trilho-cab, .sessao { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr) minmax(0, 1.45fr) minmax(0, 1.1fr); column-gap: 30px; }
.trilho-cab { padding: 11px 28px; background: var(--folha-2); border-bottom: 1px solid var(--linha); }
.sessao { padding: 20px 28px; border-top: 1px solid var(--linha); scroll-margin-top: 16px; transition: opacity .2s; }
.trilho-cab + .sessao { border-top: 0; }
.sessao.fora { opacity: .28; }
.sessao:target { background: var(--cor-suave); }
.s-num { font-family: var(--f-serif); font-weight: 700; font-size: .98rem; color: var(--cor); font-variant-numeric: tabular-nums; }
.s-id h3 { font-size: 1.03rem; font-weight: 700; line-height: 1.3; margin-top: 2px; text-wrap: balance; }
.s-meta { display: flex; flex-wrap: wrap; gap: 4px 10px; margin-top: 8px; font-size: .84rem; color: var(--tinta-2); }
.s-min { font-variant-numeric: tabular-nums; font-weight: 700; color: var(--tinta); }
.s-dor { font-family: var(--f-serif); font-style: italic; font-size: 1.04rem; line-height: 1.45; text-wrap: pretty; }
.s-faz, .s-ganho { position: relative; min-width: 0; }
.s-faz::before, .s-ganho::before { content: "\\2192"; position: absolute; left: -22px; top: 0; color: var(--linha-forte); }
.s-faz p, .s-ganho p { font-size: .95rem; }
.peca { display: inline-flex; align-items: center; gap: 7px; margin-top: 10px; padding: 5px 11px 5px 8px; border-radius: 4px; background: var(--cor-suave); color: var(--cor); font-weight: 700; font-size: .9rem; line-height: 1.25; }
.peca .ico { width: 18px; height: 18px; }
.s-faz .s-pratica { margin-top: 10px; font-size: .86rem; color: var(--tinta-2); }
.s-faz .s-pratica b { color: var(--tinta); font-weight: 700; }
.s-faz .s-cuidado { margin-top: 6px; font-size: .86rem; color: var(--tinta-2); }
.s-ganho .s-frase { font-weight: 600; }
.s-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.s-tags span { font-size: .68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--tinta-2); border: 1px solid var(--linha); border-radius: 3px; padding: 2px 6px; }
.rot-m { display: none; }

.bloco h2 { font-family: var(--f-titulo); font-weight: 400; font-size: clamp(1.5rem, 3vw, 1.9rem); line-height: 1.15; text-wrap: balance; }
.bloco > p { margin-top: 8px; color: var(--tinta-2); max-width: 70ch; }
.mapa-lista { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); column-gap: 30px; margin-top: 16px; border-top: 1px solid var(--linha); }
.mapa-lista li { display: flex; flex-direction: column; gap: 8px; padding: 14px 0; border-bottom: 1px solid var(--linha); }
.mapa-lista q { font-family: var(--f-serif); font-style: italic; quotes: "\\201C" "\\201D"; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chips a { font-size: .8rem; font-weight: 700; font-variant-numeric: tabular-nums; text-decoration: none; padding: 3px 10px; border-radius: 999px; border: 1px solid currentColor; }
.chips .c1 { color: var(--azul); } .chips .c2 { color: var(--rubi); } .chips .c3 { color: var(--latao); }
.notas { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px 32px; border-top: 1px solid var(--linha); padding-top: 24px; }
.notas h3 { font-size: .95rem; font-weight: 700; }
.notas ul { margin-top: 8px; display: flex; flex-direction: column; gap: 6px; }
.notas li { font-size: .92rem; color: var(--tinta-2); padding-left: 14px; position: relative; }
.notas li::before { content: ""; position: absolute; left: 0; top: .62em; width: 5px; height: 5px; border-radius: 50%; background: var(--linha-forte); }
.rodape { font-size: .84rem; color: var(--tinta-2); }

@media (max-width: 900px) {
  .pagina { padding-block: 28px 56px; gap: 32px; }
  .modulo-cab { grid-template-columns: minmax(0, 1fr); gap: 20px; padding: 22px 18px; }
  .trilho-cab { display: none; }
  .sessao { grid-template-columns: minmax(0, 1fr); row-gap: 14px; padding: 20px 18px; }
  .trilho-cab + .sessao { border-top: 0; }
  .rot-m { display: block; margin-bottom: 4px; }
  .s-faz::before, .s-ganho::before { display: none; }
}
@media (prefers-reduced-motion: reduce) { .sessao { transition: none; } }
`;

// ---------- página ----------
function sessao(s) {
  const tags = (s.ganhos || []).map((g) => `<span>${GANHOS[g]}</span>`).join('');
  return `
      <article class="sessao" id="${idSessao(s.numero)}" role="listitem" data-ganhos="${(s.ganhos || []).join(' ')}">
        <div class="s-id">
          <span class="s-num">${esc(s.numero)}</span>
          <h3>${esc(s.nome)}</h3>
          <p class="s-meta"><span class="s-min">${s.minutos} min</span>${s.plano ? `<span>${esc(s.plano)}</span>` : ''}</p>
        </div>
        <div class="s-d"><span class="rotulo rot-m">A dor</span><p class="s-dor">“${esc(s.dor)}”</p></div>
        <div class="s-faz"><span class="rotulo rot-m">O que você constrói</span>
          <p>${esc(s.o_que_constroi)}</p>
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
        <p class="conta">${m.sessoes.length} sessões · ${fmt(m.minutos)} · ${esc(m.requisitos)}</p>
      </div>
    </header>
    <div role="list">
      <div class="trilho-cab" aria-hidden="true"><span class="rotulo">Sessão</span><span class="rotulo">A dor</span><span class="rotulo">O que você constrói</span><span class="rotulo">O que você ganha</span></div>${m.sessoes.map(sessao).join('')}
    </div>
  </section>`;
}

const temGanhos = A.modulos.some((m) => m.sessoes.some((s) => (s.ganhos || []).length));
const filtro = !temGanhos ? '' : `
  <div class="filtro" role="group" aria-label="Ver as sessões por ganho">
    <span class="rotulo">Ver por ganho</span>
    <button type="button" id="ver-tudo" data-ganho="tudo" aria-pressed="true">Tudo<span>${totalSessoes}</span></button>
    ${Object.keys(GANHOS).map((g) => `<button type="button" id="ver-${g}" data-ganho="${g}" aria-pressed="false">${GANHOS[g]}<span>${contagem(g)}</span></button>`).join('\n    ')}
    <output id="filtro-status" aria-live="polite"></output>
  </div>`;

const mapa = !(A.mapa_dores || []).length ? '' : `
  <section class="bloco" aria-labelledby="mapa-t">
    <h2 id="mapa-t">${esc(A.mapa_titulo || 'A mesma dor volta em mais de uma sessão')}</h2>
    <p>${esc(A.mapa_texto || 'A relação não é de um para um: uma dor grande pede mais de uma peça, e uma peça boa alivia mais de uma dor.')}</p>
    <ul class="mapa-lista">${A.mapa_dores.map((d) => `
      <li><q>${esc(d.dor)}</q><span class="chips">${d.sessoes.map((n) => `<a class="c${String(n).split('.')[0]}" href="#${idSessao(n)}">${esc(n)}</a>`).join('')}</span></li>`).join('')}
    </ul>
  </section>`;

const N = A.notas || {};
const notas = !Object.keys(N).length ? '' : `
  <section class="notas" aria-label="Notas da agenda">${[['precisa', 'O que o aluno precisa'], ['cuidados', 'Cuidados que valem para tudo'], ['extras', 'Para quem quiser automatizar, fora da minutagem'], ['producao', 'O que falta para gravar']]
    .filter(([k]) => (N[k] || []).length).map(([k, t]) => `
    <div><h3>${t}</h3><ul>${N[k].map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}
  </section>`;

const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${Object.keys(SIMBOLOS).map((k) => `<symbol id="i-${k}" viewBox="0 0 24 24">${SIMBOLOS[k]}</symbol>`).join('')}</defs></svg>`;

const script = !temGanhos ? '' : `
<script>
(function () {
  var botoes = [].slice.call(document.querySelectorAll('.filtro button'));
  var sessoes = [].slice.call(document.querySelectorAll('.sessao'));
  var status = document.getElementById('filtro-status');
  function aplicar(g) {
    var n = 0;
    sessoes.forEach(function (s) {
      var dentro = g === 'tudo' || (' ' + s.getAttribute('data-ganhos') + ' ').indexOf(' ' + g + ' ') >= 0;
      s.classList.toggle('fora', !dentro);
      if (dentro) n += 1;
    });
    botoes.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-ganho') === g)); });
    status.textContent = g === 'tudo' ? '' : n + ' de ' + sessoes.length + ' sessões em destaque';
  }
  botoes.forEach(function (b) { b.addEventListener('click', function () { aplicar(b.getAttribute('data-ganho')); }); });
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
    <h1>${esc(A.titulo)}</h1>
    <p class="promessa">${esc(A.promessa)}</p>
    <dl class="fatos">
      <div><dt class="rotulo">Módulos</dt><dd>3</dd></div>
      <div><dt class="rotulo">Sessões</dt><dd>${totalSessoes}</dd></div>
      <div><dt class="rotulo">Vídeo</dt><dd>${fmt(totalMin)}</dd></div>
      <div><dt class="rotulo">Peças prontas</dt><dd>${totalSessoes}</dd></div>
      <div><dt class="rotulo">Sistemas</dt><dd>3</dd></div>
    </dl>
    <p class="compasso"><span>Toda sessão anda em três tempos:</span> <b>a dor</b> <i>→</i> <b>o que você constrói</b> <i>→</i> <b>o que você ganha</b></p>${A.pratica_texto ? `
    <p class="jogo">${esc(A.pratica_texto)}</p>` : ''}
  </header>${filtro}
${A.modulos.map(modulo).join('\n')}
${mapa}
${notas}
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
const md = [];
md.push(`# ${A.titulo}`, '', `**${A.rotulo || 'Curso gravado · Agenda'}** · 3 módulos · ${totalSessoes} sessões · ${fmt(totalMin)} de vídeo · uma peça pronta por sessão · um sistema por módulo`, '', A.promessa, '');
md.push('A página da agenda é [agenda-udemy.html](agenda-udemy.html). Este arquivo é o espelho em texto; os dois saem de [agenda.json](agenda.json) pelo script [montar.js](montar.js).', '');
md.push('Toda sessão anda em três tempos: **a dor** → **o que você constrói** → **o que você ganha**.', '');
A.modulos.forEach((m) => {
  md.push(`## Módulo ${m.numero} · ${m.nivel}${m.eixo ? ' · ' + m.eixo : ''} · ${m.nome}`, '');
  md.push(`- **A dor do módulo:** "${m.dor_do_modulo}"`, `- **Você constrói e leva:** ${m.sistema}`, `- **O que muda:** ${m.ganho_do_modulo}`, `- **Para quem:** ${m.para_quem}`, `- **Precisa de:** ${m.requisitos}`, `- **Tamanho:** ${m.sessoes.length} sessões, ${fmt(m.minutos)}`, '');
  md.push('| Sessão | A dor | O que você constrói | Você leva | O que você ganha | Min |', '|---|---|---|---|---|---:|');
  const cel = (t) => String(t || '').replace(/\|/g, '\\|');
  m.sessoes.forEach((s) => md.push(`| **${s.numero} ${cel(s.nome)}** | "${cel(s.dor)}" | ${cel(s.o_que_constroi)}${s.pratica ? ` *${cel(s.pratica)}.*` : ''}${s.cuidado ? ` Cuidado: ${cel(s.cuidado)}` : ''} | ${cel(s.entregavel)} | ${cel(s.ganho)} | ${s.minutos} |`));
  md.push('');
});
if ((A.mapa_dores || []).length) {
  md.push(`## ${A.mapa_titulo || 'A mesma dor volta em mais de uma sessão'}`, '', '| Dor | Sessões |', '|---|---|');
  A.mapa_dores.forEach((d) => md.push(`| "${d.dor}" | ${d.sessoes.join(', ')} |`));
  md.push('');
}
[['precisa', 'O que o aluno precisa'], ['cuidados', 'Cuidados que valem para tudo'], ['extras', 'Para quem quiser automatizar, fora da minutagem'], ['producao', 'O que falta para gravar']].forEach(([k, t]) => {
  if ((N[k] || []).length) { md.push(`## ${t}`, '', ...N[k].map((x) => `- ${x}`), ''); }
});
if (A.rodape) md.push(A.rodape, '');
fs.writeFileSync(path.join(pastaSaida, 'README.md'), md.join('\n'));

console.log(`Agenda montada: ${totalSessoes} sessões, ${fmt(totalMin)} (${totalMin} min).`);
A.modulos.forEach((m) => console.log(`  Módulo ${m.numero}: ${m.sessoes.length} sessões, ${m.minutos} min`));
Object.keys(GANHOS).forEach((g) => console.log(`  ${GANHOS[g]}: ${contagem(g)} sessões`));
