# IA Aplicada a Advogados

**Construa, aula por aula, um escritório ou departamento jurídico com rotinas automatizadas e decisões sob seu controle.**

Primeiro você monta o local de trabalho, sem nenhum dado de cliente. Depois trabalha com casos no ambiente pronto. Por fim, automatiza as rotinas e acompanha tudo num painel próprio. Tudo no navegador, sem programar e dentro das regras da OAB.

3 módulos · 26 aulas · 5 h 18 de vídeo · 26 conquistas · 17 ferramentas

A página é [agenda-udemy.html](agenda-udemy.html). Ela e este arquivo saem de [agenda.json](agenda.json) pelo script [montar.js](montar.js) (`node montar.js`).

## O curso

- **Para quem é.** Qualquer advogado: em escritório de qualquer porte, autônomo ou no jurídico de uma empresa. Basta ainda não ter configurado uma IA no trabalho. Não precisa saber programar.
- **O que você constrói.** Um escritório ou jurídico no Claude, no GitHub e no Google, com a sua identidade, padrão de atendimento, rotinas que passam pela sua aprovação e um painel próprio com os números do escritório.
- **Como é cada aula.** Um roteiro passo a passo, uma missão prática com material fictício e uma conquista no fim.
- **Tudo na web.** Nada para instalar. Os exemplos usam o Google; em empresas com Microsoft 365, as aulas de Claude valem igual.

| Hoje | No fim do curso |
|---|---|
| Arquivos do caso espalhados entre e-mail, WhatsApp e computador | Uma pasta por caso, com histórico de versões e a memória do caso |
| Explicar tudo de novo ao Claude a cada conversa | O Claude já conhece o seu perfil, o seu estilo e cada caso |
| Tudo o que sai do escritório com cara de Word cru | Apresentações e documentos com o seu design system |
| Pedidos das áreas da empresa chegando por e-mail, WhatsApp e corredor | Uma entrada única, com responsável, prazo e registro |
| Medo de colar documento de cliente na IA | Ambiente configurado com critérios de segurança e controles de revisão |
| Os números do escritório espalhados em planilhas, e-mails e na memória | Um painel próprio no celular: casos, prazos, propostas, honorários e o que espera você |

## Módulo 1 · Montar o local de trabalho

> "Abro o Claude e não sei por onde começar, onde guardar cada coisa nem se é seguro."

**Nenhuma aula deste módulo usa dado de cliente. Primeiro você monta e configura tudo.**

**No fim do módulo:** Conta segura, uma pasta por caso no GitHub com a memória do caso, design system, o Claude ajustado ao seu perfil e as ferramentas conectadas com as permissões certas.

8 aulas · 1 h 40 · Precisa de: conta no Claude e no GitHub; conectores, plugin, MCP e a integração com o GitHub podem pedir o plano pago do Claude

