(()=>{const {$,$$,tone,ding,boing}=DECK, SEC=DECK.el('pea');
/* cenas: e = emoji, t = texto, s = luzes [P,E,A] (1 ok · -1 falhou · 0 ainda não), v = veredito */
const M=[
 {ttl:'O encontro',sc:[
  {e:'💌',t:'Você chamou a pessoa para sair.',s:[0,0,0],v:['Será que rola?','Ainda não dá para saber nada.']},
  {e:'🚶‍♀️',t:'Ela <em>foi</em> ao encontro.',s:[1,0,0],v:['Bom sinal: prontidão.','Topou ir. Mas ir não é gostar.']},
  {e:'😒',t:'Foi… de <em>cara fechada</em>, olhando o celular a noite toda.',s:[1,-1,0],v:['Presente, mas não engajada.','Apareceu, mas não está dentro.']},
  {e:'🥳',t:'Riu, dançou, dividiu a sobremesa… e <em>nunca mais respondeu</em>.',s:[1,1,-1],v:['Engajou, mas não adotou.','Curtiu o momento, não ficou.']},
  {e:'📞',t:'No dia seguinte, <em>ela liga</em> e já marca o próximo.',s:[1,1,1],v:['Adoção!','Escolhe de novo, sem você empurrar.']}]},
 {ttl:'O sistema novo',sc:[
  {e:'🚀',t:'O sistema novo vai entrar no ar.',s:[0,0,0],v:['Será que pega?','Go-live marcado não é adoção garantida.']},
  {e:'🧑‍💻',t:'Todo mundo <em>foi</em> ao treinamento.',s:[1,0,0],v:['Bom sinal: prontidão.','Sabem que vem aí. Mas presença não é engajamento.']},
  {e:'😶',t:'Foi… de <em>câmera desligada</em>, respondendo e-mail.',s:[1,-1,0],v:['Presente, mas não engajado.','Lista de presença cheia, cabeça em outro lugar.']},
  {e:'👏',t:'Amou a demo, aplaudiu… e <em>voltou para a planilha</em> Controle_FINAL_v3.xlsx.',s:[1,1,-1],v:['Engajou, mas não adotou.','O sistema está no ar; o trabalho, na planilha.']},
  {e:'✅',t:'Lança tudo no sistema, <em>larga a planilha</em> e ensina o colega.',s:[1,1,1],v:['Adoção!','O novo virou o jeito normal.']}]}
];
let m=0,k=0;
const emo=$('.pe-emo span',SEC),cap=$('.pe-cap',SEC),vd=$('.pe-vd',SEC),dots=$('.pe-dots',SEC),LT=$$('.pe-lt',SEC);
dots.innerHTML=M[0].sc.map((_,i)=>`<button type="button" aria-label="Cena ${i+1}"></button>`).join('');
const re=(el,c)=>{el.classList.remove(c);void el.offsetWidth;el.classList.add(c)};
function burst(){const b=$('.pe-burst',SEC);b.innerHTML='';const C=['#F26B21','#FF8A4C','#2ECC71','#A3B8D6','#fff','#FFC7A6'];
 for(let i=0;i<34;i++){const a=Math.random()*Math.PI*2,d=90+Math.random()*190,x=document.createElement('i');x.style.cssText=`background:${C[i%C.length]};--tx:${Math.cos(a)*d}px;--ty:${Math.sin(a)*d-40}px;--r:${Math.random()*720-360}deg;animation-delay:${Math.random()*.12}s`;b.appendChild(x)}}
function show(snd=true){const s=M[m].sc[k];$('.pe-ttl',SEC).textContent=M[m].ttl+(k?` · cena ${k} de ${M[m].sc.length-1}`:' · o começo');
 emo.textContent=s.e;emo.classList.remove('bob');re(emo,'in');clearTimeout(emo._t);emo._t=setTimeout(()=>{emo.classList.remove('in');emo.classList.add('bob')},700);
 $('.pe-n',cap).textContent=k?'Cena '+k:'Começo';$('p',cap).innerHTML=s.t;re(cap,'in');
 $('b',vd).textContent=s.v[0];$('span',vd).textContent=s.v[1];re(vd,'in');
 LT.forEach((l,i)=>{l.classList.toggle('ok',s.s[i]===1);l.classList.toggle('ko',s.s[i]===-1)});
 $$('button',dots).forEach((b,i)=>b.classList.toggle('on',i<=k));
 const full=s.s.every(v=>v===1),bad=s.s.includes(-1);
 if(full){burst();if(snd)ding()}else if(snd){bad?tone(180,.25,'triangle',.06,140):tone(520+k*60,.12,'sine',.05,900)}}
$$('.pe-tg button',SEC).forEach(b=>b.addEventListener('click',()=>{m=+b.dataset.m;$$('.pe-tg button',SEC).forEach(x=>x.classList.toggle('on',x===b));show()}));
dots.addEventListener('click',e=>{const b=e.target.closest('button');if(b){k=$$('button',dots).indexOf(b);show()}});
$$('.pe-lens',SEC).forEach(l=>l.addEventListener('click',()=>{const on=!l.classList.contains('on');$$('.pe-lens',SEC).forEach(x=>x.classList.remove('on'));if(on){l.classList.add('on');boing()}}));
DECK.register('pea',{
 enter(){m=0;k=0;$$('.pe-tg button',SEC).forEach((x,i)=>x.classList.toggle('on',i===0));$$('.pe-lens',SEC).forEach(x=>x.classList.remove('on'));show(false)},
 step(d){const n=k+d;if(n<0||n>=M[m].sc.length){if(d>0&&m===0){m=1;k=0;$$('.pe-tg button',SEC).forEach((x,i)=>x.classList.toggle('on',i===1));show();return true}return false}k=n;show();return true}
});
})();
