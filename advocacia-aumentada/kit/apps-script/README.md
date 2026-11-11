# Kit de automações para Google Workspace

Sete scripts de Google Apps Script que transformam uma planilha na central do escritório (módulo 2) e no sistema de contratos (módulo 3). A mesma planilha serve aos dois módulos, e cada um a instala do zero.

**Regra do kit: a IA propõe, o advogado dispõe.** Nenhuma função envia e-mail a terceiros, assina, protocola ou apaga documento.

## Situação dos testes

| O que foi feito | Resultado |
|---|---|
| Verificação de sintaxe dos sete scripts | Sem erros |
| Testes da lógica com os serviços do Google simulados (`testes/`) | 29 de 29 passam |
| Quebras propositais do código para conferir se os testes as detectam | 22 de 22 detectadas |
| Validador de número CNJ contra quatro números reais e públicos | Confere |
| **Execução em uma conta Google real** | **Ainda não feita** |
| **Chamada real à API** | **Ainda não feita** |

O que a simulação não cobre: permissões pedidas pelo Google, cotas, conversão real de PDF e Word, e a resposta real do modelo. **Faça uma execução completa do caso prático em uma conta de treino antes da primeira turma.**

## O que cada arquivo faz

| Arquivo | Função |
|---|---|
| `00_Config.gs` | Único arquivo a editar: modelo, horários, limites, termos vermelhos e playbook-exemplo |
| `01_Base.gs` | Menu, instalação (abas, pastas, etiquetas), gatilhos, leitura e escrita na planilha, registro de auditoria, painel |
| `02_IA.gs` | Chamada à API, fila em segundo plano, máscara de dados, termos vermelhos, conferência de trechos |
| `03_Email.gs` | Triagem da caixa de entrada: etiquetas, resumo e rascunho |
| `04_Agenda.gs` | Briefing da semana e lançamento dos prazos de contratos revisados |
| `05_Jurisprudencia.gs` | Validador de número CNJ (`=VALIDAR_CNJ(A2)`) e auditor de citações |
| `06_Contratos.gs` | Da pasta de entrada à matriz de risco |
| `07_Historico.gs` | Detecção de nova versão, comparação e registro no histórico |
| `appsscript.json` | Manifesto: fuso de São Paulo e serviço avançado do Drive |

## Instalação

### Para o facilitador: montar a planilha-modelo uma vez

1. Crie uma planilha no Google Sheets com o nome "CRM de Contratos · modelo".
2. Abra **Extensões › Apps Script**.
3. Para cada arquivo `.gs` desta pasta, crie um arquivo de script com o mesmo nome e cole o conteúdo. Apague o `Código.gs` vazio.
4. Em **Configurações do projeto**, marque "Mostrar arquivo de manifesto appsscript.json" e substitua o conteúdo pelo do `appsscript.json` desta pasta. Isso liga o serviço avançado do Drive, usado para ler PDF e Word.
5. Salve, volte à planilha e recarregue a página. O menu **Advocacia Aumentada** aparece.
6. Compartilhe a planilha com a turma como "leitor". Cada participante usa **Arquivo › Fazer uma cópia**, e os scripts vão junto.

### Para o participante

1. Faça a cópia da planilha-modelo na **conta Google de treino**.
2. Menu **Advocacia Aumentada › 1 · Instalar**. O Google pede autorização na primeira vez. A instalação cria as abas, a pasta "Contratos · Advocacia Aumentada" no Drive e as etiquetas `IA-…` no Gmail.
3. Menu **2 · Guardar chave da API**. A chave fica no seu perfil de usuário, fora da planilha, e quem recebe uma cópia do arquivo não a recebe.
4. Teste pelo menu, um item de cada vez: **Triar e-mails agora**, **Processar contratos agora**.
5. Só depois: **3 · Ligar automações**.

Para a turma, o facilitador distribui chaves de API de treino com limite de gasto baixo, criadas no painel do fornecedor e revogadas ao fim do encontro.

## As automações

| Automação | Roda | O que faz | O que não faz |
|---|---|---|---|
| Triagem de e-mail | A cada 30 min, das 7h às 20h | Lê até 8 conversas não lidas, classifica, resume, etiqueta e deixa rascunho com aviso | Não envia, não arquiva, não marca como lido |
| Briefing da semana | Segunda-feira, 7h | Lê a agenda de 7 dias, calcula conflitos e janelas livres e envia o resumo **para o seu próprio e-mail** | Não altera a agenda |
| Contratos | A cada 10 min | Processa até 2 arquivos de `01_Entrada`: cadastro, cópia, matriz de risco | Não decide nem responde à outra parte |
| Versões | A cada hora | Compara cada contrato com a última cópia e registra as mudanças; avisa você por e-mail se houver alteração desfavorável de risco alto | Não aceita nem rejeita alterações |
| Prazos na agenda | Só pelo menu | Cria os eventos dos contratos com status "Revisado" e "Revisado por" preenchido | Não lança prazo de contrato sem revisor |
| Auditor de citações | Só pelo menu | Lista tudo o que um Google Docs cita, valida números CNJ e deixa cada linha "Pendente" | Não confere a jurisprudência: isso é do advogado |

### Como um contrato vira nova versão

