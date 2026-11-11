# Método FATOS e biblioteca de prompts

*Da mihi factum, dabo tibi ius*: dá-me os fatos e te darei o direito. O brocardo vale para a IA. Ela devolve um bom rascunho quando recebe os fatos certos, do jeito certo, e quem responde pelo direito continua sendo o advogado.

## O método

| Letra | Pergunta | O que escrever |
|---|---|---|
| **F** · Função | Quem a IA deve ser nesta tarefa? | O papel e o nível de experiência: "revisora sênior de contratos de tecnologia" |
| **A** · Alvo | Para quê e para quem? | O objetivo e o leitor: "para a sócia decidir se negocia", "para um cliente leigo" |
| **T** · Texto-base | Com base em quê? | Os fatos e os documentos, dentro de marcas como `<contrato>…</contrato>`. Dado amarelo só com proteção; dado vermelho não entra |
| **O** · Orientações | Com que limites? | As regras: o que não fazer, o que fazer quando faltar informação, o que citar |
| **S** · Saída | Em que formato? | Tabela, lista, e-mail, número de linhas, tom |

### Três orientações que entram em quase todo prompt

1. **"Se a informação não estiver no texto, escreva *não especificado*."** Tira da IA a tentação de completar o que falta.
2. **"Para cada afirmação, copie o trecho literal em que ela se apoia."** Torna a resposta conferível em segundos.
3. **"Não cite lei, súmula nem jurisprudência de memória."** Citação só entra depois de conferida na fonte oficial.

### O mesmo pedido, sem método e com método

Sem método:

```
Resume esse contrato pra mim.
```

Com método:

```
FUNÇÃO: Você é revisora sênior de contratos de tecnologia em um escritório brasileiro.

ALVO: Preciso decidir em dez minutos se recomendo ao cliente, que é o CONTRATANTE, assinar,
negociar ou recusar. O leitor sou eu, advogada.

TEXTO-BASE:
<contrato>
[cole aqui o contrato]
</contrato>

ORIENTAÇÕES:
- Use só o que está no contrato. Se algo não estiver escrito, escreva "não especificado".
- Para cada ponto, copie o trecho literal entre aspas e indique a cláusula.
- Não cite lei nem jurisprudência.
- Aponte o que falta no contrato e deveria estar.

SAÍDA: tabela com as colunas Cláusula, Tema, O que diz (trecho literal), Risco para o
contratante (alto, médio, baixo) e Por quê. Depois, três linhas com a recomendação.
```

### Depois da primeira resposta

A primeira resposta é um rascunho. Quatro pedidos que melhoram qualquer resultado:

```
Aponte os três pontos mais fracos da sua resposta e corrija-os.
```

```
O que um advogado da outra parte responderia a isso?
```

```
Reescreva para um cliente leigo, em no máximo oito linhas, sem termos técnicos.
```

```
Liste o que você presumiu sem estar escrito no texto.
```

---

## Biblioteca

Vinte e um prompts, na ordem em que aparecem nos módulos. Cada um responde a uma dor. Troque o que está entre colchetes; os exemplos usam o caso prático do treinamento.

### Módulo 1 · O painel do advogado

Os dez prompts que o participante leva do básico.

**1. Perfil do advogado** · "Explico quem eu sou toda vez" (colar nas instruções personalizadas)

```
Sou advogada no Brasil e atuo em [contratos empresariais e proteção de dados].
Escreva em português do Brasil, em tom profissional e direto, sem floreio.
Regras permanentes:
- Nunca invente lei, súmula, tema ou jurisprudência. Se não tiver certeza, diga que
  não sabe e sugira onde conferir.
- Quando eu colar um documento, responda só com base nele e copie o trecho literal
  que sustenta cada afirmação.
- Se a informação não estiver no texto, escreva "não especificado".
- Não calcule prazos processuais. Aponte a data ou o prazo como está escrito.
- Antes de uma resposta longa, pergunte o que faltar para fazer bem a tarefa.
```

**2. Andamento em linguagem simples** · "Doutor, e o meu processo?"

```
FUNÇÃO: Você ajuda um escritório de advocacia a se comunicar com clientes leigos.
ALVO: Explicar ao cliente, em uma mensagem curta, o que aconteceu no processo dele e
o que vem agora.
TEXTO-BASE:
<andamento>
[cole aqui o andamento ou a decisão, sem dados que identifiquem o cliente]
</andamento>
ORIENTAÇÕES:
- Linguagem do dia a dia. Se um termo técnico for inevitável, explique entre parênteses.
- Não diga se o resultado será bom ou ruim, não estime chance de ganhar e não prometa
  prazo de conclusão.
- Não calcule prazos. Se o texto trouxer uma data ou um prazo, copie como está.
- Se o texto não deixar claro o que aconteceu, escreva "não especificado" e me pergunte.
SAÍDA: mensagem de até seis linhas, em três partes: o que aconteceu; o que isso
significa; qual é o próximo passo e quem o dá. Use [NOME] no lugar do nome do cliente.
```

