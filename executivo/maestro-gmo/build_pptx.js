#!/usr/bin/env node
/* Gera dist/GMO_Maestro_Executivo.pptx: a página executiva em PowerPoint, nativa e editável
   (formas, textos e quadros agrupados por coluna; listas completas nas anotações).
   Requer: npm i pptxgenjs react react-dom react-icons sharp
   Coordenadas em px do palco 1600×900 do HTML (120 px = 1 polegada); fonte Arial. */
const fs = require('fs'), path = require('path');
const pptxgen = require('pptxgenjs');
const JSZip = require(require.resolve('jszip', { paths: [require.resolve('pptxgenjs')] }));
const React = require('react'), { renderToStaticMarkup } = require('react-dom/server');
const sharp = require('sharp');
const { FiUsers, FiCoffee, FiStar } = require('react-icons/fi');
const { FaTrophy } = require('react-icons/fa');

const ROOT = __dirname, OUT = path.join(ROOT, 'dist', 'GMO_Maestro_Executivo.pptx');
const X = v => +(v / 120).toFixed(4);
const H = { ol: '4C641D', olD: '3A4E14', olDD: '26340B', olL: 'E8EEDA', li: 'D3CE22', liD: 'B3AE12', liLL: 'FAF9E6',
  gr: '54575C', grL: '8D9096', grLL: 'EEEFF0', bg: 'F5F5EC', card: 'FFFFFF', line: 'E3E3D3', line2: 'D2D2BF',
  ink: '1D2210', ink2: '474C38', ink3: '767B66' };
const THEME = { name: 'Maestro GMO', headFontFace: 'Arial', bodyFontFace: 'Arial',
  colors: { dk1: H.ink, lt1: 'FFFFFF', dk2: H.olDD, lt2: H.bg, accent1: H.ol, accent2: H.li, accent3: H.gr,
    accent4: H.liD, accent5: H.grL, accent6: H.olD, hlink: H.ol, folHlink: H.gr } };

const png = async (buf, opt = {}) => 'image/png;base64,' + (await sharp(buf, opt).png().toBuffer()).toString('base64');
const icon = (Comp, hex) => png(Buffer.from(renderToStaticMarkup(React.createElement(Comp, { size: 256 })).replace(/currentColor/g, '#' + hex)));

