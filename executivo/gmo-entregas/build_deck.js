#!/usr/bin/env node
/* Gera dist/GMO_Entregas_Maestro.pptx: capa, visão geral das frentes de GMO e um slide por frente
   (contexto, entrega e imagem), no padrão visual A&M.
   Requer: npm i pptxgenjs sharp
   Imagens dos boletins em assets/boletins/ (fora do git; renderizadas dos PPTs de status do projeto).
   Coordenadas em px de um palco 1600×900 (120 px = 1 polegada). */
const fs = require('fs'), path = require('path');
const pptxgen = require('pptxgenjs');
const JSZip = require(require.resolve('jszip', { paths: [require.resolve('pptxgenjs')] }));
const sharp = require('sharp');

const ROOT = __dirname, OUT = path.join(ROOT, 'dist', 'GMO_Entregas_Maestro.pptx');
const BOL = f => path.join(ROOT, 'assets', 'boletins', f), BRAND = f => path.join(ROOT, '..', 'maestro-gmo', 'assets', f);
const X = v => +(v / 120).toFixed(4);
const C = { navy: '002A46', ink: '0C344F', steel: '5E8AB3', label: '4B7AA5', body: '536978', orange: 'C7680B', orange2: 'D56F00',
  circle: '0B4D78', box: 'EDF3F7', card: 'FAFBFC', cardLine: 'D8E0E6', sep: 'E3E9EE', page: '688091', brand: '00274D',
  bullet: '213D52', pale: 'AFC6DD', ol: '4C641D', li: 'D3CE22', gr: '54575C', white: 'FFFFFF' };
const THEME = { name: 'AM Maestro GMO', colors: { dk1: C.ink, lt1: C.white, dk2: C.navy, lt2: C.box, accent1: C.circle, accent2: C.orange,
  accent3: C.label, accent4: C.steel, accent5: C.ol, accent6: C.li, hlink: C.circle, folHlink: C.body } };
const SANS = 'Arial', NARROW = 'Arial Narrow';

const b64 = buf => 'image/png;base64,' + buf.toString('base64');
const pngFile = async f => b64(await sharp(f).png().toBuffer());
const whiten = async (buf, opt) => { // silhueta branca preservando a transparência
  const { data, info } = await sharp(buf, opt).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) { data[i] = data[i + 1] = data[i + 2] = 255; }
  return b64(await sharp(data, { raw: info }).png().toBuffer());
};

/* ---------------------------------------------------------------- frentes */
const FRENTES = [
  { n: '01', t: 'Plano de GMO', b: ['Diagnóstico de prontidão', 'Ações por fase do projeto', 'Medição da adoção'] },
  { n: '02', t: 'Identidade visual', b: ['Marca Maestro', 'Padrão de boletins e peças', 'Presença no Sou+'] },
  { n: '03', t: 'Comunicação', b: ['16 comunicados', '29 edições de boletim', '12 vídeos e 1 game'] },
  { n: '04', t: 'Stakeholders', b: ['39 lideranças mapeadas', '26 entrevistas', 'Rede de Influenciadores'] },
  { n: '05', t: 'Impactos', b: ['Todas as gerências do ONS', 'Stakeholders externos', 'Mapeamento fev–mar/26'] },
  { n: '06', t: 'Guia de bolso', b: ['Temas do modelo unificados', 'Linguagem simples', 'Acesso fácil para todos'] },
];
const NUMEROS = [['+60', 'entrevistas'], ['490', 'respostas de prontidão'], ['16', 'comunicados'], ['12', 'vídeos'], ['31', 'encontros com o modelo'], ['4,17', 'índice de prontidão']];

