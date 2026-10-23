/* 운동(hc.exercise.v1) · 수면(hc.sleep.v1): routines, toggle, lists, visual reference cards */
(()=>{'use strict';const $=id=>document.getElementById(id),EK='hc.exercise.v1',SK='hc.sleep.v1';
const load=k=>{try{const v=JSON.parse(localStorage.getItem(k));return Array.isArray(v)?v:[]}catch(e){return[]}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const I18=window.hcI18n,t=I18.t,pad=n=>String(n).padStart(2,'0');
const fmt=ts=>I18.F.dt(ts);
const dur=ms=>I18.F.hm(ms/6e4);
const hm=m=>I18.F.hm(m);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const wk=()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate()-6).getTime()};
const prof=()=>{try{return JSON.parse(localStorage.getItem('hc.profile.v1'))||{}}catch(e){return{}}};
function delBtn(label,fn){const b=document.createElement('button');b.className='tbtn del';b.textContent=t('del');b.setAttribute('aria-label',t('delLbl',{x:label}));b.onclick=()=>{if(confirm(t('delConfirm')))fn()};return b}
const P=(v,max)=>(Math.min(max,Math.max(0,v))/max*100).toFixed(2)+'%';

/* ---- routines ---- */
/* 루틴: 저장은 id만, 이름·단계는 i18n (r_<id>, rs_<id>) */
const R=[{id:'stretch',min:3},{id:'stairs',min:6},{id:'walk',min:9}];
R.forEach(r=>{Object.defineProperty(r,'name',{get:()=>t('r_'+r.id)});Object.defineProperty(r,'steps',{get:()=>t('rs_'+r.id)})});
const RN=id=>I18.D['r_'+id]?t('r_'+id):null;
let cur=null,left=0,rIv=null,running=false;
function chips(){$('chips').innerHTML='';R.forEach(r=>{const b=document.createElement('button');b.className='chip';b.dataset.gc='routine-'+r.id;b.innerHTML=`<b>${t('nMin',{n:r.min})}</b>${r.name}`;b.onclick=()=>open(r);$('chips').appendChild(b)})}chips();
function clock(){$('clock').textContent=`${pad(Math.floor(left/60))}:${pad(left%60)}`;
 const per=cur.min*60/cur.steps.length,idx=Math.min(cur.steps.length-1,Math.floor((cur.min*60-left)/per));
 [...$('steps').children].forEach((li,i)=>li.classList.toggle('cur',running&&i===idx))}
function stopT(){clearInterval(rIv);running=false;$('goBtn').textContent=left<cur.min*60&&left>0?t('resume'):t('start')}
function open(r){cur=r;left=r.min*60;sheetText();
 $('savedMsg').classList.add('hide');$('doneBtn').disabled=false;stopT();clock();$('sheet').classList.remove('hide');$('closeBtn').focus()}
function sheetText(){if(!cur)return;$('sTitle').textContent=t('rTitle',{n:cur.min,x:cur.name});$('steps').innerHTML=cur.steps.map(s=>`<li>${s}</li>`).join('');if(running)$('goBtn').textContent=t('pause');else if(left<=0)$('goBtn').textContent=t('restart');else stopT();clock()}
function close(){stopT();$('sheet').classList.add('hide')}
$('goBtn').onclick=()=>{if(running){stopT();clock();return}if(left<=0)left=cur.min*60;running=true;$('goBtn').textContent=t('pause');vib(60);clock();
 rIv=setInterval(()=>{left--;clock();if(left<=0){stopT();vib([80,80,80]);$('goBtn').textContent=t('restart')}},1000)};
$('doneBtn').onclick=()=>{const a=load(EK);a.push({id:uid(),ts:Date.now(),routine:cur.id,min:cur.min});save(EK,a);$('savedMsg').classList.remove('hide');$('doneBtn').disabled=true;stopT();exRender()};
$('closeBtn').onclick=close;$('sheet').addEventListener('click',e=>{if(e.target.id==='sheet')close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('sheet').classList.contains('hide'))close()});

