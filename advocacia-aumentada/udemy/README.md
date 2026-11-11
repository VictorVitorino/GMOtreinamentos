# IA Aplicada a Advogados

*Planilhas, painéis, Google Apps Script e IA no dia a dia do escritório*

**Curso gravado · Agenda** · 3 módulos · 27 sessões · 4 h 55 min de vídeo · 12 automações · um sistema por módulo

Em cada sessão, uma dor a menos e uma ferramenta pronta para usar no dia seguinte. Três módulos independentes, três plataformas: casos e prazos, clientes e contratos.

A página da agenda é [agenda-udemy.html](agenda-udemy.html). Este arquivo é o espelho em texto; os dois saem de [agenda.json](agenda.json) pelo script [montar.js](montar.js) (`node montar.js`).

Toda sessão anda em três tempos: **a dor** → **o que você constrói** → **o que você ganha**.

## A caixa de ferramentas do escritório

| Frente | Sessões |
|---|---|
| Planilhas | 1.3, 1.4, 2.5, 3.1 |
| Painéis | 1.9, 2.8, 3.8 |
| Google Apps Script | 1.5, 1.6, 2.3, 2.4, 2.6, 2.7, 2.9, 3.1, 3.3, 3.5, 3.6, 3.9 |
| Automação de e-mail | 1.5, 2.3, 2.7, 2.9 |
| Automação de agenda | 1.6, 3.6 |
| Análise de contrato automatizada | 3.3, 3.5 |
| Análise de riscos | 3.2, 3.3, 3.4, 3.7 |
| Gestão de casos | 1.3, 1.4, 1.7, 1.9 |
| Plataforma de contratos | 3.1, 3.8, 3.9 |
| Plataforma de clientes | 2.2, 2.4, 2.6, 2.8 |

## Módulo 1 · Básico · Organização · Casa em ordem

- **A dor do módulo:** "Trabalho o dia inteiro apagando incêndio e, no fim, não sei o que ficou para trás."
- **Você constrói e leva:** Gestão de casos e prazos: planilha, painel e o robô das 7h
- **O que muda:** Você sabe pedir à IA, sabe conferir o que ela diz, protege o sigilo e acorda com os prazos da semana no e-mail e na agenda.
- **Para quem:** Para quem usa IA sem método, ou ainda não começou, e controla tudo em caderno e planilha.
- **Precisa de:** conta gratuita de IA e conta Google gratuita
- **Tamanho:** 9 sessões, 1 h 34 min

