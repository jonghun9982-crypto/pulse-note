(()=>{'use strict';
/* ---- GoatCounter: 방문과 주요 버튼 누름만 ---- */
const P='/pulse-note';
const gc=(path,title,event)=>{try{window.goatcounter&&window.goatcounter.count&&window.goatcounter.count({path,title,event})}catch(e){}};
const onGc=()=>gc(P+'/','맥박 노트',false);
if(document.readyState==='complete')onGc();else addEventListener('load',onGc);
document.addEventListener('click',e=>{const b=e.target.closest('[data-gc]');if(b&&!b.disabled)gc(P+'/tap/'+b.dataset.gc,b.dataset.gc,true)},true);
})();
