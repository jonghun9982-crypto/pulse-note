/* 운동(hc.exercise.v1) · 수면(hc.sleep.v1): routines, toggle, lists, visual reference cards */
(()=>{'use strict';const $=id=>document.getElementById(id),EK='hc.exercise.v1',SK='hc.sleep.v1';
const load=k=>{try{const v=JSON.parse(localStorage.getItem(k));return Array.isArray(v)?v:[]}catch(e){return[]}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const DW=['일','월','화','수','목','금','토'],pad=n=>String(n).padStart(2,'0');
const fmt=ts=>{const d=new Date(ts),h=d.getHours();return `${d.getMonth()+1}월 ${d.getDate()}일 (${DW[d.getDay()]}) ${h<12?'오전':'오후'} ${h%12||12}:${pad(d.getMinutes())}`};
const dur=ms=>{const m=Math.max(0,Math.round(ms/6e4));return m<60?`${m}분`:`${Math.floor(m/60)}시간${m%60?' '+m%60+'분':''}`};
const hm=m=>{m=Math.round(m);return `${Math.floor(m/60)}시간${m%60?' '+m%60+'분':''}`};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const wk=()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate()-6).getTime()};
const prof=()=>{try{return JSON.parse(localStorage.getItem('hc.profile.v1'))||{}}catch(e){return{}}};
function delBtn(label,fn){const b=document.createElement('button');b.className='tbtn del';b.textContent='삭제';b.setAttribute('aria-label',label+' 삭제');b.onclick=()=>{if(confirm('이 기록을 지울까요?'))fn()};return b}
const P=(v,max)=>(Math.min(max,Math.max(0,v))/max*100).toFixed(2)+'%';

/* ---- routines ---- */
const R=[{id:'stretch',min:5,name:'자리에서 스트레칭',steps:['목을 천천히 좌우로 돌려요','어깨를 위로 올렸다 툭 내려요','깍지 끼고 팔을 위로 쭉 펴요','앉아서 상체를 좌우로 비틀어요','발목을 돌리고 크게 숨 쉬어요']},
 {id:'stairs',min:10,name:'계단 걷기',steps:['난간을 잡고 천천히 시작해요','한 층씩 편한 속도로 올라가요','숨이 차면 잠깐 쉬어요','내려올 때는 더 천천히','끝나면 종아리를 가볍게 풀어요']},
 {id:'walk',min:15,name:'점심 산책',steps:['편한 신발로 밖에 나가요','처음 3분은 천천히 걸어요','조금 빠르게 10분 걸어요','마지막 2분은 천천히 정리해요']}];
const RN=Object.fromEntries(R.map(r=>[r.id,r.name]));
let cur=null,left=0,rIv=null,running=false;
R.forEach(r=>{const b=document.createElement('button');b.className='chip';b.innerHTML=`<b>${r.min}분</b>${r.name}`;b.onclick=()=>open(r);$('chips').appendChild(b)});
function clock(){$('clock').textContent=`${pad(Math.floor(left/60))}:${pad(left%60)}`;
 const per=cur.min*60/cur.steps.length,idx=Math.min(cur.steps.length-1,Math.floor((cur.min*60-left)/per));
 [...$('steps').children].forEach((li,i)=>li.classList.toggle('cur',running&&i===idx))}
function stopT(){clearInterval(rIv);running=false;$('goBtn').textContent=left<cur.min*60&&left>0?'이어서':'시작'}
function open(r){cur=r;left=r.min*60;$('sTitle').textContent=`${r.min}분 ${r.name}`;$('steps').innerHTML=r.steps.map(s=>`<li>${s}</li>`).join('');
 $('savedMsg').classList.add('hide');$('doneBtn').disabled=false;stopT();clock();$('sheet').classList.remove('hide');$('closeBtn').focus()}
function close(){stopT();$('sheet').classList.add('hide')}
$('goBtn').onclick=()=>{if(running){stopT();clock();return}if(left<=0)left=cur.min*60;running=true;$('goBtn').textContent='잠시 멈춤';vib(60);clock();
 rIv=setInterval(()=>{left--;clock();if(left<=0){stopT();vib([80,80,80]);$('goBtn').textContent='다시 시작'}},1000)};
$('doneBtn').onclick=()=>{const a=load(EK);a.push({id:uid(),ts:Date.now(),routine:cur.id,min:cur.min});save(EK,a);$('savedMsg').classList.remove('hide');$('doneBtn').disabled=true;stopT();exRender()};
$('closeBtn').onclick=close;$('sheet').addEventListener('click',e=>{if(e.target.id==='sheet')close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('sheet').classList.contains('hide'))close()});