| Sessão | A dor | O que você constrói e leva | O que você ganha | Ferramentas | Min |
|---|---|---|---|---|---:|
| **1.1 O andamento que o cliente entende** | "O cliente pergunta “e o meu processo?” toda semana." | Cola um andamento fictício e pede à IA, em cinco partes (Função, Alvo, Texto-base, Orientações, Saída), três linhas: o que aconteceu, o que significa e qual é o próximo passo.<br>**Leva:** Modelo de atualização ao cliente<br>*Cliente simulado.*<br>Cuidado: Sem promessa de resultado. Você lê antes de enviar. | Primeiro resultado em oito minutos, e menos mensagens repetidas. | IA<br>Precisa de: conta gratuita de IA | 8 |
| **1.2 Sigilo em três cores** | "Tenho medo de colar documento de cliente na IA." | Ajusta a conta (conversas fora do treinamento, verificação em duas etapas), classifica oito situações em verde, amarelo e vermelho e escreve a política de uso de IA de uma página.<br>**Leva:** Cartão do semáforo e política de uso de IA<br>*Jogo do semáforo.*<br>Cuidado: Segredo de justiça, saúde e dado de criança são vermelhos: não entram. | Usa a IA sem medo e sabe o que nunca entra na conversa. | IA<br>Precisa de: conta gratuita de IA | 8 |
| **1.3 A planilha-mãe do escritório** | "Meus prazos estão em três lugares: no caderno, na planilha e na cabeça." | Junta as listas espalhadas numa planilha Google com colunas fixas, listas suspensas, fórmula de dias restantes e cor automática para o que vence. A IA desenha as colunas e escreve as fórmulas.<br>**Leva:** Planilha de casos e prazos<br>*Missão.*<br>Cuidado: A data do prazo é você quem lança. A IA não conta prazo. | Um lugar só para todos os casos, que avisa pela cor. | Planilhas, IA<br>Precisa de: conta Google gratuita | 12 |
| **1.4 Intimações do dia em cinco minutos** | "Toda manhã leio dezenas de intimações e tenho medo de deixar uma passar." | Cola as intimações do dia e recebe uma linha por intimação: processo, o que o ato pede, data de disponibilização e “prazo: conferir”. A fórmula VALIDAR_CNJ confere o número do processo.<br>**Leva:** Quadro de intimações na planilha<br>*Contra o relógio.*<br>Cuidado: A IA lê e organiza. O prazo é contado e conferido por você. | Nenhuma intimação fica sem dono, e a leitura da manhã encurta. | IA, Planilhas<br>Precisa de: conta gratuita de IA e conta Google gratuita | 10 |
| **1.5 Seu primeiro script: o e-mail das 7h** | "Só lembro do prazo quando abro a planilha, e tem dia que eu não abro." | A IA escreve um Google Apps Script que lê a planilha e manda para o seu e-mail os prazos vencidos, de hoje e da semana. Você cola, autoriza, testa e liga o horário.<br>Passa a rodar sozinho: todo dia às 7h, os prazos da semana chegam ao seu e-mail<br>**Leva:** Robô dos prazos<br>*O robô trabalhou enquanto você dormia.*<br>Cuidado: O e-mail vai só para você. Nenhum dado sai da sua conta Google. | A planilha passa a te procurar, e não o contrário. | Apps Script, Planilhas, Gmail, IA<br>Precisa de: conta Google gratuita | 12 |
| **1.6 Prazos na agenda, com alarme** | "Prazo na planilha não apita." | Um segundo script cria na Agenda Google um evento para cada prazo marcado como conferido, com alarme sete dias e um dia antes.<br>Passa a rodar sozinho: toda noite, os prazos conferidos viram eventos com alarme na sua agenda<br>**Leva:** Agenda de prazos com alarme<br>*Conserte o script.*<br>Cuidado: Só vai para a agenda o prazo com “Conferido por” preenchido. | O celular avisa antes do prazo, sem você lembrar de olhar. | Apps Script, Agenda, Planilhas<br>Precisa de: conta Google gratuita | 10 |
| **1.7 Ficha do caso a partir do WhatsApp** | "O caso inteiro do cliente está no WhatsApp: áudio, print e foto de documento." | Exporta uma conversa fictícia, sobe os documentos e pede os fatos com o trecho de origem, a linha do tempo, as lacunas e os documentos que faltam.<br>**Leva:** Ficha do caso<br>*Missão.*<br>Cuidado: Conversa real de cliente é dado amarelo: troque nomes por papéis antes de colar. | Você confere em vez de garimpar, e nenhum fato fica solto. | IA<br>Precisa de: conta gratuita de IA | 12 |
| **1.8 As três chaves** | "E se a IA inventar um precedente e eu assinar embaixo?" | Pede à IA o plano de pesquisa da tese, confere três citações nas fontes oficiais (existe? diz isso? vale hoje?) e registra cada conferência na planilha.<br>**Leva:** Registro de conferência de citações<br>*Caça ao erro.*<br>Cuidado: Tribunais já multaram advogados por precedente inexistente em peça. | Nada sai do escritório com citação que você não abriu. | IA, Planilhas<br>Precisa de: conta gratuita de IA | 10 |
| **1.9 O painel de casos** | "Tenho dezenas de processos e não sei dizer quais estão parados." | Transforma a planilha-mãe num painel: vencidos, hoje, semana, casos parados há mais de 30 dias e casos por responsável.<br>**Leva:** Painel de casos e prazos<br>*Construção guiada.*<br>Cuidado: Os dados reais ficam na sua planilha e no seu navegador. Não vão para a IA. | Uma tela responde o que vence e o que está parado. | Painel, Planilhas, IA<br>Precisa de: conta gratuita de IA e conta Google gratuita | 12 |