| Aula | O que é | O que vamos apresentar | Conquista e missão | Ferramentas | Tempo |
|---|---|---|---|---|---:|
| **1.1 Conta segura antes de tudo** | A primeira configuração do Claude, antes de qualquer conversa. | 1. Criar a conta e escolher o plano: o que muda do gratuito para o pago e para os planos de equipe e de empresa<br>2. Nas configurações, desligar o uso das suas conversas para treinar os modelos e ligar a verificação em duas etapas<br>3. Tour da tela: conversa, projetos, artefatos, conectores, memória e seletor de modelo<br>4. O semáforo do sigilo: verde, amarelo e vermelho, com oito exemplos do dia a dia | Conta configurada<br>*Missão: Checklist de decolagem* | Claude | 12 min |
| **1.2 GitHub sem mistério** | O arquivo do escritório, com o histórico de cada versão. | 1. Criar a conta no GitHub com e-mail profissional e verificação em duas etapas<br>2. Os quatro conceitos que bastam: repositório, pasta, arquivo e versão<br>3. Repositório privado: quem vê, quem edita e como convidar um colega<br>4. Editar um arquivo pelo navegador e abrir a versão anterior no histórico | GitHub configurado<br>*Missão: Viagem no tempo: altere um texto e volte à versão de ontem* | GitHub | 12 min |
| **1.3 Uma pasta por caso** | A estrutura padrão que todo caso do escritório segue. | 1. O repositório-modelo do curso: pastas de memória, documentos, peças, contratos e atas<br>2. Nomes padrão para cliente, caso e arquivo, para achar tudo em segundos<br>3. Criar o repositório de um cliente fictício a partir do modelo, com um clique<br>4. O que entra no repositório e o que nunca entra: segredo de justiça, saúde e dados de criança | Repositório-modelo do caso<br>*Missão: Arrume a bagunça: quinze arquivos soltos de um caso fictício nas pastas certas* | GitHub | 10 min |
| **1.4 A memória do caso, que se atualiza** | O que o Claude precisa lembrar de cada caso, sempre em dia. | 1. O arquivo de memória do caso: cliente, objetivo, fatos, decisões, pendências e prazos conferidos<br>2. Ligar o repositório a um projeto do Claude e sincronizar com um clique<br>3. Ligar a memória do projeto e ver o que o Claude passou a lembrar<br>4. A instrução que fecha cada sessão: o Claude propõe a atualização da memória, você aprova e grava a nova versão | Memória do caso automatizada<br>*Missão: Três sessões, uma memória: o Claude lembra o que foi decidido na primeira?* | GitHub, Claude | 14 min |
| **1.5 Design system: o seu ou um novo** | A identidade visual guardada para tudo nascer com a sua marca. | 1. Se você já tem marca: extrair cores, letras e logotipo do seu material<br>2. Se não tem: o prompt de criação, com as perguntas que geram paleta, tipografia, layout, logotipo e tom de voz<br>3. Os limites da OAB para a identidade: sobriedade, sem promessa, com nome e número de inscrição<br>4. Guardar o design system no Claude e no repositório do escritório | Design system e o prompt que o gera<br>*Missão: Teste da marca: peça uma página qualquer e veja se ela nasce com a sua cara* | Claude, Design system, GitHub | 14 min |
| **1.6 O Claude que conhece você** | O seu perfil e o seu jeito de trabalhar, ensinados uma vez. | 1. Preferências do perfil: tom, formato, tamanho das respostas e português do Brasil<br>2. Estilo de escrita: o Claude aprende com dois textos seus<br>3. Instruções do escritório: área de atuação, critério de revisão e o que nunca fazer<br>4. O modelo certo para cada tarefa: Haiku, Sonnet, Opus e Fable | Perfil, estilo e guia de modelos<br>*Missão: Teste do estagiário novo: um pedido de uma linha sai no seu padrão?* | Claude | 12 min |
| **1.7 Google conectado, com as permissões certas** | Gmail, Agenda, Drive e Meet ligados ao Claude, sob o seu controle. | 1. Ligar Gmail, Agenda e Drive ao Claude<br>2. Permissões: perguntar sempre antes de criar rascunho ou evento<br>3. A transcrição do Google Meet salva no Drive, pronta para virar ata<br>4. Como revisar e revogar acessos a qualquer momento | Google conectado<br>*Missão: Semana no escuro: o Claude acha os dois conflitos da agenda fictícia?* | Gmail, Google Agenda, Google Drive, Google Meet | 12 min |
| **1.8 Plugins, skills e MCP jurídico** | As ferramentas jurídicas instaladas e com acesso limitado. | 1. Instalar o plugin jurídico e trocar o playbook americano pelo critério brasileiro do escritório<br>2. Criar a primeira skill: a atualização de andamento ao cliente<br>3. Adicionar um conector MCP de processos ou de jurisprudência e conferir o resultado na fonte oficial<br>4. O que cada permissão libera e como revisar os acessos de terceiros | Caixa de ferramentas jurídica<br>*Missão: Caça ao erro: três cláusulas que o playbook americano marcou errado* | Plugins e skills, MCP jurídico | 14 min |

## Módulo 2 · Trabalhar com padrão

> "Cada atendimento, peça e retorno sai de um jeito, e eu reviso tudo no susto."

**Agora sim, com casos: tudo acontece no ambiente que você montou no módulo 1.**

**No fim do módulo:** O primeiro caso em ficha e retorno, roteiro de atendimento, retornos com padrão, kit visual com a marca, biblioteca de casos e revisão da produção.

7 aulas · 1 h 18 · Precisa de: o ambiente do módulo 1; skills e apresentações no Claude pedem plano pago

