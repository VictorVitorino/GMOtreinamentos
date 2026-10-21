# Apresentação · Treinamento de Gestão de Mudanças

Apresentação interativa em HTML/CSS/JS (sem dependências), no padrão visual do **Portfólio DTS** e do **Guia de Design DTS** (palco 1600×900, paleta A&M navy/steel/laranja, Inter + JetBrains Mono), com a arquitetura de página da proposta **AXON**: palco com margem sobre fundo claro, trilha de capítulos à esquerda e controles discretos na barra inferior.

## Roteiro

| # | Slide | Interação |
|---|---|---|
| — | **Capa** · metamorfose low-poly | lagarta → casulo → borboleta, que bate as asas e **voa para fora da tela**; o ciclo recomeça sozinho. Chip discreto no canto superior direito avança os estágios; o cursor desloca os fragmentos |
| 01 | **Mudança** · o que acontece no cérebro | mapa ilustrativo das "vozes" (pré-frontal, cingulado, amígdala, gânglios da base, dopamina) e o cabo de guerra entre mudar e ficar como está |
| 01+ | **Anatomia · Córtex** (botão no cabeçalho do 01) | vídeo da anatomia (rosto → crânio → cérebro) que para no cérebro inteiro e ganha moldura no pré-frontal, regiões profundas em transparência e fios entre as 5 "vozes"; `→` percorre as regiões, `Esc` fecha |
| 02 | **Exercício** · a sala bagunçada | arraste e gire os objetos, "🎲 Bagunçar mais", slider **antes/depois** revelando a sala arrumada, processo Ver → Sentir → Decidir → Agir → Repetir e o card **💡 Curiosidade** ("de fora para dentro ou de dentro para fora?") com votação da turma |
| 03 | **Gestão da Mudança** · mudar é um evento, sustentar é gestão | GESTÃO + MUDANÇA com etimologia, curva com × sem gestão (efeito sanfona) e por que a GMO importa |
| 04 | **História** · da força ao método | duas raias (o que mudou × como foi conduzida), faixa de atrito e o paralelo **sem método × com método** em cada marco |
| 05 | **Números** · o que a pesquisa mostra | selo de adoção 7×, anel 88% × 13% e barras **com × sem gestão da mudança** (Prosci, PMI, McKinsey, BCG) |
| 06 | **Ferramentas** · Kotter, ADKAR, HCMBOK e CMAK | a caixa abre e empilha as quatro abordagens; clique num card para destacá-lo |
| 07 | **Onde usar** · qual abordagem para cada desafio | matriz de aplicabilidade: clique no cenário e veja a combinação recomendada |

## Teclas

Barra inferior: trilha de capítulos · **Roda** (ícone) · **Sobre este slide** (`I`) · **Voltar** · contador/índice · **Avançar**.

`→` / `Espaço` / `PageDown` avança (passador de slides funciona) · `←` volta · `N` Fernando (a 4ª fala chama a roda) · `F` Felipe · `M` Marcelo · `V` Vitor Bravo · `R` Roda da Mudança · `I` sobre este slide · `T` tela cheia · `B` tela preta · `S` som · `0` capa e `1`–`7` vão ao capítulo de mesmo número · `Esc` fecha.

## Estrutura e build

```
src/shell.html               motor (API DECK), chrome, Fernando, Roda da Mudança e painéis
src/slides/NN-id/slide.html  <section data-id="id" class="slide …">
src/slides/NN-id/slide.css   estilos escopados no slide
src/slides/NN-id/slide.js    comportamento; registra DECK.register('id', {enter, leave, step})
src/_arquivo/                slides arquivados, fora do deck
```

A ordem dos slides é a ordem alfabética das pastas (`NN`). Para montar:

```bash
python3 build.py                 # index.html (usa assets/) + dist/… (arquivo único para apresentar offline)
python3 build.py --out teste.html   # só um arquivo único, para pré-visualizar
```

`assets/isabella.webp` **não é versionado** (ver `.gitignore`) até haver autorização de publicação; o arquivo em `dist/` embute todas as imagens.

As fontes de cada número estão no rodapé de cada slide e, completas, no painel **Sobre este slide**.