## Módulo 2 · Intermediário · Clientela · Plataforma de clientes

- **A dor do módulo:** "Faço um bom trabalho, mas o cliente não enxerga, e cada cliente novo me custa uma tarde de papelada."
- **Você constrói e leva:** Plataforma de clientes: formulário, cadastro, documentos gerados e painel
- **O que muda:** Do primeiro contato à cobrança, cada etapa tem um modelo, um botão ou um rascunho pronto, e o cliente percebe método.
- **Para quem:** Para quem quer atender, propor e cobrar com cara de escritório grande.
- **Precisa de:** conta Google gratuita; triagem com IA pede chave de API paga
- **Tamanho:** 9 sessões, 1 h 40 min

| Sessão | A dor | O que você constrói e leva | O que você ganha | Ferramentas | Min |
|---|---|---|---|---|---:|
| **2.1 A cara do escritório** | "Cada documento meu sai com uma cara diferente." | Define cores, letras e tom de voz em uma página e cria o modelo timbrado no Google Docs e a assinatura de e-mail.<br>**Leva:** Identidade em uma página e modelo timbrado<br>*Antes e depois.*<br>Cuidado: Sobriedade é regra da OAB: nome e número de inscrição, sem promessa e sem autoelogio. | O escritório parece do tamanho que é, em tudo o que envia. | IA, Docs<br>Precisa de: conta gratuita de IA e conta Google gratuita | 10 |
| **2.2 Formulário de primeiro contato** | "O cliente chega pelo WhatsApp, conta tudo em áudio, e eu perco metade." | Cria o formulário de primeiro contato com aviso de privacidade. Cada resposta vira uma linha na planilha de clientes.<br>Passa a rodar sozinho: cada formulário preenchido entra sozinho no cadastro de clientes<br>**Leva:** Formulário e cadastro de clientes<br>*Missão.*<br>Cuidado: Aviso de privacidade no formulário. Peça só o necessário. Nada de consulta automática a quem não é cliente. | Todo contato chega organizado, com o que você precisa saber. | Formulários, Planilhas<br>Precisa de: conta Google gratuita | 10 |
| **2.3 Boas-vindas e canais oficiais** | "Usaram meu nome no WhatsApp para pedir Pix ao meu cliente." | Escreve o texto fixo de boas-vindas: como o escritório trabalha, canais e horários, e o que o escritório nunca pede por mensagem. Um script deixa a resposta pronta a cada formulário novo.<br>Passa a rodar sozinho: a cada formulário novo, o e-mail de boas-vindas fica pronto em rascunho<br>**Leva:** Kit de boas-vindas com aviso contra golpe<br>*Antes e depois.*<br>Cuidado: O texto é seu e quem envia é você. A IA não fala sozinha com o cliente. | Limites combinados no primeiro dia e um cliente protegido do golpe do falso advogado. | Apps Script, Gmail, Formulários<br>Precisa de: conta Google gratuita | 8 |
| **2.4 Proposta de uma página** | "Mandei o valor por WhatsApp e o cliente sumiu." | Monta no Docs o modelo de proposta: o problema do cliente, escopo, etapas, o que não está incluído, investimento e próximo passo. Um script preenche com os dados do cliente e salva em PDF.<br>Passa a rodar sozinho: um clique na planilha gera a proposta do cliente em PDF<br>**Leva:** Gerador de propostas<br>*Antes e depois.*<br>Cuidado: Proposta só para quem pediu. Sem promessa de resultado. | Você apresenta valor antes de preço, e a conversa muda de nível. | Docs, Apps Script, Planilhas, IA<br>Precisa de: conta Google gratuita | 12 |
| **2.5 Quanto cobrar, e como sustentar** | "Cobro no chute e, no primeiro “tá caro”, dou desconto." | Monta a calculadora de honorários na planilha (custo do escritório, horas previstas, complexidade) ao lado do mínimo da tabela da sua seccional, e ensaia a conversa com a IA no papel do cliente que pechincha.<br>**Leva:** Calculadora de honorários<br>*Cliente simulado.*<br>Cuidado: A tabela da seccional é a referência mínima. Quem decide o preço é você. | Preço com critério, e firmeza para explicá-lo. | Planilhas, IA<br>Precisa de: conta gratuita de IA e conta Google gratuita | 12 |
| **2.6 Kit de abertura em um clique** | "Cliente novo, e lá vou eu preencher procuração, contrato e declaração à mão." | Um script lê a linha do cliente e gera, a partir dos seus modelos, procuração, contrato de honorários e termo de consentimento sobre o uso de IA, numa pasta do cliente no Drive.<br>Passa a rodar sozinho: um clique gera os três documentos na pasta do cliente<br>**Leva:** Kit de abertura de cliente<br>*Contra o relógio.*<br>Cuidado: O termo de consentimento atende à Recomendação 001/2024 da OAB. Confira cada documento antes de assinar. | A tarde de papelada vira um minuto de conferência. | Apps Script, Docs, Drive, Planilhas<br>Precisa de: conta Google gratuita | 12 |
| **2.7 Triagem de e-mail com você no comando** | "A caixa de entrada me engole." | Instala a triagem do kit: o script etiqueta, resume e deixa rascunho de resposta, sem enviar nada. Você ajusta uma regra do pedido e acrescenta um termo sensível.<br>Passa a rodar sozinho: a cada 30 minutos, e-mails novos ganham etiqueta, resumo e rascunho<br>**Leva:** Triagem de e-mail<br>*Caça ao erro.*<br>Cuidado: CPF, CNPJ, e-mail e telefone são mascarados antes de ir à IA. E-mail com termo sensível não vai. | Você abre a caixa já sabendo o que é urgente, com a resposta começada. | Apps Script, Gmail, IA pela API<br>Precisa de: chave de API paga (centavos por e-mail); sem chave, triagem por regras de remetente e assunto | 14 |
| **2.8 Painel de clientes e relatório do mês** | "Não sei a quem devo retorno, e relatório é a última coisa que eu faço." | Monta o painel de clientes (último contato, pendência, próxima atualização, honorários a receber) e, de cada linha, o relatório do mês em uma página: feito, pendente e próximo passo.<br>**Leva:** Painel de clientes e modelo de relatório<br>*Missão.*<br>Cuidado: Você revisa o relatório antes de enviar. | Ninguém fica sem resposta, e o relatório do mês sai em minutos. | Painel, Planilhas, Docs, IA<br>Precisa de: conta gratuita de IA e conta Google gratuita | 14 |
| **2.9 Cobrar sem constrangimento** | "Cobrar honorário atrasado me constrange, então eu deixo passar." | Escreve a régua de cobrança em três mensagens, da lembrança ao aviso formal. Um script lê as parcelas da planilha e deixa as mensagens dos atrasados prontas.<br>Passa a rodar sozinho: toda segunda, as cobranças das parcelas atrasadas ficam prontas em rascunho<br>**Leva:** Régua de cobrança<br>*Antes e depois.*<br>Cuidado: Fica em rascunho e quem envia é você. Cobrança respeitosa, sem expor o cliente. | Você cobra no prazo e preserva a relação. | Apps Script, Gmail, Planilhas<br>Precisa de: conta Google gratuita | 8 |

