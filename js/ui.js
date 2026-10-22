/* collapsible chart/record cards: hints + open state in hc.ui.v1 */
(()=>{const UK='hc.ui.v1',$=id=>document.getElementById(id);
const load=k=>{try{const v=JSON.parse(localStorage.getItem(k));return Array.isArray(v)?v:[]}catch(e){return[]}};
const st=()=>{try{const v=JSON.parse(localStorage.getItem(UK));return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch(e){return{}}};
const hm=m=>{m=Math.round(m);return m>=60?`${Math.floor(m/60)}시간${m%60?' '+(m%60)+'분':''}`:`${m}분`};
const wk=()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate()-6).getTime()};
function hints(){const s=wk(),P=load('hc.pulse.v1'),E=load('hc.exercise.v1'),S=load('hc.sleep.v1');
 const set=(id,t)=>{const e=$(id);if(e)e.textContent=t};
 const p7=P.filter(r=>r.ts>=s);set('pwHint',p7.length?`최근 7일 · 평균 ${Math.round(p7.reduce((t,r)=>t+r.bpm,0)/p7.length)}회/분`:'최근 7일 · 기록 없음');
 set('plHint',P.length?`기록 ${P.length}개`:'기록 없음');
 const e7=E.filter(r=>r.ts>=s).reduce((t,r)=>t+(+r.min||0),0);set('exwHint',e7?`최근 7일 · 합계 ${hm(e7)}`:'최근 7일 · 기록 없음');
 set('exlHint',E.length?`기록 ${E.length}개`:'기록 없음');
 const s7=S.filter(r=>r.end&&r.end>r.start&&r.end>=s);set('slwHint',s7.length?`최근 7일 · 평균 ${hm(s7.reduce((t,r)=>t+(r.end-r.start)/6e4,0)/s7.length)}`:'최근 7일 · 기록 없음');
 set('sllHint',S.length?`기록 ${S.length}개`:'기록 없음')}
const o=st();
document.querySelectorAll('details.fold[data-k]').forEach(d=>{d.open=o[d.dataset.k]===true;
 d.addEventListener('toggle',()=>{const v=st();v[d.dataset.k]=d.open;try{localStorage.setItem(UK,JSON.stringify(v))}catch(e){}
  if(d.open){try{window.hcCharts&&window.hcCharts()}catch(e){}try{window.hcPulse&&window.hcPulse()}catch(e){}}hints()})});
hints();addEventListener('hc:exercise',hints);addEventListener('storage',hints);
['recent','exList','slList'].forEach(id=>{const n=$(id);n&&new MutationObserver(hints).observe(n,{childList:true})});
})();
