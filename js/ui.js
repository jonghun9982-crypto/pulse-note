/* collapsible pulse chart/record cards: hints + open state in hc.ui.v1 */
(()=>{const t=window.hcI18n.t,UK='hc.ui.v1',$=id=>document.getElementById(id);
const load=k=>{try{const v=JSON.parse(localStorage.getItem(k));return Array.isArray(v)?v:[]}catch(e){return[]}};
const st=()=>{try{const v=JSON.parse(localStorage.getItem(UK));return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch(e){return{}}};
const wk=()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate()-6).getTime()};
function hints(){const s=wk(),P=load('hc.pulse.v1');
 const set=(id,t)=>{const e=$(id);if(e)e.textContent=t};
 const p7=P.filter(r=>r.ts>=s);set('pwHint',p7.length?t('pwHint',{v:Math.round(p7.reduce((a,r)=>a+r.bpm,0)/p7.length)}):t('pwNone'));
 set('plHint',P.length?t('nRec',{n:P.length}):t('noRec'))}
const o=st();
document.querySelectorAll('details.fold[data-k]').forEach(d=>{d.open=o[d.dataset.k]===true;
 d.addEventListener('toggle',()=>{const v=st();v[d.dataset.k]=d.open;try{localStorage.setItem(UK,JSON.stringify(v))}catch(e){}
  if(d.open){try{window.hcPulse&&window.hcPulse()}catch(e){}}hints()})});
hints();addEventListener('storage',hints);addEventListener('hc:lang',hints);
['recent'].forEach(id=>{const n=$(id);n&&new MutationObserver(hints).observe(n,{childList:true})});
})();
