(()=>{'use strict';
const $=id=>document.getElementById(id),K='hc.profile.v1';
const tabs=[...document.querySelectorAll('.tabbar [role=tab]')];
const t=window.hcI18n.t,UK='hc.ui.v1',ui=()=>{try{const v=JSON.parse(localStorage.getItem(UK));return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch(e){return{}}};
const show=(id,keep)=>{if(!tabs.some(b=>b.dataset.t===id))id=tabs[0].dataset.t;tabs.forEach(b=>{const on=b.dataset.t===id;b.setAttribute('aria-selected',on);$(b.dataset.t).classList.toggle('hide',!on)});scrollTo(0,0);
 if(keep!==false){const v=ui();v.tab=id;try{localStorage.setItem(UK,JSON.stringify(v))}catch(e){}}};
tabs.forEach(b=>b.onclick=()=>show(b.dataset.t));
/* 처음 열면 첫 탭(프로필), 그다음부터는 마지막에 본 탭 (hc.ui.v1.tab) */
show(ui().tab||tabs[0].dataset.t,false);
const seg=[...$('sexSeg').querySelectorAll('button')];let sex='';
const setSex=v=>{sex=v||'';seg.forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===sex))};
seg.forEach(b=>b.onclick=()=>setSex(b.dataset.v));
const num=(el,lo,hi)=>{const v=parseFloat(el.value);return isFinite(v)&&v>=lo&&v<=hi?v:null};
const bmi=p=>{const c=$('bmiCard');if(p&&p.heightCm&&p.weightKg){const m=p.heightCm/100;$('bmiVal').textContent=t('bmiVal',{v:(p.weightKg/(m*m)).toFixed(1)});c.classList.remove('hide')}else c.classList.add('hide')};
let p=null;try{p=JSON.parse(localStorage.getItem(K))}catch(e){}
if(p&&typeof p==='object'){if(p.age!=null)$('age').value=p.age;if(p.heightCm!=null)$('ht').value=p.heightCm;if(p.weightKg!=null)$('wt').value=p.weightKg;setSex(p.sex)}else p=null;
bmi(p);
$('pfSave').onclick=()=>{const d={age:num($('age'),1,120),sex:sex||null,heightCm:num($('ht'),50,250),weightKg:num($('wt'),10,300),savedAt:Date.now()};
 try{localStorage.setItem(K,JSON.stringify(d));$('pfMsg').textContent=t('saved')}catch(e){$('pfMsg').textContent=t('saveFail')}bmi(d)};
/* ---- 프로필 사진 (hc.avatar.v1 = {dataUrl, savedAt}) — 이 기기에만, 동기화 안 해요 ---- */
const AK='hc.avatar.v1',S=256;
const avGet=()=>{try{const v=JSON.parse(localStorage.getItem(AK));return v&&typeof v.dataUrl==='string'&&/^data:image\//.test(v.dataUrl)?v:null}catch(e){return null}};
function avShow(){const v=avGet(),i=$('avImg');if(v){i.src=v.dataUrl;i.classList.remove('hide');$('avPh').classList.add('hide')}else{i.removeAttribute('src');i.classList.add('hide');$('avPh').classList.remove('hide')}
 $('avDel').classList.toggle('hide',!v);$('avSet').textContent=v?t('avChange'):t('avPick')}
function loadImg(f){return new Promise((ok,no)=>{const u=URL.createObjectURL(f),i=new Image();i.onload=()=>{ok(i);setTimeout(()=>URL.revokeObjectURL(u),1000)};i.onerror=()=>{URL.revokeObjectURL(u);no()};i.src=u})}
$('avFile').onchange=async()=>{const f=$('avFile').files[0];$('avFile').value='';if(!f)return;const m=$('avMsg');
 try{const i=await loadImg(f),w=i.naturalWidth,h=i.naturalHeight,z=Math.min(w,h);if(!z)throw 0;
  const c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,S,S);
  x.drawImage(i,(w-z)/2,(h-z)/2,z,z,0,0,S,S);let d=c.toDataURL('image/jpeg',.85);if(d.length>120000)d=c.toDataURL('image/jpeg',.7);
  localStorage.setItem(AK,JSON.stringify({dataUrl:d,savedAt:Date.now()}));avShow();m.textContent=t('avSaved')}
 catch(e){m.textContent=t('avFail')}};
$('avDel').onclick=()=>{if(!confirm(t('avConfirm')))return;localStorage.removeItem(AK);avShow();$('avMsg').textContent=t('avGone')};
avShow();window.hcAvatar=avShow;
addEventListener('hc:lang',()=>{avShow();let q=null;try{q=JSON.parse(localStorage.getItem(K))}catch(e){}bmi(q&&typeof q==='object'?q:null);$('pfMsg').textContent='';$('avMsg').textContent=t('avLocal')});
})();