## Módulo 3 · Avançado · Contratos e riscos · Plataforma de contratos

- **A dor do módulo:** "Revisar contrato me toma a tarde, cada um revisa de um jeito, e a versão do outro lado sempre esconde alguma coisa."
- **Você constrói e leva:** Plataforma de contratos: repositório, matriz de riscos, histórico de versões e painel
- **O que muda:** Todo contrato lido pelo seu critério, cada versão comparada, prazos na agenda e uma plataforma com a cara do escritório.
- **Para quem:** Para quem revisa contratos e quer critério, histórico e um sistema próprio.
- **Precisa de:** conta Google gratuita; leitura automática pede chave de API paga
- **Tamanho:** 9 sessões, 1 h 41 min

| Sessão | A dor | O que você constrói e leva | O que você ganha | Ferramentas | Min |
|---|---|---|---|---|---:|
| **3.1 Repositório que se organiza sozinho** | "Não sei onde está a última versão do contrato." | Instala o kit: pastas no Drive, pasta de entrada, código por contrato e planilha de contratos.<br>Passa a rodar sozinho: contrato que cai na pasta de entrada é cadastrado e copiado<br>**Leva:** Repositório de contratos<br>*Construção guiada.*<br>Cuidado: Defina quem acessa e por quanto tempo se guarda cada versão. | Cada contrato tem um código, um lugar e uma história. | Drive, Planilhas, Apps Script<br>Precisa de: conta Google gratuita | 10 |
| **3.2 O critério do escritório em uma página** | "Cada advogado revisa de um jeito." | A IA entrevista você por dez minutos e escreve o playbook: o que é padrão, o que se negocia e o que se recusa, por tipo de contrato (locação, prestação de serviços).<br>**Leva:** Playbook do escritório<br>*Entrevista.* | Todo contrato passa a ser lido pelo mesmo critério, que é o seu. | IA, Planilhas<br>Precisa de: conta gratuita de IA | 10 |
| **3.3 Leitura automática e matriz de riscos** | "Leio o contrato no olho e fico com a sensação de que deixei passar uma cláusula." | O script manda o contrato à IA, compara com o playbook e preenche a matriz: cláusula, risco e trecho literal conferido. Vigência e prazo de aviso são calculados pelo código.<br>Passa a rodar sozinho: a cada 10 minutos, contrato novo vira matriz de riscos<br>**Leva:** Matriz de riscos do contrato<br>*Construção guiada.*<br>Cuidado: A IA compara com o seu critério. Trecho que não confere fica marcado. A decisão é sua. | A primeira leitura chega pronta, e você gasta o tempo no que importa. | Apps Script, IA pela API, Planilhas, Drive<br>Precisa de: chave de API paga (centavos por contrato); sem chave, a análise feita na conversa e colada na planilha | 15 |
| **3.4 Prova com gabarito** | "Como eu sei se posso confiar nessa análise?" | Compara a matriz com a revisão humana do gabarito, decide cada risco (aceitar, negociar, recusar) e assina a revisão.<br>**Leva:** Matriz revisada e assinada<br>*Prova com gabarito.*<br>Cuidado: O status “Revisado” só vale com o nome de quem revisou. | Você sabe onde a IA acerta e onde precisa de você. | Planilhas<br>Precisa de: conta Google gratuita | 10 |
| **3.5 O que mudou na versão do outro lado** | "A outra parte devolveu “com pequenos ajustes” e eu não vi o que mudou." | Sobe a versão 2. O código compara com a anterior, registra cada mudança no histórico e avisa por e-mail se alguma piorou para o seu cliente.<br>Passa a rodar sozinho: a cada hora, versão nova é comparada e mudança desfavorável vira alerta no seu e-mail<br>**Leva:** Histórico de versões com alerta<br>*Caça ao erro.*<br>Cuidado: A comparação é feita pelo código. A IA só explica. | Nenhuma cláusula muda sem você saber. | Apps Script, Drive, Gmail<br>Precisa de: conta Google gratuita; resumo das mudanças pela IA é opcional, com chave | 12 |
| **3.6 Prazos do contrato na agenda** | "Esqueci o prazo de aviso da não renovação." | Lança na agenda o fim da vigência e o último dia de aviso dos contratos revisados, com alarme.<br>Passa a rodar sozinho: pelo menu, os prazos dos contratos revisados viram eventos com alarme<br>**Leva:** Prazos contratuais na agenda<br>*Missão.*<br>Cuidado: Data lida pela IA só vai para a agenda depois da revisão. | A renovação automática deixa de ser surpresa. | Apps Script, Agenda<br>Precisa de: conta Google gratuita | 8 |
| **3.7 Relatório de riscos para o cliente** | "Mando a revisão em dez páginas e o cliente pergunta: posso assinar ou não?" | Transforma a matriz revisada em uma página para o cliente: a decisão que ele precisa tomar, os riscos em verde, amarelo e vermelho e o que negociar.<br>**Leva:** Relatório de riscos do contrato<br>*Cliente simulado.*<br>Cuidado: Linguagem simples, sem promessa. Você assina. | O cliente decide em minutos e enxerga o valor da revisão. | IA, Docs<br>Precisa de: conta gratuita de IA e conta Google gratuita | 10 |
| **3.8 Painel de contratos e riscos** | "Não sei quantos contratos vencem no trimestre nem quais têm risco alto sem decisão." | Monta o painel: contratos por situação, riscos altos sem decisão, próximos avisos de renovação e versões com alerta.<br>**Leva:** Painel de contratos<br>*Construção guiada.* | Você e o cliente veem a carteira de contratos em uma tela. | Painel, Planilhas<br>Precisa de: conta Google gratuita | 12 |
| **3.9 A plataforma com a cara do escritório** | "Quero um sistema meu, sem pagar mensalidade de software." | A IA escreve um aplicativo web do Apps Script sobre a planilha de contratos: busca, ficha do contrato, matriz e histórico, com a identidade do escritório e acesso só pela sua conta.<br>**Leva:** Plataforma de contratos própria<br>*Construção guiada.*<br>Cuidado: Publique com acesso só para você ou sua equipe. O dado do cliente não sai da sua conta Google. | Um sistema do escritório, de graça, que você mesmo ajusta. | Apps Script, Painel, IA<br>Precisa de: conta Google gratuita | 14 |

