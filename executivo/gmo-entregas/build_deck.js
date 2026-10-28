#!/usr/bin/env node
/* Gera dist/GMO_Entregas_Maestro.pptx no padrão A&M: capa, visão geral das seis frentes de GMO
   e um slide por frente (entrega realizada, componentes, imagem e resultados). Fonte: Arial Nova Cond.
   Requer: npm i pptxgenjs sharp react react-dom react-icons
   Imagens dos boletins em assets/boletins/ (fora do git; renderizadas dos PPTs de status do projeto).
   Coordenadas em px de um palco 1600×900 (120 px = 1 polegada).
   Cada caixa de texto é medida com as larguras da fonte (font-metrics.json); ao final, o script
   lista qualquer texto ou imagem que se sobreponha a outro. */
const fs = require('fs'), path = require('path');
const pptxgen = require('pptxgenjs');
const JSZip = require(require.resolve('jszip', { paths: [require.resolve('pptxgenjs')] }));
const sharp = require('sharp');
const React = require('react'), { renderToStaticMarkup } = require('react-dom/server');
const Fi = require('react-icons/fi'), Fa = require('react-icons/fa');

const ROOT = __dirname, OUT = path.join(ROOT, 'dist', 'GMO_Entregas_Maestro.pptx');
const BOL = f => path.join(ROOT, 'assets', 'boletins', f), BRAND = f => path.join(ROOT, '..', 'maestro-gmo', 'assets', f);
const X = v => +(v / 120).toFixed(4);
const FONT = 'Arial Nova Cond';
const C = { navy: '002A46', ink: '0C344F', steel: '5E8AB3', label: '4B7AA5', body: '536978', orange: 'C7680B', orange2: 'D56F00',
  circle: '0B4D78', box: 'EDF3F7', box2: 'DCE7F1', card: 'FAFBFC', line: 'D8E0E6', sep: 'E3E9EE', page: '688091', brand: '00274D',
  pale: 'AFC6DD', ol: '4C641D', li: 'D3CE22', gr: '54575C', white: 'FFFFFF' };
const THEME = { name: 'AM Maestro GMO', colors: { dk1: C.ink, lt1: C.white, dk2: C.navy, lt2: C.box, accent1: C.circle, accent2: C.orange,
  accent3: C.label, accent4: C.steel, accent5: C.ol, accent6: C.li, hlink: C.circle, folHlink: C.body } };

const b64 = buf => 'image/png;base64,' + buf.toString('base64');
const whiten = async (buf, opt) => {
  const { data, info } = await sharp(buf, opt).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) data[i] = data[i + 1] = data[i + 2] = 255;
  return b64(await sharp(data, { raw: info }).png().toBuffer());
};
const icon = async (Comp, hex) => b64(await sharp(Buffer.from(renderToStaticMarkup(React.createElement(Comp, { size: 256 })).replace(/currentColor/g, '#' + hex))).png().toBuffer());
const pngOf = async f => b64(await sharp(f).png().toBuffer());

/* ------------------------------------------------- medição de texto e sobreposição */
const MET = require('./font-metrics.json');
const wpx = (t, pt, bold) => { const m = MET[bold ? 'b' : 'r']; let u = 0; for (const ch of t) u += m[ch] ?? 0.55; return u * pt * (120 / 72) * 1.04; };
const PROBLEMS = [];
const nLines = (text, pt, bold, maxw, who) => {
  let n = 0;
  for (const para of String(text).split('\n')) {
    let cur = ''; n++;
    for (const word of para.split(' ')) {
      if (who && wpx(word, pt, bold) > maxw) PROBLEMS.push(`${who}: a palavra "${word}" não cabe na largura`);
      const t = cur ? cur + ' ' + word : word;
      if (!cur || wpx(t, pt, bold) <= maxw) cur = t; else { n++; cur = word; }
    }
  }
  return n;
};
const lineH = (pt, ls = 1) => pt * 1.2 * ls * (120 / 72);
const textH = (text, pt, bold, maxw, ls) => nLines(text, pt, bold, maxw) * lineH(pt, ls);
const needH = (name, content, o) => {
  const paras = [];
  if (typeof content === 'string') paras.push([content, o.size, o.bold, false]);
  else { let cur = null;
    for (const r of content) { const op = r.options || {};
      if (!cur) cur = ['', op.fontSize || o.size, op.bold ?? o.bold, !!op.bullet];
      cur[0] += r.text; cur[1] = Math.max(cur[1], op.fontSize || o.size);
      if (op.breakLine) { paras.push(cur); cur = null; } }
    if (cur) paras.push(cur); }
  return paras.reduce((h, [t, pt, b, bul]) => h + nLines(t, pt, b, o.w - (bul ? 26 : 0), name) * lineH(pt, o.ls || 1), 0);
};

