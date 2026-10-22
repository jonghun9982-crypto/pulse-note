(()=>{'use strict';
const $=id=>document.getElementById(id),K='hc.profile.v1';
const tabs=[...document.querySelectorAll('.tabbar [role=tab]')];
const show=id=>{tabs.forEach(b=>{const on=b.dataset.t===id;b.setAttribute('aria-selected',on);$(b.dataset.t).classList.toggle('hide',!on)});scrollTo(0,0)};
tabs.forEach(b=>b.onclick=()=>show(b.dataset.t));
const seg=[...$('sexSeg').querySelectorAll('button')];let sex='';
const setSex=v=>{sex=v||'';seg.forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===sex))};
seg.forEach(b=>b.onclick=()=>setSex(b.dataset.v));
const num=(el,lo,hi)=>{const v=parseFloat(el.value);return isFinite(v)&&v>=lo&&v<=hi?v:null};
const bmi=p=>{const c=$('bmiCard');if(p&&p.heightCm&&p.weightKg){const m=p.heightCm/100;$('bmiVal').textContent=`BMI ${(p.weightKg/(m*m)).toFixed(1)} (참고용)`;c.classList.remove('hide')}else c.classList.add('hide')};
let p=null;try{p=JSON.parse(localStorage.getItem(K))}catch(e){}
if(p&&typeof p==='object'){if(p.age!=null)$('age').value=p.age;if(p.heightCm!=null)$('ht').value=p.heightCm;if(p.weightKg!=null)$('wt').value=p.weightKg;setSex(p.sex)}else p=null;
bmi(p);
$('pfSave').onclick=()=>{const d={age:num($('age'),1,120),sex:sex||null,heightCm:num($('ht'),50,250),weightKg:num($('wt'),10,300),savedAt:Date.now()};
 try{localStorage.setItem(K,JSON.stringify(d));$('pfMsg').textContent='저장했어요.'}catch(e){$('pfMsg').textContent='저장하지 못했어요.'}bmi(d)};
})();
