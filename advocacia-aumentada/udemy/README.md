# IA Aplicada a Advogados

*Do Claude configurado à automação com guardrails, com a marca do escritório em tudo*

**Curso gravado · Agenda** · 3 módulos · 27 sessões · 4 h 50 min de vídeo · 5 automações · um sistema por módulo

Primeiro você monta o ambiente: Claude, conectores do Google, plugins e MCP jurídico. Depois a marca do escritório entra em toda apresentação e documento. Por fim, as automações rodam sozinhas, com proteções que você controla.

A página da agenda é [agenda-udemy.html](agenda-udemy.html). Este arquivo é o espelho em texto; os dois saem de [agenda.json](agenda.json) pelo script [montar.js](montar.js) (`node montar.js`).

Toda sessão anda em três tempos: **a dor** → **o que você constrói** → **o que você ganha**.

## A caixa de ferramentas do escritório

| Frente | Sessões |
|---|---|
| Configuração do Claude e escolha do modelo | 1.2, 1.3, 1.4 |
| Conectores do Google e Google Meet | 1.5, 1.6 |
| Plugins, skills e MCP jurídico | 1.7, 1.8 |
| Design system e marca do advogado | 2.1, 2.2, 2.3 |
| Apresentações e documentos com a marca | 2.4, 2.5, 2.6, 2.7, 2.8 |
| Ambiente e guardrails dos scripts | 3.1, 3.2 |
| Google Apps Script | 3.3, 3.4, 3.5, 3.6, 3.7, 3.9 |
| Automação de e-mail e de agenda | 1.5, 3.3, 3.4, 3.7 |
| Análise de contrato e de riscos | 1.7, 3.6, 3.7 |
| Gestão de casos e plataforma de clientes | 1.8, 3.3, 3.5 |
| Plataforma de contratos | 3.6, 3.7, 3.9 |
| Planilhas e painéis | 3.1, 3.8, 3.9 |

## Módulo 1 · Básico · Configuração · O seu Claude, configurado

- **A dor do módulo:** "Abro o Claude e não sei o que configurar, o que conectar nem qual modelo usar."
- **Você constrói e leva:** Ambiente do escritório no Claude: conta segura, projeto, conectores, plugin, MCP jurídico e guia de modelos
- **O que muda:** O Claude passa a conhecer o escritório, enxergar o seu Google e consultar processos, sem expor o cliente.
- **Para quem:** Para quem quer o ambiente pronto: conta segura, modelo certo, Google conectado e ferramentas jurídicas instaladas.
- **Precisa de:** conta gratuita até a 1.4; conectores, plugin e MCP pedem plano pago do Claude
- **Tamanho:** 9 sessões, 1 h 32 min

