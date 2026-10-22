# Apresentação · Treinamento de Gestão de Mudanças

Apresentação interativa em HTML/CSS/JS (sem dependências), no padrão visual do **Portfólio DTS** e do **Guia de Design DTS** (palco 1600×900, paleta A&M navy/steel/laranja, Inter + JetBrains Mono), com a arquitetura de página da proposta **AXON**: palco com margem sobre fundo claro, trilha de capítulos à esquerda e controles discretos na barra inferior.

## Roteiro

| # | Slide | Interação |
|---|---|---|
| — | **Prévia** · a turma no sofá | antes da capa: a turma com pipoca e café diante da TV; clique na TV (ou `→`) e a câmera entra na tela e abre a capa |
| — | **Capa** · metamorfose low-poly | lagarta → casulo → borboleta, que bate as asas e **voa para fora da tela**; o ciclo recomeça sozinho |
| 01 | **Agenda** · linha de transmissão | painel com os 3 capítulos e, à direita, torres de transmissão (uma por capítulo) com a energia correndo nos cabos; passar o mouse acende a torre, clicar abre o capítulo ou o tema |
| 02–04 | **Capítulo 1 · Mudança** | Mudança (o cérebro e o cabo de guerra, com a **Anatomia · Córtex**), Exercício (a sala bagunçada) e Gestão (mudar é evento, sustentar é gestão) |
| 05–06 | **Capítulo 2 · História** | História (da força ao método, sem × com método) e Números (selo 7×, 88% × 13%, com × sem gestão) |
| 07–08 | **Capítulo 3 · Metodologias** | Ferramentas (a caixa com Kotter, ADKAR, HCMBOK e CMAK) e Onde usar (matriz de cenários) |
| 09 | **Capítulo 4 · PEA** · o que é | Três colunas, uma por palavra: Prontidão (antes), Engajamento (durante) e Adoção (depois), com o que é, o que observamos e uma analogia cada (a viagem, a aula, o celular novo); `→` abre uma palavra por vez; linha do tempo com o go-live |
| 10 | **PEA** · como medir | Para cada palavra: a pergunta, onde olhamos e a conta (quem cumpre ÷ quem deveria), com um medidor; `→` percorre três momentos de um sistema novo (antes do go-live, semana 2 e semana 8) e a leitura de onde a GMO age |
| 11 | **Encerramento** | a borboleta da capa, três ideias para levar e a pergunta da Isabella com a Roda |

A trilha de capítulos na barra inferior agrupa os slides em **Agenda · Mudança · História · Metodologias · PEA · Encerramento**.

## Teclas

Barra inferior: trilha de capítulos · **Roda** (ícone) · **Sobre este slide** (`I`) · **Voltar** · contador/índice · **Avançar**.

`→` / `Espaço` / `PageDown` avança (passador de slides funciona) · `←` volta · `N` Fernando (a 4ª fala chama a roda) · `F` Felipe · `M` Marcelo · `V` Vitor Bravo · `R` Roda da Mudança (botão "😄 Roda da Alegria" troca para perguntas de quebra-gelo) · `I` sobre este slide · `T` tela cheia · `B` tela preta · `S` som · `0` capa e `1`–`9` vão à página de mesmo número (`Home` volta à prévia) · `Esc` fecha.

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