/* ---------------------------------------------------------------- conteúdo */
const COLS = [
  { k: 'C1', title: 'Assessment', tag: 'AFINAR · OUVIR ANTES DE MUDAR', c: H.ol, onC: 'FFFFFF', tint: H.olL, accent: H.ol,
    big: [['+', 36], ['60', 64]], label: 'entrevistas',
    p: 'Todas as diretorias do ONS, associações, conselheiros e agentes do setor (CCEE, EPE, ANEEL e MME).',
    units: { shape: 'dot', parts: [[40, H.ol], [20, H.liD]] },
    legend: [[H.ol, '40', 'gestores do ONS'], [H.liD, '20', 'setor e conselho']],
    tiles: [
      { n: [['490']], l: 'respostas', s: '2 pesquisas de prontidão: 328 + 162' },
      { n: [['4,17']], l: 'índice de prontidão', s: [['▲ +0,23', { bold: true, color: H.ol }], [' sobre 3,94 em 2025']] },
      { n: [['85'], ['%', 18]], l: 'lideranças favoráveis', s: '22 das 26 lideranças entrevistadas' },
      { n: [['39']], l: 'lideranças mapeadas', s: 'mapa de stakeholders de todas as diretorias' }],
    note: { icon: FiUsers, runs: [['Diagnóstico ADKAR', true], [' individual dos 5 líderes da nova FE']] } },
  { k: 'C2', title: 'Comunicação', tag: 'ECOAR · A MENSAGEM EM TODO O ONS', c: H.li, onC: H.olDD, tint: H.liLL, accent: H.olDD,
    big: [['16', 64]], label: 'comunicados',
    p: 'Peças oficiais do projeto, em 4 frentes:',
    units: { shape: 'sq', parts: [[2, H.olDD], [4, H.ol], [4, H.liD], [6, H.li]] },
    legend: [[H.olDD, '2', 'boletins'], [H.ol, '4', 'convites'], [H.liD, '4', 'conteúdo do modelo'], [H.li, '6', 'engajamento']],
    tiles: [
      { n: [['12']], l: 'vídeos', s: '7 Fala, Maestro +\u00A05\u00A0temáticos', film: true },
      { n: [['29']], l: 'edições de boletim', s: '24 semanais para a DPL e 5 mensais para todo o ONS' },
      { n: [['20']], l: 'vozes do Maestro', s: 'depoimentos de líderes e técnicos nos boletins' },
      { n: [['1']], l: 'game do Maestro', s: 'gamificação do projeto' }],
    note: { icon: FiCoffee, runs: [['Café com a Liderança', true], [' toda sexta e '], ['Rede de Influenciadores', true], [' em 4 diretorias']] } },
  { k: 'C3', title: 'Adoção ao modelo', tag: 'REGER · MODELAR E APRESENTAR', c: H.gr, onC: 'FFFFFF', tint: H.grLL, accent: H.gr,
    big: [['31', 64]], label: 'encontros',
    p: 'Reuniões para modelar e apresentar o modelo da FE.',
    units: { shape: 'sq', parts: [[16, H.gr], [7, H.ol], [8, H.liD]] },
    legend: null,
    tiles: [
      { n: [['16']], l: 'apresentações', m: H.gr, s: 'modelo, comunidades, ritos e papéis' },
      { n: [['7']], l: 'workshops', m: H.ol, s: 'Gerências Técnicas e FEG' },
      { n: [['8']], l: 'treinamentos', m: H.liD, s: 'modelo matricial, projetos, arquitetura, IA e GMO' },
      { n: [['4']], l: 'gerências no ar', s: 'FE em operação desde 01/07: FEG, FEL, FEN e FER' }],
    note: { icon: FiStar, runs: [['Workshop das Gerências', true], [' (04–05/08): +20 participantes, 7h e engajamento muito alto']] } },
];

const NOTES = `Detalhe para o apresentador (posição em 27/10/2026)

ASSESSMENT
- +60 entrevistas: +40 com gerentes executivos e gerentes de todas as diretorias; +20 com associações, conselheiros do ONS e agentes setoriais (CCEE, EPE, ANEEL e MME).
- Mapa de stakeholders: 39 lideranças mapeadas (DPL 14, DOP 10, DTA 8, DAC 6, 1 sem diretoria); 26 entrevistadas entre 15 e 27/10/2025. Postura: 22 favoráveis, 3 neutras, 1 resistente.
- Pesquisas de prontidão: 328 respondentes no início do projeto (DPL 168, DTA 100, DOP 60) e 162 na Operação Assistida (DPL 127, DTA 35). Índice geral 3,94 (2025) → 4,17 (2026), +0,23.
- Diagnóstico ADKAR dos 5 líderes da FE: consciência em todos; desejo favorável em 4 de 5; lacunas de conhecimento sobre papéis, avaliação na matriz e interfaces; habilidade é o ponto de atenção (times em formação); pedem treinamento de liderança, onboarding, comunicação e patrocínio.

COMUNICAÇÃO
- 16 comunicados. Boletins (2): Comunicado Semanal e Comunicado Mensal. Convites e encontros (4): Encontro Maestro DPL; Convite reunião Gestores + Influenciadores; Convite reunião DPL Gestores; Divulgação do Café com a Liderança. Conteúdo do modelo (4): Papéis e Responsabilidades; Fases do Projeto; Direcionadores Estratégicos; Q&A do Maestro. Engajamento e marca (6): Game Maestro; Copa ONS; Influenciadores; Material de Divulgação 1 e 2; Fundo de Tela; Recap da Página Interativa.
- 12 vídeos: Fala, Maestro (7 episódios) + Projeto Maestro, Modelo Matricial, Papéis e Responsabilidades, Gerências e Onboarding Maestro.
- 29 edições de boletim: 24 semanais para a DPL e 5 mensais para todo o ONS.
- 20 vozes do Maestro (5 lideranças e 15 do time técnico) e 1 game.
- Canais: Café com a Liderança (depois Bate-papo dos Maestros) toda sexta, 9h; Rede de Influenciadores na DPL, DTA, DOP e DAC; página oficial no Sou+; vídeo na tela de entrada do ONS.

ADOÇÃO AO MODELO
- 16 apresentações: 3 do modelo de operação (webinar com áreas clientes, gerentes das áreas clientes, estrutura definida); 5 Comunidades de Entrega (FEL RMS, FEL Transitórios Eletromagnéticos, FER Carga/RED/GRV, FER Recursos Hidrológicos, FEN Planejamento e Programação Energética); 6 de aderência a ritos, fóruns e papéis; 2 de papéis por perfil.
- 7 workshops: Modelo de Atuação das Gerências Técnicas (2 sessões presenciais, 04–05/08: +20 participantes, 7h, 4 dinâmicas); FEG Fóruns, Processos e Rotinas (2 sessões); FEG Governança e Portfólio; FEG Comunidades Técnicas (save the date); FEG Captação Orçamentária.
- 8 treinamentos: Modelo Matricial e Papéis; Gestão de Projetos; Arquitetura de Modelos Eletroenergéticos (2 sessões); Plataformização, Escalabilidade e Performance; Fundamentos de IA; Desenvolvimento Integrado com IA; Gestão de Mudanças (save the date).
- FE em operação desde 01/07/2026 com FEG, FEL, FEN e FER.`;

