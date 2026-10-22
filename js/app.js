(()=>{'use strict';
const $=id=>document.getElementById(id);
const PK='hc.pulse.v1',EK='hc.exercise.v1';
const load=k=>{try{const v=JSON.parse(localStorage.getItem(k));return Array.isArray(v)?v:[]}catch(e){return[]}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const DW=['일','월','화','수','목','금','토'];
const pad=n=>String(n).padStart(2,'0');
function fmt(ts){const d=new Date(ts),h=d.getHours();return `${d.getMonth()+1}월 ${d.getDate()}일 (${DW[d.getDay()]}) ${h<12?'오전':'오후'} ${h%12||12}:${pad(d.getMinutes())}`}
function cue(){const r=document.querySelector('.ring');r.classList.add('cue');setTimeout(()=>r.classList.remove('cue'),250)}

/* ---- 1. pulse ---- */
let mode='view',iv=null;
function show(m){mode=m;const has=load(PK).length>0;
 $('pView').classList.toggle('hide',!(m==='view'&&has));$('pEmpty').classList.toggle('hide',!(m==='view'&&!has));
 $('pTimer').classList.toggle('hide',m!=='timer');$('pInput').classList.toggle('hide',m!=='input');
 $('startBtn').classList.toggle('hide',m!=='view');$('pwEmpty').classList.toggle('hide',has);$('week').classList.toggle('hide',!has);$('plEmpty').classList.toggle('hide',has)}
function render(){const recs=load(PK).sort((a,b)=>b.ts-a.ts);
 if(recs[0]){$('bpm').textContent=recs[0].bpm;$('date').textContent=fmt(recs[0].ts)+' 기록'}
 const ul=$('recent');ul.innerHTML='';
 recs.slice(0,5).forEach(r=>{const li=document.createElement('li');
  li.innerHTML=`<div><b>${r.bpm}</b> <span>회/분 · ${fmt(r.ts)}</span></div>`;
  const b=document.createElement('button');b.className='tbtn del';b.textContent='삭제';b.setAttribute('aria-label',`${fmt(r.ts)} 기록 삭제`);
  b.onclick=()=>{if(confirm('이 기록을 지울까요?')){save(PK,load(PK).filter(x=>x.id!==r.id));render();show('view')}};
  li.appendChild(b);ul.appendChild(li)});
 const wk=$('week');wk.innerHTML='';const now=new Date();const days=[];
 for(let i=6;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()-i);const e=d.getTime()+864e5;
  const v=recs.filter(r=>r.ts>=d.getTime()&&r.ts<e).map(r=>r.bpm);days.push({d,avg:v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):null})}
 const vals=days.filter(x=>x.avg).map(x=>x.avg),mx=Math.max(...vals,1),mn=Math.min(...vals,mx);
 days.forEach((x,i)=>{const h=x.avg?30+60*((x.avg-mn)/((mx-mn)||1)):2;
  const el=document.createElement('div');el.className='day';
  el.innerHTML=`<span class="v">${x.avg??''}</span><div class="bar${x.avg?'':' none'}" style="height:${x.avg?(mx===mn?60:h):2}px"></div><span>${i===6?'오늘':DW[x.d.getDay()]}</span>`;
  el.setAttribute('aria-label',`${x.d.getMonth()+1}월 ${x.d.getDate()}일 ${x.avg?'평균 '+x.avg+'회/분':'기록 없음'}`);wk.appendChild(el)})}
function draw(l){$('sec').textContent=l;$('arc').style.strokeDashoffset=439.8*(1-l/15)}
function start(){show('timer');let l=15;$('arc').style.transition='none';draw(15);$('arc').getBoundingClientRect();$('arc').style.transition='';
 $('tMsg').textContent='손목 안쪽에 두 손가락을 대고 세어 보세요';vib(80);cue();clearInterval(iv);
 iv=setInterval(()=>{l--;draw(l);if(l<=0){clearInterval(iv);vib([80,80,80]);cue();$('cnt').value='';calc();show('input');setTimeout(()=>$('cnt').focus(),50)}},1000)}
function calc(){const n=parseInt($('cnt').value,10);const ok=n>=1&&n<=60;$('saveBtn').disabled=!ok;
 $('res').textContent=ok?`분당 ${n*4}회로 기록할게요`:'1~60 사이 숫자를 입력해 주세요'}
$('cnt').addEventListener('input',calc);$('startBtn').onclick=start;
$('cancelBtn').onclick=()=>{clearInterval(iv);show('view')};$('discardBtn').onclick=()=>show('view');
$('saveBtn').onclick=()=>{const n=parseInt($('cnt').value,10);if(!(n>=1&&n<=60))return;
 const a=load(PK);a.push({id:uid(),ts:Date.now(),bpm:n*4});save(PK,a);render();show('view')};
render();show('view');window.hcPulse=()=>{render();show(mode)};

/* ---- 2. animation ---- */
const pB=$('pBelly'),pA=$('pArm'),LB=pB.getTotalLength(),LA=pA.getTotalLength();
const DUR={soft:{b:1500,a:1250},stiff:{b:750,a:1250}};
let am='soft',t0=0,raf=0;
function place(el,p,L,f){const pt=p.getPointAtLength(L*Math.min(f,1));el.setAttribute('cx',pt.x);el.setAttribute('cy',pt.y)}
function frame(t,once){const d=DUR[am],e=t-t0,cyc=Math.max(d.a,d.b)+900;const k=once?Math.min(e,cyc-1):e%cyc;
 place($('dB'),pB,LB,k/d.b);place($('dA'),pA,LA,k/d.a);
 $('endB').setAttribute('opacity',k>=d.b?1:0);$('endA').setAttribute('opacity',k>=d.a?1:0);
 const first=d.b<d.a?'배 쪽 큰 혈관':'손목';$('aStatus').textContent=k>=Math.min(d.a,d.b)?`${first}에 먼저 도착했어요`:'동시에 출발!'}
function loop(t){frame(t,false);raf=requestAnimationFrame(loop)}
function staticView(){cancelAnimationFrame(raf);const d=DUR[am];frame(t0+Math.max(d.a,d.b)+10,true)}
function play(){cancelAnimationFrame(raf);t0=performance.now();
 if(reduce.matches){const step=t=>{frame(t,true);if(t-t0<Math.max(DUR[am].a,DUR[am].b)+100)raf=requestAnimationFrame(step)};raf=requestAnimationFrame(step)}
 else raf=requestAnimationFrame(loop)}
function init(){if(reduce.matches){t0=0;staticView()}else play()}
document.querySelectorAll('#animSeg button').forEach(b=>b.onclick=()=>{am=b.dataset.m;document.querySelectorAll('#animSeg button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));reduce.matches?staticView():play()});
$('replayBtn').onclick=play;reduce.addEventListener?.('change',init);init();
window.__anim={get mode(){return am},DUR};

/* ---- 3. routines ---- */
const R=[{id:'stretch',min:5,name:'자리에서 스트레칭',steps:['목을 천천히 좌우로 돌려요','어깨를 위로 올렸다 툭 내려요','깍지 끼고 팔을 위로 쭉 펴요','앉아서 상체를 좌우로 비틀어요','발목을 돌리고 크게 숨 쉬어요']},
 {id:'stairs',min:10,name:'계단 걷기',steps:['난간을 잡고 천천히 시작해요','한 층씩 편한 속도로 올라가요','숨이 차면 잠깐 쉬어요','내려올 때는 더 천천히','끝나면 종아리를 가볍게 풀어요']},
 {id:'walk',min:15,name:'점심 산책',steps:['편한 신발로 밖에 나가요','처음 3분은 천천히 걸어요','조금 빠르게 10분 걸어요','마지막 2분은 천천히 정리해요']}];
let cur=null,left=0,rIv=null,running=false;
const ch=$('chips');R.forEach(r=>{const b=document.createElement('button');b.className='chip';b.innerHTML=`<b>${r.min}분</b>${r.name}`;b.onclick=()=>open(r);ch.appendChild(b)});
function clock(){$('clock').textContent=`${pad(Math.floor(left/60))}:${pad(left%60)}`;
 const per=cur.min*60/cur.steps.length,idx=Math.min(cur.steps.length-1,Math.floor((cur.min*60-left)/per));
 [...$('steps').children].forEach((li,i)=>li.classList.toggle('cur',running&&i===idx))}
function stopT(){clearInterval(rIv);running=false;$('goBtn').textContent=left<cur.min*60&&left>0?'이어서':'시작'}
function open(r){cur=r;left=r.min*60;$('sTitle').textContent=`${r.min}분 ${r.name}`;$('steps').innerHTML=r.steps.map(s=>`<li>${s}</li>`).join('');
 $('savedMsg').classList.add('hide');$('doneBtn').disabled=false;stopT();clock();$('sheet').classList.remove('hide');$('closeBtn').focus()}
function close(){stopT();$('sheet').classList.add('hide')}
$('goBtn').onclick=()=>{if(running){stopT();clock();return}if(left<=0)left=cur.min*60;running=true;$('goBtn').textContent='잠시 멈춤';vib(60);clock();
 rIv=setInterval(()=>{left--;clock();if(left<=0){stopT();vib([80,80,80]);$('goBtn').textContent='다시 시작'}},1000)};
$('doneBtn').onclick=()=>{const a=load(EK);a.push({id:uid(),ts:Date.now(),routine:cur.id,min:cur.min});save(EK,a);$('savedMsg').classList.remove('hide');$('doneBtn').disabled=true;stopT();exDone();dispatchEvent(new Event('hc:exercise'))};
$('closeBtn').onclick=close;$('sheet').addEventListener('click',e=>{if(e.target.id==='sheet')close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('sheet').classList.contains('hide'))close()});
function exDone(){const s=new Date();s.setHours(0,0,0,0);const n=load(EK).filter(x=>x.ts>=s.getTime()).length;$('exDone').textContent=n?`오늘 ${n}번 완료했어요.`:''}
exDone();
})();