| Sessão | A dor | O que você constrói e leva | O que você ganha | Ferramentas | Min |
|---|---|---|---|---|---:|
| **1.1 O primeiro resultado em oito minutos** | "O cliente pergunta “e o meu processo?” toda semana." | Cola um andamento fictício e pede, em cinco partes (Função, Alvo, Texto-base, Orientações, Saída), três linhas para o cliente: o que aconteceu, o que significa e qual é o próximo passo.<br>**Leva:** Modelo de atualização ao cliente<br>*Cliente simulado.*<br>Cuidado: Sem promessa de resultado. Você lê antes de enviar. | Você vê o valor antes de configurar qualquer coisa. | IA<br>Precisa de: conta gratuita | 8 |
| **1.2 Conta segura e sigilo** | "Tenho medo de colar documento de cliente na IA." | Desliga o uso das conversas para treinamento, liga a verificação em duas etapas, revê a memória e classifica oito situações em verde, amarelo e vermelho. Sai com a política de uso de IA de uma página.<br>**Leva:** Configuração de privacidade conferida e política de uso de IA<br>*Jogo do semáforo.*<br>Cuidado: Segredo de justiça, saúde e dado de criança são vermelhos: não entram. | Usa o Claude sem medo e sabe o que nunca entra na conversa. | IA<br>Precisa de: conta gratuita | 8 |
| **1.3 Qual modelo para qual trabalho** | "Não sei qual modelo escolher e gasto o limite do plano à toa." | Roda o mesmo pedido em dois modelos, compara qualidade e tempo, e monta o guia do escritório: o menor modelo para o volume, o maior para o caso complexo.<br>**Leva:** Guia de modelos do escritório<br>*Antes e depois.*<br>Cuidado: Nenhum modelo dispensa a sua revisão. | Resposta melhor no caso difícil e limite preservado no dia a dia. | IA<br>Precisa de: conta gratuita; os modelos maiores dependem do plano | 10 |
| **1.4 O projeto do escritório** | "Toda conversa eu explico de novo quem eu sou e como eu escrevo." | Cria o projeto com as instruções permanentes do escritório e sobe duas peças antigas, anonimizadas, para o Claude aprender a estrutura e o estilo da casa.<br>**Leva:** Projeto do escritório com perfil e molde da casa<br>*Antes e depois.*<br>Cuidado: Peça antiga só entra sem nomes, números de documento e dados do cliente. | Toda resposta já sai no seu tom e no seu formato. | IA<br>Precisa de: conta gratuita | 10 |
| **1.5 Gmail, Agenda e Drive conectados** | "Começo a segunda-feira no escuro." | Conecta Gmail, Google Agenda e Drive da conta de treino, deixa as permissões em “perguntar sempre” e pede o resumo da semana: compromissos, conflitos e e-mails que pedem resposta.<br>**Leva:** Conectores do Google configurados e resumo da semana<br>*Missão.*<br>Cuidado: Conecte só o necessário. Rascunho e evento novo pedem a sua confirmação. | O Claude enxerga a sua semana e prepara o que você precisa saber. | Conectores, Gmail, Agenda, Drive<br>Precisa de: plano pago do Claude e conta Google | 12 |
| **1.6 Google Meet: a reunião vira ata** | "Saio da reunião com o cliente e a anotação fica pela metade." | Liga a transcrição da reunião (salva no Drive, ou por um conector de notas de reunião) e pede a ata: o que o cliente contou, decisões, pendências com responsável e data, e o e-mail de retorno em rascunho.<br>**Leva:** Ata da reunião com tarefas e e-mail de retorno<br>*Contra o relógio.*<br>Cuidado: Grave e transcreva só com o consentimento do cliente. Não existe conector oficial do Meet no Claude: confira a ferramenta de notas antes de usar. | Toda reunião termina com um próximo passo escrito. | Meet, Conectores, Drive, IA<br>Precisa de: plano pago do Claude; transcrição do Meet pede Google Workspace pago, ou um conector de notas de reunião | 10 |
| **1.7 Plugin jurídico e skills** | "O plugin pronto revisa contrato pelo direito americano." | Instala o plugin jurídico, troca o playbook padrão, feito para os Estados Unidos, pelo critério do escritório e cria uma skill sua, a da atualização ao cliente.<br>**Leva:** Plugin jurídico com o playbook do escritório e uma skill própria<br>*Caça ao erro.*<br>Cuidado: O plugin sugere; a decisão é sua. | Os comandos prontos passam a seguir o direito brasileiro e o seu critério. | Plugins e skills, IA<br>Precisa de: plano pago do Claude | 12 |
| **1.8 MCP jurídico: processos e jurisprudência** | "Copio andamento do site do tribunal, um processo por vez." | Adiciona um conector MCP de processos (DataJud, do CNJ) e consulta movimentações por número; testa um conector de jurisprudência brasileira e compara com a fonte oficial.<br>**Leva:** Conector de processos e de jurisprudência configurado<br>*Missão.*<br>Cuidado: Os conectores jurídicos brasileiros são de terceiros: confira quem os mantém e a política de dados. O DataJud não busca por nome de parte nem por número da OAB. | O andamento e a pesquisa chegam dentro da conversa, com link para conferir. | MCP, IA<br>Precisa de: plano pago do Claude | 12 |
| **1.9 As três chaves** | "E se a IA inventar um precedente e eu assinar embaixo?" | Confere três citações nas fontes oficiais (existe? diz isso? vale hoje?) e registra cada conferência.<br>**Leva:** Registro de conferência de citações<br>*Caça ao erro.*<br>Cuidado: Tribunais já multaram advogados por precedente inexistente em peça. | Nada sai do escritório com citação que você não abriu. | IA, Planilhas<br>Precisa de: conta gratuita | 10 |