/* ------------------------------------------------------------------ conteúdo */
const FRENTES = [
  { n: '01', t: 'Plano de GMO', b: ['Diagnóstico de prontidão', 'Ações em cada fase do projeto', 'Medição da adoção ao modelo'] },
  { n: '02', t: 'Identidade visual', b: ['Marca e assinatura com o ONS', 'Paleta e grafismos próprios', 'Padrão de boletins e peças'] },
  { n: '03', t: 'Comunicação', b: ['16 comunicados', '29 edições de boletim', '12 vídeos e 1 game'] },
  { n: '04', t: 'Stakeholders', b: ['39 lideranças mapeadas', '26 entrevistas individuais', 'Influenciadores em 4 diretorias'] },
  { n: '05', t: 'Impactos', b: ['42 impactos revisados', '44 ações de mitigação', '16 impactos críticos tratados'] },
  { n: '06', t: 'Guia de bolso', b: ['Temas do modelo em um só lugar', 'Linguagem simples', 'Apoio à clareza de papéis'] },
];
const NUMEROS = [['+60', 'entrevistas'], ['490', 'respostas de prontidão'], ['16', 'comunicados'], ['12', 'vídeos'], ['31', 'encontros com o modelo'], ['4,17', 'índice de prontidão']];

async function build() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.theme = { headFontFace: FONT, bodyFontFace: FONT };
  pres.title = 'Gestão da Mudança · Entregas do Projeto Maestro';
  pres.company = 'Alvarez &amp; Marsal';

  const svg = fs.readFileSync(BRAND('maestro.svg'));
  const logo = b64(await sharp(svg, { density: 600 }).png().toBuffer()), logoW = await whiten(svg, { density: 600 });
  const ons = await pngOf(BRAND('ons.png')), onsW = await whiten(fs.readFileSync(BRAND('ons.png')));
  const bm = await sharp(BOL('semanal-01.png')).metadata(), BR = bm.height / bm.width; // proporção dos boletins
  const brand = color => ({ text: 'Alvarez & Marsal', options: { x: X(1240), y: X(20), w: X(298), h: X(28), margin: 0, align: 'right', valign: 'top', fontFace: FONT, fontSize: 11, color } });

  pres.defineSlideMaster({
    title: 'CAPA', background: { color: C.navy },
    objects: [
      { text: brand(C.white) },
      { image: { x: X(96), y: X(96), w: X(240), h: X(52), data: logoW, altText: 'Maestro' } },
      { placeholder: { options: { name: 'title', type: 'title', x: X(96), y: X(292), w: X(760), h: X(100), margin: 0, valign: 'top', align: 'left',
          fontFace: FONT, fontSize: 48, bold: true, color: C.white }, text: '' } },
      { placeholder: { options: { name: 'sub', type: 'body', x: X(96), y: X(400), w: X(760), h: X(96), margin: 0, valign: 'top', align: 'left',
          fontFace: FONT, fontSize: 22, color: C.pale }, text: '' } },
      { image: { x: X(96), y: X(796), w: X(170.5), h: X(40), data: onsW, altText: 'ONS' } },
    ],
  });
  pres.defineSlideMaster({
    title: 'CONTEUDO', background: { color: C.white },
    objects: [
      { text: brand(C.brand) },
      { placeholder: { options: { name: 'title', type: 'title', x: X(62), y: X(48), w: X(1476), h: X(58), margin: 0, valign: 'top', align: 'left',
          fontFace: FONT, fontSize: 28, color: C.navy }, text: '' } },
      { placeholder: { options: { name: 'sub', type: 'body', x: X(62), y: X(106), w: X(1476), h: X(36), margin: 0, valign: 'top', align: 'left',
          fontFace: FONT, fontSize: 17, color: C.steel }, text: '' } },
    ],
    slideNumber: { x: X(1478), y: X(858), w: X(60), h: X(22), fontFace: FONT, fontSize: 9, color: C.page, align: 'right' },
  });

  /* helpers: toda caixa de texto cresce até caber; textos e imagens são registrados para a checagem de sobreposição */
  let s, slideName = '', RECTS = [];
  const T = (name, content, o) => {
    let { x, y, w, h } = o;
    if (!o.rotate) {
      const need = needH(name, content, o);
      if (need > h) { const v = o.valign || 'top'; if (v === 'middle') y -= (need - h) / 2; else if (v === 'bottom') y -= need - h; h = need; }
      RECTS.push({ name, x, y, w, h });
    }
    return s.addText(content, Object.assign({ objectName: name, isTextBox: true, x: X(x), y: X(y), w: X(w), h: X(h),
      margin: 0, fontFace: FONT, fontSize: o.size, color: o.color || C.ink, bold: !!o.bold, align: o.align || 'left', valign: o.valign || 'top',
      fit: 'none', paraSpaceBefore: 0, paraSpaceAfter: 0 }, o.cs ? { charSpacing: o.cs } : {}, o.rotate ? { rotate: o.rotate } : {},
      o.ls ? { lineSpacingMultiple: o.ls } : {}));
  };
  const R = (name, shape, o) => s.addShape(shape, Object.assign({ objectName: name, x: X(o.x), y: X(o.y), w: X(o.w), h: X(o.h),
    fill: o.fill ? { color: o.fill } : { type: 'none' }, line: o.line ? { color: o.line, width: o.lw || 0.75 } : { type: 'none' } },
    o.r ? { rectRadius: X(o.r) } : {}));
  const IMG = (name, data, o) => { RECTS.push({ name, x: o.x, y: o.y, w: o.w, h: o.h });
    return s.addImage(Object.assign({ objectName: name, data, x: X(o.x), y: X(o.y), w: X(o.w), h: X(o.h), altText: o.alt || name },
      o.shadow ? { shadow: { type: 'outer', color: '0C344F', opacity: 0.22, blur: 10, offset: 3, angle: 90 } } : {})); };
  const RR = pres.shapes.ROUNDED_RECTANGLE, RECT = pres.shapes.RECTANGLE, OV = pres.shapes.OVAL, LINE = pres.shapes.LINE;
  const label = (name, t, o) => T(name, t.toUpperCase(), Object.assign({ size: 12, bold: true, color: C.label, cs: 0.8, h: 24 }, o));
  const newSlide = (master, name, section) => { check(); slideName = name; RECTS = []; s = pres.addSlide({ masterName: master, sectionTitle: section }); };
  const check = () => {
    for (let i = 0; i < RECTS.length; i++) for (let j = i + 1; j < RECTS.length; j++) {
      const a = RECTS[i], b = RECTS[j];
      const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (ox > 2 && oy > 2) PROBLEMS.push(`${slideName}: "${a.name}" sobrepõe "${b.name}" (${Math.round(ox)}×${Math.round(oy)} px)`);
    }
  };

  /* modelo de slide de frente (como o exemplo A&M): entrega e componentes à esquerda, imagem e resultados à direita */
  const frente = async (f, hero) => {
    newSlide('CONTEUDO', f.title, 'Frentes');
    s.addText(f.title, { placeholder: 'title' });
    s.addText(f.sub, { placeholder: 'sub' });
    label('Entrega · rótulo', 'Entrega realizada', { x: 76, y: 204, w: 540 });
    const h2 = textH(f.entrega, 22, true, 540), dy = 238 + h2 + 14, dh = textH(f.desc, 14, false, 540, 1.05);
    T('Entrega · título', f.entrega, { x: 76, y: 238, w: 540, h: h2, size: 22, bold: true, color: C.ink });
    T('Entrega · descrição', f.desc, { x: 76, y: dy, w: 540, h: dh, size: 14, color: C.body, ls: 1.05 });
    label('Componentes · rótulo', 'Principais componentes', { x: 76, y: 488, w: 540 });
    let cy = 526;
    f.comp.forEach((c, i) => {
      const ch = Math.max(textH(c, 16, true, 492), 34);
      T(`Componente ${i + 1} · número`, String(i + 1).padStart(2, '0'), { x: 76, y: cy, w: 44, h: 34, size: 17, bold: true, color: C.orange });
      T(`Componente ${i + 1} · texto`, c, { x: 124, y: cy, w: 492, h: ch, size: 16, bold: true, color: C.ink });
      cy += ch + 26;
    });
    await hero();
    R('Resultados · caixa', RR, { x: 672, y: 684, w: 866, h: 164, r: 16, fill: C.box });
    label('Resultados · rótulo', 'Resultados', { x: 698, y: 700, w: 820 });
    if (f.nums) f.nums.forEach(([n, l], i, a) => {
      const w = 820 / a.length, x = 698 + i * w;
      T(`Resultados · ${i + 1} · número`, n, { x, y: 726, w: w - 12, h: 60, size: 30, bold: true, color: C.navy });
      T(`Resultados · ${i + 1} · rótulo`, l, { x, y: 788, w: w - 14, h: 26, size: 13, color: C.body });
    });
    else T('Resultados · texto', f.res, { x: 698, y: 732, w: 820, h: 90, size: 15, color: C.ink, ls: 1.05 });
  };

  /* ---------------------------------------------------------------- 1 · capa */
  pres.addSection({ title: 'Abertura' });
  newSlide('CAPA', 'Capa', 'Abertura');
  s.addText('Gestão da Mudança', { placeholder: 'title' });
  s.addText([{ text: 'Entregas da frente de GMO do Projeto Maestro', options: { breakLine: true } },
    { text: 'out/2025 a out/2026', options: { fontSize: 16, color: C.steel } }], { placeholder: 'sub' });
  FRENTES.forEach((f, i) => {
    const y = 236 + i * 72;
    T(`Capa · frente ${f.n} · número`, f.n, { x: 1010, y, w: 60, h: 44, size: 22, bold: true, color: C.orange2, valign: 'middle' });
    T(`Capa · frente ${f.n} · nome`, f.t, { x: 1076, y, w: 420, h: 44, size: 22, color: C.white, valign: 'middle' });
    if (i < FRENTES.length - 1) R(`Capa · frente ${f.n} · divisória`, LINE, { x: 1010, y: y + 58, w: 470, h: 0, line: '24506F', lw: 0.75 });
  });
  T('Capa · data', 'Outubro de 2026', { x: 1238, y: 806, w: 300, h: 28, size: 14, color: C.pale, align: 'right' });

  /* --------------------------------------------------------- 2 · visão geral */
  pres.addSection({ title: 'Visão geral' });
  newSlide('CONTEUDO', 'Visão geral', 'Visão geral');
  s.addText('Seis frentes de Gestão da Mudança, do plano à adoção do novo modelo', { placeholder: 'title' });
  s.addText('O que a frente de GMO entregou no Projeto Maestro, de out/2025 a out/2026', { placeholder: 'sub' });
  const CW = (1476 - 5 * 16) / 6;
  FRENTES.forEach((f, i) => {
    const x = 62 + i * (CW + 16), k = `Frente ${f.n}`;
    R(`${k} · cartão`, RECT, { x, y: 196, w: CW, h: 448, fill: C.card, line: C.line });
    R(`${k} · topo`, RECT, { x, y: 196, w: CW, h: 7, fill: C.orange2 });
    T(`${k} · título`, f.t.toUpperCase(), { x: x + 12, y: 216, w: CW - 24, h: 60, size: 15, bold: true, color: C.orange2, align: 'center', valign: 'middle' });
    R(`${k} · círculo`, OV, { x: x + CW / 2 - 27, y: 288, w: 54, h: 54, line: C.circle, lw: 2 });
    T(`${k} · número`, f.n, { x: x + CW / 2 - 27, y: 288, w: 54, h: 54, size: 15, bold: true, color: C.circle, align: 'center', valign: 'middle' });
    f.b.forEach((t, j) => {
      const y = 372 + j * 88;
      T(`${k} · item ${j + 1}`, [{ text: t, options: { bullet: { indent: 14 } } }], { x: x + 16, y, w: CW - 30, h: 68, size: 14.5, color: C.ink, valign: 'middle' });
      if (j < f.b.length - 1) R(`${k} · divisória ${j + 1}`, LINE, { x: x + 16, y: y + 78, w: CW - 32, h: 0, line: C.sep, lw: 0.75 });
    });
  });
  R('Números · caixa', RECT, { x: 62, y: 672, w: 1476, h: 162, fill: 'F7FAFC', line: C.line });
  R('Números · divisória', LINE, { x: 456, y: 672, w: 0, h: 162, line: C.line, lw: 0.75 });
  T('Números · título', 'A GMO em números', { x: 88, y: 694, w: 344, h: 36, size: 18, bold: true, color: C.ink });
  T('Números · texto', 'Assessment, comunicação e adoção ao modelo, de outubro de 2025 a outubro de 2026.', { x: 88, y: 734, w: 344, h: 84, size: 14, color: C.body });
  NUMEROS.forEach(([n, l], i) => {
    const w = (1538 - 486) / 6, x = 486 + i * w;
    T(`Números · ${i + 1} · valor`, n, { x, y: 692, w: w - 10, h: 68, size: 34, bold: true, color: C.navy });
    T(`Números · ${i + 1} · rótulo`, l, { x, y: 764, w: w - 16, h: 56, size: 14, color: C.body });
  });

  /* -------------------------------------------------------- 3 · plano de GMO */
  pres.addSection({ title: 'Frentes' });
  await frente({
    title: 'Plano de Gestão da Mudança', sub: 'Do diagnóstico à Operação Assistida, com ações planejadas em cada fase do projeto',
    entrega: 'Plano de GMO do Projeto Maestro',
    desc: 'Preparou as pessoas da DPL, DTA, DOP e DAC para a nova Gerência Executiva de Ferramentas Eletroenergéticas (FE), com ações de diagnóstico, engajamento, comunicação e capacitação ao longo de todo o projeto.',
    comp: ['Diagnóstico da prontidão e das lideranças', 'Engajamento, comunicação e rede de agentes da mudança', 'Capacitação, reforço e medição da adoção'],
    res: 'O índice geral de prontidão subiu de 3,94 para 4,17 entre a 1ª e a 2ª pesquisa, com evolução nas quatro dimensões: ponto de partida favorável para a Operação Assistida.',
  }, async () => {
    const F = [['Entendimento', 'out–dez/25', ['1ª pesquisa de prontidão: 328 respostas', '+60 entrevistas internas e externas', 'Rede de Influenciadores e Café com a Liderança']],
      ['Desenho', 'jan–abr/26', ['Rede ampliada para DTA, DOP e DAC', 'Série Fala, Maestro', 'Mapeamento dos impactos organizacionais']],
      ['Transição', 'abr–jun/26', ['Divulgação da nova gerência em 15 e 16/04', 'Roadmap da implantação da mudança', 'Plano de capacitação']],
      ['Operação Assistida', 'jul–out/26', ['2ª pesquisa: índice de prontidão 4,17', '8 treinamentos e 7 workshops', 'Game do Maestro e Guia de Bolso']]];
    const W = (866 - 3 * 24) / 4;
    R('Plano · linha do tempo', LINE, { x: 680, y: 222, w: 850, h: 0, line: C.line, lw: 1.5 });
    F.forEach(([fase, quando, acoes], i) => {
      const x = 672 + i * (W + 24), k = `Plano · fase ${i + 1}`, cor = i === 3 ? C.orange2 : C.circle;
      R(`${k} · marco`, OV, { x: x + 2, y: 213, w: 18, h: 18, fill: cor });
      T(`${k} · período`, quando, { x, y: 244, w: W, h: 26, size: 13, color: C.steel });
      T(`${k} · nome`, fase, { x, y: 272, w: W, h: 34, size: 17, bold: true, color: i === 3 ? C.orange : C.ink });
      acoes.forEach((a, j) => {
        const y = 344 + j * 104;
        T(`${k} · ação ${j + 1}`, a, { x, y, w: W, h: 30, size: 14, color: C.ink, ls: 1.05 });
        if (j < acoes.length - 1) R(`${k} · divisória ${j + 1}`, LINE, { x, y: y + 94, w: W, h: 0, line: C.sep, lw: 0.75 });
      });
    });
  });

  /* --------------------------------------------------- 4 · identidade visual */
  await frente({
    title: 'Identidade visual do Maestro', sub: 'Uma marca própria para o projeto ser reconhecido de imediato em todo o ONS',
    entrega: 'Marca Maestro e padrão visual do projeto',
    desc: 'Deu ao projeto uma assinatura própria, aplicada de forma consistente em boletins, convites, materiais de divulgação e canais digitais, como a página no Sou+ e o fundo de tela.',
    comp: ['Marca Maestro e assinatura com o ONS', 'Paleta oliva e lima e grafismos próprios', 'Templates de boletim semanal e mensal'],
    res: 'As 29 edições de boletim, de nov/25 a out/26, seguem o mesmo padrão visual: a mensagem do projeto é reconhecida antes mesmo da leitura.',
  }, async () => {
    const th = 444, tw = Math.round(th / BR), pw = 866 - tw - 28;
    R('Identidade · prancha', RR, { x: 672, y: 206, w: pw, h: 444, r: 16, fill: C.box });
    IMG('Identidade · marca', logo, { x: 672 + pw / 2 - 180, y: 240, w: 360, h: 78, alt: 'Marca Maestro' });
    label('Identidade · paleta · rótulo', 'Paleta', { x: 704, y: 356, w: 300 });
    const sw = (pw - 64 - 2 * 16) / 3;
    [['Oliva', C.ol], ['Lima', C.li], ['Grafite', C.gr]].forEach(([n, hex], i) => {
      const x = 704 + i * (sw + 16);
      R(`Identidade · cor ${n}`, RR, { x, y: 388, w: sw, h: 88, r: 12, fill: hex });
      T(`Identidade · cor ${n} · nome`, [{ text: n, options: { bold: true, breakLine: true } }, { text: '#' + hex, options: { fontSize: 12, color: C.body } }],
        { x, y: 484, w: sw, h: 48, size: 14, color: C.ink });
    });
    label('Identidade · assinatura · rótulo', 'Assinatura', { x: 704, y: 556, w: 300 });
    IMG('Identidade · assinatura · Maestro', logo, { x: 704, y: 596, w: 156, h: 34, alt: 'Maestro' });
    IMG('Identidade · assinatura · ONS', ons, { x: 888, y: 592, w: 170.5, h: 40, alt: 'ONS' });
    IMG('Identidade · boletim', await pngOf(BOL('semanal-01.png')), { x: 1538 - tw, y: 206, w: tw, h: th, alt: 'Boletim semanal', shadow: true });
  });

  /* --------------------------------------------------------- 5 · comunicação */
  await frente({
    title: 'Comunicação na Operação Assistida', sub: 'Boletins e canais que levaram o novo modelo às equipes, de 15/07 a 31/10/26',
    entrega: 'Plano de comunicação da Operação Assistida',
    desc: 'Manteve a cadência de boletins e abriu novos canais para apoiar a apropriação do modelo pelas equipes da FE e das áreas clientes.',
    comp: ['Boletins: 7 semanais e 1 mensal', 'Vozes do Maestro: depoimentos de especialistas', 'Game e Guia de Bolso para o dia a dia do modelo'],
    nums: [['8', 'edições de boletim'], ['2', 'vozes do Maestro'], ['1', 'game de aprendizagem'], ['1', 'Guia de Bolso']],
  }, async () => {
    const items = [['semanal-07.png', 'Boletim semanal', 'jul/26'], ['semanal-04.png', 'Boletim semanal', 'ago/26'], ['mensal-1.png', 'Boletim mensal', 'set/26'], ['semanal-02.png', 'Boletim semanal', 'out/26']];
    const G = 18, W = Math.floor((866 - 4 * G) / 5), H = Math.round(W * BR), cap = 212 + H + 14;
    for (const [i, [f, t, q]] of items.entries()) {
      const x = 672 + i * (W + G);
      IMG(`Comunicação · boletim ${i + 1}`, await pngOf(BOL(f)), { x, y: 212, w: W, h: H, alt: `${t} ${q}`, shadow: true });
      T(`Comunicação · boletim ${i + 1} · legenda`, [{ text: t, options: { bold: true, breakLine: true } }, { text: q, options: { color: C.steel } }],
        { x, y: cap, w: W, h: 50, size: 12.5, color: C.ink, align: 'center' });
    }
    const gx = 672 + 4 * (W + G);
    R('Comunicação · game · cartão', RR, { x: gx, y: 212, w: W, h: H, r: 10, fill: C.navy });
    IMG('Comunicação · game · ícone', await icon(Fa.FaGamepad, C.li), { x: gx + W / 2 - 34, y: 212 + H / 2 - 76, w: 68, h: 68, alt: 'Game' });
    T('Comunicação · game · texto', [{ text: 'Gamificação', options: { bold: true, breakLine: true } }, { text: 'do projeto', options: {} }],
      { x: gx + 10, y: 212 + H / 2 + 8, w: W - 20, h: 60, size: 15, color: C.white, align: 'center' });
    T('Comunicação · game · legenda', [{ text: 'Game do Maestro', options: { bold: true, breakLine: true } }, { text: 'set/26', options: { color: C.steel } }],
      { x: gx, y: cap, w: W, h: 50, size: 12.5, color: C.ink, align: 'center' });
  });

  /* -------------------------------------------------------- 6 · stakeholders */
  await frente({
    title: 'Gestão de stakeholders', sub: 'Quem é impactado, quem influencia e como engajar cada liderança',
    entrega: 'Mapa de stakeholders e entrevistas com as lideranças',
    desc: 'Mapeou as lideranças de quatro diretorias por impacto e influência e ouviu cada uma em entrevistas individuais, para orientar o engajamento de quem seria mais afetado pela mudança.',
    comp: ['39 lideranças mapeadas na DPL, DOP, DTA e DAC', '26 entrevistas e diagnóstico ADKAR dos 5 líderes da FE', 'Rede de Influenciadores ativa em 4 diretorias'],
    res: '85% das lideranças entrevistadas têm postura favorável à mudança (22 de 26). Na matriz, cada número é a quantidade de lideranças em cada combinação de impacto e influência.',
  }, async () => {
    const M = { 3: [0, 10, 6], 2: [1, 5, 2], 1: [0, 2, 0] }, gx = 790, gy = 208, cw = 172, ch = 112;
    T('Matriz · eixo impacto', 'IMPACTO', { x: 672 - 140, y: gy + 1.5 * ch - 12, w: 300, h: 24, size: 12, bold: true, color: C.label, align: 'center', rotate: 270, cs: 0.8 });
    ['Alto', 'Médio', 'Baixo'].forEach((l, r) => T(`Matriz · linha ${l}`, l, { x: 704, y: gy + r * ch, w: 74, h: ch, size: 14, color: C.body, align: 'right', valign: 'middle' }));
    ['Baixa', 'Média', 'Alta'].forEach((l, c) => T(`Matriz · coluna ${l}`, l, { x: gx + c * cw, y: gy + 3 * ch + 10, w: cw, h: 28, size: 14, color: C.body, align: 'center' }));
    T('Matriz · eixo influência', 'INFLUÊNCIA', { x: gx, y: gy + 3 * ch + 42, w: 3 * cw, h: 24, size: 12, bold: true, color: C.label, align: 'center', cs: 0.8 });
    [3, 2, 1].forEach((imp, r) => M[imp].forEach((n, c) => {
      const x = gx + c * cw, y = gy + r * ch;
      R(`Matriz · célula ${r + 1}${c + 1}`, RECT, { x, y, w: cw, h: ch, fill: r === 0 && c > 0 ? C.box2 : C.box, line: C.white, lw: 3 });
      if (!n) return;
      const d = Math.round(36 + Math.sqrt(n) * 19);
      R(`Matriz · bolha ${r + 1}${c + 1}`, OV, { x: x + cw / 2 - d / 2, y: y + ch / 2 - d / 2, w: d, h: d, fill: C.circle });
      T(`Matriz · valor ${r + 1}${c + 1}`, String(n), { x: x + cw / 2 - d / 2, y: y + ch / 2 - d / 2, w: d, h: d, size: n > 4 ? 20 : 15, bold: true, color: C.white, align: 'center', valign: 'middle' });
    }));
    [['16', 'com alto impacto'], ['8', 'com alta influência'], ['39', 'lideranças mapeadas']].forEach(([n, l], i) => {
      const y = gy + i * 120;
      T(`Matriz · destaque ${i + 1} · valor`, n, { x: 1340, y, w: 198, h: 68, size: 34, bold: true, color: C.navy });
      T(`Matriz · destaque ${i + 1} · rótulo`, l, { x: 1340, y: y + 66, w: 198, h: 28, size: 14, color: C.body });
    });
  });

  /* ------------------------------------------------------------ 7 · impactos */
  // fonte: Projeto_Maestro_Gestão_dos_Impactos_v3 (revisão de 18/08/2026, na Operação Assistida)
  await frente({
    title: 'Gestão dos impactos', sub: 'Matriz revisada na Operação Assistida, com plano de mitigação e responsáveis',
    entrega: 'Revisão da matriz de impactos e plano de mitigação',
    desc: 'Na Operação Assistida, a matriz de impactos foi revisada e os impactos ganharam ações de mitigação com responsável, acompanhadas pela Gestão da Mudança.',
    comp: ['42 impactos revisados por diretoria, tipo e criticidade', '44 ações de mitigação com responsável definido', '21 ações lideradas pela Gestão da Mudança'],
    res: 'Matriz revisada em 18/08/2026: 16 impactos de criticidade alta ou muito alta, 12 deles na DPL, tratados com treinamento, alocação de atividades e revisão de processos.',
  }, async () => {
    label('Impactos · rótulo', 'Revisão da Operação Assistida', { x: 672, y: 204, w: 560 });
    T('Impactos · revisão', '18/08/2026', { x: 1238, y: 204, w: 300, h: 24, size: 13, bold: true, color: C.orange, align: 'right' });
    [['42', 'impactos revisados'], ['16', 'de criticidade alta ou muito alta'], ['44', 'ações de mitigação'], ['21', 'lideradas pela Gestão da Mudança']].forEach(([n, l], i) => {
      const w = 866 / 4, x = 672 + i * w;
      T(`Impactos · kpi ${i + 1} · valor`, n, { x, y: 236, w: w - 16, h: 60, size: 30, bold: true, color: C.navy });
      T(`Impactos · kpi ${i + 1} · rótulo`, l, { x, y: 296, w: w - 20, h: 26, size: 13, color: C.body });
    });
    // tipos de mitigação (44 ações)
    const TM = [['Treinamento', 12], ['Alocação de atividades', 11], ['Revisão de processos', 10], ['Comunicação', 5], ['Contratação', 2], ['Redefinição de papéis', 2], ['Infraestrutura', 2]];
    label('Impactos · tipos · rótulo', 'Ações por tipo de mitigação', { x: 672, y: 372, w: 400 });
    TM.forEach(([n, q], i) => {
      const y = 404 + i * 34;
      T(`Impactos · tipo ${i + 1}`, n, { x: 672, y, w: 204, h: 26, size: 12.5, color: C.ink, valign: 'middle' });
      R(`Impactos · tipo ${i + 1} · barra`, RECT, { x: 884, y: y + 5, w: 140 * q / 12, h: 16, fill: C.circle });
      T(`Impactos · tipo ${i + 1} · valor`, String(q), { x: 884 + 140 * q / 12 + 8, y, w: 30, h: 26, size: 12.5, bold: true, color: C.ink, valign: 'middle' });
    });
    // mapa de calor: diretoria × criticidade
    const DIR = ['DPL', 'DTA', 'DAC', 'DOP', 'DGL', 'Todos'], CR = ['Baixo', 'Moderado', 'Alto', 'Muito alto'];
    const H = { DPL: [2, 7, 11, 1], DTA: [4, 3, 2, 0], DAC: [2, 1, 2, 0], DOP: [0, 4, 0, 0], DGL: [2, 0, 0, 0], Todos: [0, 1, 0, 0] };
    const hx = 1166, cw = (1538 - hx) / 4, ch = 34, hy = 432;
    label('Impactos · mapa · rótulo', 'Impactos por criticidade', { x: 1086, y: 372, w: 452 });
    CR.forEach((c, j) => T(`Impactos · mapa · coluna ${c}`, c, { x: hx + j * cw, y: hy - 26, w: cw, h: 22, size: 11, bold: true, color: C.label, align: 'center' }));
    const tint = n => n === 0 ? C.card : n <= 2 ? 'DCE7F1' : n <= 4 ? 'AFC6DD' : n <= 7 ? '5E8AB3' : C.circle;
    DIR.forEach((d, i) => {
      T(`Impactos · mapa · ${d}`, d, { x: 1086, y: hy + i * ch, w: 74, h: ch, size: 12, color: C.body, align: 'right', valign: 'middle' });
      H[d].forEach((n, j) => {
        R(`Impactos · mapa · ${d} · ${CR[j]}`, RECT, { x: hx + j * cw, y: hy + i * ch, w: cw, h: ch, fill: tint(n), line: C.white, lw: 2 });
        if (n) T(`Impactos · mapa · ${d} · ${CR[j]} · valor`, String(n), { x: hx + j * cw, y: hy + i * ch, w: cw, h: ch, size: 12.5, bold: true, color: n > 4 ? C.white : C.ink, align: 'center', valign: 'middle' });
      });
    });
  });

  /* -------------------------------------------------------- 8 · guia de bolso */
  await frente({
    title: 'Guia de bolso do Maestro', sub: 'O novo modelo de operação em formato de consulta rápida',
    entrega: 'Guia de Bolso Maestro',
    desc: 'Reuniu em um só material, de forma simples e de fácil acesso a todos, os principais temas do novo modelo de operação, para apoiar as equipes no dia a dia da Operação Assistida.',
    comp: ['Temas do modelo unificados em um só lugar', 'Linguagem simples, para consulta rápida', 'Apoio à clareza de papéis e responsabilidades'],
    res: 'O guia é um dos critérios da frente "Clareza de papéis e responsabilidades", uma das cinco usadas para medir a adoção ao modelo de operação.',
  }, async () => {
    const F = ['Ritos e fóruns de governança', 'Clareza de papéis e responsabilidades', 'Interfaces com áreas de negócio', 'Uso das ferramentas oficiais', 'Adoção do fluxo de backlog'];
    const crit = ['Guia de bolso disponibilizado', 'Alinhamento com gerentes', 'Alinhamento com líderes de comunidade', 'Exercício dos papéis', 'Desdobramento para o time'];
    label('Guia · rótulo', 'Onde o guia entra na medição da adoção', { x: 672, y: 204, w: 866 });
    const WON = 246, W = (866 - WON - 4 * 12) / 4;
    let gx = 672;
    F.forEach((t, i) => {
      const on = i === 1, w = on ? WON : W, k = `Guia · frente ${i + 1}`;
      R(`${k} · cartão`, RECT, { x: gx, y: 240, w, h: 88, fill: on ? C.white : C.card, line: on ? C.orange2 : C.line, lw: on ? 2 : 0.75 });
      T(`${k} · nome`, t, { x: gx + 10, y: 248, w: w - 20, h: 72, size: on ? 15 : 13, bold: on, color: on ? C.orange : C.body, align: 'center', valign: 'middle' });
      gx += w + 12;
    });
    R('Guia · critérios · cartão', RR, { x: 672, y: 348, w: 866, h: 302, r: 16, fill: C.box });
    label('Guia · critérios · rótulo', 'Critérios de clareza de papéis e responsabilidades', { x: 698, y: 368, w: 820 });
    for (const [i, c] of crit.entries()) {
      const y = 406 + i * 46, on = i === 0;
      R(`Guia · critério ${i + 1} · marca`, OV, { x: 698, y: y + 4, w: 28, h: 28, fill: on ? C.orange2 : C.white, line: on ? undefined : C.line });
      if (on) IMG('Guia · critério 1 · ok', await icon(Fi.FiCheck, C.white), { x: 704, y: y + 10, w: 16, h: 16, alt: 'Atendido' });
      T(`Guia · critério ${i + 1}`, c, { x: 742, y, w: 760, h: 36, size: 16, bold: on, color: on ? C.ink : C.body, valign: 'middle' });
    }
  });

  check();
  if (PROBLEMS.length) console.warn('ATENÇÃO:\n  ' + PROBLEMS.join('\n  ')); else console.log('Medição: nenhum texto estourado e nenhuma sobreposição.');
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await pres.writeFile({ fileName: OUT });
  await finish(OUT);
  console.log(OUT);
}

