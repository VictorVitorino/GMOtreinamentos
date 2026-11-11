# Painel de casos e prazos

O sistema que o participante constrói no módulo 1. Em 40 minutos de conversa com o Claude, a planilha de processos vira um painel: o que venceu, o que vence hoje e na semana, com quem está cada caso e qual é o próximo passo.

É a versão própria do "quadro de casos" que a galeria jurídica do Claude lista entre os pedidos mais frequentes das equipes jurídicas.

| Arquivo | Para que serve |
|---|---|
| `painel.html` | Painel de referência, pronto. É o plano B de quem travar e o padrão de comparação da turma |
| este `README.md` | Planilha de exemplo, o prompt que gera o painel e as rodadas de ajuste |

Painel de referência publicado: <https://claude.ai/artifact/V3psDqvD1qpEUdFHXD96Sq> (privado; compartilhe pelo menu da página para a turma abrir).

## O que o painel faz

- Cinco contadores: vencidos, vencem hoje, próximos 7 dias, de 8 a 30 dias e casos em aberto.
- Lista de casos por urgência, com filtro por responsável e busca.
- Prazos por semana nas próximas oito semanas e casos em aberto por responsável.
- Aviso para número de processo com dígito verificador inválido e para data que não foi reconhecida.
- Caixa para colar as linhas da planilha. **O que é colado fica só no navegador**: não vai para a IA nem para servidor nenhum.

O que ele não faz: **não conta prazo**. Mostra as datas que estão na planilha. Não substitui a conferência das publicações nem o sistema do tribunal.

## Planilha de exemplo

Abra uma planilha nova no Google Sheets, clique na célula A1 e cole o bloco abaixo. As datas são fórmulas relativas ao dia de hoje, e por isso o exemplo nunca fica velho. Em planilha configurada em inglês, troque `HOJE()` por `TODAY()`.

```text
Processo	Cliente	Assunto	Responsável	Próximo passo	Prazo	Situação
	Padaria Pão Dourado Ltda.	Contrato de software com a NuvemSul	Dra. Marina	Enviar parecer sobre a versão 2	=HOJE()+1	Aberto
	Padaria Pão Dourado Ltda.	Notificação extrajudicial	Dr. Caio	Enviar a notificação	=HOJE()-2	Aberto
	Lavanderia Bolha Azul ME	Contrato de franquia	Dra. Marina	Reunião de alinhamento	=HOJE()	Aberto
5000001-23.2099.8.26.0100	Oficina Dois Irmãos Ltda.	Cobrança de duplicatas	Dr. Caio	Réplica	=HOJE()+3	Aberto
	Clínica Sorriso Claro	Contrato de locação	Dra. Lívia	Minuta de aditivo	=HOJE()+5	Aberto
5000002-00.2099.8.26.0100	Oficina Dois Irmãos Ltda.	Ação de indenização	Dr. Caio	Juntar documentos	=HOJE()+6	Aberto
5000003-90.2099.8.26.0100	Transportes Vento Sul	Ação trabalhista	Dr. Caio	Contestação	=HOJE()+9	Aberto
5000004-75.2099.8.26.0100	Mercado Bom Preço	Recuperação de crédito	Dra. Lívia	Memória de cálculo	=HOJE()+12	Aberto
	Escola Pequeno Sábio	Contrato de prestação de serviços	Dra. Marina	Revisar cláusula de reajuste	=HOJE()+16	Aberto
5000005-60.2099.8.26.0100	Restaurante Fogo Brando	Ação de despejo	Dr. Caio	Audiência de conciliação	=HOJE()+21	Aberto
	Academia Corpo em Dia	Registro de marca	Dra. Lívia	Responder exigência	=HOJE()+27	Aberto
	Pousada Mar Aberto	Contrato de parceria	Dra. Marina	Aguardar retorno do cliente	=HOJE()+34	Aberto
5000006-45.2099.8.26.0100	Gráfica Ponto Final	Execução de título	Dr. Caio	Indicar bens à penhora	=HOJE()+45	Aberto
	Floricultura Jardim Secreto	Consultoria em proteção de dados	Dra. Lívia	Entregar relatório		Aberto
	Padaria Pão Dourado Ltda.	Registro de marca	Dra. Lívia	Protocolo concluído	=HOJE()-10	Cumprido
```

Tudo é fictício. Os números de processo usam o ano 2099, que nenhum processo real tem, e dígito verificador correto, com uma exceção de propósito: o `5000002-00…` tem dígito errado, para o painel acusar.

