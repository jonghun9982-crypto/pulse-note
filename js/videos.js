/* 건강 영상 목록 — 여기만 고치면 돼요.
   id: 유튜브 영상 ID (https://www.youtube.com/watch?v=ID), title/ch: oEmbed에서 확인한 제목·채널, len: 길이
   모든 ID는 2026-10-22에 youtube.com/oembed 200 응답으로 확인했어요. */
window.HC_VIDEOS=[
 {k:'v_cpr',title:'심폐소생술·AED',open:true,items:[
  {id:'xkMwh-LXZ1A',title:'[생명을 살리는 심폐소생술] 5. 심폐소생술! 이렇게 합니다.',ch:'질병관리청 아프지마TV',len:'1:47'},
  {id:'b4XAPbxcEZk',title:'[생명을 살리는 심폐소생술] 6. 자동심장충격기(AED)는 이렇게 사용합니다.',ch:'질병관리청 아프지마TV',len:'2:05'},
  {id:'kfVkY_hMKwM',title:'[생명을 살리는 심폐소생술] 11. 심폐소생술과 자동심장충격기(AED)의 적용',ch:'질병관리청 아프지마TV',len:'3:12'},
  {id:'DZxIScD48zc',title:'[소방청N] 전문가가 상세히 보여드리는 ‘심폐소생술&자동심장충격기(AED)’의 A to Z',ch:'소방청TV',len:'3:44'}]},
 {k:'v_heart',title:'맥박·심장 건강',items:[
  {id:'ZWPuyGXhQeY',title:"활력징후 자가측정방법 (경기도 생활치료센터)",ch:'분당서울대학교병원',len:'3:09'},
  {id:'4Ddb1bclk1c',title:'심장 [내 몸 둘러보기]',ch:'서울아산병원',len:'4:07'},
  {id:'caFdBkLUjiA',title:'1분 내 심장 이상, 부정맥 확인하는 간단한 방법 | 건강톡톡 EP.300 서울대병원 최의근 교수',ch:'서울대병원tv',len:'15:10'}]},
 {k:'v_ex',title:'운동·스트레칭',items:[
  {id:'40spd1w5Cw0',title:'사무실에서 하는 목, 어깨 스트레칭',ch:'서울아산병원',len:'4:00'},
  {id:'-JzaMksAeew',title:'사무실에서 하는 허리 스트레칭',ch:'서울아산병원',len:'4:05'},
  {id:'ZBIMsyooPCQ',title:"서울아산병원 재활의학과와 함께하는 '10년이 젊어지는 하루 5분 운동'",ch:'서울아산병원',len:'7:13'}]},
 {k:'v_sl',title:'수면',items:[
  {id:'IP8CQXmu_rw',title:'자도 자도 피곤한 당신을 위한 건강한 수면법ㅣ건강플러스',ch:'서울아산병원',len:'3:09'},
  {id:'_BN8BlfoJIw',title:'꿀잠, 쾌면, 통잠이란 없다! 잠에 대한 강박을 먼저 버리세요 #신경과 주은연 교수',ch:'삼성서울병원',len:'5:18'},
  {id:'kMMjng48P10',title:'불면증 고통에서 벗어나려면 이렇게 하면 잘 잘 수 있어요 #신경과 주은연 교수',ch:'삼성서울병원',len:'14:12'}]}
];
/* 그리기: 썸네일만 먼저, 누르면 youtube-nocookie iframe (file://에서는 유튜브 새 탭) */
(()=>{const box=document.getElementById('vList');if(!box)return;const UK='hc.ui.v1';
const st=()=>{try{const v=JSON.parse(localStorage.getItem(UK));return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch(e){return{}}};
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const FILE=location.protocol==='file:';const o=st();
window.HC_VIDEOS.forEach(s=>{const sec=el('section','card');const d=el('details','ref fold vsec');d.dataset.vk=s.k;
 d.open=typeof o[s.k]==='boolean'?o[s.k]:!!s.open;
 const sm=el('summary');const w=el('span','sm');w.append(el('span','st',s.title),el('span','hint',`영상 ${s.items.length}개`));sm.append(w);d.append(sm);
 const ul=el('ul','vlist');
 s.items.forEach(v=>{const li=el('li','vitem');const yt='https://www.youtube.com/watch?v='+encodeURIComponent(v.id);
  const b=el(FILE?'a':'button','vthumb');b.dataset.gc='video-'+v.id;b.setAttribute('aria-label',v.title+' 재생');
  if(FILE){b.href=yt;b.target='_blank';b.rel='noopener'}else b.type='button';
  const im=el('img');im.src='https://i.ytimg.com/vi/'+encodeURIComponent(v.id)+'/hqdefault.jpg';im.alt='';im.loading='lazy';im.decoding='async';
  const pl=el('span','vplay');pl.setAttribute('aria-hidden','true');pl.innerHTML='<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
  b.append(im,pl);if(v.len)b.append(el('span','vlen',v.len));
  if(!FILE)b.onclick=()=>{const f=document.createElement('iframe');
   f.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(v.id)+'?autoplay=1&playsinline=1&rel=0';
   f.title=v.title;f.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';f.allowFullscreen=true;f.referrerPolicy='strict-origin-when-cross-origin';
   const fr=el('div','vframe');fr.append(f);b.replaceWith(fr)};
  const meta=el('div','vmeta');meta.append(el('b','vt',v.title));
  const sub=el('span','vch',v.ch+(v.len?' · '+v.len:''));meta.append(sub);
  const a=el('a','vyt','유튜브에서 보기');a.href=yt;a.target='_blank';a.rel='noopener';a.dataset.gc='video-yt-'+v.id;meta.append(a);
  li.append(b,meta);ul.append(li)});
 d.append(ul);d.addEventListener('toggle',()=>{const v=st();v[s.k]=d.open;try{localStorage.setItem(UK,JSON.stringify(v))}catch(e){}});
 sec.append(d);box.append(sec)});
})();
