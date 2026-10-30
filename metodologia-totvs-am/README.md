# Onboarding — Metodologia TOTVS + A&M (TMO) · v5

Vídeo de onboarding **16:9 · 1920×1080 · 30fps · ~4:48**, motion design estilo DTS
(navy `#0B2545` + laranja `#F26B21`, Inter + JetBrains Mono), narração da **Dani**
(voz carioca, ElevenLabs `eleven_v4`) e SFX sutis (cliques, chime, whoosh, bed).

Estrutura em **3 atos**: ATO 1 — A Metodologia A&M (por que método · PMO+GMO=TMO ·
6 fases · status semanal · riscos) · ATO 2 — O Framework A&M × TOTVS (venn ·
como entregamos · MIT · frentes Fluig/Integrações/GAPs) · ATO 3 — O seu papel.

## O que a v5 tem

- **Sincronia palavra a palavra**: todas as entradas de frames são ancoradas na fala
  via `kw(cena, 'trecho falado')` (`timings.js` guarda o texto exato narrado e converte
  posição do caractere → tempo). Cada card aparece quando a Dani fala dele.
- **Efeitos do guia DTS**: Particle System (capas e encerramento), Shimmer/Holographic
  Sweep (selo TMO, card Atuação Conjunta, tiles, selo VALIDADO), Flip Card (KPIs e
  etapas do MIT), Card Stack (frentes do dia a dia), Chart Build (ritmo de entregas),
  Data Highlight (Integrações no farol, quadrante crítico da matriz), Progress Motion
  (barras com meta + anel), BPMN Flow Motion (token no fluxo Fluig).
- **Logos lúdicos**: lockups TOTVS × ALVAREZ & MARSAL no cold open, no split e no
  encerramento, sobre rede viva de partículas.
- **Narração fonética**: TMO = "tê eme ó", PMO = "pê eme ó", GMO = "gê eme ó",
  MIT narrado como "MITH" (na tela permanece "MIT").
- **Trilha de cliques**: 43 cliques suaves nos momentos em que elementos pousam
  (lista `CLICKS` em `timings.js`), ding nos cartões de ato — tudo abaixo da voz
  (voz 1.0 · click 0.34 · ding 0.30 · whoosh 0.22 · bed 0.13, com loudnorm).

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `roteiro/` | Roteiro de narração (textos exatos por cena) |
| `video/index.html` | Animação completa (timeline determinística via `window.seek(t)`) |
| `video/timings.js` | Fonte única de tempo: cenas, textos narrados, `kw()`, `CLICKS` |
| `video/assets/` | Fontes woff2 (Inter + JetBrains Mono) |
| `video/audio/` | Narrações n01–n10/nA2/nA3, bed, whoosh, click, ding, mix.m4a |
| `video/render.js` | Render frame a frame (Playwright → ffmpeg, JPEG q94) |
| `video/preview.js` | Screenshots de QC: `node preview.js <pasta> <t1> <t2> …` |
| `video/mix2.js` | Mixagem (narração + whoosh + cliques + dings + bed → mix.m4a) |
| `output/` | MP4 final |

## Como regenerar

```bash
cd video
node mix2.js                                  # audio/mix.m4a a partir de timings.js
node render.js /tmp/video_mudo.mp4 30         # ~15–25 min
ffmpeg -y -i /tmp/video_mudo.mp4 -i audio/mix.m4a -c:v copy -c:a copy \
  ../output/onboarding-metodologia-totvs-am_FINAL_1080p.mp4
```

Para ajustar uma cena: os tweens em `index.html` usam `KW('cena','trecho falado',lead)`
para tudo que acompanha a fala; mudou o texto da narração, atualize `NARRTXT` e a
duração em `DEF` (`timings.js`) e os tempos se realinham sozinhos. QC com
`node preview.js`.
