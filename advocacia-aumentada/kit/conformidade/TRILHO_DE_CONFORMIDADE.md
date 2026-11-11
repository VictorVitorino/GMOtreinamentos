# Trilho de conformidade

O que o treinamento ensina e o kit pratica para manter o uso de IA dentro do sigilo profissional, da LGPD e das regras de publicidade da advocacia. Material de treinamento, sem valor de parecer. Normas e telas conferidas em **11/11/2026**; confira de novo antes de cada turma.

## 1. Semáforo de dados

A primeira decisão antes de qualquer prompt: de que cor é o que vou colar?

| Cor | O que é | Onde pode entrar |
|---|---|---|
| **Verde** | Conteúdo público ou sem dado de ninguém: legislação, doutrina, modelos em branco, dúvidas conceituais, texto já publicado | Qualquer ferramenta |
| **Amarelo** | Documentos e dados de clientes cobertos pelo sigilo profissional | Só em conta com treinamento desligado ou em plano corporativo, com ciência escrita do cliente e, sempre que possível, com os dados mascarados |
| **Vermelho** | Segredo de justiça, dados de saúde, crianças e adolescentes, investigação criminal, operação societária sigilosa | Não entra. Só com anonimização efetiva, ou em ambiente contratado para isso e com autorização expressa |

Na dúvida entre duas cores, vale a mais restritiva.

**Anonimizar à mão, em três passos:** troque nomes por papéis (CONTRATANTE, AUTOR, EMPRESA A); troque números de documento, endereços e contatos por marcadores; releia procurando detalhes que identifiquem alguém mesmo sem nome, como cargo raro, cidade pequena ou valor exato de uma operação conhecida.

## 2. Cinco regras que o kit cumpre sozinho

| Regra | O que o código faz | Onde está |
|---|---|---|
| Mascarar antes de enviar | CPF, CNPJ, e-mail e telefone viram marcadores (`[CPF_1]`) e só voltam ao valor real dentro da conta Google do escritório. **Nomes de pessoas não são mascarados.** | `02_IA.gs` |
| Termo vermelho não sai | Conteúdo com termo da lista sensível não é enviado à IA; o e-mail recebe a etiqueta `IA-Sigilo` e o arquivo vai para `99_Revisao_manual` | `02_IA.gs`, lista em `00_Config.gs` |
| Sem trecho, sem achado | Toda afirmação da IA sobre um documento traz o trecho literal; o código confere se ele existe no texto e sinaliza o que não confere | `02_IA.gs` |
| A IA propõe, o advogado dispõe | E-mail fica em rascunho com aviso; análise fica "Aguardando revisão"; prazo só vai para a agenda com status "Revisado" e o nome de quem revisou | `03_Email.gs`, `04_Agenda.gs`, `06_Contratos.gs` |
| O código calcula, a IA redige | Datas, conflitos de agenda e comparação de versões são calculados por código; a IA explica o resultado | `04_Agenda.gs`, `06_Contratos.gs`, `07_Historico.gs` |

Além delas: tudo o que o kit faz deixa uma linha na aba **Log** (trilha de auditoria); texto vindo de fora nunca vira fórmula na planilha; e o conteúdo de e-mails e contratos é tratado como material de análise, nunca como ordem, o que limita o efeito de instruções maliciosas embutidas (injeção de prompt).

**Limites que precisam ser ditos em sala:** a lista de termos vermelhos é um filtro por palavra-chave e deixa passar o que não estiver nela; a máscara não cobre nomes, RG nem endereços; e o texto das cláusulas vai à IA. Por isso contrato de cliente é dado **amarelo**: só entra com as três proteções da tabela acima.

## 3. Recomendação 001/2024 do Conselho Federal da OAB

Aprovada em 11/11/2024 e publicada no Diário Eletrônico da OAB em 14/11/2024. É uma recomendação e não prevê sanção própria, mas os Tribunais de Ética já a aplicam. Texto: <https://diario.oab.org.br/pages/materia/842347>.