/* tema A&M nas cores do documento, contornos vazios explícitos, idioma pt-BR e marca A&M em caixa-alta reduzida */
async function finish(file) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const tp = 'ppt/theme/theme1.xml';
  const scheme = `<a:clrScheme name="${THEME.name}">` + Object.entries(THEME.colors).map(([k, v]) => `<a:${k}><a:srgbClr val="${v}"/></a:${k}>`).join('') + '</a:clrScheme>';
  zip.file(tp, (await zip.file(tp).async('string')).replace(/<a:clrScheme\b[\s\S]*?<\/a:clrScheme>/, () => scheme)
    .replace(/(<a:(?:theme|fontScheme)\b[^>]*?\bname=")[^"]*"/g, (_, h) => h + THEME.name + '"'));
  for (const n of Object.keys(zip.files)) if (/^ppt\/(slides|slideLayouts|slideMasters|notesSlides)\/[^/]+\.xml$/.test(n))
    zip.file(n, (await zip.file(n).async('string')).replace(/<a:ln><\/a:ln>/g, '<a:ln><a:noFill/></a:ln>').replace(/lang="en-US"/g, 'lang="pt-BR"')
      .replace(/<a:r>(<a:rPr\b)((?:(?!<\/a:r>)[\s\S])*?<a:t>Alvarez &amp; Marsal<\/a:t><\/a:r>)/g, '<a:r>$1 cap="small"$2'));
  fs.writeFileSync(file, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
}

build().catch(e => { console.error(e); process.exit(1); });
