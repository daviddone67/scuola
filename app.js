var KEY="piano-studio-v2",PAL=["#ffc93c","#22c3a0","#ff8fb8","#8fb0ff","#ffa766","#b79bff"];
var S={exams:[],done:{},log:{},mat:""},open={};
try{var q=localStorage.getItem(KEY);if(q)S=Object.assign(S,JSON.parse(q))}catch(e){}
var st=null;function flush(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}function save(){clearTimeout(st);st=setTimeout(flush,300)}addEventListener("pagehide",flush);document.addEventListener("visibilitychange",function(){if(document.hidden)flush()});
function $(i){return document.getElementById(i)}
function p2(n){return n<10?"0"+n:""+n}
function K(d){return d.getFullYear()+"-"+p2(d.getMonth()+1)+"-"+p2(d.getDate())}
function P(k){var a=k.split("-");return new Date(+a[0],+a[1]-1,+a[2])}
function E(t){return String(t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var T=new Date();T.setHours(0,0,0,0);var TK=K(T);
var DN=["domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato"];
function col(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%997;return PAL[h%PAL.length]}
function fmt(k){var d=P(k);return DN[d.getDay()]+" "+d.getDate()+"/"+(d.getMonth()+1)}
var hr=new Date().getHours();$("hi").textContent=(hr<12?"Buongiorno":hr<18?"Buon pomeriggio":"Buonasera")+". Un passo alla volta.";

function plan(){
  var out={};
  S.exams.filter(function(e){return P(e.date)>T}).sort(function(a,b){return b.diff-a.diff||a.date.localeCompare(b.date)}).forEach(function(e){
    var av=[];for(var d=new Date(T);d<P(e.date);d.setDate(d.getDate()+1))av.push(K(d));
    var w=av.filter(function(k){return P(k).getDay()!==0});if(!w.length)w=av;
    var n=Math.min(w.length,e.type==="compito"?1:e.diff+1),st=Math.max(1,Math.floor(w.length/n));
    for(var i=0;i<n;i++){var ix=Math.max(0,w.length-1-i*st),ok=false;
      for(var o=0;o<w.length&&!ok;o++){[ix-o,ix+o].forEach(function(j){if(ok||j<0||j>=w.length)return;var l=out[w[j]]||(out[w[j]]=[]);if(l.length<2&&l.indexOf(e.subj)<0){l.push(e.subj);ok=true}})}}
  });return out;
}
function subjects(){var a=[];S.exams.forEach(function(e){if(a.indexOf(e.subj)<0)a.push(e.subj)});return a}
function minsOn(k){return(S.log[k]&&S.log[k].m)||0}
function streak(){var n=0,d=new Date(T);if(!minsOn(K(d)))d.setDate(d.getDate()-1);while(minsOn(K(d))>0){n++;d.setDate(d.getDate()-1)}return n}

function render(){
  var vw=document.querySelector(".view.on").id,pl=plan(),sb=subjects();
  var cur=$("tsub").value;$("tsub").innerHTML=sb.length?sb.map(function(s){return"<option>"+E(s)+"</option>"}).join(""):"<option>Studio libero</option>";if(cur)$("tsub").value=cur;
  var tl=pl[TK]||[];
  if(vw==="v-oggi")$("today").innerHTML=tl.length?tl.map(function(s){var k=TK+"|"+s,d=S.done[k];return'<label class="task'+(d?" d":"")+'"><input type="checkbox" data-done="'+E(k)+'"'+(d?" checked":"")+'><i class="dot" style="background:'+col(s)+'"></i><span>'+E(s)+"</span></label>"}).join(""):'<div class="empty">Niente in programma oggi. Anticipa la materia più difficile se hai tempo.</div>';
  var ex=S.exams.map(function(e,i){return{e:e,i:i}}).sort(function(a,b){return a.e.date.localeCompare(b.e.date)});
  if(vw==="v-verifiche")$("exams").innerHTML=ex.length?ex.map(function(o){var e=o.e,i=o.i,tp=e.topics||[],dn=tp.filter(function(t){return t.d}).length,left=Math.round((P(e.date)-T)/864e5);
    return'<details class="card" data-o="'+e.id+'"'+(open[e.id]?" open":"")+'><summary><i class="dot" style="background:'+col(e.subj)+'"></i><span style="flex:1">'+E(e.subj)+'<br><small style="color:var(--mute);font-weight:400">'+E(e.type)+" · "+fmt(e.date)+(left>=0?" · tra "+left+" gg":" · passata")+'</small></span><span class="tag">'+dn+"/"+tp.length+"</span></summary><div style=\"margin-top:10px\">"+
    tp.map(function(t,j){return'<label class="task'+(t.d?" d":"")+'"><input type="checkbox" data-tp="'+i+"."+j+'"'+(t.d?" checked":"")+"><span>"+E(t.t)+"</span></label>"}).join("")+
    '<div class="row" style="margin-top:8px"><input id="nt'+i+'" placeholder="Argomento (es. cap. 5)" aria-label="Nuovo argomento"><button class="g s" data-addtp="'+i+'">Aggiungi</button><button class="g s" data-del="'+i+'">Elimina scadenza</button></div></div></details>'}).join(""):'<div class="card empty">Nessuna scadenza. Aggiungi la prima qui sopra.</div>';
  var ks=Object.keys(pl).sort();
  if(vw==="v-piano")$("plan").innerHTML=ks.length?ks.map(function(k){return'<div class="day'+(k===TK?" t":"")+'"><h3>'+fmt(k)+"</h3>"+pl[k].map(function(s){return'<span class="chip'+(S.done[k+"|"+s]?" x":"")+'" style="background:'+col(s)+'">'+E(s)+"</span>"}).join("")+"</div>"}).join(""):'<div class="empty">Il piano compare appena aggiungi una scadenza futura.</div>';
  var wk=0,by={};for(var i=0;i<7;i++){var d=new Date(T);d.setDate(d.getDate()-i);var l=S.log[K(d)];if(l){wk+=l.m;for(var s in l.b)by[s]=(by[s]||0)+l.b[s]}}
  if(vw==="v-stats")$("stats").innerHTML='<div class="stat" style="background:#ffc93c"><b>'+minsOn(TK)+"</b><small>minuti oggi</small></div>"+'<div class="stat" style="background:#22c3a0"><b>'+wk+"</b><small>minuti in 7 gg</small></div>"+'<div class="stat" style="background:#ff8fb8"><b>'+streak()+"</b><small>giorni di fila</small></div>";
  var mx=Math.max.apply(null,[1].concat(Object.keys(by).map(function(s){return by[s]})));
  if(vw==="v-stats")$("bars").innerHTML=Object.keys(by).length?Object.keys(by).map(function(s){return"<div><b>"+E(s)+'</b> <small style="color:var(--mute)">'+by[s]+' min</small><div class="bar" style="width:'+Math.max(6,by[s]/mx*100)+"%;background:"+col(s)+'"></div></div>'}).join(""):'<div class="empty">Fai partire il timer e qui vedi quali materie stai studiando.</div>';
  if(S.mat){$("mat").value=S.mat;var g=Math.round((P(S.mat)-T)/864e5);$("matt").textContent=g>0?"Mancano "+g+" giorni alla prima prova.":"La prima prova è arrivata."}else $("matt").textContent="Imposta la data per vedere il conto alla rovescia.";
}

$("add").onclick=function(){var s=$("subj").value.trim(),d=$("date").value;
  if(!s||!d){$("err").textContent="Scrivi la materia e scegli la data.";return}
  if(P(d)<=T){$("err").textContent="La data deve essere da domani in poi.";return}
  S.exams.push({id:"e"+Date.now(),subj:s,type:$("type").value,date:d,diff:+$("diff").value,topics:[]});$("subj").value="";$("err").textContent="";save();render()};
$("matok").onclick=function(){S.mat=$("mat").value;save();render()};
document.addEventListener("click",function(ev){var a=ev.target.getAttribute&&ev.target;if(!a)return;
  var v=a.getAttribute("data-v");if(v){document.querySelectorAll(".view").forEach(function(x){x.classList.remove("on")});$("v-"+v).classList.add("on");document.querySelectorAll("nav button").forEach(function(b){b.classList.toggle("on",b===a)});window.scrollTo(0,0);render();return}
  var dl=a.getAttribute("data-del");if(dl!==null){S.exams.splice(+dl,1);save();render();return}
  var at=a.getAttribute("data-addtp");if(at!==null){var inp=$("nt"+at),t=inp.value.trim();if(t){var e=S.exams[+at];(e.topics=e.topics||[]).push({t:t,d:false});open[e.id]=1;save();render()}}});
document.addEventListener("toggle",function(ev){var id=ev.target.getAttribute&&ev.target.getAttribute("data-o");if(id)open[id]=ev.target.open},true);
document.addEventListener("change",function(ev){var a=ev.target,k=a.getAttribute&&a.getAttribute("data-done");
  if(k){S.done[k]=a.checked;save();render();return}
  var tp=a.getAttribute&&a.getAttribute("data-tp");if(tp){var p=tp.split(".");S.exams[+p[0]].topics[+p[1]].d=a.checked;open[S.exams[+p[0]].id]=1;save();render()}});

var iv=null,left=600,tot=600,ph="",ac=null;
function show(){$("time").textContent=p2(Math.floor(left/60))+":"+p2(left%60);$("arc").setAttribute("stroke-dashoffset",(276.46*(1-left/tot)).toFixed(1))}
function beep(){try{if(navigator.vibrate)navigator.vibrate([200,100,200]);ac=ac||new(window.AudioContext||window.webkitAudioContext)();var o=ac.createOscillator(),g=ac.createGain();o.frequency.value=880;g.gain.value=.15;o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+.4)}catch(e){}}
var endAt=0;function tick(){left=Math.max(0,Math.ceil((endAt-Date.now())/1000));show();if(left<=0){clearInterval(iv);fin()}}
function start(sec,p,t){clearInterval(iv);left=tot=sec;endAt=Date.now()+sec*1000;ph=p;$("msg").textContent=t;show();iv=setInterval(tick,500)}
function addMin(m){var l=S.log[TK]||(S.log[TK]={m:0,b:{}}),s=$("tsub").value;l.m+=m;l.b[s]=(l.b[s]||0)+m;save();render()}
function fin(){beep();
  if(ph==="10"){addMin(10);$("msg").textContent="10 minuti fatti. Continui con un pomodoro?";left=tot=600}
  else if(ph==="25"){addMin(25);start(300,"p","Pausa: alzati e bevi qualcosa.");return}
  else{$("msg").textContent="Pausa finita. Un altro giro?";left=tot=1500}show()}
$("b10").onclick=function(){start(600,"10","Parti dalla cosa più semplice.")};
$("b25").onclick=function(){start(1500,"25","Telefono lontano. Solo questa materia.")};
$("bstop").onclick=function(){clearInterval(iv);left=tot=600;$("msg").textContent="Fermo. Riparti quando vuoi.";show()};
show();render();
if("serviceWorker" in navigator)addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})});
