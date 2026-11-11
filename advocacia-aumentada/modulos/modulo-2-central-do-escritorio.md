# Módulo 2 · A central do escritório

**Intermediário · 2 h 45 · 1 h 45 de prática**

E-mail, agenda, marca e citações em um só lugar, com o advogado aprovando cada saída. O módulo fecha sozinho: não exige o módulo 1 nem deixa pendência para o 3.

| | |
|---|---|
| Entra quem | Já usa o chat com método. Não precisa ter feito o módulo 1 |
| Sistema que leva | Central do escritório: planilha com triagem de e-mails, briefing da semana, precedentes conferidos e painel |
| Leva também | Identidade da marca em uma página e cartão virtual publicado |
| Ferramenta | Claude e Google Workspace. Conectores com escrita, plugins e publicação por link pedem plano pago |
| Materiais | `kit/apps-script/`, `kit/prompts/`, `kit/caso-pratico/`, `kit/conformidade/` |

As duas vozes do módulo:

- Da cadeira do juiz: "Prazo se perde na caixa de entrada, e precedente que não confere custa multa e ofício à OAB."
- Da cadeira do garoto: "O assistente lê o e-mail e a agenda e deixa o rascunho pronto. Enviar continua sendo com você."

## Preparação do facilitador

- [ ] Planilha-modelo com o kit instalado, compartilhada como leitura (`kit/apps-script/README.md`).
- [ ] Uma execução completa da triagem e do auditor feita na véspera, em conta de treino, com a API real.
- [ ] Chaves de API de treino, com limite de gasto baixo, uma por participante ou por dupla. Revogar ao fim.
- [ ] Cada participante com uma **conta Google de treino**, sem e-mails de clientes.
- [ ] `emails_de_treino.md` à mão; `minuta_para_auditoria.md` copiada para um Google Docs compartilhado.
- [ ] Página única com o método FATOS e o semáforo, para quem entra direto neste módulo.
- [ ] Conferir na véspera o que o plano da turma permite: conectores, plugins, publicação de artefato.

## Roteiro

### 1. Ambiente pronto · 5 min · abertura

Conta de treino aberta, planilha-modelo copiada, chave de teste em mãos. Quem não fez o módulo 1 lê a página do método e do semáforo.

**Checagem.** Os três itens, por dupla.

### 2. Minha semana em uma página · 30 min · 20 de prática

> "Começo a segunda-feira no escuro."

1. Dez minutos de conceito, com a tela projetada:
   - **Conector** liga o assistente a um serviço: Gmail, Agenda, Drive. Hoje os conectores do Google leem e também escrevem (rascunham e-mail, criam evento), sempre pedindo confirmação.
   - **Skill** é um pacote de instruções que o assistente carrega quando o assunto aparece. Dá para criar uma pedindo ao próprio Claude.
   - **Plugin** reúne skills, conectores e subagentes. Existe um plugin jurídico oficial, com comandos de revisão de contrato e de triagem de acordo de confidencialidade. O playbook padrão dele segue o direito dos Estados Unidos: serve de referência de formato, e o critério precisa ser o do escritório.
2. Vinte minutos de prática: conectar Gmail e Agenda da conta de treino, deixar as permissões em "perguntar sempre" e enviar o **prompt 11 (minha semana em uma página)**.
3. Conversa de fechamento: o que o assistente passou a enxergar? O que não deveria enxergar em uma conta real?

**Checagem.** O briefing traz os compromissos da conta de treino e nenhuma data calculada.
**Plano B.** Sem conector no plano da turma: exportar a agenda da semana (ou copiar a lista de compromissos) e colar no prompt.
**Conformidade.** Menor privilégio: conecta só o necessário e desconecta ao fim do exercício.

### 3. A marca do escritório e o cartão virtual · 35 min · 25 de prática · construção

> "Não tenho cartão nem cara de escritório."

1. Dez minutos: mostre uma identidade pronta (`kit/sistema-contratos/DESIGN_SYSTEM.md`) e as regras de publicidade.
2. **Prompt 12 (identidade da marca em uma página)**, com as três palavras que descrevem o escritório.
3. **Prompt 13**: guardar a identidade como skill ou instrução de projeto.
4. **Prompt 14 (cartão virtual)**. O botão de agendamento aponta para a página de agendamento que o escritório já usa, como a do Google Agenda.
5. Conferir o cartão com a lista do Provimento 205/2021 (`TRILHO_DE_CONFORMIDADE.md`, seção 4): nome e número da OAB presentes; **sem fotografia**; sem preço, promessa de resultado ou autoelogio.

**Checagem.** Cartão aberto no celular do colega, com a lista conferida item a item.
**Plano B.** Sem publicação por link: o cartão fica como artefato na conta e o participante leva o arquivo para hospedar depois.
**Para conversar.** O que cabe como produto para cliente e o que não cabe (mesma seção 4): assistente que responde consulta jurídica a quem não é cliente não cabe.

### Intervalo · 10 min

