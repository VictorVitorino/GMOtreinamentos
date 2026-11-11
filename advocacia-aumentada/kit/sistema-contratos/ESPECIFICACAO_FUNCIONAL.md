# Especificação funcional · Sistema de contratos do escritório

Especificação de referência para a oficina do módulo 3. Descreve o sistema que o escritório quer ter e marca o que a **versão 1** do kit (planilha e Apps Script) já entrega. Cada escritório gera a sua pela entrevista do prompt 19 e usa este documento como modelo de formato.

Versão 0.1 · 11/11/2026 · documento de trabalho

## 1. Para que serve

Dar ao escritório um lugar único onde todo contrato entra, é lido pelo mesmo critério, tem cada versão guardada e comparada, e gera os prazos que importam. A IA faz a primeira leitura; o advogado decide e assina.

**Dores que resolve:** "não sei onde está a última versão"; "cada advogado revisa de um jeito"; "a outra parte mudou uma cláusula e eu não vi"; "esqueci o prazo de renovação".

**Fora da versão 1:** redação automática de contratos; negociação com a outra parte; assinatura eletrônica embutida; portal do cliente; faturamento.

## 2. Perfis e permissões

| Perfil | Pode | Não pode |
|---|---|---|
| Sócio | Tudo; aprova o playbook; define acessos e prazo de guarda | — |
| Advogado | Enviar contratos; decidir riscos; marcar "Revisado" com nome e OAB; lançar prazos | Alterar o playbook sem aprovação |
| Estagiário ou paralegal | Enviar contratos; ler análises; preparar comparações | Marcar "Revisado"; lançar prazos |
| Administrativo | Cadastrar clientes; arquivar termos de ciência | Ver matriz de risco de clientes que não atende |
| Cliente (fase 3) | Ver o resumo revisado dos seus contratos e os próximos prazos | Ver análises não revisadas |

Na versão 1 as permissões são as de compartilhamento do Google Drive e da planilha.

## 3. O caminho de um contrato

| De | Para | Quem move | Condição |
|---|---|---|---|
| — | Recebido | Quem envia o arquivo | Arquivo na pasta de entrada |
| Recebido | Revisão manual | Sistema | Texto ilegível, formato não aceito ou termo sensível |
| Recebido | Em análise pela IA | Sistema | Passou no controle de entrada; cópia e impressão digital guardadas |
| Em análise pela IA | Na fila da IA | Sistema | Resposta não chegou no tempo de espera |
| Em análise ou na fila | Aguardando revisão | Sistema | Análise gravada, trechos conferidos |
| Em análise ou na fila | Revisão manual | Sistema | A IA recusou, falhou ou devolveu resposta incompleta |
| Aguardando revisão | Revisado | Advogado | Todo risco alto com decisão; "Revisado por" preenchido |
| Revisado | Em negociação | Advogado | Contraproposta enviada |
| Qualquer um | Aguardando revisão | Sistema | Nova versão registrada |
| Revisado ou em negociação | Assinado | Advogado | Versão final assinada, arquivada em "assinados" |
| Assinado | Encerrado | Advogado | Fim da vigência ou rescisão |

## 4. Requisitos funcionais

A coluna "v1" indica o que o kit já faz.