| Aula | O que é | O que vamos apresentar | Conquista e missão | Ferramentas | Tempo |
|---|---|---|---|---|---:|
| **2.1 O primeiro caso: ficha e retorno ao cliente** | Uma pilha de documentos vira ficha do caso e mensagem ao cliente. | 1. Criar o repositório do caso fictício e subir os oito documentos<br>2. Ficha do caso: cada fato com o documento e o trecho de origem, a linha do tempo e as lacunas<br>3. Retorno ao cliente em três linhas: o que aconteceu, o que significa e o próximo passo<br>4. Cronometrar a tarefa do início ao envio: é a sua primeira medição | Ficha do caso e retorno<br>*Missão: Cronômetro ligado* | Claude, GitHub | 14 min |
| **2.2 O primeiro atendimento** | Do primeiro contato à ata, com cliente ou área interna. | 1. Roteiro de perguntas por tipo de caso: família, trabalhista, previdenciário e consumidor<br>2. Lista de documentos para pedir já na primeira conversa<br>3. Do atendimento à ata: decisões, pendências e prazos na pasta de atas<br>4. A memória do caso atualizada com o que foi combinado | Roteiro de atendimento e ata<br>*Missão: Cliente simulado: o Claude faz o cliente que fala demais* | Claude, GitHub | 12 min |
| **2.3 Retornos com padrão** | Atualização, relatório e prazo de resposta combinado com quem pediu. | 1. Atualização de andamento em três linhas, sem juridiquês<br>2. Relatório mensal de uma página, com a sua marca<br>3. Prazo de retorno combinado com o cliente ou a área e registrado na memória do caso<br>4. O modelo guardado como skill, para usar em todos os casos | Modelos de retorno e relatório<br>*Missão: Contra o relógio: três retornos em dez minutos* | Claude, Plugins e skills, Google Docs | 10 min |
| **2.4 Apresentações e documentos com a marca** | O design system aplicado ao que sai do escritório. | 1. Um parecer de doze páginas em cinco slides: decisão, cenário, riscos, caminhos e próximo passo<br>2. Timbrado no Google Docs e assinatura de e-mail a partir do design system<br>3. Proposta de honorários ou parecer de uma página<br>4. Exportar em PowerPoint e PDF | Kit visual<br>*Missão: Antes e depois: Word cru contra a sua marca* | Design system, Google Docs, Gmail | 12 min |
| **2.5 Biblioteca de casos** | Casos, teses e peças de referência organizados para reuso. | 1. Um repositório-biblioteca com casos encerrados e anonimizados<br>2. Peças e teses organizadas por tipo de ação e por resultado<br>3. Anonimizar em três passos antes de guardar<br>4. Pedir ao Claude a referência da casa para um caso novo | Biblioteca de casos<br>*Missão: Ache o precedente da casa em trinta segundos* | GitHub, Claude | 10 min |
| **2.6 Revisão da produção** | O que sai do escritório passa pelos seus critérios. | 1. As três chaves de cada citação: existe, diz isso e vale hoje<br>2. Checklist antes do envio e do protocolo: fatos, pedidos, valores, datas e citações<br>3. Registro de quem revisou, quando e o que mudou<br>4. Onde conferir: os sites oficiais do STF, do STJ, do TST e dos tribunais | Revisão com critério<br>*Missão: Caça ao erro: uma citação inventada e outra que diz o contrário* | Claude, Google Planilhas | 12 min |
| **2.7 IA às claras com o cliente** | Transparência e consentimento sobre o uso de IA. | 1. A página “Como usamos IA no seu caso”, com a sua marca<br>2. O termo de consentimento do cliente, como pede a Recomendação 001/2024 da OAB<br>3. Onde arquivar o termo assinado: na pasta do caso<br>4. Como responder ao cliente que pergunta se foi a IA que fez | Transparência<br>*Missão: Cliente desconfiado: três perguntas difíceis* | Claude, Google Docs | 8 min |

## Módulo 3 · Rotinas automatizadas, decisões com você

> "Passo o dia respondendo, lembrando e cobrando. O escritório só anda quando eu empurro."

**As rotinas preparam; quem aprova é você.**

**No fim do módulo:** O painel do escritório no ar, quatro fluxos que o alimentam (entrada da demanda, documentos, follow-up e cobrança, aprovação) e o ganho medido antes e depois.

11 aulas · 2 h 20 · Precisa de: conta Google gratuita e WhatsApp Business; nenhuma chave de API paga na trilha principal

### O painel do escritório

Uma página só sua, em HTML, ligada à planilha-mãe pelo Apps Script. Em três aulas você desenha com o Claude e o seu design system, liga à planilha e publica com acesso só seu. Os números são calculados no seu Google, sem passar pela IA.