/* ---- exercise list + card (routine | type:'strength' | type:'cardio') ---- */
const n0=v=>{const x=parseFloat(v);return isFinite(x)&&x>0?x:null};
const today=()=>{const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
const dts=v=>{if(!v||v===today())return Date.now();const [y,m,d]=v.split('-').map(Number);return new Date(y,m-1,d,12,0).getTime()};
const dayk=ts=>{const d=new Date(ts);return d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()};
const fmtD=ts=>I18.F.d(ts);
/* 빠른 칩 이름은 그대로 저장하고, 화면에서는 지금 언어로 보여요 */
const QN=s=>{const k=I18.key(s);return k&&/^q_/.test(k)?t(k):s};
function desc(r){if(r.type==='strength')return{tag:`<span class="tag tg-s">${t('str')}</span>`,name:r.name?QN(r.name):t('str'),sub:[r.sets&&r.reps?t('setsReps',{s:r.sets,r:r.reps}):'',r.kg?`${r.kg}kg`:'',fmtD(r.ts)].filter(Boolean).join(' · ')};
 if(r.type==='cardio')return{tag:`<span class="tag tg-c">${t('car')}</span>`,name:r.name?QN(r.name):t('car'),sub:[r.min?t('nMin',{n:r.min}):'',r.km?`${r.km}km`:'',fmtD(r.ts)].filter(Boolean).join(' · ')};
 return{tag:`<span class="tag tg-r">${t('routine')}</span>`,name:RN(r.routine)||r.routine||t('exercise'),sub:(r.min?t('nMin',{n:r.min})+' · ':'')+fmt(r.ts)}}
function exRender(){const a=load(EK).filter(r=>r&&isFinite(r.ts)).sort((x,y)=>y.ts-x.ts),ul=$('exList');ul.innerHTML='';$('exEmpty').classList.toggle('hide',a.length>0);
 a.slice(0,30).forEach(r=>{const li=document.createElement('li'),d=desc(r);li.innerHTML=`<div>${d.tag}<b>${esc(d.name)}</b> <span>${esc(d.sub)}</span></div>`;
  li.appendChild(delBtn(t('exLog',{x:d.name+' '+fmtD(r.ts)}),()=>{save(EK,load(EK).filter(x=>x.id!==r.id));exRender()}));ul.appendChild(li)});
 const ns=a.filter(r=>r.type==='strength').length,nc=a.filter(r=>r.type==='cardio').length;
 $('exlHint').textContent=a.length?t('nRec',{n:a.length})+(ns||nc?t('exHint',{s:ns,c:nc}):''):t('noRec');
 const s0=new Date();s0.setHours(0,0,0,0);const n=a.filter(x=>x.ts>=s0.getTime()).length;$('exDone').textContent=n?t('exToday',{n}):'';
 const w=a.filter(r=>r.ts>=wk()),wm=w.filter(r=>r.type!=='strength'&&+r.min>0),tot=wm.reduce((t,r)=>t+(+r.min||0),0),max=Math.max(360,Math.ceil(tot*1.1/60)*60),bar=$('exvBar');
 const sd=new Set(w.filter(r=>r.type==='strength').map(r=>dayk(r.ts))).size;
 $('exaSHint').textContent=t('sHint',{n:sd});$('exaCHint').textContent=t('cHint',{n:w.filter(r=>r.type==='cardio').reduce((a,r)=>a+(+r.min||0),0)});
 let g=`<div class="tr"></div><div class="bd" style="left:${P(150,max)};width:calc(${P(300,max)} - ${P(150,max)})"><span>${t('rec150')}</span></div>`;
 if(wm.length)g+=`<div class="fill" style="width:${P(tot,max)}"></div><div class="rdot" style="left:${P(tot,max)}"></div>`;
 g+=[0,150,300,max].filter((v,i,x)=>x.indexOf(v)===i).map(v=>`<span class="ax" style="left:${P(v,max)}">${v}${v===max?(I18.lang==='en'?' ':'')+t('min'):''}</span>`).join('');
 bar.innerHTML=g;
 $('exvMine').innerHTML=(wm.length?`<span class="dotk"></span>`+t('exvMine',{n:tot}):`<span class="rempty">${t('exvEmpty')}</span>`)+`<br><span class="sub">${t('sHint',{n:sd})}</span>`};try{dispatchEvent(new Event('hc:exercise'))}catch(e){}
const qsync=[];document.querySelectorAll('.qchips').forEach(q=>{const inp=$(q.dataset.for),sync=()=>q.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===inp.value.trim())));qsync.push(sync);
 q.querySelectorAll('button').forEach(b=>b.onclick=()=>{inp.value=b.textContent;sync()});inp.addEventListener('input',sync);sync()});
['sDate','cDate'].forEach(id=>{$(id).value=today();$(id).max=today()});
function addEx(rec,msg,ids){const a=load(EK);a.push(Object.assign({id:uid()},rec));save(EK,a);ids.forEach(id=>{$(id).value=''});
 document.querySelectorAll('.qchips button').forEach(b=>b.setAttribute('aria-pressed','false'));$(msg).textContent=t('exSaved');vib(40);exRender()}
$('sSave').onclick=()=>{const name=$('sName').value.trim(),sets=n0($('sSets').value),reps=n0($('sReps').value),kg=n0($('sKg').value);
 if(!name||!sets||!reps){$('sMsg').textContent=t('sNeed');return}
 const r={type:'strength',ts:dts($('sDate').value),name,sets:Math.round(sets),reps:Math.round(reps)};if(kg)r.kg=kg;addEx(r,'sMsg',['sName','sSets','sReps','sKg'])};
$('cSave').onclick=()=>{const name=$('cName').value.trim(),min=n0($('cMin').value),km=n0($('cKm').value);
 if(!name||!min){$('cMsg').textContent=t('cNeed');return}
 const r={type:'cardio',ts:dts($('cDate').value),name,min:Math.round(min)};if(km)r.km=km;addEx(r,'cMsg',['cName','cMin','cKm'])};
exRender();