## Módulo 2 · Intermediário · Apresentação · A marca do advogado

- **A dor do módulo:** "Faço um bom trabalho, mas tudo o que eu mando tem cara de Word cru."
- **Você constrói e leva:** Design system do escritório no Claude, aplicado a apresentações, documentos e propostas
- **O que muda:** Logo, paleta, tipografia e layout definidos uma vez; daí em diante, o Claude produz tudo com a marca.
- **Para quem:** Para quem quer que cada apresentação, proposta e documento saia com a cara do escritório.
- **Precisa de:** conta gratuita para a identidade; design system e apresentações no Claude pedem plano pago
- **Tamanho:** 9 sessões, 1 h 30 min

| Sessão | A dor | O que você constrói e leva | O que você ganha | Ferramentas | Min |
|---|---|---|---|---|---:|
| **2.1 A identidade em uma página** | "Não sei explicar o que o meu escritório transmite." | Responde a uma entrevista do Claude e sai com três palavras, a paleta, as letras e o tom de voz do escritório.<br>**Leva:** Identidade do escritório em uma página<br>*Entrevista.*<br>Cuidado: Sobriedade é regra da OAB: sem autoelogio e sem promessa. | Uma base para todas as decisões visuais, tomada uma vez. | IA<br>Precisa de: conta gratuita | 10 |
| **2.2 O logotipo** | "Não tenho logo, ou tenho um que eu mesmo fiz no celular." | Pede três caminhos de logotipo tipográfico, escolhe um, refina em duas rodadas e guarda o arquivo em vetor (SVG) e em PNG.<br>**Leva:** Logotipo do escritório em SVG e PNG<br>*Antes e depois.*<br>Cuidado: Não use o símbolo da OAB nem da República. Confira se o nome não colide com outra marca registrada. | Uma marca limpa, que funciona no papel timbrado e na tela do celular. | IA, Design system<br>Precisa de: conta gratuita | 10 |
| **2.3 O design system no Claude** | "Cada vez que peço uma apresentação, ela vem com uma cara diferente." | Guarda no Claude o design system do escritório: cores, letras, espaçamentos, logotipo e exemplos de página. Sem esse recurso no plano, guarda a marca como skill ou instrução do projeto.<br>**Leva:** Design system do escritório<br>*Construção guiada.* | Toda página, slide ou painel que o Claude cria já sai com a sua marca. | Design system, Plugins e skills<br>Precisa de: plano pago do Claude; sem ele, skill ou instrução do projeto | 12 |
| **2.4 Apresentações com a sua marca** | "Tenho reunião com o cliente amanhã e só um parecer de doze páginas." | Transforma o parecer em cinco slides com a marca: a decisão que se pede, o cenário, os riscos, os caminhos e o próximo passo. Baixa em PowerPoint ou PDF.<br>**Leva:** Apresentação de cinco slides com a marca<br>*Contra o relógio.*<br>Cuidado: Dado do cliente só entra anonimizado, ou depois do termo de consentimento. | Você chega à reunião com material de escritório grande. | Slides, Design system, IA<br>Precisa de: plano pago do Claude | 12 |
| **2.5 Documentos timbrados e assinatura de e-mail** | "Cada documento meu sai com uma cara diferente." | Cria o modelo timbrado no Google Docs e a assinatura de e-mail com a marca.<br>**Leva:** Modelo timbrado e assinatura de e-mail<br>*Antes e depois.*<br>Cuidado: No timbre: nome e número de inscrição na OAB. | Petição, parecer e e-mail com a mesma identidade. | Docs, Gmail, IA<br>Precisa de: conta Google gratuita | 8 |
| **2.6 Proposta de uma página** | "Mandei o valor por WhatsApp e o cliente sumiu." | Monta o modelo de proposta com a marca: o problema do cliente, escopo, etapas, o que não está incluído, investimento e próximo passo.<br>**Leva:** Modelo de proposta de honorários<br>*Antes e depois.*<br>Cuidado: Proposta só para quem pediu. Sem promessa de resultado. | Você apresenta valor antes de preço. | Docs, Design system, IA<br>Precisa de: conta gratuita | 12 |
| **2.7 Relatório do caso para o cliente** | "Trabalhei o mês inteiro e, para o cliente, parece que nada aconteceu." | Gera o relatório do mês em uma página, com a marca: o que foi feito, o que está pendente e o próximo passo, com a linha do tempo do caso.<br>**Leva:** Modelo de relatório mensal<br>*Cliente simulado.*<br>Cuidado: Você revisa antes de enviar. | O cliente vê o trabalho, confia e indica. | IA, Design system, Docs<br>Precisa de: conta gratuita | 10 |
| **2.8 Cartão virtual dentro das regras** | "Não tenho cartão, e o que eu vejo por aí parece propaganda." | Cria o cartão virtual com a marca, QR Code e link para a agenda, e confere item a item com o Provimento 205/2021.<br>**Leva:** Cartão virtual conferido<br>*Caça ao erro.*<br>Cuidado: Nome e número da OAB; sem fotografia, sem preço e sem promessa. | Você é encontrado do jeito que a OAB permite. | IA, Design system<br>Precisa de: conta gratuita; publicar por link pede plano pago | 8 |
| **2.9 IA às claras com o cliente** | "Uso IA escondido. E se o cliente perguntar?" | Escreve, com a marca, a página “Como usamos IA no seu caso” e o termo de consentimento do cliente.<br>**Leva:** Página de transparência e termo de consentimento<br>*Cliente simulado.*<br>Cuidado: A Recomendação 001/2024 da OAB pede informação por escrito e a assinatura do cliente. | O cuidado com o sigilo vira diferencial. | IA, Docs<br>Precisa de: conta gratuita | 8 |

