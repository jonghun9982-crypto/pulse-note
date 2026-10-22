(()=>{'use strict';
const $=id=>document.getElementById(id);
const PK='hc.pulse.v1';
const load=k=>{try{const v=JSON.parse(localStorage.getItem(k));return Array.isArray(v)?v:[]}catch(e){return[]}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const I18=window.hcI18n,t=I18.t;
const pad=n=>String(n).padStart(2,'0');
function fmt(ts){return I18.F.dt(ts)}
function cue(){const r=document.querySelector('.ring');r.classList.add('cue');setTimeout(()=>r.classList.remove('cue'),250)}

/* ---- 1. pulse ---- */
let mode='view',iv=null;
function show(m){mode=m;const has=load(PK).length>0;
 $('pView').classList.toggle('hide',!(m==='view'&&has));$('pEmpty').classList.toggle('hide',!(m==='view'&&!has));
 $('pTimer').classList.toggle('hide',m!=='timer');$('pInput').classList.toggle('hide',m!=='input');
 $('startBtn').classList.toggle('hide',m!=='view');$('pwEmpty').classList.toggle('hide',has);$('week').classList.toggle('hide',!has);$('plEmpty').classList.toggle('hide',has)}
function render(){const recs=load(PK).sort((a,b)=>b.ts-a.ts);
 if(recs[0]){$('bpm').textContent=recs[0].bpm;$('date').textContent=t('recAt',{d:fmt(recs[0].ts)})}
 const ul=$('recent');ul.innerHTML='';
 recs.slice(0,5).forEach(r=>{const li=document.createElement('li');
  li.innerHTML=`<div><b>${r.bpm}</b> <span>${t('bpm')} · ${fmt(r.ts)}</span></div>`;
  const b=document.createElement('button');b.className='tbtn del';b.textContent=t('del');b.setAttribute('aria-label',t('delLbl',{x:t('recDel',{d:fmt(r.ts)})}));
  b.onclick=()=>{if(confirm(t('delConfirm'))){save(PK,load(PK).filter(x=>x.id!==r.id));render();show('view')}};
  li.appendChild(b);ul.appendChild(li)});
 const wk=$('week');wk.innerHTML='';const now=new Date();const days=[];
 for(let i=6;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()-i);const e=d.getTime()+864e5;
  const v=recs.filter(r=>r.ts>=d.getTime()&&r.ts<e).map(r=>r.bpm);days.push({d,avg:v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):null})}
 const vals=days.filter(x=>x.avg).map(x=>x.avg),mx=Math.max(...vals,1),mn=Math.min(...vals,mx);
 days.forEach((x,i)=>{const h=x.avg?30+60*((x.avg-mn)/((mx-mn)||1)):2;
  const el=document.createElement('div');el.className='day';
  el.innerHTML=`<span class="v">${x.avg??''}</span><div class="bar${x.avg?'':' none'}" style="height:${x.avg?(mx===mn?60:h):2}px"></div><span>${i===6?t('today'):I18.F.wd(x.d)}</span>`;
  el.setAttribute('aria-label',t('wkAria',{d:I18.F.md(x.d),v:x.avg?t('wkAvg',{v:x.avg}):t('noRec')}));wk.appendChild(el)})}
function draw(l){$('sec').textContent=l;$('arc').style.strokeDashoffset=439.8*(1-l/15)}
function start(){show('timer');let l=15;$('arc').style.transition='none';draw(15);$('arc').getBoundingClientRect();$('arc').style.transition='';
 $('tMsg').textContent=t('tMsg');vib(80);cue();clearInterval(iv);
 iv=setInterval(()=>{l--;draw(l);if(l<=0){clearInterval(iv);vib([80,80,80]);cue();$('cnt').value='';calc();show('input');setTimeout(()=>$('cnt').focus(),50)}},1000)}
function calc(){const n=parseInt($('cnt').value,10);const ok=n>=1&&n<=60;$('saveBtn').disabled=!ok;
 $('res').textContent=ok?t('cntOk',{v:n*4}):t('cntRange')}
$('cnt').addEventListener('input',calc);$('startBtn').onclick=start;
$('cancelBtn').onclick=()=>{clearInterval(iv);show('view')};$('discardBtn').onclick=()=>show('view');
$('saveBtn').onclick=()=>{const n=parseInt($('cnt').value,10);if(!(n>=1&&n<=60))return;
 const a=load(PK);a.push({id:uid(),ts:Date.now(),bpm:n*4});save(PK,a);render();show('view')};
render();show('view');window.hcPulse=()=>{render();show(mode)};
addEventListener('hc:lang',()=>{render();if(mode==='input')calc();if(reduce.matches)staticView()});

/* ---- 2. animation ---- */
const pB=$('pBelly'),pA=$('pArm'),LB=pB.getTotalLength(),LA=pA.getTotalLength();
const DUR={soft:{b:1500,a:1250},stiff:{b:750,a:1250}};
let am='soft',t0=0,raf=0;
function place(el,p,L,f){const pt=p.getPointAtLength(L*Math.min(f,1));el.setAttribute('cx',pt.x);el.setAttribute('cy',pt.y)}
function frame(t,once){const d=DUR[am],e=t-t0,cyc=Math.max(d.a,d.b)+900;const k=once?Math.min(e,cyc-1):e%cyc;
 place($('dB'),pB,LB,k/d.b);place($('dA'),pA,LA,k/d.a);
 $('endB').setAttribute('opacity',k>=d.b?1:0);$('endA').setAttribute('opacity',k>=d.a?1:0);
 const first=d.b<d.a?I18.t('aBellyS'):I18.t('aWristS');$('aStatus').textContent=k>=Math.min(d.a,d.b)?I18.t('aFirst',{x:first}):I18.t('aGo')}
function loop(t){frame(t,false);raf=requestAnimationFrame(loop)}
function staticView(){cancelAnimationFrame(raf);const d=DUR[am];frame(t0+Math.max(d.a,d.b)+10,true)}
function play(){cancelAnimationFrame(raf);t0=performance.now();
 if(reduce.matches){const step=t=>{frame(t,true);if(t-t0<Math.max(DUR[am].a,DUR[am].b)+100)raf=requestAnimationFrame(step)};raf=requestAnimationFrame(step)}
 else raf=requestAnimationFrame(loop)}
function init(){if(reduce.matches){t0=0;staticView()}else play()}
document.querySelectorAll('#animSeg button').forEach(b=>b.onclick=()=>{am=b.dataset.m;document.querySelectorAll('#animSeg button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));reduce.matches?staticView():play()});
$('replayBtn').onclick=play;reduce.addEventListener?.('change',init);init();
window.__anim={get mode(){return am},DUR};

})();