| Item | O que a recomendação diz | Onde o programa atende |
|---|---|---|
| 2.1 | "zelar pela confidencialidade e sigilo profissional dos dados apresentados", com atenção a dados que tornem o cliente identificável | Semáforo (M1); máscara (M2 e M3) |
| 2.2 | Diligência na escolha do sistema, que deve proteger as informações e "possibilitar a não utilização dos dados fornecidos para treinamento" | Configuração segura (M1); seção 6 deste documento |
| 2.3 | Atenção ao compartilhamento de dados pelos sistemas e à política de privacidade | Conectores com menor privilégio (M2); dossiê (M3) |
| 2.4 | Chatbot "não deve incluir a realização de atividades privativas da advocacia" e deve informar "que se trata de uma máquina" | Produtos para clientes (M2); seção 4 |
| 2.5 | Observar a LGPD "antes de inserir dados confidenciais em ferramentas de IA" | Semáforo (M1); dossiê (M3) |
| 3.1 | Julgamento profissional não pode ser feito por IA "sem supervisão humana"; nenhuma atividade privativa é delegada | Status "Aguardando revisão" e campo "Revisado por" (M3) |
| 3.2 | "Especial atenção" ao levantamento de doutrina e jurisprudência; veracidade do que se apresenta em juízo | Tribunal da IA (M1); precedentes verificados (M2) |
| 3.3 | Dependência excessiva é incompatível com a advocacia | Prova com gabarito e decisão do advogado em cada risco (M3) |
| 3.4, 3.5 e 3.8 | Compreender como a tecnologia funciona, seus limites e riscos; capacitação constante da equipe | O programa e o tutor de 30 dias |
| 3.6 | Sócios e gestores devem ter política de uso e de cibersegurança, treinar e monitorar | Política de uma página (M1); aba Log (M3) |
| 3.7 | "Revisar integralmente todas as saídas geradas pela IA antes de apresentá-las em processos judiciais" | Protocolo das três chaves (M1 e M2) |
| 4.1 a 4.2.1 | Formalizar ao cliente, por escrito e em linguagem clara, o uso de IA: propósito, benefícios e limites, riscos, medidas de segurança e revisão humana | `TERMO_DE_CIENCIA_DO_CLIENTE.md` (M1) |
| 4.3 | A comunicação com o cliente "não pode ser feita apenas a partir de conteúdo gerado" por IA; o cliente pode pedir para falar com uma pessoa | E-mail só em rascunho (M2) |
| 4.3.1 a 4.3.4 | Consentimento "por meio de assinatura"; respeitar a recusa; arquivar o documento até o fim da prestação do serviço | Termo arquivado no cadastro do cliente (M3) |

Movimentos posteriores para acompanhar: em 10/06/2026 o Conselho Federal anunciou a preparação de um provimento sobre IA; em 09/10/2026 a Resolução 16/2026 da Diretoria tratou de termos de ajuste com empresas de IA jurídica, sempre com a IA "como instrumento de apoio".

## 4. Publicidade: cartão virtual e produtos para clientes