## Módulo 3 · Avançado · Automação · Automação com guardrails

- **A dor do módulo:** "Quero automatizar, mas tenho medo de um script fazer besteira com os dados do meu cliente."
- **Você constrói e leva:** Plataforma do escritório no Google: casos, clientes e contratos, com scripts protegidos e painéis
- **O que muda:** Prazos, e-mails, clientes e contratos rodando sozinhos, com proteções escritas, registro de tudo e nada enviado sem você.
- **Para quem:** Para quem quer o escritório rodando sozinho no Google, sem perder o controle.
- **Precisa de:** conta Google gratuita; triagem e leitura de contrato com IA pedem chave de API paga
- **Tamanho:** 9 sessões, 1 h 48 min

| Sessão | A dor | O que você constrói e leva | O que você ganha | Ferramentas | Min |
|---|---|---|---|---|---:|
| **3.1 O ambiente das automações** | "Não sei nem onde um script fica, nem onde guardar a chave." | Monta o ambiente: conta Google de treino, planilha-mãe com as abas do escritório, pastas no Drive, a chave da API guardada fora da planilha e o limite de gasto no painel do fornecedor.<br>**Leva:** Ambiente de automação do escritório<br>*Construção guiada.*<br>Cuidado: Teste sempre na conta de treino antes da conta real. | Tudo no lugar antes do primeiro script rodar. | Planilhas, Drive, Apps Script<br>Precisa de: conta Google gratuita | 10 |
| **3.2 Os guardrails dos scripts** | "E se o script mandar um e-mail errado ou vazar um CPF?" | Configura as proteções: máscara de CPF, CNPJ, e-mail e telefone antes da IA, lista de termos que nunca saem, e-mail só em rascunho, revisão obrigatória antes da agenda e registro de tudo na aba Log.<br>**Leva:** Arquivo de configuração com as proteções do escritório<br>*Conserte o script.*<br>Cuidado: A máscara não cobre nomes nem endereços: troque por papéis antes. | Você decide, por escrito, o que o robô pode e não pode fazer. | Apps Script, Planilhas<br>Precisa de: conta Google gratuita | 12 |
| **3.3 O robô das 7h e os prazos na agenda** | "Prazo na planilha não apita." | O Claude escreve dois scripts: um manda para o seu e-mail os prazos da semana; o outro cria na agenda os prazos conferidos, com alarme.<br>Passa a rodar sozinho: todo dia às 7h, os prazos da semana no seu e-mail; à noite, os prazos conferidos viram eventos com alarme<br>**Leva:** Robô dos prazos e agenda com alarme<br>*O robô trabalhou enquanto você dormia.*<br>Cuidado: A IA não conta prazo. Só vai para a agenda o prazo com “Conferido por”. | A planilha passa a te procurar, e o celular avisa antes do prazo. | Apps Script, Gmail, Agenda, Planilhas<br>Precisa de: conta Google gratuita | 12 |
| **3.4 Triagem de e-mail com você no comando** | "A caixa de entrada me engole." | Liga a triagem: o script etiqueta, resume e deixa rascunho de resposta. Você muda uma regra do pedido e acrescenta um termo sensível.<br>Passa a rodar sozinho: a cada 30 minutos, e-mails novos ganham etiqueta, resumo e rascunho<br>**Leva:** Triagem de e-mail<br>*Caça ao erro.*<br>Cuidado: Nada é enviado. E-mail com termo sensível não vai para a IA. | Você abre a caixa já sabendo o que é urgente. | Apps Script, Gmail, IA pela API<br>Precisa de: chave de API paga (centavos por e-mail); sem chave, triagem por regras de remetente e assunto | 12 |
| **3.5 Plataforma de clientes** | "Cliente novo me custa uma tarde de papelada." | Formulário de primeiro contato com aviso de privacidade, cadastro automático, boas-vindas em rascunho e, com um clique, procuração, contrato de honorários e termo de consentimento gerados dos seus modelos timbrados.<br>Passa a rodar sozinho: cada formulário entra no cadastro; um clique gera os documentos na pasta do cliente<br>**Leva:** Plataforma de clientes<br>*Contra o relógio.*<br>Cuidado: Peça só o necessário. Nada de consulta automática a quem não é cliente. | A tarde de papelada vira um minuto de conferência. | Formulários, Apps Script, Docs, Drive, Planilhas<br>Precisa de: conta Google gratuita | 14 |
| **3.6 Contrato lido pelo seu critério** | "Leio o contrato no olho e fico com a sensação de que deixei passar uma cláusula." | O script manda o contrato à IA, compara com o playbook e preenche a matriz de riscos com o trecho literal conferido. Vigência e prazo de aviso são calculados pelo código.<br>Passa a rodar sozinho: a cada 10 minutos, contrato novo na pasta de entrada vira matriz de riscos<br>**Leva:** Matriz de riscos do contrato<br>*Prova com gabarito.*<br>Cuidado: Trecho que não confere fica marcado. O risco é decidido e assinado por você. | A primeira leitura chega pronta, e você gasta o tempo no que importa. | Apps Script, IA pela API, Planilhas, Drive<br>Precisa de: chave de API paga (centavos por contrato); sem chave, a análise na conversa colada na planilha | 14 |
| **3.7 Versões e prazos do contrato** | "A outra parte devolveu “com pequenos ajustes” e eu não vi o que mudou." | O código compara cada nova versão com a anterior, registra no histórico, avisa por e-mail se algo piorou e leva os prazos dos contratos revisados para a agenda.<br>Passa a rodar sozinho: a cada hora, versão nova é comparada e mudança desfavorável vira alerta no seu e-mail<br>**Leva:** Histórico de versões com alerta e prazos contratuais na agenda<br>*Caça ao erro.*<br>Cuidado: A comparação é do código; a IA só explica. | Nenhuma cláusula muda sem você saber, e nenhuma renovação te pega de surpresa. | Apps Script, Drive, Gmail, Agenda<br>Precisa de: conta Google gratuita | 10 |
| **3.8 Os painéis do escritório** | "Não sei o que está parado, quem espera retorno nem que contrato vence." | Monta três painéis com a marca do escritório: casos e prazos, clientes e honorários a receber, contratos e riscos sem decisão.<br>**Leva:** Painéis de casos, clientes e contratos<br>*Missão.*<br>Cuidado: Os dados reais ficam na sua conta Google. | Três telas respondem à pergunta de segunda-feira. | Painel, Planilhas, Design system<br>Precisa de: conta Google gratuita | 12 |
| **3.9 A plataforma com a cara do escritório** | "Quero um sistema meu, sem pagar mensalidade de software." | O Claude escreve um aplicativo web do Apps Script sobre as planilhas, com o design system do escritório: busca, ficha do cliente, ficha do contrato, matriz e histórico, acessível só pela sua conta.<br>**Leva:** Plataforma própria do escritório<br>*Construção guiada.*<br>Cuidado: Publique com acesso só para você ou sua equipe. | Um sistema do escritório, de graça, que você mesmo ajusta. | Apps Script, Painel, Design system, IA<br>Precisa de: conta Google gratuita | 12 |