/* ---- exercise list + card ---- */
function exRender(){const a=load(EK).filter(r=>r&&isFinite(r.ts)).sort((x,y)=>y.ts-x.ts),ul=$('exList');ul.innerHTML='';$('exEmpty').classList.toggle('hide',a.length>0);
 a.slice(0,20).forEach(r=>{const li=document.createElement('li');li.innerHTML=`<div><b>${esc(RN[r.routine]||r.routine||'운동')}</b> <span>${r.min?esc(r.min)+'분 · ':''}${fmt(r.ts)}</span></div>`;
  li.appendChild(delBtn(fmt(r.ts)+' 운동 기록',()=>{save(EK,load(EK).filter(x=>x.id!==r.id));exRender()}));ul.appendChild(li)});
 $('exlHint').textContent=a.length?`기록 ${a.length}개`:'기록 없음';
 const s0=new Date();s0.setHours(0,0,0,0);const n=a.filter(x=>x.ts>=s0.getTime()).length;$('exDone').textContent=n?`오늘 ${n}번 기록했어요.`:'';
 const w=a.filter(r=>r.ts>=wk()),tot=w.reduce((t,r)=>t+(+r.min||0),0),max=Math.max(360,Math.ceil(tot*1.1/60)*60),bar=$('exvBar');
 let g=`<div class="tr"></div><div class="bd" style="left:${P(150,max)};width:calc(${P(300,max)} - ${P(150,max)})"><span>권장 150~300분</span></div>`;
 if(w.length)g+=`<div class="fill" style="width:${P(tot,max)}"></div><div class="rdot" style="left:${P(tot,max)}"></div>`;
 g+=[0,150,300,max].filter((v,i,x)=>x.indexOf(v)===i).map(v=>`<span class="ax" style="left:${P(v,max)}">${v}${v===max?'분':''}</span>`).join('');
 bar.innerHTML=g;
 $('exvMine').innerHTML=w.length?`<span class="dotk"></span>내 최근 7일 <b>${tot}분</b> · 권장 150~300분`:'<span class="rempty">루틴을 완료하면 최근 7일 합계가 여기에 표시돼요</span>'}
exRender();