Fonte: Provimento 205/2021 do Conselho Federal e seu Anexo Único (<https://www.oab.org.br/leisnormas/legislacao/provimentos/205-2021>). A publicidade da advocacia "deve ter caráter meramente informativo e primar pela discrição e sobriedade" (art. 3º).

### Lista de conferência do cartão virtual

- [ ] Traz o nome ou nome social do advogado e o **número de inscrição na OAB**
- [ ] Traz o nome da sociedade, se o advogado a integra
- [ ] Telefone, endereço físico ou eletrônico e QR Code são permitidos; o cartão pode ser físico e eletrônico
- [ ] **Não tem fotografia**, pessoal ou de terceiros (Código de Ética, art. 44, § 2º)
- [ ] Não menciona honorários, forma de pagamento, gratuidade ou desconto (art. 3º, I)
- [ ] Não usa "expressões persuasivas, de autoengrandecimento ou de comparação" (art. 3º, IV)
- [ ] Não promete resultado nem usa caso concreto como oferta (art. 6º)
- [ ] Não será distribuído de modo indiscriminado em locais públicos, presenciais ou virtuais; em eventos de interesse jurídico pode (art. 3º, V)
- [ ] Se anuncia especialidade, o advogado tem o título ou a notória especialização correspondente (art. 3º, III)

### O que cabe e o que não cabe em produto para cliente

| Cabe | Não cabe |
|---|---|
| Página de agendamento de consulta | Aplicativo que responde automaticamente consultas jurídicas a quem não é cliente (Anexo Único: "representando mercantilização dos serviços jurídicos") |
| Formulário de primeiro contato com aviso de privacidade, que entrega os dados ao advogado | Atendimento só por IA, sem a opção de falar com uma pessoa (Recomendação 001/2024, item 4.3) |
| Assistente no site para "responder as primeiras dúvidas de um potencial cliente", informar sobre a atuação do escritório ou coletar dados e documentos, identificado como máquina | Assistente que afasta "a pessoalidade da prestação do serviço jurídico" ou suprime "o poder decisório e as responsabilidades do profissional" |
| "Contrato explicado": resumo em linguagem simples, revisado e assinado pelo advogado | Resumo gerado por IA entregue ao cliente sem revisão |
| Relatório mensal do caso, gerado do CRM e revisado antes do envio | Divulgação com preço, promessa de resultado ou comparação com outros escritórios |

As políticas de uso dos fornecedores vão no mesmo sentido: a da OpenAI veda oferecer orientação que exige habilitação profissional, como a jurídica, sem o envolvimento de um profissional habilitado (<https://openai.com/policies/usage-policies/>).

## 5. LGPD: pontos de atenção para o encarregado

1. **Transferência internacional (LGPD, art. 33).** Os dados enviados a Claude ou ChatGPT são processados fora do Brasil. Os contratos de proteção de dados dos dois fornecedores incorporam cláusulas europeias e os adendos britânico e suíço; **não localizamos neles as cláusulas-padrão brasileiras** da Resolução ANPD 19/2024, cujo prazo de adequação venceu em 23/08/2025. É ponto para decisão do escritório com o seu encarregado. Enquanto isso, a máscara e o semáforo reduzem o que sai.
2. **Papéis.** Em regra o escritório decide por que e como os dados dos clientes são tratados, e o fornecedor de IA trata os dados por conta do escritório. O dossiê registra essa relação e o contrato que a rege.
3. **Registro das operações (art. 37).** O uso de IA entra no registro de operações de tratamento. O modelo está em `DOSSIE_LGPD.md`.
4. **Incidente.** A Resolução ANPD 15/2024 fixa três dias úteis para comunicar à ANPD e ao titular o incidente que possa causar risco ou dano relevante; o envolvimento de dado protegido por sigilo profissional é um dos critérios de risco.
5. **Pequeno porte.** A Resolução ANPD 2/2022 simplifica o registro de operações, dispensa o encarregado (com canal de comunicação) e dobra prazos. Não vale para tratamento de alto risco, e o "uso de tecnologias emergentes ou inovadoras" é um dos critérios que, somado a outro, caracteriza alto risco. Não presuma a dispensa.
6. **Decisão automatizada (art. 20).** Nenhuma automação do kit decide nada sobre uma pessoa: classifica, resume e propõe. Se o escritório criar triagem que aceite ou recuse clientes, entra em jogo o direito de revisão.
7. **Guarda e eliminação (arts. 15 e 16).** As cópias de versões e a planilha ficam no Drive do escritório. O dossiê define por quanto tempo e quem elimina.
8. **Regras em movimento.** A ANPD, agência desde a Lei 15.352/2026, não tem norma específica sobre IA generativa; o PL 2338/2023 (marco legal da IA) foi aprovado no Senado em 10/12/2024 e aguardava parecer em comissão especial da Câmara em 27/10/2026.

## 6. Configuração de privacidade das ferramentas

Conferido nas páginas oficiais de ajuda em 11/11/2026. Os nomes das telas mudam com frequência: abra cada uma na véspera da turma.

| | Claude | ChatGPT |
|---|---|---|
| Planos individuais usam as conversas para treinar? | Sim, a menos que a pessoa desligue | Sim, a menos que a pessoa desligue |
| Onde desligar | Settings › Privacy, opção de ajudar a melhorar os modelos (`claude.ai/settings/data-privacy-controls`) | Settings › Data controls › "Improve the model for everyone" |
| Conversa que não fica no histórico | Conversa anônima (ícone de fantasma) | Chat temporário |
| Planos de equipe e corporativos | Não treinam por padrão | Não treinam por padrão |
| API (o que o kit usa) | Não treina por padrão; dados apagados em até 30 dias | Não treina por padrão; registros de monitoramento por até 30 dias |

Três cuidados que valem para as duas: o botão de avaliar a resposta (polegar) pode enviar aquela conversa para análise mesmo com o treinamento desligado; a memória guarda fatos entre conversas e deve ser revista ou desligada para assuntos de cliente; e a verificação em duas etapas protege a conta, que passa a concentrar documentos do escritório.

Fontes: <https://privacy.claude.com/en/articles/10023548> · <https://privacy.claude.com/en/articles/7996868> · <https://help.openai.com/en/articles/7730893> · <https://openai.com/enterprise-privacy/>

## 7. Sigilo profissional: a base de tudo

- Estatuto da Advocacia (Lei 8.906/1994): inviolabilidade do escritório e da correspondência "escrita, eletrônica, telefônica e telemática" (art. 7º, II); é infração "violar, sem justa causa, sigilo profissional" (art. 34, VII).
- Código de Ética e Disciplina: dever de sigilo sobre os fatos conhecidos no exercício da profissão (art. 35); "Presumem-se confidenciais as comunicações de qualquer natureza entre advogado e cliente" (art. 36, § 1º).

## 8. Casos reais para a abertura do módulo 1

| Órgão | Caso | O que aconteceu | Fonte |
|---|---|---|---|
| TST, 6ª Turma | RR-0000284-92.2024.5.06.0351 (notícia de 10/03/2026) | Recurso com precedentes inexistentes ou adulterados, "possivelmente gerados por inteligência artificial". Multa por litigância de má-fé de 1% sobre o valor da causa para a empresa e multa de igual percentual para o advogado; ofícios à OAB e ao Ministério Público Federal. Do relator: "A responsabilidade pela verificação da veracidade das informações permanece integralmente com o advogado e a parte" | [TST](https://www.tst.jus.br/-/empresa-e-advogado-sao-condenados-por-possivel-uso-de-ia-com-citacoes-falsas-de-jurisprudencia) |
| TRT-7, 3ª Turma | 0000702-38.2024.5.07.0016 (junho de 2025) | Multa de 2% do valor atualizado da causa por litigância de má-fé; ofício à OAB-CE | [TRT-7](https://www.trt7.jus.br/index.php/noticias/todas-as-noticias/15649-advogado-que-falsificou-jurisprudencia-e-condenado-por-litigancia-de-ma-fe-e-caso-vai-a-oab-ce) |
| Justiça Federal do Paraná, 2ª Vara de Londrina | Notícia de 30/06/2025 | Multa de 20 salários mínimos ao advogado; OAB-PR comunicada | [TRF4](https://www.trf4.jus.br/trf4/controlador.php?acao=noticia_visualizar&id_noticia=29304) |
| TJPR, 9ª Câmara Cível | 0025387-22.2025.8.16.0001 (30/06/2026) | Multa por litigância de má-fé e ofício à OAB/PR | [TJPR](https://www.tjpr.jus.br/noticias/-/asset_publisher/9jZB/content/tjpr-multa-advogado-por-litig%C3%A2ncia-de-m%C3%A1-f%C3%A9-pelo-uso-de-ia-sem-zelo-e-cautela-/18319) |

O primeiro caso foi lido por nós na página do TST. Os outros três vêm do levantamento de fontes feito para este material: abra cada link antes de citá-los em sala.

## 9. Onde conferir jurisprudência

| Fonte | Endereço |
|---|---|
| STF | <https://jurisprudencia.stf.jus.br/pages/search> |
| STJ | <https://scon.stj.jus.br/SCON/> |
| TST | <https://jurisprudencia.tst.jus.br/> |
| Justiça do Trabalho (pesquisa unificada) | <https://jurisprudencia.jt.jus.br/> |
| Banco Nacional de Precedentes | <https://pangeabnp.pdpj.jus.br/> |

**Número único do processo (Resolução CNJ 65/2008).** O formato é `NNNNNNN-DD.AAAA.J.TR.OOOO`, e os dois dígitos `DD` são calculados pelo módulo 97. A função `=VALIDAR_CNJ(A2)` da planilha confere esse dígito. Dígito errado significa número digitado errado ou inventado. Dígito certo **não** prova que o processo existe nem o que ele decide.

**Extensão possível.** A API pública do DataJud, do CNJ (<https://datajud-wiki.cnj.jus.br/api-publica/acesso/>), devolve metadados e movimentos de processos por número e permite checar a existência do processo. Ela não devolve o inteiro teor das decisões. Não está no kit.
