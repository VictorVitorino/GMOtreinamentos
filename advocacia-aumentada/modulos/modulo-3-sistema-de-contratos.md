# Módulo 3 · O sistema de contratos

**Avançado · 2 h 45 · 1 h 40 de prática**

Contrato lido pelo critério do escritório, cada versão guardada e comparada, e o desenho do sistema próprio. O módulo fecha sozinho: instala o que precisa e não exige os módulos 1 e 2.

| | |
|---|---|
| Entra quem | Revisa contratos com frequência e já usa IA no dia a dia |
| Sistema que leva | Sistema de contratos: repositório, planilha-CRM com painel, matriz de risco pelo playbook, histórico de versões com alerta e prazos na agenda |
| Leva também | Especificação e protótipo do sistema próprio; dossiê de conformidade |
| Ferramenta | Claude e Google Workspace, com chave de API |
| Materiais | `kit/apps-script/`, `kit/caso-pratico/`, `kit/sistema-contratos/`, `kit/conformidade/`, `kit/prompts/` |

As duas vozes do módulo:

- Da cadeira do juiz: "Boa parte do que chega ao fórum nasceu de uma cláusula que ninguém leu duas vezes."
- Da cadeira do garoto: "Cada versão fica guardada e comparada sozinha, e o alerta chega antes da assinatura."

## Preparação do facilitador

- [ ] Planilha-modelo com o kit, compartilhada como leitura.
- [ ] **Execução completa do caso na véspera**, em conta de treino e com a API real: versão 1, versão 2 e prazos na agenda. Guardar essa planilha como plano B.
- [ ] Chaves de API de treino com limite de gasto.
- [ ] `contrato_v1.txt` e `contrato_v2.txt` em uma pasta compartilhada.
- [ ] Gabaritos do caso (`kit/caso-pratico/README.md`) à mão; não distribuir antes do bloco 3.
- [ ] Página do semáforo para quem entra direto neste módulo.

## Roteiro

### 1. O mapa do sistema · 5 min · abertura

Projete o diagrama "O que sai do escritório e o que fica", da agenda em HTML. Conferência do ambiente: conta de treino, planilha copiada, chave de teste.

### 2. Repositório e planilha-CRM · 25 min · 15 de prática · construção

> "Não sei onde está a última versão."

1. Dez minutos: as cinco pastas e as abas da planilha (`kit/apps-script/README.md`, seção Planilha). Uma regra: o contrato só existe para o escritório depois de passar pela pasta de entrada.
2. Prática: **1 · Instalar**, **2 · Guardar chave da API**. Abrir a pasta "Contratos · Advocacia Aumentada" no Drive.
3. Em duplas, definir para o próprio escritório:

| Decisão | Exemplo |
|---|---|
| Quem pode colocar arquivo na entrada | Advogados e estagiários |
| Quem pode mudar o status para "Revisado" | Só advogado, com nome e OAB |
| Quem vê a planilha inteira | Sócios |
| Por quanto tempo se guardam as versões | Até cinco anos depois do fim do contrato, a confirmar com os sócios |

**Checagem.** Pastas criadas, abas no lugar, decisões anotadas.
**Conformidade.** O uso de IA entra no registro de operações de tratamento (LGPD, art. 37). O modelo está no dossiê.

### 3. Leitura pelo playbook, com guardrails · 40 min · 30 de prática · construção guiada

> "Cada advogado revisa de um jeito, e o contrato fica parado na minha mesa."

1. Dez minutos: o playbook (`kit/caso-pratico/playbook.md`). A IA não opina: compara o contrato com a tabela. Leia o `PROMPT_CONTRATO_` do `06_Contratos.gs`, regra a regra.
2. Cada dupla altera uma linha da aba **Playbook** para a realidade do seu escritório.
3. Enviar o `contrato_v1.txt` para `01_Entrada` e rodar **Processar contratos agora**.
4. Ler o resultado:
   - aba **Contratos**: partes, valor, assinatura em 03/11/2026, fim da vigência em 03/11/2027, limite para avisar em 05/08/2027, status "Aguardando revisão";
   - aba **Riscos**: um achado por linha, com trecho literal e a coluna "Trecho confirmado".
5. **Prova com gabarito.** Comparar a matriz com o gabarito da versão 1 e avaliar em seis critérios: correção factual, precisão jurídica, concisão, consistência, legibilidade e imparcialidade. O que a IA deixou passar? O que ela classificou diferente?
6. Decidir cada risco (Aceitar, Negociar, Recusar), mudar o status para "Revisado" e preencher "Revisado por".

**Checagem.** As datas calculadas batem com o gabarito; todo risco alto tem decisão; "Revisado por" preenchido.
**Plano B.** API lenta: o contrato vai para a fila e fica "Na fila da IA". Siga com a planilha processada na véspera e volte à própria no bloco seguinte.
**Para conversar.** O que acontece se a IA citar um trecho que não está no contrato? A coluna "Trecho confirmado" mostra "NÃO — confira no contrato". O achado não some: fica marcado para o advogado.