## Qual modelo para qual trabalho

Comece pelo menor modelo que resolve e suba quando a tarefa pede raciocínio longo ou documento grande. Os modelos maiores gastam mais do limite do plano e custam mais pela API. A disponibilidade depende do plano: confira no seletor de modelos antes de gravar.

| Modelo | Perfil | Na advocacia |
|---|---|---|
| **Haiku 5.5** | O mais rápido e barato | Triagem de e-mail em volume, classificar intimações, extrair campos de formulários e documentos padronizados, automações pela API que rodam o dia inteiro. |
| **Sonnet 5.5** | O do dia a dia | E-mails, atualização ao cliente, resumos, ata de reunião, fórmulas de planilha, scripts do Apps Script, slides e páginas com a marca. |
| **Opus 5.5** | Leitura cuidadosa | Contrato contra o playbook, minuta a partir do molde da casa, parecer, comparação de versões, pesquisa com fontes. É o modelo que o kit usa na leitura de contratos. |
| **Fable 5.2** | O mais capaz | Processos complexos: autos volumosos, várias teses em disputa, estratégia processual, contratos longos e interligados, revisão crítica da peça antes do protocolo e construção da plataforma própria. |

## A mesma dor volta em mais de uma sessão

| Dor | Sessões |
|---|---|
| "Não sei o que configurar nem qual modelo usar." | 1.2, 1.3, 1.4 |
| "Tenho medo de expor meu cliente." | 1.2, 2.9, 3.2 |
| "Começo a segunda-feira no escuro." | 1.5, 3.3, 3.8 |
| "A reunião acaba e a anotação fica pela metade." | 1.6 |
| "Copio andamento do site do tribunal, um por um." | 1.8 |
| "Tenho medo de a IA inventar e eu assinar embaixo." | 1.9, 3.6 |
| "Tudo o que eu mando tem cara de Word cru." | 2.1, 2.2, 2.3, 2.5 |
| "O cliente não enxerga o meu trabalho." | 2.4, 2.6, 2.7 |
| "Uso IA escondido." | 2.9 |
| "Prazo na planilha não apita." | 3.3 |
| "A caixa de entrada me engole." | 3.4 |
| "Cliente novo me custa uma tarde de papelada." | 3.5 |
| "Revisar contrato me toma a tarde." | 1.7, 3.6, 3.7 |
| "Quero um sistema meu, sem mensalidade." | 3.8, 3.9 |