**3. E-mail delicado** · "Preciso cobrar honorários sem perder o cliente"

```
FUNÇÃO: Você redige a correspondência de um escritório de advocacia.
ALVO: Lembrar um cliente de uma parcela de honorários em atraso, preservando a relação.
TEXTO-BASE: Parcela de [VALOR], vencida em [DATA], referente a [SERVIÇO]. É o [primeiro]
lembrete. O cliente costuma pagar em dia.
ORIENTAÇÕES: Tom cordial e direto, sem ameaça e sem juridiquês. Não mencione medidas de
cobrança. Ofereça um caminho simples para regularizar e um contato para dúvidas.
Não invente dados bancários: escreva [DADOS PARA PAGAMENTO].
SAÍDA: e-mail de até dez linhas, com assunto, e uma versão de três linhas para
mensagem de celular.
```

**4. Resumo com trecho e "não especificado"** · "Levo uma hora para achar dez linhas"

```
Resuma o documento abaixo para um advogado que não o leu.

Extraia, nesta ordem: partes; objeto; valor e forma de pagamento; prazo e renovação;
obrigações de cada parte; penalidades; proteção de dados; foro.

Para cada item, copie o trecho literal entre aspas e indique a cláusula. Se o item não
estiver no documento, escreva "não especificado". Não acrescente opinião.

<documento>
[cole aqui]
</documento>
```

**5. Instruções do projeto "Meu escritório"** · "Explico tudo de novo a cada conversa"

```
Este projeto reúne os documentos de referência do escritório [NOME].
Responda sempre com base nos arquivos do projeto e diga de qual arquivo e de qual
trecho veio cada informação. Se a resposta não estiver nos arquivos, diga isso e não
complete com conhecimento geral.
Ao analisar contrato, aplique o playbook do escritório: classifique cada ponto como
padrão, aceitável ou inaceitável e copie o trecho do contrato.
Não cite lei nem jurisprudência sem que eu peça, e nunca de memória.
```

**6. Linha do tempo e síntese** · "O juiz não acha os fatos na minha peça"

```
Com base apenas nos arquivos do projeto, monte a linha do tempo dos fatos do caso.
Tabela com as colunas: Data; Fato; Onde está (arquivo e cláusula ou página); Trecho
literal. Ordene da data mais antiga para a mais recente. Fato sem data vai para o fim,
marcado "sem data". Não deduza datas que não estejam escritas.

Depois, em até dez linhas, escreva a síntese que um juiz leria primeiro: quem pede, o
quê, por quê e com base em quais documentos.
```

**7. Tribunal da IA** · "E se ela inventar um precedente?" (rodar com a busca na web desligada)

```
Liste cinco precedentes do STJ sobre [limitação de responsabilidade em contrato de
software], com classe, número, relator, data de julgamento e a tese em uma linha.
```

O prompt é ruim de propósito: pede à IA exatamente o que ela não deve fazer de memória. A turma confere cada item nas fontes oficiais e descobre o que existe, o que diz outra coisa e o que não foi encontrado.

**8. Painel de casos e prazos** · "Meus prazos estão em três lugares"

O prompt completo, as rodadas de ajuste e o gabarito estão em `kit/painel-de-prazos/README.md`. Em resumo: função de quem constrói painéis, a planilha anexada, a ordem de não contar prazo e de tratar tudo como texto, e a saída com cinco contadores, lista por urgência, prazos por semana e casos por responsável.

**9. Política de uso de IA em uma página** · "Preciso estar em dia com a OAB"

```
FUNÇÃO: Você ajuda a redigir políticas internas de escritórios de advocacia.
ALVO: Uma política de uso de IA generativa que caiba em uma página e que um estagiário
entenda no primeiro dia.
TEXTO-BASE: O escritório tem [N] pessoas, atua em [áreas] e usa [ferramentas e planos].
Classificamos os dados em verde (públicos), amarelo (dados de clientes sob sigilo) e
vermelho (segredo de justiça, saúde, crianças e adolescentes, investigações).
ORIENTAÇÕES: Escreva regras verificáveis, com sujeito e verbo. Inclua: ferramentas
autorizadas; o que cada cor permite; revisão humana obrigatória; conferência de
citações; comunicação ao cliente; quem responde por dúvidas; data de revisão.
Não cite artigos de lei.
SAÍDA: uma página, com título, sete a nove regras numeradas e um quadro com as três cores.
```

O modelo pronto está em `kit/conformidade/POLITICA_DE_USO_DE_IA.md`.

