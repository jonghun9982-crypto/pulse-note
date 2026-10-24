/* 데이터: 화면 테마 버튼(hc.ui.v1.theme, 헤더) · JSON 내보내기/불러오기 (hc.avatar.v1 포함) */
(()=>{'use strict';const t=window.hcI18n.t,$=id=>document.getElementById(id),UK='hc.ui.v1';
const KEYS=['hc.pulse.v1','hc.exercise.v1','hc.sleep.v1','hc.profile.v1','hc.avatar.v1','hc.ui.v1'],ARR=['hc.pulse.v1','hc.exercise.v1','hc.sleep.v1'];
const ui=()=>{try{const v=JSON.parse(localStorage.getItem(UK));return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch(e){return{}}};
const msg=t=>{$('dmMsg').textContent=t};
/* ---- 테마 ---- */
const ORDER=['auto','light','dark'],LBL={auto:()=>t('thAuto'),light:()=>t('thLight'),dark:()=>t('thDark')};
const ICO={auto:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg>',
 light:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
 dark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>'};
const pref=()=>{const t=ui().theme;return ORDER.includes(t)?t:'auto'};
function paint(p){$('thIco').innerHTML=ICO[p];$('thLbl').textContent=LBL[p]();$('thBtn').setAttribute('aria-label',t('thAria',{p:LBL[p]()}));}
function setTheme(p){const v=ui();v.theme=p;try{localStorage.setItem(UK,JSON.stringify(v))}catch(e){}window.hcTheme&&window.hcTheme(p);paint(p)}
$('thBtn').onclick=()=>setTheme(ORDER[(ORDER.indexOf(pref())+1)%3]);
paint(pref());addEventListener('hc:lang',()=>{paint(pref());msg('')});
/* ---- 내보내기 ---- */
const pad=n=>String(n).padStart(2,'0');
const stamp=()=>{const d=new Date();return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`};
function build(){const data={};KEYS.forEach(k=>{const s=localStorage.getItem(k);if(s==null)return;try{data[k]=JSON.parse(s)}catch(e){}});
 const text=JSON.stringify({app:'maekbak-note',format:1,exportedAt:new Date().toISOString(),data},null,2);
 return {name:`maekbak-note-backup-${stamp()}.json`,text,blob:new Blob([text],{type:'application/json'})}}
const count=d=>ARR.reduce((t,k)=>t+(Array.isArray(d[k])?d[k].length:0),0);
const canFile=()=>{try{return !!(navigator.canShare&&navigator.share&&navigator.canShare({files:[new File(['{}'],'t.json',{type:'application/json'})]}))}catch(e){return false}};
async function share(b){const f=new File([b.blob],b.name,{type:'application/json'});await navigator.share({files:[f],title:b.name});msg(t('shareMsg'))}
$('expBtn').onclick=async()=>{const b=build();window.hcLastExport=b.text;
 try{const a=document.createElement('a');if(!('download' in a))throw 0;const u=URL.createObjectURL(b.blob);a.href=u;a.download=b.name;a.rel='noopener';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),30000);
  msg(t('expOk',{f:b.name,n:count(JSON.parse(b.text).data)}))}
 catch(e){if(canFile()){try{await share(b)}catch(er){if(er&&er.name!=='AbortError')msg(t('expFail'))}}else msg(t('expNo'))}};
if(canFile()){$('shareBtn').classList.remove('hide');$('shareBtn').onclick=async()=>{try{await share(build())}catch(e){if(e&&e.name!=='AbortError')msg(t('shareFail'))}}}
/* ---- 불러오기 ---- */
function validate(j){const d=j&&typeof j==='object'&&j.data&&typeof j.data==='object'?j.data:j;
 if(!d||typeof d!=='object'||Array.isArray(d))throw 0;const out={};let any=false;
 for(const k of KEYS){if(!(k in d))continue;const v=d[k];
  if(ARR.includes(k)){if(!Array.isArray(v)||!v.every(r=>r&&typeof r==='object'))throw 0}
  else if(k==='hc.avatar.v1'&&v!==null&&!(v&&typeof v==='object'&&typeof v.dataUrl==='string'&&/^data:image\/(jpeg|png|webp);base64,/.test(v.dataUrl)))throw 0;
  else if(v!==null&&(typeof v!=='object'||Array.isArray(v)))throw 0;out[k]=v;any=true}
 if(!any)throw 0;return out}
$('impBtn').onclick=()=>{$('impFile').value='';$('impFile').click()};
$('impFile').onchange=async()=>{const f=$('impFile').files[0];if(!f)return;let d;
 try{d=validate(JSON.parse((await f.text()).replace(/^\ufeff/,'')))}catch(e){msg(t('impBad'));return}
 const n=k=>Array.isArray(d[k])?d[k].length:0;
 if(!confirm(t('impAsk',{p:n('hc.pulse.v1'),e:n('hc.exercise.v1'),s:n('hc.sleep.v1'),x:(d['hc.profile.v1']?t('impPf'):'')+(d['hc.avatar.v1']?t('impAv'):'')}))){msg(t('impCancel'));return}
 try{for(const [k,v] of Object.entries(d)){if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,JSON.stringify(v))}
  const u=ui();u.dm=true;localStorage.setItem(UK,JSON.stringify(u));
  sessionStorage.setItem('hc.dm.msg',t('impOk',{n:count(d)}))}catch(e){msg(t('saveFail'));return}
 location.reload()};
const pm=sessionStorage.getItem('hc.dm.msg');if(pm){sessionStorage.removeItem('hc.dm.msg');document.querySelector('.tabbar [data-t=tabSet]')?.click();msg(pm)}

/* ---- My Sleep 파일 불러오기 (병합, hc.sleep.v1에 추가만) ---- */
const msMsg=x=>{$('msMsg').textContent=x};
function msParse(text){text=text.replace(/^\ufeff/,'').trim();let raw=[];
 if(/^[\[{]/.test(text)){const j=JSON.parse(text);const a=Array.isArray(j)?j:(j&&j.app==='MySleep'&&Array.isArray(j.sleep)?j.sleep:null);
  if(!a)throw 0;raw=a.map(r=>[r&&r.sleep,r&&r.wake])}
 else{const P=s=>{const m=String(s||'').trim().replace(/^"|"$/g,'').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{2})/);return m?new Date(+m[1],m[2]-1,+m[3],+m[4],+m[5]).getTime():NaN};
  const L=text.split(/\r?\n/).filter(x=>x.trim());let ok=0;
  for(const l of L){const c=l.split(',');const a=P(c[0]);if(isNaN(a))continue;ok++;raw.push([a,c[1]&&c[1].trim()?P(c[1]):null])}
  if(!ok)throw 0}
 const ms=v=>v==null||v===''?NaN:(typeof v==='number'?v:Date.parse(v));
 return raw.map(([a,b])=>({start:ms(a),end:ms(b)})).filter(r=>!isNaN(r.start)&&!isNaN(r.end)&&r.end>r.start&&r.end-r.start<=864e5)}
function msMerge(list){let cur=[];try{cur=JSON.parse(localStorage.getItem('hc.sleep.v1'))||[]}catch(e){}if(!Array.isArray(cur))cur=[];
 const add=[];let skip=0;const all=cur.slice();
 for(const r of list){const dup=all.some(x=>x&&x.start&&(Math.floor(x.start/6e4)===Math.floor(r.start/6e4)||(x.end&&Math.min(x.end,r.end)-Math.max(x.start,r.start)>0.5*Math.min(x.end-x.start,r.end-r.start))));
  if(dup){skip++;continue}const n={id:'ms-'+r.start.toString(36)+'-'+Math.random().toString(36).slice(2,6),start:r.start,end:r.end};add.push(n);all.push(n)}
 return {cur,add,skip}}
window.hcMySleep={parse:msParse,merge:msMerge};
$('msImpBtn').onclick=()=>{$('msFile').value='';$('msFile').click()};
$('msFile').onchange=async()=>{const f=$('msFile').files[0];if(!f)return;let list;
 try{list=msParse(await f.text())}catch(e){msMsg(t('msBad'));return}
 const {cur,add,skip}=msMerge(list);
 if(!add.length){msMsg(t('msNone',{m:skip}));return}
 if(!confirm(t('msAsk',{n:add.length}))){msMsg(t('impCancel'));return}
 try{localStorage.setItem('hc.sleep.v1',JSON.stringify(cur.concat(add).sort((a,b)=>b.start-a.start)));sessionStorage.setItem('hc.ms.msg',t('msOk',{n:add.length,m:skip}))}catch(e){msMsg(t('saveFail'));return}
 location.reload()};
const mm=sessionStorage.getItem('hc.ms.msg');if(mm){sessionStorage.removeItem('hc.ms.msg');document.querySelector('.tabbar [data-t=tabSet]')?.click();msMsg(mm)}
})();