## O que o aluno precisa

- Módulo 1: conta gratuita até a sessão 1.4; conectores, plugin e MCP pedem plano pago do Claude.
- Módulo 2: conta gratuita para identidade, logo e documentos; design system e apresentações no Claude pedem plano pago.
- Módulo 3: conta Google gratuita; só a triagem de e-mail e a leitura de contrato com IA pedem chave de API paga, com caminho sem chave.
- Não precisa saber programar: o Claude escreve o script, você cola, autoriza, testa e muda uma regra. O kit traz cada script pronto.
- Os módulos são independentes: quem entra direto no 2 ou no 3 recebe a página de configuração mínima e a planilha-base.

## Regras que valem para tudo

- Em aula, só casos e dados fictícios, numa conta de treino.
- Nada sai sozinho para terceiros: e-mail fica em rascunho e quem envia é você.
- A IA não conta prazo. Prazo só vai para a agenda depois de conferido.
- Conector, plugin e MCP de terceiros: confira quem mantém e a política de dados antes de usar com cliente.
- Material público do escritório segue o Provimento 205/2021 da OAB: informativo e sóbrio, sem preço e sem promessa.

## Para ir além, fora da minutagem

- Resumo semanal automático da agenda (script do kit).
- Auditor de citações de um Google Docs (script do kit).
- Painel de casos em página única, sem conta Google (painel do kit).

