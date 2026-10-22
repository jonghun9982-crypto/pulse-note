/* 로그인 화면 + 설정 탭 (v18): Google 로그인·동기화 + 의견 보내기 — My Sleep(sync.js) 패턴.
   ▶ 연결할 곳은 아래 CONFIG 하나뿐이에요.
     firebase: Firebase 웹 앱 설정 객체 {apiKey,authDomain,projectId,appId,...} (null이면 '준비 중' 상태)
     formUrl : 의견 Google 폼 주소 (예: 'https://forms.gle/...') (null이면 '의견 폼을 준비하고 있어요')
   동기화 범위: 맥박·운동·수면 기록만 (hc.pulse.v1 / hc.exercise.v1 / hc.sleep.v1).
   기본 정보(hc.profile.v1)·프로필 사진(hc.avatar.v1)·화면 설정(hc.ui.v1)·로그인 선택(hc.login.v1)은 이 기기에만 남아요.
   클라우드: Firestore users/{uid}/items/{종류_id} = {k, id, d(JSON 문자열), updatedAt} */
(()=>{'use strict';
const CONFIG={
 firebase:null,
 formUrl:null,
 sdk:'https://www.gstatic.com/firebasejs/10.12.5/'
};
window.hcAccountConfig=CONFIG;
const t=window.hcI18n.t,F_=window.hcI18n.F,$=id=>document.getElementById(id);
const KINDS={pulse:'hc.pulse.v1',exercise:'hc.exercise.v1',sleep:'hc.sleep.v1'};
const LAST='hc.sync.lastSync';
/* ---- 토스트 ---- */
let tt=0;const toast=t=>{const e=$('toast');if(!e)return;e.textContent=t;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),2600)};
window.hcToast=toast;
/* ---- 의견 보내기 ---- */
const fbOk=typeof CONFIG.formUrl==='string'&&/^https:\/\//.test(CONFIG.formUrl);
$('fbExt').classList.toggle('hide',!fbOk);
$('fbBtn').onclick=()=>{if(fbOk){const w=window.open(CONFIG.formUrl,'_blank','noopener');if(!w)location.href=CONFIG.formUrl;$('fbMsg').textContent=''}
 else{toast(t('fbPrep'));$('fbMsg').textContent=t('fbPrep2')}};
/* ---- 상태 표시: 모양 + 글자 (색만으로 구분하지 않아요) ---- */
const ST=s=>t('st_'+s);
/* ---- 로그인 화면 (hc.login.v1 = {mode:'guest'|'google', at}) ---- */
const LK='hc.login.v1';
function choose(mode){try{localStorage.setItem(LK,JSON.stringify({mode,at:Date.now()}))}catch(e){}if(mode==='google')gate(false)}
function gate(on){const d=document.documentElement;if(on){try{localStorage.removeItem(LK)}catch(e){}$('lgMsg').textContent=''}d.classList.toggle('gate',on);scrollTo(0,0)}
window.hcGate=gate;
let F=null,auth=null,db=null,user=null,busy=false,err='',online=navigator.onLine!==false,unsub=null,known=new Map(),applying=false;
const configured=()=>!!(CONFIG.firebase&&CONFIG.firebase.apiKey&&CONFIG.firebase.projectId);
const pad=n=>String(n).padStart(2,'0');
function when(iso){if(!iso)return'';const d=new Date(iso);if(isNaN(d))return'';const n=new Date(),day=x=>new Date(x.getFullYear(),x.getMonth(),x.getDate()).getTime();
 const tm=F_.time(d),dd=(day(n)-day(d))/864e5;
 return dd===0?`${t('today')} ${tm}`:dd===1?`${t('yesterday')} ${tm}`:F_.md(d)}