/* ---- sleep ---- */
const NSF=a=>a==null||!isFinite(a)?[7,9,'성인 기준']:a<=2?[11,14,'1–2세']:a<=5?[10,13,'3–5세']:a<=13?[9,11,'6–13세']:a<=17?[8,10,'14–17세']:a<=25?[7,9,'18–25세']:a<=64?[7,9,'26–64세']:[7,8,'65세 이상'];
const KR=a=>a==null||!isFinite(a)||a<10?[481,'한국 전체 평균']:a<20?[517,'같은 연령대(10대) 한국 평균']:a<30?[506,'같은 연령대(20대) 한국 평균']:a<40?[486,'같은 연령대(30대) 한국 평균']:a<50?[472,'같은 연령대(40대) 한국 평균']:a<60?[460,'같은 연령대(50대) 한국 평균']:[478,'같은 연령대(60세 이상) 한국 평균'];
let tick=null;
function slCard(a){const p=prof(),age=p&&p.age!=null&&isFinite(p.age)?+p.age:null,[lo,hi,lab]=NSF(age),[kr,krl]=KR(age);
 let d=a.filter(r=>r.end&&r.end>r.start&&r.end>=wk());if(!d.length)d=a.filter(r=>r.end&&r.end>r.start).slice(0,7);
 const avg=d.length?d.reduce((t,r)=>t+(r.end-r.start)/6e4,0)/d.length:null,max=Math.max(12*60,(hi+2)*60,avg?Math.ceil(avg/60+1)*60:0);
 let g=`<div class="tr"></div><div class="bd" style="left:${P(lo*60,max)};width:calc(${P(hi*60,max)} - ${P(lo*60,max)})"><span>권장 ${lo}~${hi}시간</span></div>`;
 g+=`<div class="rtick" style="left:${P(kr,max)}"></div>`;
 if(avg!=null)g+=`<div class="fill" style="width:${P(avg,max)}"></div><div class="rdot" style="left:${P(avg,max)}"></div>`;
 for(let h=0;h<=max/60;h+=3)g+=`<span class="ax" style="left:${P(h*60,max)}">${h}${h*60>max-180?'h':''}</span>`;
 $('slvBar').innerHTML=g;$('slvKeyBand').textContent=`권장 ${lo}~${hi}시간 (NSF, ${lab})`;$('slvKeyKr').textContent=krl;
 const krt=`${krl} ${hm(kr)}`;
 $('slvMine').innerHTML=(avg!=null?`<span class="dotk"></span>내 평균 <b>${hm(avg)}</b> · 권장 ${lo}~${hi}시간<br><span class="sub">${krt}</span>`:`<span class="rempty">수면과 기상을 기록하면 평균이 여기에 표시돼요</span><br><span class="sub">권장 ${lo}~${hi}시간 · ${krt}</span>`)+(lab==='성인 기준'?'<br><span class="sub">성인 기준 (기본 정보에 나이를 넣으면 연령에 맞춰 보여 드려요)</span>':'')}
function slRender(){const a=load(SK).filter(r=>r&&isFinite(r.start)).sort((x,y)=>y.start-x.start),op=a.find(r=>!r.end);
 $('slToggle').textContent=op?'기상':'수면';$('slToggle').classList.toggle('on',!!op);$('slToggle').setAttribute('aria-label',op?'기상 기록하기':'수면 기록하기');
 $('slIcon').classList.toggle('on',!!op);$('slIcon').setAttribute('aria-label',op?'자는 중':'깨어 있음');
 $('slState').textContent=op?'자는 중':'깨어 있어요';$('slSince').textContent=op?`${fmt(op.start)}부터 · ${dur(Date.now()-op.start)}`:'';
 const ul=$('slList');ul.innerHTML='';$('slEmpty').classList.toggle('hide',a.length>0);$('sllHint').textContent=a.length?`기록 ${a.length}개`:'기록 없음';
 a.slice(0,20).forEach(r=>{const li=document.createElement('li');
  li.innerHTML=r.end?`<div><b>${dur(r.end-r.start)}</b> <span>${fmt(r.start)} ~ ${fmt(r.end)}</span></div>`:`<div><b>자는 중</b> <span>${fmt(r.start)}부터</span></div>`;
  li.appendChild(delBtn(fmt(r.start)+' 수면 기록',()=>{save(SK,load(SK).filter(x=>x.id!==r.id));slRender()}));ul.appendChild(li)});
 slCard(a);clearInterval(tick);if(op)tick=setInterval(slRender,60000)}
$('slToggle').onclick=()=>{const a=load(SK),op=a.find(r=>!r.end),now=Date.now();
 if(op)op.end=Math.max(now,op.start);else a.push({id:uid(),start:now,end:null});save(SK,a);slRender()};
slRender();
const all=()=>{exRender();slRender()};addEventListener('storage',all);
const pf=$('pfSave');pf&&pf.addEventListener('click',()=>setTimeout(all,0));
})();