## A mesma dor volta em mais de uma sessão

| Dor | Sessões |
|---|---|
| "Meus prazos estão em três lugares." | 1.3, 1.5, 1.6, 1.9 |
| "Tenho medo de deixar uma intimação passar." | 1.4, 1.5 |
| "O cliente pergunta do processo toda semana." | 1.1, 2.8 |
| "O caso está espalhado no WhatsApp." | 1.7, 2.2 |
| "Tenho medo de a IA inventar e eu assinar embaixo." | 1.8, 3.3, 3.4 |
| "Tenho medo de expor meu cliente." | 1.2, 2.7, 3.9 |
| "O cliente não enxerga o meu trabalho." | 2.1, 2.4, 2.8, 3.7 |
| "Mandei o valor por WhatsApp e o cliente sumiu." | 2.4, 2.5 |
| "Cobro no chute e recebo quando dá." | 2.5, 2.8, 2.9 |
| "Cliente novo me custa uma tarde de papelada." | 2.2, 2.6 |
| "Usaram meu nome para pedir Pix ao meu cliente." | 2.3 |
| "A caixa de entrada me engole." | 2.7 |
| "Cada um revisa contrato de um jeito." | 3.2, 3.3 |
| "A versão do outro lado esconde mudanças." | 3.5 |