- O arquivo cadastrado foi editado: a automação de versões percebe pela impressão digital do texto.
- Chegou em `01_Entrada` um arquivo cujo nome começa com o código do contrato, como `CT-0001 versão do fornecedor.pdf`: ele é registrado como nova versão do `CT-0001`.

### Planilha

| Aba | Conteúdo |
|---|---|
| Painel | E-mails triados na semana por categoria, urgentes e com rascunho; precedentes pendentes e confirmados; contratos por status, riscos altos sem decisão e próximos avisos de não renovação |
| Clientes | Cadastro manual, com origem e base legal |
| Contratos | Um contrato por linha: dados lidos, datas calculadas, status, revisor, versão |
| Riscos | Matriz de risco: cláusula, tema, risco, trecho literal, se o trecho confere, decisão do advogado |
| Historico | Uma linha por versão: autor, impressão digital, alterações, resumo, alerta, detalhe |
| Emails | Registro da triagem |
| Precedentes | Citações listadas pelo auditor e sua conferência |
| Playbook | Critérios do escritório, editáveis |
| Log | Trilha de auditoria de tudo o que o kit faz |

Não renomeie os cabeçalhos: os scripts localizam as colunas pelo nome.

## Limites que você precisa conhecer

1. **Cerca de 60 segundos por chamada.** O Apps Script desiste de esperar uma resposta externa depois de aproximadamente um minuto; o limite não é documentado pelo Google. Se a análise de um contrato passa disso, o kit envia o pedido para a fila em segundo plano da API, que custa a metade, e recolhe o resultado em uma rodada seguinte. A maioria das filas termina em menos de uma hora. Para contratos longos, deixe `MODO_CONTRATOS: 'fila'` no `00_Config.gs`. Quando a chamada imediata estoura o tempo, o pedido pode já ter sido processado e cobrado; a fila cobra de novo, pela metade.
2. **6 minutos por execução.** Por isso cada rodada processa poucos itens.
3. **90 minutos por dia de gatilhos em conta Gmail gratuita** (6 horas em conta Workspace). Com caixa de entrada movimentada, aumente o intervalo da triagem ou reduza `EMAIL_MAX_POR_RODADA`.
4. **PDF escaneado** depende do reconhecimento de texto do Drive. Arquivo sem texto legível vai para `99_Revisao_manual`.
5. **A máscara cobre CPF, CNPJ, e-mail e telefone com DDD.** Não cobre nomes, RG, endereços nem números de processo.
6. **Os termos vermelhos são um filtro por palavra.** Ajuste a lista no `00_Config.gs` e não confie só nela.
7. **Datas.** O código calcula o fim da vigência a partir da data de assinatura e do prazo em meses lidos pela IA. Se a IA ler errado, a data sai errada. Por isso ela só vai para a agenda depois da revisão.

## Modelo e custo

O kit usa a API da Anthropic com o modelo `claude-opus-5-5`, indicado pelo guia oficial de sumarização jurídica para tarefas que exigem alta precisão. O pedido leva `fallbacks: "default"`: se o modelo principal recusar um pedido, a API tenta o modelo reserva recomendado. Esse recurso não existe na fila.

Ordem de grandeza, pelos preços de tabela (US$ 4 por milhão de tokens de entrada e US$ 20 por milhão de tokens de saída) e pela taxa do guia oficial (cerca de 1 token a cada 2,8 caracteres):

| Tarefa | Estimativa |
|---|---|
| Triagem de um e-mail | Cerca de 1 a 2 centavos de dólar |
| Leitura de um contrato de 10 a 50 páginas | Cerca de 15 a 40 centavos de dólar |
| O mesmo contrato pela fila | Metade |

São estimativas nossas: confirme no painel de uso depois das primeiras execuções. Trocar o modelo é uma linha no `00_Config.gs`; a escolha entre precisão e custo é do escritório.

Referências: [guia de sumarização jurídica](https://platform.claude.com/docs/pt-BR/about-claude/use-case-guides/legal-summarization) · [processamento em lote](https://platform.claude.com/docs/en/build-with-claude/batch-processing) · [cotas do Apps Script](https://developers.google.com/apps-script/guides/services/quotas)

## Rodar os testes

Opcional, para quem for alterar os scripts. Requer Node.js 18 ou mais recente.

```bash
cd kit/apps-script/testes
```

```bash
node rodar-testes.js
```

O `simulador.js` imita em memória a planilha, o Drive, o Gmail, a Agenda e a API. Os testes cobrem, entre outros pontos: nenhum CPF, CNPJ, e-mail ou telefone do caso chega ao pedido enviado à IA; trecho inventado pela IA é sinalizado; e-mail com termo sensível não é enviado; nenhum e-mail é enviado a terceiros; prazo só entra na agenda com revisor; a comparação entre as versões do caso encontra as 14 mudanças; a fila assume quando a chamada imediata não responde; texto de fora não vira fórmula na planilha.

## Antes de usar com dados reais

- [ ] Execução completa do caso prático em conta de treino, com a API real
- [ ] Política de uso de IA assinada pela equipe
- [ ] Termo de ciência assinado pelos clientes cujos documentos e e-mails entram
- [ ] Dossiê preenchido, com a transferência internacional discutida com o encarregado
- [ ] Lista de termos vermelhos e playbook revisados pelos sócios
- [ ] Chave de API própria, com limite de gasto
