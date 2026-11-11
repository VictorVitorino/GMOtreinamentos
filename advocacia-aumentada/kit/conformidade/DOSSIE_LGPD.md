# Dossiê de conformidade do uso de IA

**Modelo para preencher no fechamento do módulo 3.** Reúne em um lugar o que o escritório precisa saber responder se um cliente, a OAB ou a ANPD perguntar como a IA é usada. Onde não souber responder, escreva "a levantar" e leve a pendência ao encarregado. Este modelo não atesta conformidade.

Escritório: [NOME] · Responsável pelo dossiê: [NOME] · Encarregado ou canal de comunicação: [NOME, contato] · Preenchido em: [DATA] · Próxima revisão: [DATA, no máximo 6 meses]

## 1. Ferramentas e fornecedores

| Ferramenta | Plano | Usa os dados para treinar? | Guarda por quanto tempo | Contrato de proteção de dados | Onde processa |
|---|---|---|---|---|---|
| [Claude, aplicativo] | [Pro / Team / …] | [desligado em __/__/__] | [ ] | [ ] | [fora do Brasil] |
| [API usada pelo kit] | [ ] | [não, por padrão] | [até 30 dias] | [termos comerciais] | [fora do Brasil] |
| [Google Workspace] | [ ] | [ ] | [ ] | [ ] | [ ] |

## 2. Registro das operações com IA (LGPD, art. 37)

Uma linha por atividade. As quatro primeiras são as do kit.

| Atividade | Dados pessoais | Titulares | Finalidade | Base legal (confirmar com o encarregado) | Quem acessa | Guarda | Proteções |
|---|---|---|---|---|---|---|---|
| Triagem de e-mail | Nome, contato, conteúdo da mensagem | Clientes e terceiros | Organizar a caixa de entrada e rascunhar respostas | [ ] | [ ] | [ ] | Máscara; termos vermelhos; só rascunho |
| Briefing da agenda | Títulos e horários de compromissos | Clientes e terceiros | Planejar a semana | [ ] | [ ] | [ ] | Só título, horário e local; título sensível oculto |
| Leitura de contratos | Dados das partes e conteúdo do contrato | Clientes, contrapartes, representantes | Apontar riscos pelo playbook | [ ] | [ ] | [ ] | Máscara; conferência de trechos; revisão humana |
| Histórico de versões | Os mesmos do contrato | Os mesmos | Registrar alterações e alertar | [ ] | [ ] | [ ] | Comparação por código; cópias só no Drive |
| [outra] | | | | | | | |

Bases legais que costumam aparecer na advocacia, para discutir com o encarregado: execução de contrato (art. 7º, V), exercício regular de direitos em processo judicial, administrativo ou arbitral (art. 7º, VI, e art. 11, II, "d", para dados sensíveis), cumprimento de obrigação legal (art. 7º, II) e legítimo interesse (art. 7º, IX).

## 3. Transferência internacional (art. 33)

- Fornecedores que processam dados fora do Brasil: [ ]
- Mecanismo de transferência adotado: [a levantar]
- O contrato do fornecedor traz as cláusulas-padrão da Resolução ANPD 19/2024? [sim / não / a levantar]
- Medidas que reduzem o que sai: máscara de identificadores, semáforo de dados, lista de termos vermelhos.

## 4. Acesso e segurança

- [ ] Verificação em duas etapas em todas as contas de IA e do Google
- [ ] Planilha-CRM e pastas de contratos compartilhadas só com quem precisa, com permissão de leitura por padrão
- [ ] Chave da API guardada no perfil de cada usuário, com limite de gasto definido no painel do fornecedor
- [ ] Conectores ligados só às contas e pastas necessárias; revisão [trimestral] do que está conectado
- [ ] Saída de pessoa da equipe: acesso retirado no mesmo dia, por [responsável]

## 5. Guarda e eliminação (arts. 15 e 16)

| O que | Onde fica | Por quanto tempo | Quem elimina |
|---|---|---|---|
| Cópias de versões de contratos (`03_Versoes`) | Drive do escritório | [ ] | [ ] |
| Planilha-CRM e registro de auditoria | Drive do escritório | [ ] | [ ] |
| Conversas nas ferramentas de IA | Fornecedor | [ ] | [ ] |
| Termos de ciência dos clientes | [ ] | Até o fim da prestação do serviço, no mínimo | [ ] |

## 6. Direitos dos titulares (art. 18)

Canal para pedidos: [e-mail ou formulário] · Quem responde: [ ] · Prazo interno: [ ]

## 7. Incidentes

| Passo | Quem | Prazo |
|---|---|---|
| Avisar o responsável | Quem percebeu | Na hora |
| Conter: trocar senha, revogar chave da API, desligar automações (menu **Desligar automações**) | [ ] | No mesmo dia |
| Avaliar o risco: há dado sob sigilo profissional, dado sensível ou dado financeiro? | Responsável e encarregado | [ ] |
| Comunicar à ANPD e aos titulares, se houver risco ou dano relevante | Encarregado | Três dias úteis (Resolução ANPD 15/2024) |
| Registrar o incidente e o que mudou | [ ] | [ ] |

## 8. Cliente e ética profissional

- [ ] Política de uso de IA assinada por toda a equipe (`POLITICA_DE_USO_DE_IA.md`)
- [ ] Termo de ciência assinado por cada cliente cujos documentos passam por IA (`TERMO_DE_CIENCIA_DO_CLIENTE.md`)
- [ ] Cartão virtual e materiais de divulgação conferidos com a lista do Provimento 205/2021
- [ ] Nenhum produto para cliente responde consulta jurídica de forma automática

## 9. Pendências

| Pendência | Responsável | Prazo |
|---|---|---|
| [ ] | [ ] | [ ] |

## 10. Histórico de revisões

| Data | O que mudou | Quem aprovou |
|---|---|---|
| [ ] | Primeira versão | [ ] |