**10. Termo de ciência do cliente** · "Como conto ao cliente que uso IA?"

```
Adapte o termo de ciência abaixo à realidade do meu escritório, sem mudar a estrutura.
Usamos [ferramenta e plano] para [tarefas]. Não inserimos em IA: [lista].
Mantenha a linguagem simples, as cinco informações (para que usamos, o que ajuda e o
que não faz, riscos, proteção e revisão humana), o direito de falar com uma pessoa e as
duas opções de escolha. Aponte, no fim, qualquer frase que descreva algo que talvez
não façamos de fato, para eu conferir.

<termo>
[cole o modelo de kit/conformidade/TERMO_DE_CIENCIA_DO_CLIENTE.md]
</termo>
```

### Módulo 2 · A central do escritório

**11. Minha semana em uma página** · "Começo a segunda-feira no escuro" (com os conectores de agenda e e-mail ligados)

```
Olhe a minha agenda dos próximos sete dias e os e-mails não lidos dos últimos dois dias.
Monte um briefing de uma página com:
1. Compromissos por dia, com horário.
2. Conflitos de horário.
3. O que preciso preparar para cada compromisso e quando.
4. E-mails que pedem resposta, do mais ao menos urgente, com uma linha cada.
Não calcule prazos processuais: copie as datas como aparecem. Não responda nenhum
e-mail nem altere a agenda. Se algo estiver ambíguo, liste no fim como "a confirmar".
```

**12. Identidade da marca em uma página** · "Não tenho cara de escritório"

```
FUNÇÃO: Você é diretora de arte e estrategista de marca para serviços profissionais.
ALVO: A identidade do escritório [NOME] em uma página, para toda peça sair igual.
TEXTO-BASE: Atuamos em [áreas] para [tipo de cliente]. Três palavras que nos descrevem:
[ex.: claro, cuidadoso, acessível]. Não queremos parecer: [ex.: pomposo, genérico].
ORIENTAÇÕES: Publicidade de advocacia é sóbria e informativa: nada de promessa de
resultado, autoelogio, comparação com outros escritórios ou menção a preço.
Escolha cores com contraste suficiente para leitura (texto sobre fundo com razão de
pelo menos 4,5 para 1) e fontes gratuitas do Google Fonts.
SAÍDA:
1. Posicionamento em uma frase.
2. Voz: três regras de como escrevemos e três de como não escrevemos, com exemplo.
3. Cores: primária, secundária, neutras e de alerta, com código hexadecimal e uso.
4. Tipografia: fonte de títulos e de texto, com tamanhos.
5. Componentes: cabeçalho de documento, assinatura de e-mail, cartão virtual, capa de
   proposta.
Depois, mostre tudo aplicado em uma página de demonstração.
```

**13. Guardar a identidade como instrução reutilizável**

```
Transforme a identidade acima em uma instrução curta, que eu possa salvar como skill
ou como instrução de projeto, começando por: "Sempre que criar um documento, página ou
apresentação para o escritório [NOME], siga estas regras:". Inclua os códigos das
cores, as fontes, as regras de voz e as vedações de publicidade.
```

**14. Cartão virtual** · "Não tenho cartão"

```
Crie uma página única para servir de cartão virtual, com a identidade do escritório.
Conteúdo, nesta ordem: nome do escritório; nome da advogada: [NOME]; inscrição:
OAB/[UF] [NÚMERO]; áreas de atuação em uma linha; telefone, e-mail e endereço como texto
selecionável; botão "Agendar consulta" apontando para [LINK DA PÁGINA DE AGENDAMENTO];
QR Code que leva a esta mesma página.
Regras: sem fotografia; sem preço, promoção ou promessa de resultado; sem adjetivos de
autoelogio; leitura boa no celular; contraste adequado.
```

Antes de publicar, confira o cartão com a lista da seção 4 de `kit/conformidade/TRILHO_DE_CONFORMIDADE.md`.

**15. Pesquisa de jurisprudência com fontes** · "Tenho medo de citar o que não existe" (com a busca na web ligada)

```
Pesquise precedentes sobre [tema] nos sites oficiais do STF, do STJ e do [tribunal].
Para cada resultado, traga: tribunal, classe e número, relator, data, o link da página
oficial e o trecho literal da ementa que trata do tema.
Não inclua nada que você não tenha aberto nesta pesquisa. Se achar pouco, diga que
achou pouco. Separe o que é tese firmada (súmula, tema repetitivo, repercussão geral)
do que é decisão isolada.
```

Tudo o que vier dessa pesquisa entra na tabela de precedentes como **pendente**. Só vira **confirmado** depois que alguém abre o link, lê e assina.

**16. Advogado do diabo**