| Bloco | O que mostra | Liga na aula |
|---|---|---|
| Casos | Ativos por fase e por responsável, os novos e os parados | 3.3 |
| Prazos | O que vence em 7 dias e quem conferiu cada um | 3.5 |
| Propostas | Em aberto, taxa de aceite e follow-ups pendentes | 3.8 |
| Honorários | Recebido no mês, a receber em 30 dias e vencidos | 3.8 |
| Esperando você | Documentos, rascunhos e prazos para aprovar | 3.9 |
| Ganho | Antes e depois: tempo, correções e retornos na data | 3.11 |

No jurídico de empresa, Propostas vira demandas das áreas e Honorários vira valores envolvidos.

| Aula | O que é | O que vamos apresentar | Conquista e missão | Ferramentas | Tempo |
|---|---|---|---|---|---:|
| **3.1 A planilha-mãe** | A base do escritório, numa planilha que você entende. | 1. As abas Casos, Clientes, Propostas, Honorários, Fila e Registro, e o que vai em cada coluna<br>2. Listas suspensas para fase e situação: ninguém escreve “em andamento” de cinco jeitos<br>3. O que é o Google Apps Script e onde ele fica<br>4. Conta de treino antes da conta real | Planilha-mãe<br>*Missão: Construção guiada: instale pelo menu e veja as abas aparecerem* | Google Planilhas, Apps Script | 10 min |
| **3.2 Desenhar o painel** | O HTML do painel, desenhado com o Claude e o seu design system, ainda com dados fictícios. | 1. Escolher os indicadores: casos por fase, prazos da semana, propostas em aberto, honorários recebidos e a receber<br>2. O pedido ao Claude: o design system, a lista de indicadores e uma planilha de exemplo com dados fictícios<br>3. O HTML que o Claude entrega: cabeçalho com a marca, cartões de números, gráficos e a lista para aprovar<br>4. Ajustar o visual por conversa até aprovar, no computador e no celular | Painel desenhado<br>*Missão: Peça uma segunda versão só com os três números que você olha toda manhã* | Claude, Design system | 14 min |
| **3.3 Ligar o painel à planilha** | O painel lê a planilha-mãe pelo Apps Script e mostra casos, propostas e valores reais. | 1. Os dois arquivos do Apps Script: um lê as abas Casos, Propostas, Honorários e Fila; o outro entrega a página<br>2. Os indicadores calculados pelo código: casos por fase, casos parados há mais de 15 dias, taxa de aceite das propostas e valor em aberto<br>3. Honorários: recebido no mês, a receber em 30 dias e parcelas vencidas<br>4. Conferir cada número com a planilha antes de confiar nele | Painel ligado à planilha<br>*Missão: Mude a fase de um caso na planilha e veja o painel acompanhar* | Apps Script, Google Planilhas, Claude | 16 min |
| **3.4 Publicar só para você** | O painel no ar, com acesso só seu, abrindo no celular. | 1. Publicar como app da Web, executando como você e com acesso só seu<br>2. Autorizar o Google e conferir o que o painel pode ler<br>3. Abrir no celular e colocar o atalho na tela inicial<br>4. Modo apresentação: dados fictícios no lugar dos reais, para gravar a tela ou mostrar sem expor clientes | Painel no ar<br>*Missão: Abra o painel no celular e ache o caso parado há mais tempo* | Apps Script, Google Planilhas | 10 min |
| **3.5 Controles de revisão e acompanhamento** | O que cada rotina pode fazer, e o que sempre passa por você. | 1. CPF, CNPJ, e-mail e telefone mascarados antes de qualquer envio à IA<br>2. A lista de termos que nunca saem, como laudo e segredo de justiça<br>3. E-mail sempre em rascunho; prazo só vale com “Conferido por”, e o painel avisa quando falta<br>4. Registro de tudo e cada script versionado no GitHub | Controles ativos<br>*Missão: Conserte o script: uma rotina sem controle quase envia um CPF* | Apps Script, GitHub | 12 min |
| **3.6 Fluxo 1 · Entrada da demanda** | Toda nova demanda, de cliente ou de outra área da empresa, chega organizada. | 1. WhatsApp Business: saudação, mensagem de ausência e respostas rápidas<br>2. Resposta automática do Gmail fora do horário, com o link do formulário<br>3. Formulário de primeiro contato com aviso de privacidade<br>4. Cada resposta vira um caso na planilha, com responsável e prazo, e aparece no painel | Entrada organizada<br>*Missão: Simulador de mensagens: cinco contatos fictícios, o que cada um recebe?* | WhatsApp Business, Gmail, Google Formulários, Google Planilhas | 14 min |
| **3.7 Fluxo 2 · Documentos** | Procuração, contratos e documentos padrão com um clique. | 1. Modelos timbrados de procuração, contrato e proposta, com os campos marcados<br>2. O script que lê o cadastro e preenche os campos<br>3. A pasta do cliente criada no Drive, com os três documentos<br>4. Os documentos entram na fila do painel para você conferir antes da assinatura | Documentos em um clique<br>*Missão: Contra o relógio: três documentos em um minuto* | Apps Script, Google Docs, Google Drive | 14 min |
| **3.8 Fluxo 3 · Follow-up e cobrança** | Ninguém fica sem resposta e nenhuma parcela vence esquecida. | 1. Proposta sem resposta há três dias: rascunho de follow-up<br>2. Caso sem notícia ao cliente há trinta dias: rascunho de atualização a partir do último andamento<br>3. Parcela vencida: rascunho de lembrete de cobrança, no tom do escritório<br>4. O gatilho de segunda às 8h: tudo vai para a fila do painel, nada é enviado sozinho | Follow-up em dia<br>*Missão: Segunda-feira: cinco rascunhos esperando por você* | Apps Script, Gmail, Google Planilhas | 14 min |
| **3.9 Fluxo 4 · Aprovação pelo painel** | Tudo o que espera você, numa tela do painel e às 7h no e-mail. | 1. A fila no painel: abrir, aprovar ou devolver, com o seu nome e a data gravados na planilha<br>2. O e-mail das 7h com a fila do dia e os prazos da semana<br>3. Prazos conferidos vão para a agenda, com alarme<br>4. O Registro: quem decidiu o quê, e quando | Aprovação pelo painel<br>*Missão: Caça ao erro: um item “aprovado” sem nome de quem aprovou* | Apps Script, Google Planilhas, Gmail, Google Agenda | 14 min |
| **3.10 O dia simulado** | Os quatro fluxos e o painel rodando juntos em um dia fictício. | 1. Uma demanda chega às 22h pelo WhatsApp<br>2. De manhã: o caso já está no painel, com documentos prontos e follow-ups na fila<br>3. Você revisa a fila pelo celular em quinze minutos<br>4. Os ajustes depois do primeiro dia: o que liberar e o que apertar | Rotinas em funcionamento<br>*Missão: Missão final* | Apps Script, Google Planilhas | 12 min |
| **3.11 Medir o ganho** | Antes e depois, com os seus números. | 1. Repetir a tarefa da aula 2.1 com as rotinas e cronometrar<br>2. Contar as correções que a revisão pediu<br>3. Calcular os retornos feitos na data combinada<br>4. Levar os três números para o painel e decidir o que manter, ajustar ou desligar | Ganho medido<br>*Missão: Compare com a aula 2.1* | Google Planilhas | 10 min |