async function build() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.theme = { headFontFace: SANS, bodyFontFace: NARROW };
  pres.title = 'Gestão da Mudança · Entregas do Projeto Maestro';
  pres.company = 'Alvarez &amp; Marsal';

  const svg = fs.readFileSync(BRAND('maestro.svg'));
  const logo = b64(await sharp(svg, { density: 600 }).png().toBuffer()), logoW = await whiten(svg, { density: 600 });
  const ons = await pngFile(BRAND('ons.png')), onsW = await whiten(fs.readFileSync(BRAND('ons.png')));
  const brand = color => ({ text: 'Alvarez & Marsal', options: { x: X(1240), y: X(20), w: X(298), h: X(24), margin: 0, align: 'right', valign: 'top', fontFace: SANS, fontSize: 10.5, color } });

  pres.defineSlideMaster({
    title: 'CAPA', background: { color: C.navy },
    objects: [
      { image: { x: X(96), y: X(92), w: X(226), h: X(49), data: logoW, altText: 'Maestro' } },
      { text: brand(C.white) },
      { placeholder: { options: { name: 'title', type: 'title', x: X(96), y: X(330), w: X(820), h: X(130), margin: 0, valign: 'top', align: 'left',
          fontFace: SANS, fontSize: 40, bold: true, color: C.white }, text: '' } },
      { placeholder: { options: { name: 'sub', type: 'body', x: X(96), y: X(470), w: X(820), h: X(80), margin: 0, valign: 'top', align: 'left',
          fontFace: NARROW, fontSize: 20, color: C.pale }, text: '' } },
      { image: { x: X(96), y: X(800), w: X(170.5), h: X(40), data: onsW, altText: 'ONS' } },
    ],
  });
  pres.defineSlideMaster({
    title: 'CONTEUDO', background: { color: C.white },
    objects: [
      { text: brand(C.brand) },
      { placeholder: { options: { name: 'title', type: 'title', x: X(62), y: X(54), w: X(1476), h: X(92), margin: 0, valign: 'top', align: 'left',
          fontFace: SANS, fontSize: 22, color: C.navy }, text: '' } },
      { placeholder: { options: { name: 'sub', type: 'body', x: X(62), y: X(104), w: X(1476), h: X(32), margin: 0, valign: 'top', align: 'left',
          fontFace: NARROW, fontSize: 15, color: C.steel }, text: '' } },
    ],
    slideNumber: { x: X(1478), y: X(866), w: X(60), h: X(18), fontFace: SANS, fontSize: 8, color: C.page, align: 'right' },
  });

  /* helpers */
  let s;
  const T = (name, content, o) => s.addText(content, Object.assign({ objectName: name, isTextBox: true, x: X(o.x), y: X(o.y), w: X(o.w), h: X(o.h),
    margin: 0, fontFace: o.font || NARROW, fontSize: o.size, color: o.color || C.ink, bold: !!o.bold, italic: !!o.italic, align: o.align || 'left',
    valign: o.valign || 'top', fit: 'none', paraSpaceBefore: 0, paraSpaceAfter: o.after || 0, lang: 'pt-BR' },
    o.cs ? { charSpacing: o.cs } : {}, o.rotate ? { rotate: o.rotate } : {}, o.ls ? { lineSpacingMultiple: o.ls } : {}));
  const R = (name, shape, o) => s.addShape(shape, Object.assign({ objectName: name, x: X(o.x), y: X(o.y), w: X(o.w), h: X(o.h),
    fill: o.fill ? { color: o.fill } : { type: 'none' },
    line: o.line ? { color: o.line, width: o.lw || 0.75, dashType: o.dash || 'solid' } : { type: 'none' } },
    o.r ? { rectRadius: X(o.r) } : {}, o.shadow ? { shadow: { type: 'outer', color: '0C344F', opacity: 0.18, blur: 8, offset: 3, angle: 90 } } : {}));
  const IMG = async (name, file, o) => s.addImage({ objectName: name, data: await pngFile(file), x: X(o.x), y: X(o.y), w: X(o.w), h: X(o.h), altText: o.alt || name });
  const RR = pres.shapes.ROUNDED_RECTANGLE, RECT = pres.shapes.RECTANGLE, OV = pres.shapes.OVAL, LINE = pres.shapes.LINE;
  const pending = (name, label, o) => { // espaço reservado para a imagem que vem do Drive
    R(`PENDENTE · ${name}`, RR, { x: o.x, y: o.y, w: o.w, h: o.h, r: 12, fill: o.dark ? '0D3756' : C.card, line: o.dark ? '5E8AB3' : 'C3CFD9', lw: 1.25, dash: 'dash' });
    T(`PENDENTE · ${name} · texto`, [{ text: label, options: { bold: true, breakLine: true } }, { text: 'aguardando arquivo do Drive', options: { fontSize: 11 } }],
      { x: o.x + 20, y: o.y, w: o.w - 40, h: o.h, size: 14, color: o.dark ? C.pale : C.body, align: 'center', valign: 'middle' });
  };
  const runs = arr => arr.map(([t, o]) => ({ text: t, options: o || {} }));

  /* modelo de slide de frente: contexto · entrega · componentes à esquerda; imagem e resultado à direita */
  const frente = async (f, draw) => {
    s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Frentes' });
    s.addText(f.title, { placeholder: 'title' });
    s.addText(f.sub, { placeholder: 'sub' });
    T('Contexto · rótulo', 'CONTEXTO', { x: 76, y: 196, w: 560, h: 20, size: 11.5, bold: true, color: C.label, cs: 0.6 });
    T('Contexto · texto', f.contexto, { x: 76, y: 222, w: 560, h: 84, size: 13.5, color: C.body });
    T('Entrega · rótulo', 'ENTREGA REALIZADA', { x: 76, y: 318, w: 560, h: 20, size: 11.5, bold: true, color: C.label, cs: 0.6 });
    T('Entrega · título', f.entrega, { x: 76, y: 344, w: 560, h: 82, size: 20, bold: true, color: C.ink });
    T('Componentes · rótulo', 'PRINCIPAIS COMPONENTES', { x: 76, y: 446, w: 560, h: 20, size: 11.5, bold: true, color: C.label, cs: 0.6 });
    f.comp.forEach((c, i) => {
      T(`Componente ${i + 1} · número`, String(i + 1).padStart(2, '0'), { x: 76, y: 482 + i * 76, w: 50, h: 32, size: 17, bold: true, color: C.orange });
      T(`Componente ${i + 1} · texto`, c, { x: 132, y: 482 + i * 76, w: 504, h: 66, size: 15, bold: true, color: C.ink });
    });
    await draw();
    R('Resultado · caixa', RR, { x: 680, y: 690, w: 858, h: 140, r: 14, fill: C.box });
    T('Resultado · rótulo', f.resLabel || 'RESULTADO', { x: 702, y: 706, w: 814, h: 20, size: 11.5, bold: true, color: C.label, cs: 0.6 });
    if (f.resNums) f.resNums.forEach(([n, l], i, a) => {
      const w = 814 / a.length, x = 702 + i * w;
      T(`Resultado · número ${i + 1}`, n, { x, y: 734, w: w - 10, h: 40, size: 24, bold: true, font: SANS, color: C.ink });
      T(`Resultado · rótulo ${i + 1}`, l, { x, y: 778, w: w - 12, h: 40, size: 12, color: C.body });
    });
    else T('Resultado · texto', f.res, { x: 702, y: 734, w: 814, h: 84, size: 14, color: C.ink });
  };

  /* ------------------------------------------------------------- 1 · capa */
  pres.addSection({ title: 'Abertura' });
  s = pres.addSlide({ masterName: 'CAPA', sectionTitle: 'Abertura' });
  s.addText('Gestão da Mudança', { placeholder: 'title' });
  s.addText([{ text: 'Entregas da frente de GMO do Projeto Maestro', options: { breakLine: true } }, { text: 'out/2025 a out/2026', options: { fontSize: 15 } }], { placeholder: 'sub' });
  pending('Watt', 'Watt', { x: 980, y: 170, w: 470, h: 560, dark: true });
  T('Capa · data', 'Outubro de 2026', { x: 1238, y: 812, w: 300, h: 22, size: 13, color: C.pale, align: 'right' });

  /* --------------------------------------------------- 2 · visão geral */
  pres.addSection({ title: 'Visão geral' });
  s = pres.addSlide({ masterName: 'CONTEUDO', sectionTitle: 'Visão geral' });
  s.addText('A Gestão da Mudança do Maestro foi estruturada em seis frentes, do plano à adoção do novo modelo de operação', { placeholder: 'title' });
  const CW = (1476 - 5 * 14) / 6;
  FRENTES.forEach((f, i) => {
    const x = 62 + i * (CW + 14), k = `Frente ${f.n}`;
    R(`${k} · cartão`, RECT, { x, y: 186, w: CW, h: 452, fill: C.card, line: C.cardLine });
    R(`${k} · topo`, RECT, { x, y: 186, w: CW, h: 8, fill: C.orange2 });
    T(`${k} · título`, f.t.toUpperCase(), { x: x + 12, y: 212, w: CW - 24, h: 50, size: 14, bold: true, color: C.orange2, align: 'center', valign: 'middle' });
    R(`${k} · círculo`, OV, { x: x + CW / 2 - 28, y: 280, w: 56, h: 56, line: C.circle, lw: 2 });
    T(`${k} · número`, f.n, { x: x + CW / 2 - 28, y: 280, w: 56, h: 56, size: 14, bold: true, color: C.circle, align: 'center', valign: 'middle' });
    f.b.forEach((t, j) => {
      const y = 372 + j * 78;
      T(`${k} · item ${j + 1}`, [{ text: t, options: { bullet: { indent: 14 } } }], { x: x + 16, y, w: CW - 30, h: 56, size: 14, color: C.bullet, valign: 'middle' });
      if (j < f.b.length - 1) R(`${k} · divisória ${j + 1}`, LINE, { x: x + 16, y: y + 66, w: CW - 32, h: 0, line: C.sep, lw: 0.75 });
    });
  });
  R('Números · caixa', RECT, { x: 62, y: 676, w: 1476, h: 150, fill: 'F7FAFC', line: C.cardLine });
  R('Números · divisória', LINE, { x: 470, y: 676, w: 0, h: 150, line: C.cardLine, lw: 0.75 });
  T('Números · título', 'A GMO em números', { x: 86, y: 700, w: 360, h: 26, size: 15, bold: true, color: C.ink });
  T('Números · texto', 'Assessment, comunicação e adoção ao modelo, de out/2025 a out/2026.', { x: 86, y: 732, w: 360, h: 60, size: 13, color: C.body });
  NUMEROS.forEach(([n, l], i) => {
    const w = (1538 - 500) / 6, x = 500 + i * w;
    T(`Números · ${i + 1} · valor`, n, { x, y: 704, w: w - 10, h: 48, size: 28, bold: true, font: SANS, color: C.navy });
    T(`Números · ${i + 1} · rótulo`, l, { x, y: 758, w: w - 14, h: 44, size: 12.5, color: C.body });
  });

  /* ------------------------------------------------------ 3 · plano de GMO */
  pres.addSection({ title: 'Frentes' });
  await frente({
    title: 'Plano de Gestão da Mudança', sub: 'A estratégia que conduziu as pessoas do diagnóstico à Operação Assistida',
    contexto: 'A criação da FE mudaria estrutura, papéis e rotinas de quatro diretorias. Era preciso preparar as pessoas antes, durante e depois da mudança.',
    entrega: 'Plano de GMO com ações em cada fase do projeto',
    comp: ['Diagnóstico: prontidão, entrevistas e leitura ADKAR',
      'Engajamento: influenciadores e Café com a Liderança',
      'Implantação: roadmap, capacitação e medição da adoção'],
    res: 'O índice de prontidão subiu de 3,94 para 4,17 entre as duas pesquisas: ponto de partida favorável para a Operação Assistida.',
  }, async () => {
    const F = [['Entendimento', 'out–dez/25', ['Pesquisa de prontidão: 328 respostas', '+60 entrevistas', 'Narrativa da mudança e Café com a Liderança']],
      ['Desenho', 'jan–abr/26', ['Rede de Influenciadores em 4 diretorias', 'Série Fala, Maestro', 'Mapeamento de impactos']],
      ['Transição', 'abr–jun/26', ['Divulgação da nova gerência (15–16/04)', 'Roadmap da implantação da mudança', 'Plano de capacitação']],
      ['Operação Assistida', 'jul–out/26', ['Pesquisa 2: índice 4,17', '8 treinamentos e 7 workshops', 'Game do Maestro e guia de bolso']]];
    const W = (858 - 3 * 8) / 4;
    F.forEach(([fase, quando, acoes], i) => {
      const x = 680 + i * (W + 8), k = `Plano · fase ${i + 1}`, fill = ['0B4D78', '1F5F8B', '4B7AA5', C.orange2][i];
      R(`${k} · seta`, i === 0 ? pres.shapes.PENTAGON : pres.shapes.CHEVRON, { x, y: 206, w: W, h: 78, fill });
      T(`${k} · nome`, [{ text: fase, options: { bold: true, breakLine: true } }, { text: quando, options: { fontSize: 11.5 } }],
        { x: x + (i === 0 ? 16 : 30), y: 206, w: W - 52, h: 78, size: 12.5, color: C.white, valign: 'middle' });
      acoes.forEach((a, j) => {
        const y = 306 + j * 104;
        R(`${k} · ação ${j + 1} · fundo`, RR, { x: x + 4, y, w: W - 8, h: 92, r: 10, fill: C.box });
        T(`${k} · ação ${j + 1}`, a, { x: x + 18, y, w: W - 34, h: 92, size: 13, color: C.ink, valign: 'middle' });
      });
    });
  });

  /* ------------------------------------------------- 4 · identidade visual */
  await frente({
    title: 'Identidade visual do Maestro', sub: 'Uma marca própria para o projeto ser reconhecido em todo o ONS',
    contexto: 'Um projeto desta escala, com muitas peças e canais, precisava ser reconhecido de imediato por quem recebe a mensagem.',
    entrega: 'Marca Maestro e padrão visual aplicado às peças do projeto',
    comp: ['Marca e assinatura com o ONS', 'Paleta oliva e lima e grafismos', 'Templates de boletim, convites e página no Sou+'],
    res: 'As 29 edições de boletim e as peças do projeto seguem o mesmo padrão visual: a mensagem é reconhecida antes mesmo da leitura.',
  }, async () => {
    R('Identidade · prancha', RR, { x: 680, y: 196, w: 410, h: 470, r: 14, fill: C.white, line: C.cardLine, shadow: true });
    s.addImage({ objectName: 'Identidade · marca', data: logo, x: X(735), y: X(236), w: X(300), h: X(65), altText: 'Marca Maestro' });
    T('Identidade · paleta · rótulo', 'PALETA', { x: 710, y: 336, w: 350, h: 18, size: 11, bold: true, color: C.label, cs: 0.6 });
    [['Oliva', C.ol], ['Lima', C.li], ['Grafite', C.gr]].forEach(([n, hex], i) => {
      const x = 710 + i * 118;
      R(`Identidade · cor ${n}`, RR, { x, y: 362, w: 104, h: 104, r: 12, fill: hex });
      T(`Identidade · cor ${n} · nome`, [{ text: n, options: { bold: true, breakLine: true } }, { text: '#' + hex, options: { fontSize: 10.5, color: C.body } }],
        { x, y: 474, w: 110, h: 40, size: 12.5, color: C.ink });
    });
    T('Identidade · assinatura · rótulo', 'ASSINATURA', { x: 710, y: 540, w: 350, h: 18, size: 11, bold: true, color: C.label, cs: 0.6 });
    s.addImage({ objectName: 'Identidade · assinatura · maestro', data: logo, x: X(710), y: X(578), w: X(152), h: X(33), altText: 'Maestro' });
    s.addImage({ objectName: 'Identidade · assinatura · ONS', data: ons, x: X(884), y: X(574), w: X(170.5), h: X(40), altText: 'ONS' });
    R('Identidade · cabeçalho · moldura', RECT, { x: 1110, y: 196, w: 428, h: 129, fill: C.white, line: C.cardLine, shadow: true });
    await IMG('Identidade · cabeçalho do boletim', BOL('cabecalho-boletim.png'), { x: 1110, y: 196, w: 428, h: 129, alt: 'Cabeçalho do boletim' });
    for (const [i, f] of ['semanal-24.png', 'mensal-1.png'].entries()) {
      const x = 1110 + i * 222;
      R(`Identidade · aplicação ${i + 1} · moldura`, RECT, { x, y: 345, w: 206, h: 366 * 0 + 321, fill: C.white, line: C.cardLine, shadow: true });
      await IMG(`Identidade · aplicação ${i + 1}`, BOL(f), { x, y: 345, w: 206, h: 321, alt: 'Boletim' });
    }
  });

  /* ------------------------------------------------------- 5 · comunicação */
  await frente({
    title: 'Comunicação', sub: 'A mensagem do Maestro em todo o ONS, com ritmo e vozes próprias',
    contexto: 'A mudança precisava chegar a todas as áreas com regularidade, clareza e canais para tirar dúvidas.',
    entrega: 'Plano de comunicação contínuo, de nov/25 a out/26',
    comp: ['Boletins semanais (DPL) e mensais (todo o ONS)', 'Vídeos Fala, Maestro, convites e peças do modelo', 'Diálogo: Café com a Liderança e influenciadores'],
    resLabel: 'EM NÚMEROS', resNums: [['16', 'comunicados'], ['29', 'edições de boletim'], ['12', 'vídeos'], ['20', 'vozes do Maestro'], ['1', 'game do Maestro']],
  }, async () => {
    const thumbs = [['semanal-24.png', 'Boletim semanal · nov/25'], ['mensal-5.png', 'Boletim mensal · dez/25'], ['semanal-07.png', 'Boletim semanal · jul/26'], ['mensal-1.png', 'Boletim mensal · set/26']];
    const W = 160, H = Math.round(W * 1467 / 825), G = 14.5;
    for (const [i, [f, cap]] of thumbs.entries()) {
      const x = 680 + i * (W + G);
      R(`Comunicação · miniatura ${i + 1} · moldura`, RECT, { x, y: 214, w: W, h: H, fill: C.white, line: C.cardLine, shadow: true });
      await IMG(`Comunicação · miniatura ${i + 1}`, BOL(f), { x, y: 214, w: W, h: H, alt: cap });
      T(`Comunicação · miniatura ${i + 1} · legenda`, cap, { x, y: 214 + H + 10, w: W, h: 20, size: 11.5, color: C.body, align: 'center' });
    }
    pending('Game do Maestro', 'Game do Maestro', { x: 680 + 4 * (W + G), y: 214, w: W, h: H });
    T('Comunicação · game · legenda', 'Game do Maestro', { x: 680 + 4 * (W + G), y: 214 + H + 10, w: W, h: 20, size: 11.5, color: C.body, align: 'center' });
  });

  /* ------------------------------------------------------ 6 · stakeholders */
  await frente({
    title: 'Gestão de stakeholders', sub: 'Quem é impactado, quem influencia e como engajar cada liderança',
    contexto: 'A adesão ao novo modelo dependia das lideranças de quatro diretorias. Era preciso conhecer a posição de cada uma antes de engajar.',
    entrega: 'Mapa de stakeholders e entrevistas com as lideranças',
    comp: ['39 lideranças mapeadas por impacto e influência', '26 entrevistas e leitura ADKAR dos líderes da FE', 'Rede de Influenciadores na DPL, DTA, DOP e DAC'],
    res: '85% das lideranças entrevistadas têm postura favorável à mudança (22 de 26).',
  }, async () => {
    // matriz impacto × influência das 26 lideranças entrevistadas
    const M = { 3: [0, 10, 6], 2: [1, 5, 2], 1: [0, 2, 0] }, gx = 830, gy = 206, cw = 170, ch = 128;
    T('Matriz · eixo impacto', 'IMPACTO', { x: 660, y: gy + 1.5 * ch - 12, w: 120, h: 24, size: 11.5, bold: true, color: C.label, align: 'center', rotate: 270, cs: 0.6 });
    ['Alto', 'Médio', 'Baixo'].forEach((l, r) => T(`Matriz · linha ${l}`, l, { x: 744, y: gy + r * ch, w: 76, h: ch, size: 13, color: C.body, align: 'right', valign: 'middle' }));
    ['Baixa', 'Média', 'Alta'].forEach((l, c) => T(`Matriz · coluna ${l}`, l, { x: gx + c * cw, y: gy + 3 * ch + 8, w: cw, h: 22, size: 13, color: C.body, align: 'center' }));
    T('Matriz · eixo influência', 'INFLUÊNCIA', { x: gx, y: gy + 3 * ch + 34, w: 3 * cw, h: 20, size: 11.5, bold: true, color: C.label, align: 'center', cs: 0.6 });
    [3, 2, 1].forEach((imp, r) => M[imp].forEach((n, c) => {
      const x = gx + c * cw, y = gy + r * ch, hot = r === 0 && c >= 1;
      R(`Matriz · célula ${r + 1}${c + 1}`, RECT, { x, y, w: cw, h: ch, fill: hot ? 'DCE7F1' : C.box, line: C.white, lw: 3 });
      if (!n) return;
      const d = Math.round(34 + Math.sqrt(n) * 20);
      R(`Matriz · bolha ${r + 1}${c + 1}`, OV, { x: x + cw / 2 - d / 2, y: y + ch / 2 - d / 2, w: d, h: d, fill: C.circle });
      T(`Matriz · valor ${r + 1}${c + 1}`, String(n), { x: x + cw / 2 - d / 2, y: y + ch / 2 - d / 2, w: d, h: d, size: n > 4 ? 18 : 14, bold: true, font: SANS, color: C.white, align: 'center', valign: 'middle' });
    }));
    [['16', 'de alto impacto'], ['8', 'de alta influência'], ['39', 'lideranças mapeadas']].forEach(([n, l], i) => {
      T(`Matriz · destaque ${i + 1} · valor`, n, { x: 1366, y: gy + 6 + i * 128, w: 170, h: 44, size: 28, bold: true, font: SANS, color: C.navy });
      T(`Matriz · destaque ${i + 1} · rótulo`, l, { x: 1366, y: gy + 54 + i * 128, w: 170, h: 44, size: 13, color: C.body });
    });
  });

  /* ---------------------------------------------------------- 7 · impactos */
  await frente({
    title: 'Mapeamento de impactos', sub: 'Como a nova estrutura muda o dia a dia de cada área',
    contexto: 'A criação da FE mudaria atribuições, interfaces e rotinas de várias gerências do ONS, de forma diferente para cada uma.',
    entrega: 'Mapeamento dos impactos organizacionais da mudança',
    comp: ['Todas as gerências do ONS no escopo', 'Stakeholders externos considerados'],
    res: 'Mapeamento conduzido durante o desenho do novo modelo, entre fevereiro e março de 2026.',
  }, async () => { pending('Matriz de impactos', 'Matriz de impactos', { x: 680, y: 196, w: 858, h: 470 }); });

  /* ------------------------------------------------------ 8 · guia de bolso */
  await frente({
    title: 'Guia de bolso do Maestro', sub: 'O novo modelo de operação em formato de consulta rápida',
    contexto: 'Com a FE em operação, as equipes precisavam de uma referência simples para o dia a dia do novo modelo.',
    entrega: 'Guia de Bolso Maestro, elaborado na Operação Assistida',
    comp: ['Diversos temas do modelo unificados em um só lugar', 'Linguagem simplificada e de fácil acesso a todos'],
    res: 'Reforça a clareza de papéis e responsabilidades, uma das frentes usadas para medir a adoção ao modelo.',
  }, async () => { pending('Guia de Bolso', 'Guia de Bolso Maestro', { x: 680, y: 196, w: 858, h: 470 }); });

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await pres.writeFile({ fileName: OUT });
  await finish(OUT);
  console.log(OUT);
}

/* tema A&M nas cores do documento, contornos vazios explícitos e idioma pt-BR */
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