### Intervalo · 10 min

### 4. Histórico de versões e prazos · 30 min · 20 de prática

> "A outra parte mudou uma cláusula e eu não vi. E esqueci o prazo de renovação."

1. Leia o e-mail fictício da NuvemSul: "Acatamos os pedidos: aviso de 30 dias, reajuste só pelo IPCA, multa de 2%, limite de 12 meses e multa rescisória de 20%. Incluímos também a cláusula de LGPD." Pergunte: assinariam?
2. Renomear o `contrato_v2.txt` para começar com o código do contrato, por exemplo `CT-0001 versão revisada.txt`, enviar para `01_Entrada` e rodar **Processar contratos agora**.
3. Abrir a aba **Historico**: versão 2, 14 trechos alterados, alerta de alterações desfavoráveis de risco alto, e o detalhe com antes e depois. O alerta também chega ao e-mail do próprio participante.
4. Localizar as duas mudanças que o e-mail não mencionou: a disponibilidade caiu de 99,5% para 98% (6.1) e o limite de responsabilidade passou a valer para incidentes com dados pessoais (7.3). E a condição desfavorável dentro da cláusula nova: suboperadores sem anuência (8.3).
5. Menu **Lançar na agenda os prazos dos contratos revisados**. Conferir os dois eventos: fim da vigência e último dia para avisar a não renovação.

**Checagem.** Histórico com duas versões; dois eventos na agenda, com a descrição "Data lida por IA e revisada por…".
**Plano B.** Sem a API, o histórico é gravado do mesmo jeito, com as 14 mudanças calculadas pelo código e sem o resumo da IA. Vale mostrar: o histórico não depende da IA.
**Mensagem.** A comparação é feita por código; a IA só explica. A data vai para a agenda depois que alguém assina a revisão. A IA não conta prazo.

### 5. O sistema próprio do escritório · 40 min · 30 de prática · oficina

> "Quero um sistema com a cara do escritório."

1. Dez minutos: a especificação de referência (`kit/sistema-contratos/ESPECIFICACAO_FUNCIONAL.md`) e o roteiro de evolução: planilha hoje, aplicativo sem código depois, sistema sob medida quando o volume justificar.
2. **Prompt 19 (especificação por entrevista)**: o assistente pergunta, a dupla responde, sai a especificação do escritório.
3. **Prompt 20 (protótipo navegável)**, com a identidade do escritório. Quem não tem identidade pronta usa a de referência (`DESIGN_SYSTEM.md`) e troca o nome e a cor principal.
4. Cada dupla mostra uma tela em um minuto.

**Checagem.** O protótipo tem quatro telas, dados marcados como exemplo e a etiqueta "aguardando revisão" em tudo o que vem da IA.
**Plano B.** Tempo curto: fazer só a entrevista e levar o prompt do protótipo como tarefa.
**Conformidade.** Privacidade desde o desenho: perfis de acesso, registro de alterações, prazo de guarda. Assinatura eletrônica de contrato privado vale por outro meio de comprovação quando admitido pelas partes (MP 2.200-2/2001, art. 10, § 2º).

### 6. Dossiê de conformidade e plano de 90 dias · 15 min · 5 de prática

> "E se o cliente perguntar como usamos IA?"

1. Dez minutos: os oito pontos de atenção da LGPD (`TRILHO_DE_CONFORMIDADE.md`, seção 5). Dois merecem destaque: a transferência internacional, que é decisão do escritório com o encarregado, e o prazo de três dias úteis para comunicar incidente.
2. Cada participante preenche as seções 1 e 2 do `DOSSIE_LGPD.md` e lista as pendências. O **prompt 21** ajuda a terminar depois.
3. Três metas para 30, 60 e 90 dias. Sugestões:

| Prazo | Meta | Como medir |
|---|---|---|
| 30 dias | Todo contrato novo passa pela pasta de entrada | Aba Contratos |
| 60 dias | Playbook de um segundo tipo de contrato, aprovado pelos sócios | Aba Playbook |
| 90 dias | Primeiro serviço recorrente para cliente: acompanhamento de versões e radar de renovações | Contrato de honorários assinado |

4. Lista "pronto para amanhã":

- [ ] Sistema instalado e testado com as duas versões do caso
- [ ] Playbook com pelo menos uma linha do escritório
- [ ] Perfis de acesso decididos
- [ ] Especificação e protótipo guardados
- [ ] Dossiê iniciado, com pendências e responsáveis
- [ ] Chave de API de treino devolvida ou revogada

## Antes de usar com contratos reais

A lista completa está no fim do `kit/apps-script/README.md`: execução real do caso, política assinada, termo de ciência dos clientes, dossiê com a transferência internacional discutida, playbook e termos vermelhos revisados pelos sócios, chave de API própria com limite de gasto.

## Critérios de conclusão

O módulo está completo quando o participante: processou a versão 1 e assinou a revisão; encontrou as duas mudanças não anunciadas da versão 2; lançou os prazos na agenda; e tem a especificação e o protótipo do sistema do seu escritório.