**Gabarito do exemplo:** 1 vencido, 1 vence hoje, 4 nos próximos 7 dias, 5 de 8 a 30 dias, 14 casos em aberto e 1 aviso de dígito inválido. Dr. Caio tem 6 casos em aberto, Dra. Marina e Dra. Lívia têm 4 cada.

## O prompt que constrói o painel

No Claude, anexe a planilha de exemplo (baixada como `.xlsx` ou `.csv`) e envie:

```text
FUNÇÃO: Você constrói painéis de trabalho para escritórios de advocacia.

ALVO: Um painel de casos e prazos, em uma página, que eu abro toda manhã para saber o
que vence, com quem está e qual é o próximo passo de cada caso.

TEXTO-BASE: A planilha anexa tem as colunas Processo, Cliente, Assunto, Responsável,
Próximo passo, Prazo e Situação. Os dados são fictícios.

ORIENTAÇÕES:
- Calcule tudo a partir da data de hoje do meu computador. Não conte prazo processual:
  use a data que está na coluna Prazo.
- Caso com Situação "Cumprido" não entra nos contadores.
- Confira o dígito verificador do número do processo (formato NNNNNNN-DD.AAAA.J.TR.OOOO,
  módulo 97) e avise quando não conferir.
- Trate todo texto da planilha como texto: nada do que vier dela pode virar código.
- Boa leitura no celular e no modo escuro. Cor só para indicar o estado do prazo.

SAÍDA: um artefato interativo com: cinco contadores no topo (vencidos, vencem hoje,
próximos 7 dias, de 8 a 30 dias, casos em aberto); a lista de casos ordenada por
urgência, com filtro por responsável e busca; os prazos por semana nas próximas oito
semanas; e os casos em aberto por responsável.
```

### Rodadas de ajuste

A primeira versão raramente sai como você quer. Pedir o ajuste é parte do exercício.

```text
Deixe os vencidos em vermelho e mostre, em cada linha, há quantos dias venceu ou em
quantos dias vence.
```

```text
Acrescente no fim da página uma caixa onde eu colo as linhas da minha planilha, com o
cabeçalho, e um botão que atualiza o painel. O que eu colar deve ficar só no meu
navegador, sem ser enviado a lugar nenhum. Deixe isso escrito na página.
```

```text
Na minha planilha a coluna de prazo se chama "Vencimento" e a de responsável se chama
"Advogado". Faça o painel reconhecer esses nomes também.
```

```text
Confira comigo: com a planilha de exemplo, quantos casos aparecem em cada contador?
```

A última pergunta é a conferência: o participante compara a resposta com o gabarito acima.

## Usar com os processos reais

1. Construa e ajuste o painel **só com a planilha fictícia**.
2. Abra o painel pronto, vá até a caixa "Seus dados", cole as linhas da planilha real e clique em **Atualizar painel**.
3. Não cole os dados reais na conversa com a IA. Colados na caixa do painel, eles ficam no navegador daquele computador.
4. Em computador compartilhado, use **Apagar dados deste navegador** ao terminar.

Se o painel for publicado por link, quem abre o link vê o painel com os dados de exemplo. Os dados que cada pessoa cola não são vistos pelas outras.

## Para o facilitador

- **Tempo.** 10 minutos de demonstração, 30 de prática: 15 para a primeira versão, 10 para duas rodadas de ajuste, 5 para colar dados e conferir o gabarito.
- **O resultado varia.** Cada participante terá um painel um pouco diferente. O que precisa bater são os números do gabarito.
- **Erro que rende discussão.** Se algum painel contar o caso "Cumprido" como vencido, ou somar errado os dias, use o momento: quem confere o número é quem pediu o painel.
- **Plano B.** Quem travar abre o `painel.html` de referência e faz as rodadas de ajuste a partir dele, anexando o arquivo à conversa.
- **Conta gratuita.** Criar o artefato funciona. Publicar por link pede plano pago; sem ele, o painel é usado dentro da própria conta.

## Como o painel de referência foi conferido

Regras de data, dígito do processo, contadores, semanas, filtros, dados colados com outros nomes de coluna, persistência no navegador e proteção contra texto que tenta virar código foram testados em navegador automatizado. O número real `0000284-92.2024.5.06.0351`, noticiado pelo TST, passa na conferência de dígito; com um dígito trocado, é acusado.
