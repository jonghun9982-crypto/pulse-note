/* 7-day bar charts for exercise (minutes) and sleep (hours by wake day) — mirrors pulse week chart */
(()=>{'use strict';const $=id=>document.getElementById(id);
const load=k=>{try{const v=JSON.parse(localStorage.getItem(k));return Array.isArray(v)?v:[]}catch(e){return[]}};
const I18=window.hcI18n,t=I18.t;
const days=()=>{const n=new Date(),o=[];for(let i=6;i>=0;i--){const d=new Date(n.getFullYear(),n.getMonth(),n.getDate()-i);
 o.push({d,s:d.getTime(),e:new Date(d.getFullYear(),d.getMonth(),d.getDate()+1).getTime(),i})}return o};
const pad=n=>String(n).padStart(2,'0');
const clk=m=>{m=((Math.round(m)%1440)+1440)%1440;return`${pad(Math.floor(m/60))}:${pad(m%60)}`};
function bars(el,data,lab,aria){if(!el)return;el.innerHTML='';const mx=Math.max(...data.map(x=>x.v),1);
 data.forEach(x=>{const c=document.createElement('div');c.className='day';const h=x.v?Math.max(6,Math.round(80*x.v/mx)):2;
  const dayLab=x.i===0?t('today'):I18.F.wd(x.d);
  c.innerHTML=`<span class="v">${x.v?lab(x.v):''}</span><div class="bar${x.v?'':' none'}" style="height:${h}px"></div><span>${dayLab}</span>`;
  c.setAttribute('aria-label',`${dayLab} ${aria(x.v)}`);el.appendChild(c)})}
function ex(){const a=load('hc.exercise.v1'),D=days().map(d=>({...d,v:a.filter(r=>r&&r.ts>=d.s&&r.ts<d.e).reduce((s,r)=>s+(+r.min||0),0)}));
 const tot=D.reduce((s,x)=>s+x.v,0),has=tot>0;const em=$('exwEmpty'),bd=$('exwBody');if(!em||!bd)return;
 em.classList.toggle('hide',has);bd.classList.toggle('hide',!has);if(!has)return;
 $('exwTotal').textContent=I18.F.hm(tot);
 bars($('exWeek'),D,v=>String(v),v=>v?t('nMin',{n:v}):t('noRec'))}
function sl(){const a=load('hc.sleep.v1').filter(r=>r&&r.end&&r.end>r.start),D=days();
 const rs=a.filter(r=>r.end>=D[0].s&&r.end<D[6].e);
 D.forEach(d=>{d.v=rs.filter(r=>r.end>=d.s&&r.end<d.e).reduce((s,r)=>s+(r.end-r.start)/6e4,0)});
 const has=rs.length>0;const em=$('slwEmpty'),bd=$('slwBody');if(!em||!bd)return;
 em.classList.toggle('hide',has);bd.classList.toggle('hide',!has);if(!has)return;
 const nd=D.filter(d=>d.v>0);$('slwAvg').textContent=I18.F.hm(nd.reduce((s,d)=>s+d.v,0)/nd.length);
 const mins=ts=>{const d=new Date(ts);return d.getHours()*60+d.getMinutes()};
 const bed=rs.map(r=>{const m=mins(r.start);return m<720?m+1440:m}),wake=rs.map(r=>mins(r.end));
 const avg=x=>x.reduce((s,v)=>s+v,0)/x.length;$('slwBed').textContent=clk(avg(bed));$('slwWake').textContent=clk(avg(wake));
 bars($('slWeek'),D,v=>(v/60).toFixed(1),v=>v?I18.F.hm(v):t('noRec'))}
function all(){try{ex()}catch(e){}try{sl()}catch(e){}}
all();window.hcCharts=all;
addEventListener('storage',all);addEventListener('hc:lang',all);addEventListener('hc:exercise',all);addEventListener('hc:sleep',all);
['exList','slList'].forEach(id=>{const n=$(id);n&&new MutationObserver(all).observe(n,{childList:true})});
})();