```
Abaixo está a tese que pretendo sustentar. Aja como o advogado da parte contrária:
aponte os três argumentos mais fortes contra ela e que tipo de precedente eu deveria
procurar para saber se cada um se sustenta. Não cite precedentes de memória.

<tese>
[cole aqui]
</tese>
```

### Módulo 3 · O sistema de contratos

**17. Escrever o playbook** · "Cada advogado revisa de um jeito"

```
FUNÇÃO: Você ajuda sócios de escritório a registrar critérios de revisão de contratos.
ALVO: Um playbook para contratos de [tipo], do ponto de vista de [quem contrata].
Entreviste-me: faça uma pergunta por vez, tema a tema (vigência, preço, penalidades,
nível de serviço, responsabilidade, proteção de dados, rescisão, propriedade e dados,
confidencialidade, foro). Para cada tema, pergunte o que é padrão, o que ainda aceito e
o que não aceito, e peça um número sempre que couber.
SAÍDA, ao final: tabela com as colunas Tema, Posição padrão, Aceitável e Inaceitável,
com frases curtas e verificáveis.
```

**18. Prova com gabarito** · "Posso confiar no que o sistema leu?"

```
Compare as duas análises do mesmo contrato: a minha (A) e a da ferramenta (B).
Liste: o que B achou e eu não; o que eu achei e B não; onde B classificou o risco de
modo diferente; e qualquer trecho citado por B que não esteja no contrato.
Avalie B de 1 a 5 em: correção factual, precisão jurídica, concisão, consistência,
legibilidade e imparcialidade, com uma linha de justificativa cada.

<contrato>[...]</contrato>
<analise_a>[...]</analise_a>
<analise_b>[...]</analise_b>
```

Os seis critérios são os do guia oficial de sumarização jurídica do Claude.

**19. Especificação funcional por entrevista** · "Quero um sistema com a cara do escritório"

```
FUNÇÃO: Você é analista de produto e vai me entrevistar para especificar o sistema de
contratos do escritório.
Faça uma pergunta por vez, nesta ordem: quem usa e o que cada pessoa pode fazer; de
onde chegam os contratos; quais etapas eles percorrem e quem aprova cada uma; quais
dados precisamos de cada contrato; que alertas queremos; o que o cliente pode ver;
por quanto tempo guardamos os documentos; o que nunca pode acontecer.
SAÍDA, ao final: especificação com perfis e permissões, jornadas, telas, regras de
negócio numeradas, modelo de dados, requisitos de privacidade e segurança, e a lista
do que fica fora da primeira versão. Use o modelo do arquivo ESPECIFICACAO_FUNCIONAL.md
como referência de formato.
```

**20. Protótipo navegável com a marca**

```
Com base na especificação e na identidade do escritório, crie um protótipo navegável
com quatro telas: painel (contratos por status e alertas), ficha do contrato (dados,
matriz de risco e decisão do advogado), histórico de versões (antes e depois de cada
alteração) e ficha do cliente. Use dados fictícios e marque-os como exemplo.
Toda informação gerada por IA aparece com a etiqueta "aguardando revisão" até a
decisão do advogado.
```

**21. Dossiê de conformidade** · "E se o cliente perguntar como usamos IA?"

```
Ajude-me a preencher o dossiê de conformidade do uso de IA no escritório.
Pergunte, uma coisa por vez: quais ferramentas usamos e em que plano; que dados entram
em cada uma; com que finalidade; quem tem acesso; onde os dados ficam e por quanto
tempo; o que dizemos ao cliente; o que fazemos em caso de incidente.
Monte o dossiê no formato do arquivo DOSSIE_LGPD.md. Onde eu não souber responder,
escreva "a levantar" e liste essas pendências no fim. Não afirme que algo está em
conformidade: aponte o que precisa ser conferido pelo encarregado.
```

---

## Os prompts das automações

Os scripts do kit têm os seus prompts no próprio código, em português, para o advogado ler e ajustar:

| Automação | Arquivo | Constante |
|---|---|---|
| Triagem de e-mail | `kit/apps-script/03_Email.gs` | `PROMPT_EMAIL_` |
| Briefing da semana | `kit/apps-script/04_Agenda.gs` | `PROMPT_AGENDA_` |
| Auditor de citações | `kit/apps-script/05_Jurisprudencia.gs` | `PROMPT_CITACOES_` |
| Leitura de contrato | `kit/apps-script/06_Contratos.gs` | `PROMPT_CONTRATO_` |
| Comparação de versões | `kit/apps-script/07_Historico.gs` | `PROMPT_VERSOES_` |

Todos seguem o método: função na primeira linha, regras numeradas, marcas em volta do texto de fora e um formato de saída fixo. Em todos, o texto analisado é tratado como material, nunca como ordem.