/* ------------------------------------------------------------- montagem */
async function build() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = 'Gestão da Mudança em grandes números · Projeto Maestro';
  pres.company = 'Alvarez &amp; Marsal';
  const C = pres.SchemeColor;

  const svg = fs.readFileSync(path.join(ROOT, 'assets', 'maestro.svg'));
  const maestro = await png(svg, { density: 600 });
  const ons = await png(fs.readFileSync(path.join(ROOT, 'assets', 'ons.png')));
  const amDark = 'image/png;base64,' + (await sharp(fs.readFileSync(path.join(ROOT, 'assets', 'am.png'))).negate({ alpha: false }).png().toBuffer()).toString('base64');

  pres.defineSlideMaster({
    title: 'EXECUTIVO',
    background: { color: H.bg },
    objects: [
      { image: { x: X(44), y: X(42), w: X(156.7), h: X(34), data: maestro, altText: 'Maestro' } },
      { line: { x: X(231), y: X(34), w: 0, h: X(50), line: { color: H.line2, width: 1.5 } } },
      { placeholder: { options: { name: 'eyebrow', type: 'body', x: X(261), y: X(30), w: X(860), h: X(18), margin: 0, valign: 'top',
          fontFace: 'Arial', fontSize: 8, bold: true, color: H.ol, charSpacing: 2 }, text: '' } },
      { placeholder: { options: { name: 'title', type: 'title', x: X(261), y: X(47), w: X(880), h: X(46), margin: 0, valign: 'top',
          fontFace: 'Arial', fontSize: 22, bold: true, color: H.ink, align: 'left' }, text: '' } },
      { image: { x: X(1385.5), y: X(38), w: X(170.5), h: X(40), data: ons, altText: 'ONS' } },
      { text: { text: 'Projeto Maestro · ONS · Gestão da Mudança · posição em 27/10/2026',
          options: { x: X(44), y: X(871), w: X(900), h: X(16), margin: 0, valign: 'top', fontFace: 'Arial', fontSize: 7.5, color: H.ink3 } } },
      { image: { x: X(1556 - 75.7), y: X(873), w: X(75.7), h: X(12), data: amDark, transparency: 45, altText: 'A&M' } },
    ],
  });

  pres.addSection({ title: 'Gestão da Mudança' });
  const s = pres.addSlide({ masterName: 'EXECUTIVO', sectionTitle: 'Gestão da Mudança' });
  s.addShape(pres.shapes.RECTANGLE, { objectName: 'Cabeçalho · grifo', x: X(682), y: X(79.5), w: X(303), h: X(8), fill: { color: H.li }, line: { type: 'none' } });
  s.addText('PROJETO MAESTRO · ONS · OUT/25 → OUT/26', { placeholder: 'eyebrow', objectName: 'Cabeçalho · sobretítulo' });
  s.addText([{ text: 'Gestão da Mudança em ' }, { text: 'grandes números', options: { color: H.ol } }], { placeholder: 'title', objectName: 'Cabeçalho · título' });

  const runs = (arr, base = {}) => arr.map(([t, o]) => ({ text: t, options: Object.assign({}, base, typeof o === 'object' ? o : {}) }));
  const text = (name, content, o) => s.addText(content, Object.assign({ objectName: name, isTextBox: true, x: X(o.x), y: X(o.y), w: X(o.w), h: X(o.h),
    margin: 0, fontFace: 'Arial', fontSize: o.size, color: o.color || H.ink, bold: !!o.bold, align: o.align || 'left', valign: o.valign || 'top',
    fit: 'none', paraSpaceBefore: 0, paraSpaceAfter: 0 }, o.cs ? { charSpacing: o.cs } : {}));
  const box = (name, shape, o) => s.addShape(shape, Object.assign({ objectName: name, x: X(o.x), y: X(o.y), w: X(o.w), h: X(o.h),
    fill: o.fill ? { color: o.fill } : { type: 'none' }, line: o.line ? { color: o.line, width: o.lw || 0.75, dashType: o.dash || 'solid' } : { type: 'none' } },
    o.r ? { rectRadius: X(o.r) } : {}, o.shadow ? { shadow: { type: 'outer', color: H.olDD, opacity: 0.08, blur: 10, offset: 3, angle: 90 } } : {}));
  const RR = pres.shapes.ROUNDED_RECTANGLE, OV = pres.shapes.OVAL;

  /* selo 1º lugar */
  box('S · selo · fundo', RR, { x: 1160, y: 31, w: 202, h: 56, r: 28, fill: H.olDD });
  box('S · selo · círculo', OV, { x: 1167, y: 38, w: 42, h: 42, fill: H.li });
  s.addImage({ objectName: 'S · selo · troféu', data: await icon(FaTrophy, H.olDD), x: X(1177), y: X(48), w: X(22), h: X(22), altText: 'Troféu' });
  text('S · selo · título', '1º lugar · DPL', { x: 1219, y: 40, w: 135, h: 18, size: 9.5, bold: true, color: 'FFFFFF' });
  text('S · selo · prêmio', 'Somos ONS D+ 2026', { x: 1219, y: 60, w: 135, h: 14, size: 7.5, color: H.li });

  /* três colunas */
  const CW = (1512 - 40) / 3;
  for (const [i, col] of COLS.entries()) {
    const cx = 44 + i * (CW + 20), ix = cx + 24, iw = CW - 48, k = col.k;
    box(`${k} · cartão`, RR, { x: cx, y: 118, w: CW, h: 736, r: 22, fill: H.card, line: H.line, shadow: true });
    box(`${k} · número da coluna`, RR, { x: ix, y: 144, w: 48, h: 48, r: 15, fill: col.c });
    text(`${k} · número da coluna · texto`, String(i + 1), { x: ix, y: 144, w: 48, h: 48, size: 14, bold: true, color: col.onC, align: 'center', valign: 'middle' });
    text(`${k} · chamada`, col.tag, { x: ix + 62, y: 146, w: iw - 62, h: 14, size: 7.5, bold: true, color: H.ink3, cs: 1.2 });
    text(`${k} · título`, col.title, { x: ix + 62, y: 160, w: iw - 62, h: 30, size: 16, bold: true });

    /* número principal: número e rótulo na mesma linha de base */
    text(`${k} · número principal`, runs([...col.big.map(([t, sz]) => [t, { fontSize: sz, charSpacing: sz > 40 ? -2.5 : 0 }]),
      ['  ' + col.label, { fontSize: 15, color: col.accent }]], { bold: true, color: H.ink }),
      { x: ix, y: 184, w: iw, h: 112, size: 64, bold: true });
    text(`${k} · descrição`, col.p, { x: ix, y: 304, w: iw, h: 38, size: 10, color: H.ink2 });

    /* unidades: cada ponto ou quadrado é uma entrevista, um comunicado ou um encontro */
    let n = 0;
    const flat = col.units.parts.flatMap(([q, hex]) => Array.from({ length: q }, () => hex));
    for (const hex of flat) {
      const dot = col.units.shape === 'dot', per = dot ? 30 : 16, step = dot ? 14 : 27, sz = dot ? 10 : 22;
      const r = Math.floor(n / per), c = n % per, id = String(++n).padStart(2, '0');
      box(`${k} · unidade ${id}`, dot ? OV : RR, { x: ix + c * step, y: (col.legend ? (col.p.length > 60 ? 356 : 336) : 356) + r * (sz + (dot ? 4 : 5)), w: sz, h: sz, r: dot ? 0 : 6, fill: hex });
    }
    if (col.legend) {
      const lg = col.legend.flatMap(([hex, num, t], j) => [['■\u00A0', { color: hex }], [num, { bold: true, color: H.ink }], ['\u00A0' + t.replace(/ /g, '\u00A0') + (j < col.legend.length - 1 ? '    ' : ''), { color: H.ink3 }]]);
      text(`${k} · legenda`, runs(lg), { x: ix, y: col.p.length > 60 ? 388 : 368, w: iw, h: 34, size: 9, bold: false });
    }

    /* números de apoio */
    const TW = (iw - 12) / 2, TH = 158;
    for (const [j, t] of col.tiles.entries()) {
      const tx = ix + (j % 2) * (TW + 12), ty = 428 + Math.floor(j / 2) * (TH + 12), tk = `${k} · tile ${j + 1}`;
      box(`${tk} · fundo`, RR, { x: tx, y: ty, w: TW, h: TH, r: 16, fill: col.tint });
      text(`${tk} · número`, runs(t.n.map(([v, sz]) => [v, sz ? { fontSize: sz } : { charSpacing: -1 }]), { bold: true }), { x: tx + 18, y: ty + 4, w: TW - 36, h: 60, size: 29, bold: true });
      text(`${tk} · rótulo`, t.m ? runs([['■ ', { color: t.m }], [t.l]]) : t.l, { x: tx + 18, y: ty + 66, w: TW - 30, h: 20, size: 10.5, bold: true });
      text(`${tk} · apoio`, Array.isArray(t.s) ? runs(t.s) : t.s, { x: tx + 18, y: ty + 88, w: TW - 30, h: 56, size: 9, color: H.ink2 });
      if (t.film) for (let f = 0; f < 12; f++) {
        const fw = (TW - 36 - 33) / 12, fx = tx + 18 + f * (fw + 3), fy = ty + 138;
        box(`${tk} · quadro ${String(f + 1).padStart(2, '0')}`, RR, { x: fx, y: fy, w: fw, h: 11, r: 3, fill: f < 7 ? H.li : H.ol });
      }
    }

    /* nota */
    box(`${k} · nota · moldura`, RR, { x: ix, y: 774, w: iw, h: 58, r: 14, line: H.line2, lw: 1.25, dash: 'dash' });
    s.addImage({ objectName: `${k} · nota · ícone`, data: await icon(col.note.icon, col.accent), x: X(ix + 16), y: X(792), w: X(22), h: X(22), altText: 'Ícone' });
    text(`${k} · nota · texto`, runs(col.note.runs.map(([t, b]) => [t, b === true ? { bold: true, color: H.ink } : {}]), { color: H.ink2 }),
      { x: ix + 50, y: 778, w: iw - 58, h: 50, size: 9.5, color: H.ink2, valign: 'middle' });
  }

  s.addNotes(NOTES);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await pres.writeFile({ fileName: OUT });
  await finish(OUT);
  console.log(OUT);
}