## Aprofundamentos opcionais

- **Claude Code na web.** O Claude trabalhando direto no repositório do caso: edita arquivos, atualiza a memória e grava cada versão no GitHub sozinho. Ferramentas: Claude Code, GitHub. Precisa de: plano pago do Claude.
- **Contratos pelo critério do escritório.** Leitura do contrato pelo playbook, matriz de riscos com trecho conferido e comparação de versões com alerta. Ferramentas: Apps Script, API do Claude, Google Planilhas. Precisa de: chave de API paga, centavos por contrato.
- **Triagem de e-mail com IA.** Etiqueta, resumo e rascunho de resposta para cada e-mail novo, sem nada ser enviado. Ferramentas: Apps Script, API do Claude, Gmail. Precisa de: chave de API paga, centavos por e-mail.
- **n8n: rotinas fora do Google.** Os mesmos fluxos num editor visual, ligando Outlook, Teams e outros sistemas, o WhatsApp pela API oficial da Meta e o Claude acionando os fluxos por um conector MCP. Ferramentas: n8n, WhatsApp Business, Claude. Precisa de: n8n Cloud (pago, com teste grátis) ou servidor próprio com apoio de TI; WhatsApp pela API pede verificação na Meta e tem custo por mensagem.

## No fim, você apresenta o seu escritório funcionando

O trabalho de conclusão é uma demonstração de cinco minutos, gravada na sua própria tela.

1. A conta configurada e o semáforo do sigilo
2. O repositório de um caso com a memória em dia
3. O design system e uma apresentação com a marca
4. A entrada da demanda e os documentos gerados
5. O painel do escritório: casos, prazos, propostas, honorários e a fila aprovada
6. O antes e depois: tempo, correções e retornos na data