/* ---- sleep ---- */
/* NSF 권장(시간) · 한국 평균(분, 2024 생활시간조사) — 라벨은 i18n */
const NA=i=>t('nsfAge')[i],KA=i=>t('krAge',{a:t('krAges')[i]});
const NSF=a=>a==null||!isFinite(a)?[7,9,t('adultStd'),1]:a<=2?[11,14,NA(0)]:a<=5?[10,13,NA(1)]:a<=13?[9,11,NA(2)]:a<=17?[8,10,NA(3)]:a<=25?[7,9,NA(4)]:a<=64?[7,9,NA(5)]:[7,8,NA(6)];
const KR=a=>a==null||!isFinite(a)||a<10?[481,t('krAll')]:a<20?[517,KA(0)]:a<30?[506,KA(1)]:a<40?[486,KA(2)]:a<50?[472,KA(3)]:a<60?[460,KA(4)]:[478,KA(5)];
let tick=null;
function slCard(a){const p=prof(),age=p&&p.age!=null&&isFinite(p.age)?+p.age:null,[lo,hi,lab,isAd]=NSF(age),[kr,krl]=KR(age);
 let d=a.filter(r=>r.end&&r.end>r.start&&r.end>=wk());if(!d.length)d=a.filter(r=>r.end&&r.end>r.start).slice(0,7);
 const avg=d.length?d.reduce((t,r)=>t+(r.end-r.start)/6e4,0)/d.length:null,max=Math.max(12*60,(hi+2)*60,avg?Math.ceil(avg/60+1)*60:0);
 let g=`<div class="tr"></div><div class="bd" style="left:${P(lo*60,max)};width:calc(${P(hi*60,max)} - ${P(lo*60,max)})"><span>${t('recH',{a:lo,b:hi})}</span></div>`;
 g+=`<div class="rtick" style="left:${P(kr,max)}"></div>`;
 if(avg!=null)g+=`<div class="fill" style="width:${P(avg,max)}"></div><div class="rdot" style="left:${P(avg,max)}"></div>`;
 for(let h=0;h<=max/60;h+=3)g+=`<span class="ax" style="left:${P(h*60,max)}">${h}${h*60>max-180?'h':''}</span>`;
 $('slvBar').innerHTML=g;$('slvKeyBand').textContent=t('recHK',{a:lo,b:hi,l:lab});$('slvKeyKr').textContent=krl;
 const krt=`${krl} ${hm(kr)}`;
 $('slvMine').innerHTML=(avg!=null?`<span class="dotk"></span>`+t('slMine',{v:hm(avg),a:lo,b:hi})+`<br><span class="sub">${krt}</span>`:`<span class="rempty">${t('slEmpty')}</span><br><span class="sub">${t('recH',{a:lo,b:hi})} · ${krt}</span>`)+(isAd?`<br><span class="sub">${t('slAdult')}</span>`:'')}
function slRender(){const a=load(SK).filter(r=>r&&isFinite(r.start)).sort((x,y)=>y.start-x.start),op=a.find(r=>!r.end);
 $('slToggle').textContent=op?t('wakeBtn'):t('slBtn');$('slToggle').classList.toggle('on',!!op);$('slToggle').setAttribute('aria-label',op?t('wakeAria'):t('slAria'));
 $('slIcon').classList.toggle('on',!!op);$('slIcon').setAttribute('aria-label',op?t('asleep'):t('awakeA'));
 $('slState').textContent=op?t('asleep'):t('awake');$('slSince').textContent=op?t('since',{d:fmt(op.start),x:dur(Date.now()-op.start)}):'';
 const ul=$('slList');ul.innerHTML='';$('slEmpty').classList.toggle('hide',a.length>0);$('sllHint').textContent=a.length?t('nRec',{n:a.length}):t('noRec');
 a.slice(0,20).forEach(r=>{const li=document.createElement('li');
  li.innerHTML=r.end?`<div><b>${dur(r.end-r.start)}</b> <span>${fmt(r.start)} ~ ${fmt(r.end)}</span></div>`:`<div><b>${t('asleep')}</b> <span>${t('sinceS',{d:fmt(r.start)})}</span></div>`;
  li.appendChild(delBtn(t('slLog',{d:fmt(r.start)}),()=>{save(SK,load(SK).filter(x=>x.id!==r.id));slRender()}));ul.appendChild(li)});
 window.hcSleep&&window.hcSleep(!!op);
 slCard(a);try{dispatchEvent(new Event('hc:sleep'))}catch(e){}clearInterval(tick);if(op)tick=setInterval(slRender,60000)}
$('slToggle').onclick=()=>{const a=load(SK),op=a.find(r=>!r.end),now=Date.now();
 if(op)op.end=Math.max(now,op.start);else a.push({id:uid(),start:now,end:null});save(SK,a);slRender()};
slRender();
const all=()=>{exRender();slRender()};addEventListener('storage',all);
addEventListener('hc:lang',()=>{chips();all();qsync.forEach(f=>f());if(!$('sheet').classList.contains('hide'))sheetText();['sMsg','cMsg'].forEach(id=>{$(id).textContent=''})});
const pf=$('pfSave');pf&&pf.addEventListener('click',()=>setTimeout(all,0));
})();
