# Módulo 1 · O painel do advogado

**Básico completo · 2 h 30 · 1 h 40 de prática**

O básico inteiro em um encontro. O participante sai com a conta protegida, um método para pedir, o hábito de conferir e um painel de casos e prazos construído por ele. Nada fica pendente para outro módulo.

| | |
|---|---|
| Entra quem | Nunca usou IA no trabalho, ou usa de vez em quando e sem método |
| Sistema que leva | Painel de casos e prazos |
| Leva também | Projeto "Meu escritório", dez prompts no método FATOS, política de uso de IA, termo de ciência do cliente |
| Ferramenta | Claude. Conta gratuita cobre o módulo; publicar o painel por link pede plano pago |
| Materiais | `kit/prompts/`, `kit/painel-de-prazos/`, `kit/caso-pratico/`, `kit/conformidade/` |

As duas vozes do módulo, para abrir e fechar o encontro:

- Da cadeira do juiz: "Nunca indeferi um pedido por ser curto. Ajuda quem julga: fatos em ordem, pedido claro e citação que confere."
- Da cadeira do garoto: "Meia hora de conversa com o Claude e os seus prazos viram um painel, sem programar nada."

## Preparação do facilitador

- [ ] Na véspera, abrir as telas de privacidade do Claude e anotar o caminho atual (os nomes mudam). Referência: `kit/conformidade/TRILHO_DE_CONFORMIDADE.md`, seção 6.
- [ ] Planilha de exemplo criada no Google Sheets a partir de `kit/painel-de-prazos/README.md`, compartilhada como leitura.
- [ ] Painel de referência aberto em uma aba.
- [ ] `contrato_v1.txt` e `playbook.md` do caso convertidos em PDF ou Google Docs, em uma pasta compartilhada.
- [ ] Tema do Tribunal da IA testado na véspera, com as fontes oficiais abertas em abas.
- [ ] Política e termo impressos ou em Google Docs para cada participante.
- [ ] Duplas formadas: uma pessoa com mais fluência digital, outra com mais experiência jurídica.

## Roteiro

### 1. O que o juiz vê e o que a IA faz · 10 min · demonstração

> "Tenho receio de usar e não sei por onde começar."

**Objetivo.** Tirar a IA do campo do medo e do campo da mágica.

1. Comece pela cadeira do juiz: três coisas que quem julga encontra todos os dias são fato fora de ordem, pedido escondido e citação que não confere. A IA ajuda nas duas primeiras e é perigosa na terceira.
2. Conte o caso do TST (notícia de 10/03/2026): recurso com precedentes inexistentes, possivelmente gerados por IA; multa de 1% do valor da causa para a empresa e para o advogado, ofícios à OAB e ao Ministério Público Federal. Leia a frase do relator: "A responsabilidade pela verificação da veracidade das informações permanece integralmente com o advogado e a parte".
3. Demonstração ao vivo: anexe o `contrato_v1` e peça a matriz de riscos com o prompt-modelo do método (`kit/prompts`, seção "O mesmo pedido, sem método e com método").
4. Feche com as duas frases: a IA é um redator rápido e bem informado; não é banco de jurisprudência nem calculadora de prazo.

**Checagem.** Cada participante anota uma tarefa da semana em que a IA ajudaria e uma em que ela não pode decidir.
**Plano B.** Sem internet para a demonstração: mostre a captura de tela do resultado, preparada na véspera.

### 2. Conta segura e semáforo de dados · 15 min · 10 de prática

> "Tenho medo de expor meu cliente."

1. Todos entram na conta. Em Configurações › Privacidade, desligam o uso das conversas para melhorar os modelos e ligam a verificação em duas etapas.
2. Em instruções personalizadas, colam e adaptam o **prompt 1 (perfil do advogado)**.
3. Apresente o semáforo. Em duplas, classificam os dez exemplos:

| Exemplo | Cor |
|---|---|
| Texto de uma lei publicada | Verde |
| Modelo de procuração em branco | Verde |
| Dúvida conceitual sobre prescrição e decadência | Verde |
| Contrato de um cliente, com nomes e valores | Amarelo |
| E-mail do cliente contando o caso | Amarelo |
| Planilha de honorários com nomes de clientes | Amarelo |
| Petição já protocolada em processo público | Amarelo: o processo é público, os dados pessoais continuam sendo de alguém |
| Laudo médico de um cliente | Vermelho |
| Autos de processo em segredo de justiça | Vermelho |
| Documentos de uma criança em ação de guarda | Vermelho |

**Checagem.** Mão levantada: quem desligou o treinamento e ligou as duas etapas.
**Plano B.** Quem não conseguir ligar as duas etapas na hora anota como primeira tarefa do dia seguinte.

### 3. Método FATOS em três dores do dia · 30 min · 20 de prática

> "O cliente pergunta do processo toda semana, e ainda preciso cobrar honorários atrasados."

1. Dez minutos: o método (Função, Alvo, Texto-base, Orientações, Saída) e o mesmo pedido feito sem e com método, projetado.
2. Vinte minutos, em duplas, três situações:

| Dor | Prompt | Material |
|---|---|---|
| "Doutor, e o meu processo?" | 2 · Andamento em linguagem simples | Andamento fictício abaixo |
| Cobrar honorários sem perder o cliente | 3 · E-mail delicado | Parcela fictícia de R$ 1.500,00, vencida há dez dias, primeiro lembrete |
| "Levo uma hora para achar dez linhas" | 4 · Resumo com trecho e "não especificado" | `contrato_v1` |