## O ganho, medido por você

Na aula 2.1 você cronometra a primeira tarefa com um caso. Na aula 3.11 repete a medição com as rotinas e o painel e compara três números.

| Indicador | Como medir | Antes · aula 2.1 | Depois · aula 3.11 |
|---|---|---|---|
| Tempo total por entrega | Do início ao envio, incluindo a sua revisão. | | |
| Correções necessárias | Quantas correções relevantes a revisão pediu. | | |
| Retornos na data combinada | Retornos feitos no prazo ÷ retornos previstos. | | |

O curso não promete número. Você registra o que aconteceu, inclusive quando o resultado não melhora.

## Ferramentas incorporadas

| Ferramenta | Para que serve | Plano | Módulos |
|---|---|---|---|
| Claude | Conversa, projetos, memória, perfil, modelos e o código do painel | Grátis + Pro | 1, 2, 3 |
| GitHub | Uma pasta por caso, a memória do caso e o histórico de versões | Grátis | 1, 2, 3 |
| Design system | A marca em tudo que o Claude cria, inclusive no painel | Pro | 1, 2, 3 |
| Plugins e skills | Plugin jurídico e instruções reutilizáveis | Pro | 1, 2 |
| MCP jurídico | Tribunais e jurisprudência na conversa | Pro | 1 |
| Gmail | Conector, respostas fora do horário e rascunhos | Grátis | 1, 2, 3 |
| Google Agenda | Semana organizada e prazos com alarme | Grátis | 1, 3 |
| Google Drive | Transcrições, entradas e documentos gerados | Grátis | 1, 3 |
| Google Meet | Reunião transcrita que vira ata | Workspace pago | 1 |
| Google Planilhas | A planilha-mãe, que alimenta o painel, e a medição do ganho | Grátis | 2, 3 |
| Google Formulários | Primeiro contato com o cliente | Grátis | 3 |
| Google Docs | Timbrado, retornos e documentos gerados | Grátis | 2, 3 |
| Apps Script | As rotinas automatizadas e o painel ligado à planilha | Grátis | 3 |
| WhatsApp Business | Resposta fora do horário e respostas rápidas | Grátis | 3 |
| Claude Code | O Claude editando o repositório e gravando cada versão | Pro |  |
| API do Claude | A IA dentro das rotinas, nos aprofundamentos | Centavos por uso |  |
| n8n | Rotinas em editor visual, inclusive fora do Google | Pago ou servidor próprio |  |

| Modelo do Claude | Perfil | Quando usar na advocacia |
|---|---|---|
| Haiku 5.5 | O mais rápido | Rotinas que rodam o dia inteiro e tarefas em volume. |
| Sonnet 5.5 | O do dia a dia | Retornos, atas, resumos, planilhas, scripts e apresentações. |
| Opus 5.5 | Leitura cuidadosa | Ficha do caso, minutas, pareceres e contratos pelo seu critério. |
| Fable 5.2 | O mais capaz | Processos complexos: autos volumosos, várias teses, estratégia e revisão crítica da peça. |

## Resumo

| Módulo | No fim, você tem | Aulas | Vídeo |
|---|---|---:|---:|
| 1 · Montar o local de trabalho | Conta segura, uma pasta por caso no GitHub com a memória do caso, design system, o Claude ajustado ao seu perfil e as ferramentas conectadas com as permissões certas. | 8 | 1 h 40 |
| 2 · Trabalhar com padrão | O primeiro caso em ficha e retorno, roteiro de atendimento, retornos com padrão, kit visual com a marca, biblioteca de casos e revisão da produção. | 7 | 1 h 18 |
| 3 · Rotinas automatizadas, decisões com você | O painel do escritório no ar, quatro fluxos que o alimentam (entrada da demanda, documentos, follow-up e cobrança, aprovação) e o ganho medido antes e depois. | 11 | 2 h 20 |
| **Total** | 26 conquistas, as rotinas e o painel do escritório | 26 | 5 h 18 |

Agenda de planejamento, versão de 11/11/2026. Os tempos são estimativas. Planos, telas e nomes de modelos mudam: conferir antes de gravar. Conectores jurídicos MCP são de terceiros. Em aula, só casos e dados fictícios. Nenhuma rotina dispensa a revisão do advogado. Em empresas com Microsoft 365, as aulas de Claude valem igual; as rotinas do módulo 3 usam o Google, e o aprofundamento de n8n mostra o caminho para Outlook, Teams e outros sistemas.
