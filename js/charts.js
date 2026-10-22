/* 7-day charts for exercise (hc.exercise.v1) and sleep (hc.sleep.v1) — no libraries */
(()=>{const $=id=>document.getElementById(id),DW=['일','월','화','수','목','금','토'];
const load=k=>{try{const v=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}};
const pad=n=>String(n).padStart(2,'0');
const days=()=>{const n=new Date(),o=[];for(let i=6;i>=0;i--){const d=new Date(n.getFullYear(),n.getMonth(),n.getDate()-i);o.push({d,s:d.getTime(),e:new Date(d.getFullYear(),d.getMonth(),d.getDate()+1).getTime(),i})}return o};
const hm=m=>{m=Math.round(m);return m>=60?`${Math.floor(m/60)}시간${m%60?' '+(m%60)+'분':''}`:`${m}분`};
const clk=m=>{m=((Math.round(m)%1440)+1440)%1440;return`${pad(Math.floor(m/60))}:${pad(m%60)}`};
function bars(el,data,lab,label){el.innerHTML='';const mx=Math.max(...data.map(x=>x.v),1);
 data.forEach(x=>{const c=document.createElement('div');c.className='day';const h=x.v?Math.max(6,Math.round(80*x.v/mx)):2;
  c.innerHTML=`<span class="v">${x.v?lab(x.v):''}</span><div class="bar${x.v?'':' none'}" style="height:${h}px"></div><span>${x.i===0?'오늘':DW[x.d.getDay()]}</span>`;
  c.setAttribute('aria-label',`${x.i===0?'오늘':DW[x.d.getDay()]+'요일'} ${label(x.v)}`);el.appendChild(c)})}
function ex(){const a=load('hc.exercise.v1'),D=days().map(d=>({...d,v:a.filter(r=>r.ts>=d.s&&r.ts<d.e).reduce((t,r)=>t+(+r.min||0),0)}));
 const tot=D.reduce((t,x)=>t+x.v,0),has=tot>0;$('exwEmpty').classList.toggle('hide',has);$('exwBody').classList.toggle('hide',!has);
 if(!has)return;$('exwTotal').textContent=hm(tot);bars($('exWeek'),D,v=>v,v=>v?v+'분':'기록 없음')}
function sl(){const a=load('hc.sleep.v1').filter(r=>r.end&&r.end>r.start),D=days();
 const rs=a.filter(r=>r.end>=D[0].s&&r.end<D[6].e);
 D.forEach(d=>{d.v=rs.filter(r=>r.end>=d.s&&r.end<d.e).reduce((t,r)=>t+(r.end-r.start)/6e4,0)});
 const has=rs.length>0;$('slwEmpty').classList.toggle('hide',has);$('slwBody').classList.toggle('hide',!has);if(!has)return;
 const nd=D.filter(d=>d.v>0);$('slwAvg').textContent=hm(nd.reduce((t,d)=>t+d.v,0)/nd.length);
 const mins=t=>{const d=new Date(t);return d.getHours()*60+d.getMinutes()};
 const bed=rs.map(r=>{const m=mins(r.start);return m<720?m+1440:m}),wake=rs.map(r=>mins(r.end));
 const avg=x=>x.reduce((t,v)=>t+v,0)/x.length;$('slwBed').textContent=clk(avg(bed));$('slwWake').textContent=clk(avg(wake));
 bars($('slWeek'),D,v=>(v/60).toFixed(1),v=>v?hm(v):'기록 없음')}
function all(){try{ex()}catch(e){}try{sl()}catch(e){}}
all();window.hcCharts=all;addEventListener('hc:exercise',all);addEventListener('storage',all);
['exList','slList'].forEach(id=>{const n=$(id);n&&new MutationObserver(all).observe(n,{childList:true})});
})();
