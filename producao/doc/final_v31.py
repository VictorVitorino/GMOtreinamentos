#!/usr/bin/env python3
"""final_v31.py · aplica as exigências dos 3 críticos sobre a síntese do chefe de roteiro → final_v31.json
(cortes de texto, tese só no fim, carimbos de OBJETOS, botão de fliperama, 3º ato reordenado, sem disclaimers no meio, tempos que fecham 130 s)."""
import json, copy
S=json.load(open('head_writer.json')); F=copy.deepcopy(S)
F['title']='QUEM APERTA O BOTÃO?'; F['version']='v3.1 (pós-críticos)'
sc=F['scenes']
def setn(i,narr): sc[i]['narration']=narr
# --- texto ---
setn(0,'Estação Central. Plataforma três. Um cientista, um jovem… e um trem atrasado cento e dezoito anos.')
sc[0]['text_on_screen']="Painel de partidas piscando: 'PRÓXIMO TREM → 1908 · ATRASADO: 118 ANOS' · etiquetas de fita-crepe 'O CIENTISTA' / 'O JOVEM' · máquina de lanche 'PEÇAS · BOTÕES · LANCHES' · botão redondo de fliperama laranja 'PARTIU'"
setn(2,'«Olá. Sou a Máquina. Disque o ano.» Um. Nove. Zero. Oito. E agora… quem aperta? «Aguardando o botão.»')
sc[2]['visual']=sc[2]['visual'].replace('cinco peças caem, UMA a cada 1,5 s','três peças caem, UMA a cada 1,5 s (banco; relógio + telefone; máquina de escrever + botão)')
sc[2]['text_on_screen']="Etiquetas de fita-crepe: 'DISQUE O ANO', 'FLUXO', 'PARTIU' · visor: 'AGUARDANDO O BOTÃO_'"
setn(3,'«Mil novecentos e oito.» Sair de casa era um projeto.')
setn(4,'Aí veio o Ford T. Não o primeiro do mundo: o primeiro que muita gente podia ter.')
setn(5,'E a reação foi… humana. «Erro: ninguém explicou.» Então alguém pegou o giz.')
sc[5]['text_on_screen']="Visor: 'ERRO: NINGUÉM EXPLICOU' · quadro-negro em giz: pictogramas · carimbo com o OBJETO (o giz), casa 1 de 4 — sem verbo"
setn(6,'')
setn(7,'«Trânsito à frente.» Todo mundo tinha carro. Logo, todo mundo tinha trânsito.')
setn(8,'Resolve uma dor, inventa outra. Até alguém trocar de carro. «Passageira a bordo.»')
sc[8]['visual']=sc[8]['visual'].replace('os braços dele vão sendo substituídos por um SEMÁFORO de papel que brota do pedestal; ele olha os próprios braços (lookAt), dá de ombros (headWobble + braço de papel) e pega um café','um SEMÁFORO de papel brota do pedestal e COPIA os gestos dele — é ele quem ensina o semáforo; ele aprova com um café (figurante quase estático)')
sc[8]['text_on_screen']="Mostrador do relógio com anos no lugar das horas · carimbo com o OBJETO (a chave do carro pendurada no relógio), casa 2 de 4"
setn(9,'«Rota calculada.» Oitenta e cinco. A rota, resolvida. O trânsito, não.')
setn(10,'«Atualização instalada.» Hipoteticamente.')
setn(11,'Um quer o manual. Outra, o vídeo. Um olha pra baixo. Outra procura o volante. «Passageiros: zero.»')
# --- reordenação do 3º ato: silêncio → corredor → embarque → botão ---
corredor=sc[13]; embarque=sc[12]
corredor['narration']='«Recalculando.» Corredor errado. Aqui moram as ideias geniais que ninguém usou.'
embarque['narration']='Quem se assustou em mil novecentos e oito entrou primeiro. Quem sabia, mostrou. «Passageiros: catorze.»'
embarque['text_on_screen']="Visor: 'PASSAGEIROS: 0' → 'PASSAGEIROS: 14' · carimbo com o OBJETO (o cinto), casa 3 de 4"
sc[12],sc[13]=corredor,embarque
setn(14,'Quem aperta o botão? Todo mundo.')
sc[14]['text_on_screen']="Quadro-negro: botão redondo + catorze dedinhos · botão 'PARTIU' gigante · carimbo com o OBJETO (a mão), casa 4 de 4 — cartão completo, ainda sem verbos"
setn(15,'A máquina sempre funcionou. Faltava levar as pessoas. Isso tem nome. Gestão da Mudança.')
sc[15]['text_on_screen']="Verso do cartão: os quatro objetos viram palavras — ENTENDER · CONFIAR · APRENDER · ADOTAR — e 'É por isso que existe' (118–120,5 s) · 'GESTÃO DA MUDANÇA' (3D amarelo, ≥3,5 s)"
setn(16,'«Você chegou ao seu destino.» Próxima parada: esta sala.')
sc[16]['text_on_screen']=sc[16]['text_on_screen']+" · ÚNICA linha legal do filme (minúscula): 'Paródia e hipótese narrativa. Nenhuma fala atribuída a pessoas reais.'"
# --- tempos (somam 130) ---
durs=[9,3,12,6,9,11,3,7,10,6,4,10,8,9,8,9,6]; t=0.0
for s_,d in zip(sc,durs): s_['t0']=round(t,1); s_['t1']=round(t+d,1); t+=d
F['estimated_duration_s']=t
# --- narração completa ---
F['narration_full']='\n'.join(s_['narration'] for s_ in sc if s_.get('narration'))
import re; F['word_count']=len(re.sub(r'[«»]','',F['narration_full']).split())
F['running_gag']=F['running_gag'].replace('tecla verde gigante CONFIRMA','botão redondo de fliperama laranja PARTIU').replace('tecla verde','botão laranja').replace('CONFIRMA','PARTIU')
F['final_reveal']='Os quatro carimbos são OBJETOS (giz, chave, cinto, mão) — a plateia vê o cartão encher sem ler método nenhum. Só no flip (S16) os objetos viram palavras: ENTENDER · CONFIAR · APRENDER · ADOTAR, e o nome cai: Gestão da Mudança.'
F['avoid']=[a.replace('CONFIRMA','PARTIU') for a in F.get('avoid',[])]+['Disclaimers no meio do filme: só a linha legal da cartela final.','Enunciar a tese antes de S16 (a frase "a máquina não quebrou / só faltava explicar" foi cortada de S06).','Mais de UMA coisa se movendo por beat; cada cameo tem um único gesto.']
F['changes_v31']=['Narração 211 → %d palavras (tempo fecha em 130 s no ritmo lento).'%F['word_count'],'Abertura concreta e sem a palavra "mudança"; primeira piada aos 4 s (painel ATRASADO: 118 ANOS) e segunda aos 8 s (moeda falha, Pix funciona).','Tese cortada de S06; só em S16.','Carimbos de objetos (giz, chave, cinto, mão); verbos só no flip final.','Botão redondo de fliperama "PARTIU" no lugar da tecla verde CONFIRMA (semana eleitoral).','3º ato reordenado: silêncio → corredor das ideias (ameaça) → embarque → botão (uma resolução só).','Montagem da Máquina com 3 peças em vez de 5; guarda ensina o semáforo em vez de ser substituído.','Disclaimers removidos do meio; única linha legal na cartela final.','Decisão do solicitante mantida: usar a foto do metrô e as imagens de Elon Musk enviadas, recortadas de verdade.']
json.dump(F,open('final_v31.json','w'),ensure_ascii=False,indent=1)
print('palavras',F['word_count'],'duração',t)
for s_ in sc: print(f"[{s_['t0']:>5}–{s_['t1']:>5}] {(s_.get('scene') or '')[:48]:48} | {s_.get('narration','')[:90]}")
