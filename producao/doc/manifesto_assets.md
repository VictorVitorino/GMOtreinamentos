## 8 · Manifesto de ativos do roteiro (o que existe · o que construo · o que depende de você)

| Ativo | Cena | Estado |
|---|---|---|
| Estação do metrô (sua foto, rostos apagados) + cabeças de Gabriel e Elon pinadas | S01 | **pronto** (`metro_frame_base.png`, cabeças separadas) |
| Máquina do tempo = banco do carro de época + relógio de estação + telefone de disco + máquina de escrever + xícara + tecla verde | S03 em diante | recortes do acervo prontos (relógio, telefone, máquina de escrever, xícara, PC retrô); **tecla verde e montagem: construo** |
| Rua de Viena c. 1900 com carruagem (sépia, cartão rasgado) | S04–S05 | **pronto** (`cards/cavalos_viena.png`, `a_street1900_card.png`) |
| Ford T isolado (foto do acervo) + Ford T sua referência | S05–S06 | **pronto** (`veh/fordt_iso.png`, `veh/fordt_ref.png`) |
| Jornal fac-símile "O AUTOMÓVEL QUE CABE NO BOLSO" (recriado, preço só com rótulo "anúncio de época") | S05 | construo (função `newspaper` do motor) |
| Corpos 1908: 6 figuras da sua foto da rua (cartola, barba, boné, 2 damas, menino) | S05–S06, P02–P05 | **prontos** como recortes; cabeças entram conforme as fotos chegam |
| Trânsito 1965: Havana P&B → cor, carros empilhados | S08 | **pronto** (`cards/transito_pb.png`, `cards/transito_cor.png`); empilhamento: construo |
| Guarda de trânsito (soldado c. 1900 + luvas/quepe de papel) → braços viram semáforo | S09, P06 | corpo **pronto** (`soldados_*`); semáforo de papel: construo |
| Relógio de estação com anos no mostrador | S09 | foto **pronta** (`a_clock`); mostrador: construo |
| PC retrô + impressora matricial + glitch VHS | S10 | PC **pronto** (`c_office80s`); matricial/mapa: construo |
| Carro voador: modo voo da Máquina (rotores de papel) **+ quadro real do seu vídeo (carro no ar com propulsores)** | S11–S12 | **pronto** o recorte real (`veh/voador_carro.png`); rotores/neon: construo |
| Elon apresentando (meio corpo, sua imagem) | S11 (introdução da "atualização") | **pronto** (`veh/elon_meio.png`) |
| Gato dono do carro | S11–S17 | **sua referência é de terceiros** → gato recortado do acervo ou vetor de papel (a decidir) |
| Céu XP + grama (vetor/gradiente, recriação) | S12, S15 | motor já tem `bgGrass` |
| Corredor abandonado (foto do acervo) + placas datilografadas + troféus "FUNCIONA 100%" | S14 | foto **pronta** (`p_ward`); placas/troféus: construo |
| Cartão perfurado com 4 carimbos (ENTENDER · CONFIAR · APRENDER · ADOTAR) | S06, S09, S13, S15 | motor tem `stampCard`; carimbos: construo |
| Catorze mãos de papel | S15 | construo (um SVG, 14 instâncias) |
| Cartela GESTÃO DA MUDANÇA em 3D amarelo + grade verde | S16 | motor tem `year3d`/`bgGridColor` |
| Retrato final emoldurado em parede vermelha | S17 | motor tem `bgRed` + moldura: construo |
| Salto no tempo com relâmpago de papel (sua referência "após o carro voar") | transições S07→S08, S10→S11 | construo (`flashAt` + raios SVG + `tearIn`) |

### Slots do elenco (P-códigos; quem é quem você decide)

| Slot | Papel / reação à mudança | Corpo real disponível | Cabeça |
|---|---|---|---|
| **P01** | O Jovem — ceticismo simpático → primeira mão a apertar | metrô (colete vermelho) | **Gabriel** (foto 81 px → pedir maior) |
| P02 | Cocheiro — aplica o antigo ao novo com dignidade | rua 1908 · cartola | *livre* (teste: Fernando) |
| P03 | Entende primeiro | rua 1908 · dama 1 | *livre* |
| P04 | Rapaz do feno — susto em 1908, primeiro a embarcar em 2026 | rua 1908 · boné | *livre* (teste: Felipe) |
| P05 | Fotógrafo de todas as épocas | rua 1908 · barba/cartola 2 | *livre* |
| P06 | Guarda — os braços viram semáforo | soldado 1 | *livre* |
| P07 | Motorista que troca de carro (CONFIAR) | homem anos 50 + mapa | *livre* |
| P08 | Engenheiro "MAIS FAIXAS" | homem anos 50 + planta | *livre* |
| P09 | Passageiro paciente — a barba cresce | homem anos 40 (chapéu) | *livre* |
| P10 | Analista 1985 — aperta sem olhar | homem anos 40 + ombreiras de papel | *livre* |
| P11 | Engenheiro do manual — quem leu, ensina | operário + capacete de papel | *livre* |
| P12 | Criadora de conteúdo — celular vertical | **falta corpo de hoje** | *livre* |
| P13 | Cauteloso das alturas — confiança construída | soldado 2 + colete de papel | *livre* (papel sensível: só com OK da pessoa) |
| P14 | Touca de aviador — guarda o volante na bolsa | soldado 3 / dama 2 | *livre* |
| — | O Cientista (Elon) | metrô (jaleco) + meio corpo apresentando | **Elon** (sua imagem) |

Disponíveis hoje: Gabriel, Felipe, Fernando (prévias pequenas). Corrompidas: Alessandra, Francislene, Paulo Sergio, Rogério. Faltam 7 fotos.