## O que o aluno precisa

- Conta gratuita em um assistente de IA. As aulas usam o Claude; o que é conversa funciona também no ChatGPT e no Gemini.
- Conta Google gratuita: Planilhas, Formulários, Docs, Agenda, Gmail, Drive e Apps Script, dentro dos limites de uso da conta gratuita.
- Chave de API paga só nas sessões 2.7 e 3.3, com custo de centavos por uso e limite de gasto. As duas têm caminho sem chave.
- Não precisa saber programar: a IA escreve o script, você cola, autoriza, testa e muda uma regra. O kit traz cada script pronto.
- Quem entra direto no módulo 2 ou no 3 recebe a planilha-base e a página do método de pedido e do semáforo.

## Regras que valem para tudo

- Em aula, só casos e dados fictícios.
- Nada sai sozinho para terceiros: e-mail fica em rascunho e quem envia é você.
- A IA não conta prazo. Prazo só vai para a agenda depois de conferido, com o nome de quem conferiu.
- O código calcula e a IA redige. Tudo o que as automações fazem fica registrado na planilha.
- Material público do escritório segue o Provimento 205/2021 da OAB: informativo e sóbrio, sem preço e sem promessa.

## Para ir além, fora da minutagem

- Resumo da semana a partir da agenda, com conflitos e horários livres (script do kit).
- Auditor de citações de um Google Docs, com validação do número do processo (script do kit).
- Relatório de encerramento do caso.

