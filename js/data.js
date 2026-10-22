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
})();