| Nº | Requisito | v1 |
|---|---|---|
| RF-01 | Receber contrato em Google Docs, PDF, Word ou texto por uma pasta de entrada | Sim |
| RF-02 | Atribuir código único ao contrato (CT-0001) e ligá-lo ao arquivo | Sim |
| RF-03 | Barrar arquivo ilegível, formato não aceito e conteúdo com termo sensível, com registro do motivo | Sim |
| RF-04 | Guardar cópia integral e impressão digital de cada versão | Sim |
| RF-05 | Mascarar CPF, CNPJ, e-mail e telefone antes do envio à IA e restaurá-los na volta | Sim |
| RF-06 | Extrair partes, objeto, valor, assinatura, prazo, renovação, aviso e foro | Sim |
| RF-07 | Aplicar o playbook e produzir a matriz de risco, com trecho literal por achado | Sim |
| RF-08 | Conferir cada trecho no texto e sinalizar o que não confere | Sim |
| RF-09 | Registrar a decisão do advogado por risco: aceitar, negociar ou recusar | Sim |
| RF-10 | Detectar nova versão por edição do arquivo ou por arquivo com o código no nome | Sim |
| RF-11 | Comparar versões por código, parágrafo a parágrafo | Sim |
| RF-12 | Explicar o efeito de cada alteração para a parte representada e alertar as desfavoráveis de risco alto | Sim |
| RF-13 | Calcular por código o fim da vigência e o último dia de aviso de não renovação | Sim |
| RF-14 | Lançar prazos na agenda somente de contrato revisado e com revisor identificado | Sim |
| RF-15 | Painel com contratos por status, riscos sem decisão e próximos avisos | Sim |
| RF-16 | Registro de auditoria de tudo o que o sistema faz | Sim |
| RF-17 | Analisar em segundo plano quando a resposta imediata não chega | Sim |
| RF-18 | Cadastro de clientes com origem, base legal e termo de ciência arquivado | Parcial: cadastro manual |
| RF-19 | Tela de comparação lado a lado, com texto riscado e texto inserido | Não: o detalhe fica em texto na planilha |
| RF-20 | Reanalisar a versão nova inteira pelo playbook | Não |
| RF-21 | Busca por cláusula em todos os contratos ("quais têm renovação automática?") | Não: filtro manual na planilha |
| RF-22 | "Contrato explicado": resumo em linguagem simples para o cliente, liberado só após revisão | Não |
| RF-23 | Relatório mensal ao cliente com prazos e alterações | Não |
| RF-24 | Perfis de acesso por pessoa dentro do sistema | Não: usa o compartilhamento do Drive |

## 5. Regras de negócio

| Nº | Regra |
|---|---|
| RN-01 | Nada produzido por IA sai do escritório sem revisão de advogado |
| RN-02 | Todo achado tem trecho literal; achado sem trecho conferido fica sinalizado, nunca oculto |
| RN-03 | A IA não cita lei nem jurisprudência na análise de contrato |
| RN-04 | Datas e comparações são calculadas por código; a IA lê e explica |
| RN-05 | O cadastro do contrato e a cópia da versão existem antes de qualquer chamada à IA |
| RN-06 | Falha da IA leva o contrato a "Revisão manual"; nunca apaga nem esconde o cadastro |
| RN-07 | Prazo só entra na agenda com status "Revisado" e revisor identificado |
| RN-08 | O playbook é decisão dos sócios; cada alteração tem data e responsável |
| RN-09 | Conteúdo com termo sensível não é enviado à IA |
| RN-10 | Texto vindo de fora é tratado como dado: não vira instrução para a IA nem fórmula na planilha |
| RN-11 | O sistema não envia mensagem a terceiros; alertas vão só para o próprio usuário |
| RN-12 | Documentos de cliente só entram com termo de ciência arquivado |

## 6. Dados

| Entidade | Campos principais |
|---|---|
| Cliente | Código, nome, tipo, contato, origem, base legal, data de entrada, responsável, link do termo de ciência |
| Contrato | Código, cliente, parte representada, arquivo, tipo, partes, objeto, valor, assinatura, fim da vigência, renovação automática, limite para avisar, foro, resumo, status, revisor, versão atual, impressão digital |
| Versão | Contrato, número, data, autor, impressão digital, quantidade de alterações, resumo, alerta, detalhe, cópia |
| Risco | Contrato, versão, cláusula, tema, nível, trecho literal, por que importa, recomendação, trecho confirmado, decisão do advogado |
| Item do playbook | Tema, posição padrão, aceitável, inaceitável, data de aprovação |
| Prazo | Contrato, tipo, data, evento na agenda, revisor |
| Registro de auditoria | Data, usuário, evento, detalhe |

