(()=>{'use strict';
/* 의견 보내기 주소: 폼이 생기면 여기에만 넣으면 돼요 */
const FEEDBACK_URL='';
const $=id=>document.getElementById(id);
const EK='hc.exercise.v1',SK='hc.sleep.v1';
const load=k=>{try{const v=JSON.parse(localStorage.getItem(k));return Array.isArray(v)?v:[]}catch(e){return[]}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const DW=['일','월','화','수','목','금','토'],pad=n=>String(n).padStart(2,'0');
const fmt=ts=>{const d=new Date(ts),h=d.getHours();return `${d.getMonth()+1}월 ${d.getDate()}일 (${DW[d.getDay()]}) ${h<12?'오전':'오후'} ${h%12||12}:${pad(d.getMinutes())}`};
const dur=ms=>{const m=Math.max(0,Math.round(ms/6e4));return m<60?`${m}분`:`${Math.floor(m/60)}시간${m%60?' '+m%60+'분':''}`};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function delBtn(label,fn){const b=document.createElement('button');b.className='tbtn del';b.textContent='삭제';b.setAttribute('aria-label',label+' 삭제');b.onclick=()=>{if(confirm('이 기록을 지울까요?'))fn()};return b}

/* ---- GoatCounter: 방문과 주요 버튼 누름만 ---- */
const P='/pulse-note';
const gc=(path,title,event)=>{try{window.goatcounter&&window.goatcounter.count&&window.goatcounter.count({path,title,event})}catch(e){}};
const onGc=()=>gc(P+'/','맥박 노트',false);
if(document.readyState==='complete')onGc();else addEventListener('load',onGc);
document.addEventListener('click',e=>{const b=e.target.closest('[data-gc]');if(b&&!b.disabled)gc(P+'/tap/'+b.dataset.gc,b.dataset.gc,true)},true);

/* ---- 운동 기록 목록 ---- */
const RN={stretch:'자리에서 스트레칭',stairs:'계단 걷기',walk:'점심 산책'};
function exRender(){const a=load(EK).sort((x,y)=>y.ts-x.ts),ul=$('exList');ul.innerHTML='';$('exEmpty').classList.toggle('hide',a.length>0);
 a.slice(0,20).forEach(r=>{const li=document.createElement('li');li.innerHTML=`<div><b>${esc(RN[r.routine]||r.routine||'운동')}</b> <span>${r.min?esc(r.min)+'분 · ':''}${fmt(r.ts)}</span></div>`;
  li.appendChild(delBtn(fmt(r.ts)+' 운동 기록',()=>{save(EK,load(EK).filter(x=>x.id!==r.id));exRender()}));ul.appendChild(li)})}
addEventListener('hc:exercise',exRender);exRender();

/* ---- 수면 기록 ---- */
let tick=null;
function slRender(){const a=load(SK).sort((x,y)=>y.start-x.start),open=a.find(r=>!r.end);
 $('slToggle').textContent=open?'기상':'수면';$('slToggle').classList.toggle('on',!!open);
 $('slToggle').setAttribute('aria-label',open?'기상 기록하기':'수면 기록하기');
 $('slState').textContent=open?'자는 중':'깨어 있어요';
 $('slSince').textContent=open?`${fmt(open.start)}부터 · ${dur(Date.now()-open.start)}`:'';
 const ul=$('slList');ul.innerHTML='';$('slEmpty').classList.toggle('hide',a.length>0);
 a.slice(0,20).forEach(r=>{const li=document.createElement('li');
  li.innerHTML=r.end?`<div><b>${dur(r.end-r.start)}</b> <span>${fmt(r.start)} ~ ${fmt(r.end)}</span></div>`:`<div><b>자는 중</b> <span>${fmt(r.start)}부터</span></div>`;
  li.appendChild(delBtn(fmt(r.start)+' 수면 기록',()=>{save(SK,load(SK).filter(x=>x.id!==r.id));slRender()}));ul.appendChild(li)});
 clearInterval(tick);if(open)tick=setInterval(slRender,60000)}
$('slToggle').onclick=()=>{const a=load(SK),open=a.find(r=>!r.end),now=Date.now();
 if(open)open.end=Math.max(now,open.start);else a.push({id:uid(),start:now,end:null});save(SK,a);slRender()};
slRender();

/* ---- 백업 ---- */
const hcKeys=()=>{const k=[];for(let i=0;i<localStorage.length;i++){const n=localStorage.key(i);if(n&&n.startsWith('hc.'))k.push(n)}return k.sort()};
const stamp=()=>{const d=new Date();return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`};
function download(name,text,type){const blob=new Blob([text],{type}),u=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}
const msg=t=>{$('bkMsg').textContent=t};
$('expJson').onclick=()=>{const data={};hcKeys().forEach(k=>{try{data[k]=JSON.parse(localStorage.getItem(k))}catch(e){data[k]=localStorage.getItem(k)}});
 download(`pulse-note-${stamp()}.json`,JSON.stringify({app:'pulse-note',format:1,exportedAt:new Date().toISOString(),data},null,2),'application/json');msg('JSON 파일로 내보냈어요.')};
const COLS=['kind','id','ts','bpm','routine','min','start','end','age','sex','heightCm','weightKg','savedAt'];
const KIND={pulse:'hc.pulse.v1',exercise:'hc.exercise.v1',sleep:'hc.sleep.v1'};
const cq=v=>{v=v==null?'':String(v);return /[",\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
$('expCsv').onclick=()=>{const rows=[COLS.join(',')];
 for(const [kind,key] of Object.entries(KIND))load(key).forEach(r=>rows.push(COLS.map(c=>cq(c==='kind'?kind:r[c])).join(',')));
 let p=null;try{p=JSON.parse(localStorage.getItem('hc.profile.v1'))}catch(e){}
 if(p&&typeof p==='object')rows.push(COLS.map(c=>cq(c==='kind'?'profile':p[c])).join(','));
 download(`pulse-note-${stamp()}.csv`,'\ufeff'+rows.join('\r\n'),'text/csv');msg('CSV 파일로 내보냈어요.')};
function parseCsv(t){const out=[];let row=[],f='',q=false;t=t.replace(/^\ufeff/,'');
 for(let i=0;i<t.length;i++){const c=t[i];if(q){if(c==='"'){if(t[i+1]==='"'){f+='"';i++}else q=false}else f+=c}
  else if(c==='"')q=true;else if(c===','){row.push(f);f=''}else if(c==='\n'||c==='\r'){if(c==='\r'&&t[i+1]==='\n')i++;row.push(f);out.push(row);row=[];f=''}else f+=c}
 if(f!==''||row.length){row.push(f);out.push(row)}return out.filter(r=>r.some(x=>x!==''))}
const NUMS=new Set(['ts','bpm','min','start','end','age','heightCm','weightKg','savedAt']);
function csvToData(t){const rows=parseCsv(t),h=rows.shift()||[];if(!h.includes('kind'))throw new Error('csv');const data={};
 rows.forEach(r=>{const o={};h.forEach((c,i)=>{const v=r[i];if(c==='kind'||v==null||v==='')return;o[c]=NUMS.has(c)?Number(v):v});
  const kind=r[h.indexOf('kind')];
  if(kind==='profile'){data['hc.profile.v1']={age:o.age??null,sex:o.sex??null,heightCm:o.heightCm??null,weightKg:o.weightKg??null,savedAt:o.savedAt??Date.now()}}
  else if(KIND[kind]){if(kind==='sleep'&&o.end==null)o.end=null;(data[KIND[kind]]=data[KIND[kind]]||[]).push(o)}});return data}
const sig=r=>JSON.stringify([r.ts??null,r.start??null,r.end??null,r.bpm??null,r.routine??null]);
function merge(data){let added=0,kept=0;
 for(const [k,v] of Object.entries(data||{})){if(!k.startsWith('hc.'))continue;
  if(Array.isArray(v)){const cur=load(k),ids=new Set(cur.map(r=>r&&r.id)),sigs=new Set(cur.map(sig));
   v.forEach(r=>{if(!r||typeof r!=='object')return;if((r.id&&ids.has(r.id))||sigs.has(sig(r))){kept++;return}
    if(!r.id)r.id=uid();cur.push(r);ids.add(r.id);sigs.add(sig(r));added++});save(k,cur)}
  else if(localStorage.getItem(k)==null){save(k,v);added++}else kept++}
 return {added,kept}}
$('impBtn').onclick=()=>{$('impFile').value='';$('impFile').click()};
$('impFile').onchange=async()=>{const f=$('impFile').files[0];if(!f)return;
 try{const t=await f.text();let data;const s=t.replace(/^\ufeff/,'').trim();
  if(s.startsWith('{')){const j=JSON.parse(s);data=j&&j.data&&typeof j.data==='object'?j.data:j}else data=csvToData(s);
  const r=merge(data);msg(`불러왔어요. 새 기록 ${r.added}개를 더했고, 이미 있던 ${r.kept}개는 건너뛰었어요.`);
  sessionStorage.setItem('hc.ui.msg',$('bkMsg').textContent);sessionStorage.setItem('hc.ui.tab','tabAcct');setTimeout(()=>location.reload(),900)}
 catch(e){msg('파일을 읽지 못했어요. 이 앱에서 내보낸 JSON 또는 CSV 파일인지 확인해 주세요.')}};
const pm=sessionStorage.getItem('hc.ui.msg'),pt=sessionStorage.getItem('hc.ui.tab');
if(pm){msg(pm);sessionStorage.removeItem('hc.ui.msg')}
if(pt){sessionStorage.removeItem('hc.ui.tab');document.querySelector(`.tabbar [data-t="${pt}"]`)?.click()}

/* ---- 의견 보내기 ---- */
if(FEEDBACK_URL){$('fbBtn').disabled=false;$('fbNote').classList.add('hide');$('fbBtn').onclick=()=>window.open(FEEDBACK_URL,'_blank','noopener')}
})();
