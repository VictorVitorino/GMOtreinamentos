# Advocacia Aumentada

Treinamento de Claude para advogados de 19 a 55 anos que ainda não usam IA no trabalho, ou usam sem método. **Três módulos independentes, oito horas.** Cada módulo parte de dores pequenas do dia a dia e termina com um painel ou um sistema construído por quem participa, dentro da LGPD e das recomendações da OAB.

**Comece pela agenda:** [agenda.html](agenda.html), publicada em <https://claude.ai/artifact/2TujraoY7qiW4p155BaXsJ> (privada; compartilhe pelo menu da página). O espelho em texto é o [AGENDA.md](AGENDA.md).

**Duas versões da agenda.** A oficina ao vivo, de 8 horas, está em [agenda.html](agenda.html). O curso gravado para a Udemy, "IA Aplicada a Advogados", com 29 sessões e 7 h 15 min de vídeo, está em [udemy/agenda-udemy.html](udemy/agenda-udemy.html).

## Os três módulos

| Módulo | Nível | Duração | Dores | Sistema que o participante leva |
|---|---|---|---|---|
| [1 · O painel do advogado](modulos/modulo-1-painel-do-advogado.md) | Básico completo | 2 h 30 | Medo de expor o cliente; cliente que pergunta do processo; documento longo; precedente inventado; prazos espalhados | Painel de casos e prazos |
| [2 · A central do escritório](modulos/modulo-2-central-do-escritorio.md) | Intermediário | 2 h 45 | Caixa de entrada; semana sem visão; falta de identidade; medo de citar errado | Central: e-mail, agenda, citações e painel; cartão virtual |
| [3 · O sistema de contratos](modulos/modulo-3-sistema-de-contratos.md) | Avançado | 2 h 45 | Versão perdida; cada um revisa de um jeito; cláusula alterada sem aviso; renovação esquecida | Sistema de contratos com matriz de risco, histórico e painel |

Nenhum módulo depende de outro. O básico é completo: quem faz só ele sai com tudo de que precisa para trabalhar.

Em todos os módulos o participante mexe na IA com as próprias mãos, em quatro frentes: **configurar** (conta, projeto, conectores, chave), **parametrizar** (instruções, skills, playbook, arquivo de configuração), **usar** e **editar** (respostas, painel, prompts das automações). O quadro por módulo está na agenda.

## Como a agenda foi desenhada

De duas cadeiras. A do juiz, que sabe o que pesa em uma peça e em um contrato: fatos em ordem, pedido claro, citação que confere, cláusula lida duas vezes. E a do garoto, que abre o Claude e constrói em meia hora o que o escritório adia há anos.

E de quatro sinais do mercado, conferidos em novembro de 2026:

1. **Tribunais.** Multas por precedente inexistente em peça, como a da 6ª Turma do TST noticiada em 10/03/2026.
2. **OAB.** A Recomendação 001/2024 pede política interna, treinamento e consentimento escrito do cliente.
3. **Fornecedores.** A galeria jurídica do Claude (28/10/2026) reúne o que as equipes jurídicas mais pediram: quadro de casos, checagem de citações, revisão por playbook, revisão tabular e porta única de entrada. Cada módulo constrói a versão própria de um deles.
4. **Advogados.** Quem advoga passou a construir as próprias ferramentas, sem programar.

## O que há nesta pasta

| Caminho | Conteúdo |
|---|---|
| `agenda.html` · `AGENDA.md` | A agenda, bloco a bloco |
| `modulos/` | Guia do facilitador de cada módulo: roteiro, exercícios, checagens e plano B |
| `kit/painel-de-prazos/` | Módulo 1. Painel de referência, planilha de exemplo e o prompt que gera o painel |
| `kit/prompts/` | Método FATOS e 21 prompts, um por dor |
| `kit/apps-script/` | Módulos 2 e 3. Sete scripts para a planilha: triagem de e-mail, briefing, auditor de citações, leitura de contratos, histórico de versões e painel; testes automatizados |
| `kit/conformidade/` | Trilho de conformidade, política de uso de IA, termo de ciência do cliente e dossiê LGPD |
| `kit/caso-pratico/` | Contrato fictício em duas versões, playbook, e-mails de treino e minuta para auditar, com gabaritos |
| `kit/sistema-contratos/` | Módulo 3. Especificação funcional e identidade visual de referência |

Páginas publicadas (privadas até serem compartilhadas):

- Agenda: <https://claude.ai/artifact/2TujraoY7qiW4p155BaXsJ>
- Painel de casos e prazos de referência: <https://claude.ai/artifact/V3psDqvD1qpEUdFHXD96Sq>

## O que foi conferido e o que falta

| Item | Situação |
|---|---|
| Soma dos minutos de cada módulo, horários e tempo de prática da agenda | Conferidos por script na página |
| Painel de casos e prazos | Testado em navegador automatizado: datas, dígito do processo, contadores, filtros, dados colados |
| Scripts dos módulos 2 e 3 | 29 testes passam com os serviços do Google simulados; 22 quebras propositais do código são detectadas pelos testes |
| Normas e casos citados | Recomendação 001/2024, Provimento 205/2021, notícia do TST, súmulas do gabarito e galeria jurídica do Claude lidos na fonte em 11/11/2026 |
| Recursos e planos do Claude e do ChatGPT | Levantados nas páginas oficiais de ajuda em 11/11/2026; mudam rápido |
| **Scripts em uma conta Google real** | **Ainda não executados** |
| **Chamada real à API** | **Ainda não feita** |
| **Turma-piloto** | **Ainda não realizada: os tempos dos blocos são estimativas** |

Antes da primeira turma: rodar o caso prático completo em uma conta de treino, com a API real, e cronometrar um ensaio de cada módulo.

## Decisões em aberto

1. **Como vender.** Os três módulos juntos ou cada um avulso.
2. **Duração do básico.** 2 h 30 com o painel construído por todos, ou 2 h com o painel só em demonstração.
3. **Ferramenta em sala.** A agenda usa o Claude; o método vale no ChatGPT, com outros nomes de tela.
4. **Plano da turma.** Publicar por link, conectores com escrita e plugins pedem plano pago.
5. **Nome e marca.** "Advocacia Aumentada" é a proposta de trabalho.
6. **Onde o material fica.** Este repositório é público. Se o programa for produto comercial, convém um repositório privado.

## Avisos

Material de treinamento, sem valor de parecer jurídico. Empresas, pessoas e documentos do caso prático e da planilha de exemplo são fictícios. As falas "da cadeira do juiz" e "da cadeira do garoto" são as duas vozes que orientaram o desenho, e não citações de pessoas reais.