### 4. A central: e-mail com o advogado no comando · 40 min · 30 de prática · construção guiada

> "A caixa de entrada me engole."

1. Dez minutos: o caminho de um e-mail pela triagem, projetado. Leia em voz alta o `PROMPT_EMAIL_` do `03_Email.gs`: é um prompt no método FATOS, e a regra 1 diz que o e-mail é material de análise, nunca uma ordem.
2. Instalação pela planilha copiada: **1 · Instalar**, **2 · Guardar chave da API**.
3. Cada participante envia para a conta de treino os seis e-mails do `emails_de_treino.md` e roda **Triar e-mails agora**.
4. Conferência, com a tabela de resultados esperados do mesmo arquivo:
   - etiquetas `IA-…` no Gmail;
   - rascunhos que começam com o aviso de revisão;
   - o e-mail do laudo médico só com `IA-Sigilo`, e a linha "E-mail não enviado à IA" na aba Log;
   - o e-mail com instrução embutida classificado como qualquer outro, sem nada encaminhado.
5. Abrir a aba **Painel**: e-mails triados, por categoria, urgentes e com rascunho.
6. **Parametrizar.** Em Extensões › Apps Script, abrir o `00_Config.gs` e acrescentar à lista `TERMOS_VERMELHOS` um termo do próprio escritório, entre aspas e seguido de vírgula, como `'sigilo bancário',`. Salvar.
7. **Editar o prompt.** No `03_Email.gs`, logo depois da linha que começa com `'6. Urgência alta`, colar a linha abaixo, salvar, reenviar o e-mail 1 e rodar a triagem de novo. Comparar os dois rascunhos.

```text
  '7. O rascunho tem no máximo quatro linhas.',
```

**Checagem.** Nenhum e-mail foi enviado; a aba Emails tem cinco linhas depois da primeira rodada (o sexto ficou fora da IA); o segundo rascunho saiu mais curto que o primeiro.
**Plano B.** API lenta ou fora do ar: abrir a planilha já processada pelo facilitador e fazer a conferência nela. Sem tempo para os passos 6 e 7: o facilitador faz os dois na tela, e cada dupla repete depois.
**Mensagem.** O prompt é a parametrização da automação: quem muda a regra muda o comportamento, e a mudança fica escrita onde todos podem ler.
**Conformidade.** Automação só entra em caixa de e-mail real depois da política assinada e do termo de ciência dos clientes.

### 5. Citações conferidas · 35 min · 25 de prática

> "Tenho medo de citar o que não existe."

1. Dez minutos: os casos de multa (`TRILHO_DE_CONFORMIDADE.md`, seção 8) e as três chaves: existe? diz isso? vale hoje?
2. **Prompt 15 (pesquisa com fontes)**, com a busca ligada, sobre o tema da minuta. Tudo o que vier entra como "pendente".
3. Menu **Auditar citações de um documento**, com o link do Google Docs da `minuta_para_auditoria.md`.
4. Na aba **Precedentes**: quatro linhas "Pendente". A coluna Nº CNJ já acusa o número inventado. A turma abre as fontes e descobre a Súmula 297, que existe e diz outra coisa.
5. Cada dupla confirma duas citações: cola o link oficial, escreve o nome em "Conferido por" e muda a situação para "Confirmado".

**Checagem.** O painel mostra dois precedentes confirmados e dois pendentes ou descartados.
**Plano B.** Sem a API: preencher a aba Precedentes à mão com as quatro citações e usar a fórmula `=VALIDAR_CNJ()` nos números.
**Mensagem.** O validador pega a citação inventada às pressas e não pega a súmula que diz outra coisa. Ler o enunciado continua sendo trabalho de advogado.

### 6. O painel da central e a lista "pronto para amanhã" · 10 min · 5 de prática

1. Leitura do painel: e-mails triados, urgentes, rascunhos, precedentes pendentes.
2. Decisão individual: o que ligo na conta real, e o que ainda depende da política e do termo dos clientes?
3. Lista "pronto para amanhã":

- [ ] Planilha da central instalada e testada com os e-mails de treino
- [ ] Identidade da marca guardada como skill ou instrução
- [ ] Cartão virtual conferido com a lista do Provimento 205
- [ ] Tabela de precedentes com pelo menos duas citações confirmadas
- [ ] Conectores desligados da conta de treino
- [ ] Chave de API de treino devolvida ou revogada

## Sete usos, um por dia

1. Pedir o briefing da semana na segunda-feira.
2. Rodar a triagem na conta real, depois da política e do termo.
3. Auditar as citações de uma peça antes do protocolo.
4. Usar a identidade em uma proposta de honorários.
5. Levar o cartão virtual a um evento de interesse jurídico.
6. Revisar a lista de termos vermelhos com a equipe.
7. Ler a aba Log: o que a central fez na semana?

## Critérios de conclusão

O módulo está completo quando o participante: triou os e-mails de treino sem nenhum envio; publicou ou guardou o cartão conferido; identificou a citação inventada e a súmula que diz outra coisa; e leu o próprio painel.