Na versão 1 cada entidade é uma aba da planilha.

## 7. Telas (a partir da fase 2)

| Tela | O que mostra | Ação principal |
|---|---|---|
| Painel | Contratos por status; riscos altos sem decisão; próximos avisos; alertas de versão | Abrir o que pede atenção |
| Lista de contratos | Tabela com cliente, tipo, status, fim da vigência, riscos | Filtrar e buscar |
| Ficha do contrato | Dados lidos, matriz de risco, decisões, prazos | Decidir cada risco e assinar a revisão |
| Histórico de versões | Linha do tempo das versões; antes e depois de cada alteração, com texto riscado e inserido | Aceitar ou contestar alterações |
| Ficha do cliente | Contratos, prazos, termo de ciência | Arquivar o termo |
| Playbook | Temas e posições | Propor alteração para aprovação |
| Auditoria | Registro de eventos | Filtrar por contrato ou pessoa |

Todo conteúdo gerado por IA leva a etiqueta "aguardando revisão" até a decisão do advogado.

## 8. Requisitos não funcionais

| Tema | Requisito |
|---|---|
| Privacidade | Mínimo de dados enviados à IA; máscara de identificadores; registro das operações; prazo de guarda definido; exportação e eliminação a pedido |
| Segurança | Verificação em duas etapas; acesso por perfil; chave de API por usuário, com limite de gasto |
| Auditoria | Toda ação do sistema e toda decisão humana registradas, com data e autor |
| Disponibilidade | A falta da IA não impede o cadastro, a cópia nem o histórico |
| Portabilidade | Dados em planilha e cópias em texto: saem do sistema sem depender de fornecedor |
| Acessibilidade | Contraste de texto de pelo menos 4,5 para 1; cor nunca é o único sinal de risco |
| Assinatura | Assinatura eletrônica por meio admitido pelas partes (MP 2.200-2/2001, art. 10, § 2º), em ferramenta escolhida pelo escritório |

## 9. Roteiro de evolução

| Fase | O que é | Quando subir |
|---|---|---|
| 1 · Planilha | Kit do treinamento: Drive, planilha e Apps Script | Agora |
| 2 · Aplicativo sem código | Um aplicativo sobre a mesma planilha, com telas por perfil e uso no celular | Mais de três pessoas usando ou mais de 50 contratos ativos |
| 3 · Sistema sob medida | Sistema próprio com banco de dados, perfis, tela de comparação e portal do cliente, construído a partir desta especificação | Volume, exigência de clientes ou oferta de serviço recorrente |

Os limites da fase 1 estão em `kit/apps-script/README.md`: cerca de 60 segundos por chamada, 6 minutos por execução e 90 minutos diários de gatilhos em conta gratuita.

## 10. Critérios de aceite

São os do caso prático. O sistema está aceito quando:

1. Dado o `contrato_v1` na pasta de entrada, o contrato aparece com código, cópia guardada, datas calculadas (fim da vigência em 03/11/2027; limite de aviso em 05/08/2027) e status "Aguardando revisão".
2. Nenhum CPF, CNPJ, e-mail ou telefone do contrato aparece no pedido enviado à IA.
3. Um trecho que não existe no contrato aparece como "NÃO — confira no contrato".
4. Um arquivo com "segredo de justiça" no texto vai para revisão manual e nada é enviado à IA.
5. Dado o `contrato_v2` com o código no nome, o histórico registra a versão 2 com 14 alterações e alerta as desfavoráveis de risco alto.
6. Com a IA fora do ar, a versão 2 é registrada do mesmo jeito, com o detalhe calculado por código.
7. Os prazos só entram na agenda depois de "Revisado" e "Revisado por".
8. Nenhuma mensagem é enviada a terceiros em nenhum dos passos.

Os itens 1 a 8 estão cobertos pelos testes automatizados do kit, em simulação. Falta a execução em conta real.
