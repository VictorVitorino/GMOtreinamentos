# Apresentação · Treinamento de Gestão de Mudanças

Apresentação interativa em HTML/CSS/JS (sem dependências), no padrão visual do **Portfólio DTS** e do **Guia de Design DTS** (palco 1600×900, paleta A&M navy/steel/laranja, Inter + JetBrains Mono), com a arquitetura de página da proposta **AXON**: palco com margem sobre fundo claro, trilha de capítulos à esquerda e controles discretos na barra inferior.

## Roteiro

| # | Slide | Interação |
|---|---|---|
| — | **Prévia** · a turma no sofá | antes da capa: a turma com pipoca e café diante da TV; clique na TV (ou `→`) e a câmera entra na tela e abre a capa |
| — | **Capa** · metamorfose low-poly | lagarta → casulo → borboleta, que bate as asas e **voa para fora da tela**; o ciclo recomeça sozinho |
| 01 | **Boas práticas** · 4 combinados | câmera ligada, pelo menos uma interação, dinâmica surpresa (quem quer se habilita) e emoji para continuar; `→` revela um por vez |
| 02 | **Agenda** · linha de transmissão | painel com os 5 capítulos e, à direita, torres de transmissão (uma por capítulo) com a energia correndo nos cabos; passar o mouse acende a torre, clicar abre o capítulo ou o tema |
| 02–04 | **Capítulo 1 · Mudança** | Mudança (o cérebro e o cabo de guerra, com a **Anatomia · Córtex**), Exercício (a sala bagunçada) e Gestão (mudar é evento, sustentar é gestão) |
| 05–06 | **Capítulo 2 · História** | História (da força ao método, sem × com método) e Números (selo 7×, 88% × 13%, com × sem gestão) |
| 07–08 | **Capítulo 3 · Metodologias** | Ferramentas (a caixa com Kotter, ADKAR, HCMBOK e CMAK) e Onde usar (matriz de cenários) |
| 09 | **Capítulo 4 · PEA** · o que é | Três colunas, uma por palavra: Prontidão (antes), Engajamento (durante) e Adoção (depois), com o que é, o que observamos e uma analogia cada (a viagem, a aula, o celular novo); `→` abre uma palavra por vez; linha do tempo com o go-live |
| 10 | **PEA** · como medir | Para cada palavra: a pergunta, onde olhamos e a conta (quem cumpre ÷ quem deveria), com um medidor; `→` percorre três momentos de um sistema novo (antes do go-live, semana 2 e semana 8) e a leitura de onde a GMO age |
| 11 | **Capítulo 5 · Na prática** · Indicadores (CMAK) | CMAK = Change Management Applicable by KPI: termômetro P·E·A e quatro cards frente e verso, um por frente (Comunicação · IEC, Stakeholders · IES, Impactos · ICI, Capacitação · IPT); a frente mostra o modelo (medidas, pesos e metas) e o verso um dashboard com números reais de um projeto; `→` vira um card por vez |
| 12 | **Plano de GMO da FE** · 2 a 4 meses | a FE (gerência executiva do ONS) e as gerências FEG, FEL, FEN e FER assumem a GMO: três ondas (até 2 meses · Estruturar, mês 3 · Rodar, mês 4 · Sustentar) × quatro frentes + "Medir"; faixa "Quem faz" (FE, gerências, comunidades, squads); `→` revela uma onda por vez |
| 13 | **Frente 1 · Comunicação** | o que é, o que um plano precisa ter (checklist) e o exemplo: o plano em movimento, com botões de fase (Montar · Validar · Lançar · Medir · Ajustar) que se repetem a cada marco do projeto; faixa com os próximos 3 · 6 · 8 meses |
| 14 | **Frente 2 · Cultura e Stakeholders** | o que é, como fazer em 4 passos e o exemplo: mapa influência × interesse com papéis genéricos; `→` percorre as pessoas e mostra postura, necessidade e ação da GMO; antes × depois do perfil dos stakeholders |
| 15 | **Frente 3 · Impactos** | o que é, como fazer e o exemplo: matriz real de 22 impactos (categoria, severidade, status) e a tabela impacto → mitigação → dono → status |
| 16 | **Frente 4 · Capacitação** | o que é, como fazer e o exemplo: funil real (136 convidados → 110 inscritos → 102 presentes → 50 na fixação), conhecimento 85%, nota 3,87, cobertura 14% |
| 17 | **Encerramento** | a borboleta da capa, três ideias para levar e a pergunta da Isabella com a Roda |

A trilha de capítulos na barra inferior agrupa os slides em **Agenda · Mudança · História · Metodologias · PEA · Na prática · Encerramento**. O índice (clique no contador) usa os mesmos grupos.

### Capítulo 5 · o que tem em cada frente
Cada slide de frente (13–16) tem: **o que é**, **como fazer**, um **exemplo** interativo (números de outro projeto, marcados como exemplo) e a faixa **Plano da FE · 2 a 4 meses**. O botão **Virar a página** (ou um `→` depois do último passo) mostra o **plano escrito da FE**: Plano de Comunicação, Mapa de Stakeholders (mapa de adoção, com os papéis Champion · Engajador · Neutro · Resistente aberto · Boicotador velado), Matriz de Impactos e Plano de Capacitação. `←` ou **Voltar** desvira.

As viradas (páginas e cards do CMAK) são 2D e as entradas usam `animation-fill-mode: backwards`: em repouso nada fica com transform, para o texto ficar nítido com o palco escalado. Não use `perspective`, `preserve-3d`, `backface-visibility` nem `will-change` em blocos de texto.

## Teclas

Barra inferior: trilha de capítulos · **Roda** (ícone) · **Sobre este slide** (`I`) · **Voltar** · contador/índice · **Avançar**.

`→` / `Espaço` / `PageDown` avança (passador de slides funciona) · `←` volta · `F` Felipe (a 4ª fala chama a roda) · `M` Marcelo · `V` Vitor Bravo · `R` Rogerinho a cavalo · `W` Roda da Mudança (botão "😄 Roda da Alegria" troca para perguntas de quebra-gelo) · `I` sobre este slide · `T` tela cheia · `B` tela preta · `S` som · `0` capa e `1`–`9` vão à página de mesmo número (`Home` volta à prévia) · `Esc` fecha.

## Estrutura e build

```
src/shell.html               motor (API DECK), chrome, elenco (Felipe, Marcelo, Vitor), Rogerinho, Roda da Mudança e painéis
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

Fontes e referências **não aparecem na tela** (nem no rodapé, nem no painel **Sobre este slide**). Os números do capítulo 5 vêm da planilha de KPIs do projeto (corte de junho), arredondados.
