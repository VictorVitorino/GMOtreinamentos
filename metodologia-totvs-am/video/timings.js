/* Fonte única de tempo — v5 (3 atos, sincronizado à narração).
   Cada cena carrega o TEXTO exato narrado; kw() converte uma frase do texto
   em tempo absoluto (proporcional por caractere) — os frames aparecem
   conforme a Dani fala. */
const DEF = [
  ['i0', 17.52, 'n01', 1.2, 1.2],  // boas-vindas + "Vamos entender essa parceria?"
  ['x1', 0,     null,  0,   2.4],
  ['a1', 21.71, 'n02', 0.9, 1.3],  // siglas em inglês: tímôu
  ['a2', 28.68, 'nA2', 0.9, 1.4],  // siglas em inglês: pímôu / djímôu / tímôu
  ['a3', 43.89, 'nA3', 0.9, 1.4],
  ['a4', 24.84, 'n08', 0.9, 1.5],
  ['a5', 21.47, 'n09', 0.9, 1.4],
  ['x2', 0,     null,  0,   2.4],
  ['b1', 33.57, 'n04', 0.9, 1.5],
  ['b2', 22.05, 'n05', 0.9, 1.4],  // MIT falado como palavra: "míti"
  ['b3', 20.11, 'n06', 0.9, 1.4],
  ['x3', 0,     null,  0,   2.4],
  ['c1', 19.72, 'n10', 0.9, 4.6],
];
const NARRTXT = {
  i0: "Olá! Seja muito bem-vindo! Este é o início do seu onboarding no projeto de implantação do ERP TOTVS. Aqui, TOTVS e Alvarez e Marsal trabalham lado a lado: tecnologia de um lado, método e governança do outro. Vamos entender essa parceria?",
  a1: "Implantar um ERP não é só trocar de sistema. É redesenhar processos, integrar áreas e mudar a rotina de muita gente. Sem método, cada frente corre para um lado. Com método, todo mundo enxerga o mesmo caminho. É isso que a Metodologia TOTVS garante, com a governança do tímôu conduzida pela Alvarez e Marsal.",
  a2: "A Metodologia A&M nasce da união de duas disciplinas. De um lado, o pímôu: planejamento integrado, governança, gestão de riscos e entregas sob controle. Do outro, o djímôu: pessoas, comunicação, capacitação e adoção. Juntas, elas formam o tímôu — o escritório de transformação que consolida dados, faz o diagnóstico, conduz a comunicação executiva e gerencia o projeto em todas as fases.",
  a3: "Essa metodologia percorre seis fases. Planejamento e Mobilização: governança, papéis e o plano integrado do projeto. Desenho e Preparação: escopo refinado, impactos mapeados e capacitação planejada. Desenvolvimento e Configuração: backlog priorizado, qualidade e integração entre as frentes. Testes e Validações: defeitos sob gestão e critérios de aceite claros. Cutover e Prontidão: plano de virada, treinamentos e a decisão de go, no-go. E Estabilização: operação assistida, adoção medida e lições aprendidas. E o tempo todo, em paralelo: governança executiva, riscos e comunicação dirigida.",
  a4: "Para manter todo mundo na mesma página, temos um ritual sagrado: o Status Report semanal executivo. Toda semana, em uma página, mostramos o avanço do projeto, as entregas concluídas, os próximos passos e os pontos de atenção, com farol verde, amarelo ou vermelho. Transparência total: boa notícia e má notícia viajam na mesma velocidade.",
  a5: "E porque todo projeto tem riscos, nós não esperamos o problema bater à porta. Na matriz de riscos, cada item é avaliado por probabilidade e impacto. Todo risco tem dono, plano de mitigação e prazo. E o que é crítico sobe para o comitê. Gestão de riscos, aqui, é antecipação — não é apagar incêndio.",
  b1: "Quando os dois mundos se encontram, nasce o framework da parceria. A TOTVS traz a gestão técnica e funcional: configuração da solução, desenvolvimento e customizações, testes, documentação e suporte. A A&M traz a gestão de transformação e valor. E no centro está a atuação conjunta: planejamento e priorização, refinamento de processos, testes integrados e aceites, preparação para o cutover, e estabilização. Um único time, com metodologias integradas e valor sustentável.",
  b2: "E tem uma palavra que você vai ouvir todos os dias: míti. Os mítis são os documentos oficiais da metodologia TOTVS. Cada processo do negócio é mapeado, desenhado e documentado em um míti — e só segue para a construção depois de validado com os key users. É assim que o refinamento vira compromisso, por escrito.",
  b3: "No dia a dia, três frentes merecem atenção especial. O refinamento do Fluig, onde desenhamos fluxos e aprovações. As Integrações, que fazem os sistemas conversarem entre si. E o mapeamento de gaps e melhorias: o que o padrão não cobre vira análise, decisão e plano de ação. Nada fica no ar.",
  c1: "E o seu papel nessa história? Participe das cerimônias, reporte com transparência e escale cedo: problema pequeno hoje é melhor do que crise na virada. Método, governança e pessoas — é assim que a gente transforma. TOTVS e Alvarez e Marsal, juntas. Seja bem-vindo a bordo!",
};
const SCENES = [];
let t = 0;
for (const [id, nd, file, lead, tail] of DEF) {
  const a = t, n = t + lead, b = t + lead + nd + tail;
  SCENES.push({ id, a, n, b, nd, file });
  t = b;
}
const TOTAL = t;
const SCMAP = {}; SCENES.forEach(s => SCMAP[s.id] = s);
/* tempo absoluto em que a Dani fala `phrase` dentro da cena `id` */
function kw(id, phrase, lead = 0.12) {
  const s = SCMAP[id], txt = NARRTXT[id];
  const i = txt.indexOf(phrase);
  if (i < 0) throw new Error('kw não encontrado: ' + id + ' → ' + phrase);
  return s.n + (i / txt.length) * s.nd - lead;
}
/* trilha de cliques (elemento ↔ fala) para a mixagem */
const CLICKS = [
  ['a1','redesenhar processos'],['a1','integrar áreas'],['a1','mudar a rotina'],
  ['a1','todo mundo enxerga'],['a1','Metodologia TOTVS garante'],
  ['a2','o pímôu'],['a2','Do outro'],['a2','formam o tímôu'],
  ['a2','consolida dados'],['a2','o diagnóstico'],['a2','comunicação executiva'],['a2','gerencia o projeto'],
  ['a3','Planejamento e Mobilização'],['a3','Desenho e Preparação'],['a3','Desenvolvimento e Configuração'],
  ['a3','Testes e Validações'],['a3','Cutover e Prontidão'],['a3','E Estabilização'],
  ['a4','ritual sagrado'],['a4','avanço do projeto'],['a4','entregas concluídas'],['a4','próximos passos'],['a4','farol verde'],
  ['a5','matriz de riscos'],['a5','probabilidade e impacto'],['a5','tem dono'],['a5','crítico sobe'],
  ['b1','dois mundos'],['b1','configuração da solução'],['b1','gestão de transformação'],['b1','atuação conjunta'],['b1','Um único time'],
  ['b2','uma palavra'],['b2','Os mítis são'],['b2','validado com os key users'],['b2','a construção'],
  ['b3','Fluig'],['b3','As Integrações'],['b3','de gaps'],
  ['c1','das cerimônias'],['c1','com transparência'],['c1','escale cedo'],['c1','é assim que'],['c1','bem-vindo a bordo'],
];
if (typeof module !== 'undefined') module.exports = { SCENES, TOTAL, NARRTXT, kw, CLICKS, SCMAP };
if (typeof window !== 'undefined') {
  window.SCENES = SCENES; window.TOTAL = Math.round(TOTAL * 100) / 100;
  window.KW = kw; window.NARRTXT = NARRTXT;
}
