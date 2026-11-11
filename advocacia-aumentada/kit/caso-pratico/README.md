# Caso prático: Pão Dourado × NuvemSul

Um único caso serve aos três módulos, e cada módulo o usa por inteiro, sem depender do que foi feito nos outros. **Tudo aqui é fictício**: empresas, pessoas, endereços, e-mails e telefones foram inventados, e os números de CNPJ e CPF têm dígitos verificadores propositalmente inválidos. Em sala, só estes dados são usados.

## A história

A **Padaria Pão Dourado Ltda.**, rede de padarias de Campinas/SP e cliente do escritório, vai contratar o sistema de pedidos e fidelidade "Fornada", da **NuvemSul Tecnologia Ltda.**, de Florianópolis/SC. O sistema guardará dados cadastrais e de consumo dos clientes da padaria. A NuvemSul enviou a minuta; o escritório representa a **CONTRATANTE**.

1. **Módulo 1.** A turma lê o contrato com a IA pelo chat, dentro do projeto "Meu escritório", exigindo o trecho literal de cada resposta, e monta a linha do tempo dos fatos.
2. **Módulo 2.** O cliente pede posição por e-mail, e a triagem classifica e rascunha a resposta. Uma minuta de notificação é auditada pelo auditor de citações.
3. **Módulo 3.** O sistema processa a versão 1 sozinho e produz a matriz de risco. Depois chega a versão 2, "com os ajustes pedidos", e o histórico revela o que o e-mail da outra parte não contou.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `contrato_v1.txt` | Minuta enviada pela NuvemSul, com problemas plantados em nove temas |
| `contrato_v2.txt` | Versão "revisada" pela NuvemSul, com cinco concessões anunciadas e duas mudanças que o e-mail não menciona |
| `playbook.md` | Posições do escritório-exemplo, tema a tema (a instalação do kit já carrega esta tabela na planilha) |
| `emails_de_treino.md` | Seis e-mails para o exercício de triagem |
| `minuta_para_auditoria.md` | Minuta com quatro citações, duas delas com defeito plantado |

Para usar um contrato no exercício, copie o texto para um Google Docs ou envie o `.txt` para a pasta `01_Entrada`.

## Gabarito da versão 1

O que o playbook do escritório-exemplo aponta. A IA deve encontrar a maior parte; o que ela não encontrar é matéria para a discussão sobre revisão humana.

| Cláusula | Tema | O problema | Risco pelo playbook |
|---|---|---|---|
| 3.2 | Vigência e renovação | Renovação automática com aviso prévio de 90 dias | Alto |
| 4.2 | Preço e reajuste | Reajuste pelo maior entre dois índices | Alto |
| 4.3 | Preço e reajuste | Reajuste extraordinário unilateral com aviso de 15 dias | Alto |
| 5.1 e 5.2 | Atraso no pagamento | Multa de 10%, juros de 2% ao mês e suspensão sem aviso | Alto |
| 6.2 | Nível de serviço | Descumprimento da disponibilidade sem nenhuma consequência | Alto |
| 7.1 e 7.2 | Limitação de responsabilidade | Limite de três mensalidades e exclusão de perda de dados | Alto |
| 8.1 | Proteção de dados | Cláusula genérica de uma linha, sem papéis, prazo de incidente nem regra de suboperador | Alto |
| 9.1 e 9.2 | Rescisão | A contratada sai sem ônus; a contratante paga 50% das mensalidades restantes | Alto |
| 10.2 | Dados e portabilidade | Exportação dos dados mediante taxa "a ser definida" | Alto |
| 11.1 | Confidencialidade | Sigilo por dois anos, dentro do aceitável | Baixo |
| 12.1 | Foro | Foro exclusivo na sede da contratada, distante do cliente | Alto |

Lacunas que o contrato não trata: devolução e eliminação dos dados ao fim do contrato e plano de transição para outro fornecedor.

**Datas para conferir o cálculo do sistema:** assinatura em 03/11/2026; prazo de 12 meses; fim da vigência em 03/11/2027; último dia para avisar a não renovação (90 dias antes) em 05/08/2027.

## Gabarito da versão 2

O e-mail da NuvemSul que acompanha a versão 2 diz: "Acatamos os pedidos: aviso de 30 dias, reajuste só pelo IPCA, multa de 2%, limite de 12 meses e multa rescisória de 20%. Incluímos também a cláusula de LGPD."

A comparação feita pelo sistema encontra **14 trechos alterados**. Duas mudanças não foram anunciadas (6.1 e 7.3), e a cláusula nova de proteção de dados traz uma condição desfavorável que o e-mail não destaca (8.3):

| Cláusula | O que mudou | Anunciado? | Efeito para a contratante |
|---|---|---|---|
| 3.2 | Aviso de não renovação de 90 para 30 dias | Sim | Favorável |
| 4.2 | Reajuste só pelo IPCA | Sim | Favorável |
| 4.3 | Reajuste extraordinário excluído | Sim | Favorável |
| 5.1 | Multa de 10% para 2%; juros de 2% para 1% ao mês | Sim | Favorável |
| **6.1** | **Disponibilidade mínima de 99,5% para 98%** | **Não** | **Desfavorável, risco alto** |
| 7.1 | Limite de 3 para 12 mensalidades | Sim | Favorável |
| 7.2 | "Perda de dados" sai da lista de exclusões | Sim, em parte | Favorável |
| **7.3** | **Cláusula nova: o limite vale também para incidentes com dados pessoais** | **Não** | **Desfavorável, risco alto** |
| 8.1 e 8.2 | Papéis definidos; incidente comunicado em 5 dias úteis | Sim | Melhora, mas o playbook pede até 2 dias úteis |
| **8.3** | **Suboperadores sem anuência prévia** | **Em parte: a cláusula foi anunciada, esta condição não** | **Desfavorável** |
| 9.2 | Multa rescisória de 50% para 20% | Sim | Favorável, mas ainda só para a contratante |
| Data | Local e data da assinatura | — | Neutro |

Continuam sem ajuste: 5.2 (suspensão sem aviso), 6.2 (sem crédito por indisponibilidade), 9.1 (rescisão sem ônus só para a contratada), 10.2 (taxa de exportação indefinida) e 12.1 (foro).

Ponto de discussão em sala: a contratada concedeu no limite de responsabilidade (7.1) e retirou a concessão, sem avisar, na cláusula 7.3. Quem lê só o e-mail aceita a versão.