/* ------------------------------------------------ tema e agrupamento (pós) */
async function finish(file) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  // tema: as 12 cores da identidade Maestro no lugar da paleta padrão do Office
  const tp = 'ppt/theme/theme1.xml';
  const scheme = `<a:clrScheme name="${THEME.name}">` + Object.entries(THEME.colors).map(([k, v]) => `<a:${k}><a:srgbClr val="${v}"/></a:${k}>`).join('') + '</a:clrScheme>';
  let th = await zip.file(tp).async('string');
  th = th.replace(/<a:clrScheme\b[\s\S]*?<\/a:clrScheme>/, () => scheme).replace(/(<a:(?:theme|fontScheme)\b[^>]*?\bname=")[^"]*"/g, (_, h) => h + THEME.name + '"');
  zip.file(tp, th);

  // grupos: cada quadro, cada conjunto de unidades, cada nota, cada coluna e o selo viram um objeto só
  const sp = 'ppt/slides/slide1.xml';
  let xml = await zip.file(sp).async('string');
  const a = xml.indexOf('</p:grpSpPr>') + '</p:grpSpPr>'.length, b = xml.lastIndexOf('</p:spTree>');
  const body = xml.slice(a, b);
  let items = body.match(/<p:(sp|pic|cxnSp)>[\s\S]*?<\/p:\1>/g) || [];
  if (items.join('') !== body) throw new Error('estrutura inesperada no slide; agrupamento cancelado');
  let id = Math.max(...[...xml.matchAll(/<p:cNvPr id="(\d+)"/g)].map(m => +m[1]));
  const nameOf = el => (el.match(/<p:cNvPr id="\d+" name="([^"]*)"/) || [])[1] || '';
  const boxOf = el => el.match(/<a:off x="(-?\d+)" y="(-?\d+)"\s*\/>\s*<a:ext cx="(\d+)" cy="(\d+)"\s*\/>/).slice(1).map(Number);
  const group = (gname, pred) => {
    const idx = items.map((el, i) => (pred(nameOf(el)) ? i : -1)).filter(i => i >= 0);
    if (idx.length < 2) return;
    const kids = idx.map(i => items[i]), bx = kids.map(boxOf);
    const x0 = Math.min(...bx.map(q => q[0])), y0 = Math.min(...bx.map(q => q[1]));
    const x1 = Math.max(...bx.map(q => q[0] + q[2])), y1 = Math.max(...bx.map(q => q[1] + q[3]));
    const xf = `<a:off x="${x0}" y="${y0}"/><a:ext cx="${x1 - x0}" cy="${y1 - y0}"/><a:chOff x="${x0}" y="${y0}"/><a:chExt cx="${x1 - x0}" cy="${y1 - y0}"/>`;
    const g = `<p:grpSp><p:nvGrpSpPr><p:cNvPr id="${++id}" name="${gname}"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm>${xf}</a:xfrm></p:grpSpPr>${kids.join('')}</p:grpSp>`;
    items = items.flatMap((el, i) => (i === idx[0] ? [g] : idx.includes(i) ? [] : [el]));
  };
  group('Selo · 1º lugar DPL', nm => nm.startsWith('S · selo'));
  for (const [i, col] of COLS.entries()) {
    const k = col.k;
    group(`${k} · unidades`, nm => nm.startsWith(`${k} · unidade `));
    for (let j = 1; j <= 4; j++) group(`${k} · tile ${j}`, nm => nm.startsWith(`${k} · tile ${j} · `));
    group(`${k} · nota`, nm => nm.startsWith(`${k} · nota · `));
    group(`${k} · número da coluna`, nm => nm.startsWith(`${k} · número da coluna`));
    group(`Coluna ${i + 1} · ${col.title}`, nm => nm.startsWith(`${k} · `));
  }
  // sem contorno explícito: <a:ln> vazio vira <a:ln><a:noFill/></a:ln>
  xml = (xml.slice(0, a) + items.join('') + xml.slice(b)).replace(/<a:ln><\/a:ln>/g, '<a:ln><a:noFill/></a:ln>');
  zip.file(sp, xml);
  for (const n of Object.keys(zip.files)) if (/^ppt\/(slides|slideLayouts|notesSlides)\/[^/]+\.xml$/.test(n)) zip.file(n, (await zip.file(n).async('string')).replace(/lang="en-US"/g, 'lang="pt-BR"'));
  fs.writeFileSync(file, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
}

build().catch(e => { console.error(e); process.exit(1); });