Andamento fictício para o exercício:

```text
Conclusos para despacho. Despacho: Intime-se a parte autora para, no prazo de 15 (quinze)
dias, manifestar-se sobre a contestação e os documentos juntados. Após, voltem conclusos.
```

3. Cada dupla aplica um dos quatro pedidos de melhoria ("aponte os três pontos mais fracos da sua resposta") e guarda os três prompts.

**Checagem.** A mensagem ao cliente não promete resultado nem calcula a data do prazo; o resumo traz "não especificado" onde o contrato se cala (por exemplo, devolução dos dados ao fim do contrato).
**Plano B.** Dupla atrasada faz só a primeira e a terceira situações.

### 4. Projeto "Meu escritório" · 20 min · 15 de prática

> "Explico tudo de novo a cada conversa."

1. Criar o projeto, colar o **prompt 5 (instruções do projeto)** e subir o `contrato_v1` e o `playbook`.
2. Fazer cinco perguntas exigindo o trecho literal. Sugestões: Qual é o prazo de aviso para não renovar? O que acontece se a padaria atrasar um pagamento? Quem responde se os dados dos clientes se perderem? Há prazo para comunicar incidente de segurança? Onde corre uma eventual ação?
3. Pedir a linha do tempo com o **prompt 6**. Ela deve trazer a assinatura (03/11/2026), a implantação em até 30 dias, a vigência de 12 meses e o aviso de 90 dias, cada item com cláusula e trecho.

**Checagem.** A quarta pergunta tem como resposta certa "não especificado": a cláusula 8.1 não traz prazo. Quem recebeu um prazo inventado encontrou o motivo do próximo bloco.
**Plano B.** Sem o recurso de projetos disponível: anexar os dois arquivos em uma conversa e colar as instruções no início.

### 5. Tribunal da IA · 20 min · 15 de prática · jogo em equipes

> "E se ela inventar um precedente?"

1. Equipes de quatro. Com a busca na web **desligada**, cada equipe envia o **prompt 7**.
2. Cada precedente recebido é conferido nas fontes oficiais (endereços em `TRILHO_DE_CONFORMIDADE.md`, seção 9) e classificado: existe e diz isso; existe e diz outra coisa; não foi encontrado.
3. Pontuação: 1 ponto por classificação correta com link oficial; 2 pontos para quem achar um "existe e diz outra coisa".
4. Fechamento com as três chaves: existe? diz isso? vale hoje?

**Checagem.** Toda equipe registra pelo menos um link oficial.
**Plano B.** Se a ferramenta se recusar a citar de memória ou acertar tudo, use a `minuta_para_auditoria.md` do caso: as quatro citações têm gabarito.
**Cuidado.** O que a IA gerar neste bloco é material de exercício. Ninguém copia para uma peça.

### 6. O painel de casos e prazos · 40 min · 30 de prática · construção

> "Meus prazos estão em três lugares diferentes."

Roteiro completo, prompt e gabarito em `kit/painel-de-prazos/README.md`.

1. Dez minutos: mostre o painel de referência e o que ele responde em cinco segundos.
2. Quinze minutos: cada participante anexa a planilha de exemplo e envia o **prompt 8**.
3. Dez minutos: duas rodadas de ajuste, sendo a segunda a caixa para colar dados.
4. Cinco minutos: conferência com o gabarito (1 vencido, 1 hoje, 4 na semana, 5 de 8 a 30 dias, 14 em aberto, 1 aviso de dígito inválido).

**Checagem.** Os cinco contadores batem com o gabarito.
**Plano B.** Quem travar abre o `painel.html` de referência e faz as rodadas de ajuste a partir dele.
**Mensagem.** Constrói-se com dado fictício e usa-se com dado real, que fica no navegador. O painel não conta prazo.

### 7. Política, termo e a lista "pronto para amanhã" · 15 min · 10 de prática

> "Preciso estar em dia com a OAB."

1. Cada participante preenche os colchetes da `POLITICA_DE_USO_DE_IA.md` e do `TERMO_DE_CIENCIA_DO_CLIENTE.md`. A versão final é discutida com os sócios depois.
2. Lista "pronto para amanhã":

- [ ] Treinamento com as conversas desligado e verificação em duas etapas ligada
- [ ] Perfil de instruções salvo
- [ ] Projeto "Meu escritório" criado
- [ ] Dez prompts guardados
- [ ] Painel funcionando com a planilha de exemplo
- [ ] Política e termo em rascunho
- [ ] Fontes oficiais de jurisprudência salvas nos favoritos

3. Feche com as duas vozes do módulo.

## Sete usos, um por dia

Sugestão para a semana seguinte, sempre com dado verde ou com as proteções do amarelo. É prática livre: nenhum módulo depende dela.

1. Explicar um andamento a um cliente (prompt 2).
2. Resumir uma decisão longa com trecho e "não especificado" (prompt 4).
3. Reescrever um parágrafo de uma peça em metade do tamanho.
4. Montar a linha do tempo de um caso (prompt 6).
5. Colar a planilha real no painel e conferir os contadores.
6. Pedir o contra-argumento de uma tese e conferir as citações nas três chaves.
7. Mostrar a política aos sócios.

## Critérios de conclusão

O módulo está completo quando o participante: configurou a conta; escreveu um prompt no método sem consultar o modelo; identificou uma citação que não confere; e tem o painel aberto com os números do gabarito.