function state(){if(!configured())return'cfg';if(!online)return'off';if(err)return'err';if(!user)return'login';return busy?'busy':'ok'}
function render(){const s=state(),c=$('acctCard');c.className='card acct st-'+s;$('syncTx').textContent=ST(s);$('syncPill').setAttribute('aria-label',t('syncAria',{s:ST(s)}));
 const g=$('gsiBtn');g.classList.toggle('hide',!!user);g.setAttribute('aria-describedby','acctSub');
 $('acctProf').classList.toggle('hide',!user);$('acctAct').classList.toggle('hide',!user);$('signOutBtn').classList.toggle('hide',!user);$('signOutNote').classList.toggle('hide',!user);$('toLoginBtn').classList.toggle('hide',!!user);
 document.querySelectorAll('.gsi .soon').forEach(e=>e.classList.toggle('hide',configured()));
 const em=user?(user.email||user.displayName||t('gAcct')):t('notIn');$('setEm').textContent=em;$('pfEm').textContent=em;$('pfEm').classList.toggle('off',!user);$('setEm').classList.toggle('hide',!!user);
 if(user){const nm=user.displayName||user.email||'';$('acctNm').textContent=nm;$('acctEm').textContent=user.displayName?user.email||'':'';
  const av=$('acctAv');av.textContent='';if(user.photoURL){const i=new Image();i.alt='';i.referrerPolicy='no-referrer';i.src=user.photoURL;i.onerror=()=>{av.textContent=(nm[0]||'?').toUpperCase()};av.appendChild(i)}else av.textContent=(nm[0]||'?').toUpperCase()}
 const sb=$('syncNow');sb.disabled=busy||!online;sb.textContent=err?t('retry'):t('syncNow');
 const sub=$('acctSub');
 sub.textContent=s==='cfg'?t('sub_cfg'):s==='off'?t('sub_off'):s==='err'?t('sub_err'):!user?t('acctSub'):busy?t('sub_busy'):t('sub_last',{t:when(localStorage.getItem(LAST))||'—'});
 if(err&&!user){g.classList.remove('hide')}}
/* ---- 로컬 기록 ---- */
const rd=k=>{try{const v=JSON.parse(localStorage.getItem(k));return Array.isArray(v)?v:[]}catch(e){return[]}};
const raw=Storage.prototype.setItem;
const wr=(k,a)=>{applying=true;try{raw.call(localStorage,k,JSON.stringify(a))}finally{applying=false}};
const docId=(k,id)=>`${k}_${String(id).replace(/\//g,'_')}`;
const localAll=()=>{const m=new Map();Object.entries(KINDS).forEach(([k,key])=>rd(key).forEach(r=>{if(r&&r.id!=null)m.set(docId(k,r.id),{k,id:r.id,d:JSON.stringify(r)})}));return m};
/* ---- Firebase (설정이 있을 때만 불러와요) ---- */
async function load(){if(F||!configured())return;const [a,au,fs]=await Promise.all([import(CONFIG.sdk+'firebase-app.js'),import(CONFIG.sdk+'firebase-auth.js'),import(CONFIG.sdk+'firebase-firestore.js')]);
 F={a,au,fs};const app=a.initializeApp(CONFIG.firebase);auth=au.getAuth(app);db=fs.getFirestore(app);
 au.getRedirectResult(auth).catch(e=>{err=e.code||'auth';render()});
 au.onAuthStateChanged(auth,u=>{const was=!!user;user=u;err='';if(u)choose('google');render();if(u&&!was)merge();if(!u){if(unsub){unsub();unsub=null}known=new Map()}})}
const col=()=>F.fs.collection(db,'users',user.uid,'items');
function login(){if(!configured()){toast(t('soon'));const m=t('lgPrep');$('acctMsg').textContent=m;$('lgMsg').textContent=m;return}
 if(!online){toast(t('offline'));return}
 if(!F){toast(t('wait'));load().then(render).catch(()=>{err='load';render()});return}
 err='';$('acctMsg').textContent='';const p=new F.au.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});
 F.au.signInWithPopup(auth,p).catch(e=>{const c=e.code||'';if(c==='auth/operation-not-supported-in-environment'||c==='auth/popup-blocked'){F.au.signInWithRedirect(auth,p).catch(()=>{err='auth';render()});return}
  if(c!=='auth/popup-closed-by-user'&&c!=='auth/cancelled-popup-request')err=c||'auth';render()})}