## O que falta para gravar

- Os tempos são estimativas: falta uma gravação-piloto.
- Na gravação, cada sessão vira dois ou três vídeos de 3 a 6 minutos.
- Os scripts do kit passaram só em simulação: rodar em conta Google real, com a API real, antes de gravar.
- A produzir: planilha-mãe com intimações, robô das 7h, agenda de prazos de casos, plataforma de clientes (formulário, boas-vindas, propostas, kit de abertura, cobrança), painéis dos módulos 2 e 3, aplicativo web de contratos e casos fictícios de cível, família, trabalhista e previdenciário.

## Relatório da agenda

| Módulo | O aluno leva | Sessões | Vídeo | Automações | Precisa de |
|---|---|---:|---:|---:|---|
| 1 · Casa em ordem (Básico) | Gestão de casos e prazos: planilha, painel e o robô das 7h | 9 | 1 h 34 min | 2 | conta gratuita de IA e conta Google gratuita |
| 2 · Plataforma de clientes (Intermediário) | Plataforma de clientes: formulário, cadastro, documentos gerados e painel | 9 | 1 h 40 min | 6 | conta Google gratuita; triagem com IA pede chave de API paga |
| 3 · Plataforma de contratos (Avançado) | Plataforma de contratos: repositório, matriz de riscos, histórico de versões e painel | 9 | 1 h 41 min | 4 | conta Google gratuita; leitura automática pede chave de API paga |
| **Total** | 3 sistemas | 27 | 4 h 55 min | 12 | |

- **Frentes pedidas cobertas:** 10 de 10
- **Primeiro resultado:** no minuto 8
- **Sessões com Apps Script:** 12
- **Sessões com IA:** 17
- **Pedem chave de API:** 2.7 e 3.3, com caminho sem chave

- **No módulo 1, o aluno sai com:** Modelo de atualização ao cliente · Cartão do semáforo e política de uso de IA · Planilha de casos e prazos · Quadro de intimações na planilha · Robô dos prazos · Agenda de prazos com alarme · Ficha do caso · Registro de conferência de citações · Painel de casos e prazos
- **No módulo 2, o aluno sai com:** Identidade em uma página e modelo timbrado · Formulário e cadastro de clientes · Kit de boas-vindas com aviso contra golpe · Gerador de propostas · Calculadora de honorários · Kit de abertura de cliente · Triagem de e-mail · Painel de clientes e modelo de relatório · Régua de cobrança
- **No módulo 3, o aluno sai com:** Repositório de contratos · Playbook do escritório · Matriz de riscos do contrato · Matriz revisada e assinada · Histórico de versões com alerta · Prazos contratuais na agenda · Relatório de riscos do contrato · Painel de contratos · Plataforma de contratos própria

Agenda de planejamento, versão de 11/11/2026. Material de treinamento, sem valor de parecer jurídico. Casos, clientes e documentos das aulas são fictícios.
