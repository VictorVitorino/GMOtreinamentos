# Onboarding — Metodologia TOTVS + A&M (TMO)

Vídeo de onboarding **16:9 · 1920×1080 · 30fps · ~2:50**, em motion design estilo DTS
(navy `#0B2545` + laranja `#F26B21`, Inter + JetBrains Mono), com narração da **Dani**
(voz carioca, ElevenLabs) e os mascotes TOTVS e A&M.

A linha de raciocínio segue a apresentação de referência *TMO — Status Semanal Executivo*
(TSO Implantação do ERP): parceria → por que método → fases da implantação → frentes de
refinamento (Fluig, Integrações, GAPs) → Status Report semanal → Gestão de Riscos → seu papel.

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `roteiro/` | Roteiro de narração e plano de cenas |
| `video/index.html` | Animação completa (engine de timeline determinística via `window.seek(t)`) |
| `video/assets/` | Mascotes recortados, fundo estúdio, fontes woff2 |
| `video/audio/` | Narração S1–S7, bed ambiente, whoosh e mix final |
| `video/render.js` | Render frame a frame (Playwright → ffmpeg) |
| `video/preview.js` | Screenshots de QC em timestamps |
| `video/mix.sh` | Mixagem de áudio alinhada à timeline |
| `output/` | MP4 final |

## Como regenerar

```bash
cd video
node render.js ../output/video_mudo.mp4 30   # ~15 min
bash mix.sh                                   # gera audio/mix.m4a
ffmpeg -y -i ../output/video_mudo.mp4 -i audio/mix.m4a -c:v copy -c:a copy \
  ../output/onboarding-metodologia-totvs-am_1080p.mp4
```

Para ajustar uma cena: edite os tweens em `index.html` (todas as cenas têm âncoras
`a` = início da cena e `n` = início da narração, em segundos absolutos) e confira com
`node preview.js <pasta> <t1> <t2> ...`.

## Timeline

| Cena | Janela | Narração | Conteúdo |
|---|---|---|---|
| S1 | 0.0–18.1 | 1.2s | Abertura · mascotes · parceria |
| S2 | 18.1–41.5 | 19.0s | Por que método (caos → caminho único) |
| S3 | 41.5–73.7 | 42.4s | Timeline das 7 etapas da implantação |
| S4 | 73.7–95.6 | 74.6s | Fluig · Integrações · GAPs |
| S5 | 95.6–122.2 | 96.5s | Status Report semanal executivo |
| S6 | 122.2–145.5 | 123.1s | Matriz e gestão de riscos |
| S7 | 145.5–169.7 | 146.4s | Seu papel · encerramento |

Narração gerada no ElevenLabs (voz "Dani — voz brasileira envolvente", modelo v4);
bed ambiente e whooshes via Sound Effects v2. Flow: `lbtPYJ0w9SylSlT08oT8`.