## O que falta para gravar

- Os tempos são estimativas: falta uma gravação-piloto.
- Na gravação, cada sessão vira dois ou três vídeos de 3 a 6 minutos.
- Telas de configuração, nomes de modelos e planos mudam rápido: conferir na véspera e gravar essas aulas separadas, para regravar fácil.
- Os scripts do kit passaram só em simulação: rodar em conta Google real, com a API real, antes de gravar.
- A produzir: playbook brasileiro para o plugin, skill de atualização ao cliente, design system de exemplo, scripts do robô das 7h e da plataforma de clientes, painéis e o aplicativo web.

## Relatório da agenda

| Módulo | O aluno leva | Sessões | Vídeo | Automações | Precisa de |
|---|---|---:|---:|---:|---|
| 1 · O seu Claude, configurado (Básico) | Ambiente do escritório no Claude: conta segura, projeto, conectores, plugin, MCP jurídico e guia de modelos | 9 | 1 h 32 min | 0 | conta gratuita até a 1.4; conectores, plugin e MCP pedem plano pago do Claude |
| 2 · A marca do advogado (Intermediário) | Design system do escritório no Claude, aplicado a apresentações, documentos e propostas | 9 | 1 h 30 min | 0 | conta gratuita para a identidade; design system e apresentações no Claude pedem plano pago |
| 3 · Automação com guardrails (Avançado) | Plataforma do escritório no Google: casos, clientes e contratos, com scripts protegidos e painéis | 9 | 1 h 48 min | 5 | conta Google gratuita; triagem e leitura de contrato com IA pedem chave de API paga |
| **Total** | 3 sistemas | 27 | 4 h 50 min | 5 | |

- **Frentes pedidas cobertas:** 12 de 12
- **Primeiro resultado:** no minuto 8
- **Sessões com Apps Script:** 8
- **Sessões com IA:** 19
- **Pedem plano pago do Claude:** 6
- **Pedem chave de API:** 3.4 e 3.6, com caminho sem chave

- **No módulo 1, o aluno sai com:** Modelo de atualização ao cliente · Configuração de privacidade conferida e política de uso de IA · Guia de modelos do escritório · Projeto do escritório com perfil e molde da casa · Conectores do Google configurados e resumo da semana · Ata da reunião com tarefas e e-mail de retorno · Plugin jurídico com o playbook do escritório e uma skill própria · Conector de processos e de jurisprudência configurado · Registro de conferência de citações
- **No módulo 2, o aluno sai com:** Identidade do escritório em uma página · Logotipo do escritório em SVG e PNG · Design system do escritório · Apresentação de cinco slides com a marca · Modelo timbrado e assinatura de e-mail · Modelo de proposta de honorários · Modelo de relatório mensal · Cartão virtual conferido · Página de transparência e termo de consentimento
- **No módulo 3, o aluno sai com:** Ambiente de automação do escritório · Arquivo de configuração com as proteções do escritório · Robô dos prazos e agenda com alarme · Triagem de e-mail · Plataforma de clientes · Matriz de riscos do contrato · Histórico de versões com alerta e prazos contratuais na agenda · Painéis de casos, clientes e contratos · Plataforma própria do escritório

Agenda de planejamento, versão de 11/11/2026. Material de treinamento, sem valor de parecer jurídico. Casos, clientes e documentos das aulas são fictícios.
