/* 안정 시 맥박 참고 자료: range bars (Ostchega 2011), AHA 60–100 band, KNHANES means */
(()=>{'use strict';const $=id=>document.getElementById(id);
const N={male:[['20–39세',71,52,89],['40–59세',71,52,90],['60–79세',70,50,91],['80세 이상',71,51,94]],
 female:[['20–39세',76,57,95],['40–59세',73,56,92],['60–79세',73,56,92],['80세 이상',73,56,93]]};
const KR={male:68.2,female:69.8},LO=40,HI=110,X=v=>((Math.min(HI,Math.max(LO,v))-LO)/(HI-LO)*100).toFixed(2)+'%';
const get=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}};
const band=a=>a>=80?3:a>=60?2:a>=40?1:a>=20?0:-1;
let sex='male',fixed=false;
function avg(){const P=(get('hc.pulse.v1')||[]).filter(r=>r&&isFinite(r.bpm)&&isFinite(r.ts)).sort((a,b)=>b.ts-a.ts);if(!P.length)return null;
 const n=new Date(),s=new Date(n.getFullYear(),n.getMonth(),n.getDate()-6).getTime();let u=P.filter(r=>r.ts>=s),lab='최근 7일';
 if(!u.length){u=P.slice(0,5);lab=`최근 ${u.length}회`}return{v:Math.round(u.reduce((t,r)=>t+r.bpm,0)/u.length),lab}}
function render(){const p=get('hc.profile.v1')||{},b=isFinite(p.age)&&p.age!=null?band(p.age):-1;
 fixed=(p.sex==='male'||p.sex==='female')&&b>=0;if(fixed)sex=p.sex;
 $('rSex').classList.toggle('hide',fixed);$('rSex').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.v===sex));
 const a=avg(),rows=N[sex],sx=sex==='male'?'남성':'여성';
 let g=`<div class="rband" style="left:${X(60)};width:calc(${X(100)} - ${X(60)})"><span>성인 일반 범위</span></div>`;
 rows.forEach((r,i)=>{const on=i===b&&fixed;g+=`<div class="rrow${on?' on':''}"><span class="rl">${r[0]}${on?'<em>내 연령대</em>':''}</span><div class="rt">`+
  `<div class="rbar" style="left:${X(r[2])};width:calc(${X(r[3])} - ${X(r[2])})"></div><div class="rtick" style="left:${X(r[1])}"></div>`+
  (on&&a?`<div class="rdot" style="left:${X(a.v)}"></div>`:'')+`<span class="rn">${r[2]}–${r[3]} · 평균 ${r[1]}</span></div></div>`});
 if(a&&!(fixed&&b>=0))g+=`<div class="rrow mine"><span class="rl">나</span><div class="rt"><div class="rdot" style="left:${X(a.v)}"></div></div></div>`;
 g+=`<div class="raxis">${[40,60,80,100].map(v=>`<span style="left:${X(v)}">${v}</span>`).join('')}<span class="u" style="left:100%">회/분</span></div>`;
 $('rChart').innerHTML=g;
 const m=$('rMine');
 if(!a)m.innerHTML='<span class="rempty">맥박을 세면 여기에 표시돼요</span>';
 else m.innerHTML=`<span class="dotk"></span>내 최근 평균 <b>${a.v}회</b> <small>(${a.lab})</small>`+(fixed?`<br><span class="sub">같은 연령대 평균 ${rows[b][1]}회 (${sx} ${rows[b][0]})</span>`:'');
 $('rKr').textContent=`미국 NHANES 1999–2008 · ${sx}. 한국 성인 ${sx} 평균은 ${KR[sex]}회예요 (KNHANES 2011–2014).`}
$('rSex').querySelectorAll('button').forEach(x=>x.onclick=()=>{sex=x.dataset.v;render()});
render();addEventListener('storage',render);
const r=$('recent');r&&new MutationObserver(render).observe(r,{childList:true});
const pf=$('pfSave');pf&&pf.addEventListener('click',()=>setTimeout(render,0));
})();