/* 로그인 직후: id 기준 합치기(양쪽에 없는 것만 추가) */
async function merge(){if(!user)return;busy=true;err='';render();
 try{const snap=await F.fs.getDocs(col());const cloud=new Map();snap.forEach(d=>{const v=d.data();if(v&&KINDS[v.k]&&typeof v.d==='string')cloud.set(d.id,v)});
  const loc=localAll();let changed=false;
  Object.entries(KINDS).forEach(([k,key])=>{const a=rd(key),ids=new Set(a.map(r=>String(r.id)));cloud.forEach((v,id)=>{if(v.k===k&&!ids.has(String(v.id))){try{a.push(JSON.parse(v.d));changed=true}catch(e){}}});if(changed)wr(key,a)});
  const up=[...loc].filter(([id])=>!cloud.has(id));
  for(let i=0;i<up.length;i+=400){const b=F.fs.writeBatch(db);up.slice(i,i+400).forEach(([id,v])=>b.set(F.fs.doc(col(),id),{...v,updatedAt:F.fs.serverTimestamp()}));await b.commit()}
  known=new Map([...localAll()].map(([id,v])=>[id,v.d]));busy=false;localStorage.setItem(LAST,new Date().toISOString());render();listen();
  if(changed){sessionStorage.setItem('hc.dm.msg',t('merged'));location.reload()}}
 catch(e){busy=false;err=e.code||'sync';render()}}
/* 다른 기기에서 바뀐 것 반영 */
function listen(){if(unsub)unsub();unsub=F.fs.onSnapshot(col(),snap=>{if(snap.metadata.hasPendingWrites)return;let ch=false;
 snap.docChanges().forEach(c=>{const v=c.doc.data();const key=KINDS[v&&v.k];if(!key)return;let a=rd(key);const i=a.findIndex(r=>String(r.id)===String(v.id));
  if(c.type==='removed'){if(i>=0){a.splice(i,1);ch=true}known.delete(c.doc.id)}
  else{try{const r=JSON.parse(v.d);if(i<0){a.push(r);ch=true}else if(JSON.stringify(a[i])!==v.d){a[i]=r;ch=true}known.set(c.doc.id,v.d)}catch(e){}}
  if(ch)wr(key,a)});
 if(ch)dispatchEvent(new CustomEvent('hc:synced'));localStorage.setItem(LAST,new Date().toISOString());render()},e=>{err=e.code||'listen';render()})}
/* 이 기기에서 바뀐 것 올리기 (추가·수정·삭제) */
async function push(){if(!user||!F||busy||!online)return;busy=true;render();
 try{const loc=localAll(),b=F.fs.writeBatch(db);let n=0;
  loc.forEach((v,id)=>{if(known.get(id)!==v.d){b.set(F.fs.doc(col(),id),{...v,updatedAt:F.fs.serverTimestamp()});n++}});
  known.forEach((d,id)=>{if(!loc.has(id)){b.delete(F.fs.doc(col(),id));n++}});
  if(n)await b.commit();known=new Map([...loc].map(([id,v])=>[id,v.d]));err='';localStorage.setItem(LAST,new Date().toISOString())}
 catch(e){err=e.code||'sync'}busy=false;render()}
let pt=0;Storage.prototype.setItem=function(k,v){raw.call(this,k,v);if(!applying&&this===localStorage&&Object.values(KINDS).includes(k)&&user){clearTimeout(pt);pt=setTimeout(push,800)}};
$('gsiBtn').onclick=login;
$('syncNow').onclick=()=>{err='';known.size||!user?push():merge()};
$('signOutBtn').onclick=()=>{if(F&&auth)F.au.signOut(auth).then(()=>{$('acctMsg').textContent=t('outDone');gate(true)})};
$('toLoginBtn').onclick=()=>gate(true);
$('lgGsi').onclick=login;
$('lgGuest').onclick=()=>{choose('guest');gate(false)};
addEventListener('online',()=>{online=true;render();push()});addEventListener('offline',()=>{online=false;render()});
addEventListener('hc:lang',()=>{['acctMsg','lgMsg','fbMsg'].forEach(id=>{$(id).textContent=''});render()});
render();if(configured())load().then(render).catch(()=>{err='load';render()});
})();
