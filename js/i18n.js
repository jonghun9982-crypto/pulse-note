/* 언어 (v22): 한국어/English — 모든 화면 문구는 여기 한 곳에만 있어요.
   hc.ui.v1.lang = 'ko'|'en' (처음 열 때 navigator.language가 ko로 시작하지 않으면 en)
   저장 데이터는 언어와 무관(id/키)하고, 화면에 보일 때만 번역해요.
   D[key] = [ko, en] — 문자열 또는 (v)=>문자열. index.html의 고정 문구는 ko/en 원문으로 찾아 바꿔요. */
(function(){'use strict';
var UK='hc.ui.v1',d=document.documentElement;
function ui(){try{var v=JSON.parse(localStorage.getItem(UK));return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch(e){return{}}}
var L=ui().lang;
if(L!=='ko'&&L!=='en'){L=/^ko/i.test(navigator.language||'')?'ko':'en';try{var u=ui();u.lang=L;localStorage.setItem(UK,JSON.stringify(u))}catch(e){}}
d.setAttribute('lang',L);
var D={
/* ---- 공통 ---- */
app:['맥박 노트','Pulse Note'],
appIcon:['맥박 노트 아이콘','Pulse Note icon'],
note:['참고·교육용이에요. 의료 상담을 대신하지 않아요.','For reference and education only. Not medical advice.'],
refNote:['참고용이에요. 건강 상태를 판단하는 기준이 아니에요.','For reference only. Not a measure of your health.'],
save:['저장','Save'],del:['삭제','Delete'],cancel:['취소','Cancel'],close:['닫기','Close'],start:['시작','Start'],done:['완료','Done'],
src:['출처 보기','Sources'],noRec:['기록 없음','No records'],noRecYet:['아직 기록이 없어요.','No records yet.'],
nRec:['기록 {n}개',function(v){return v.n===1?'1 record':v.n+' records'}],
today:['오늘','Today'],yesterday:['어제','Yesterday'],last7:['최근 7일','Last 7 days'],
bpm:['회/분','bpm'],min:['분','min'],eg:['예: {v}','e.g. {v}'],optional:['비워도 돼요','Optional'],
delConfirm:['이 기록을 지울까요?','Delete this record?'],delLbl:['{x} 삭제','Delete {x}'],
saved:['저장했어요.','Saved.'],saveFail:['저장하지 못했어요.','Couldn\u2019t save.'],
koData:['','Korean data'],
/* ---- 헤더 ---- */
thLbl:['화면 테마 바꾸기','Change theme'],thAuto:['자동','Auto'],thLight:['라이트','Light'],thDark:['다크','Dark'],
thAria:['화면 테마: {p}. 눌러서 바꾸기','Theme: {p}. Tap to change'],
lgAria:['언어: 한국어. 눌러서 English로 바꾸기','Language: English. Tap to switch to Korean'],
/* ---- 로그인 화면 ---- */
lgSub:['맥박·운동·수면을 기록해요.','Log your pulse, exercise and sleep.'],
gsi:['Google로 로그인','Sign in with Google'],soon:['준비 중이에요','Coming soon'],
guest:['로그인 없이 시작하기','Continue without signing in'],
lgNote:['로그인하지 않아도 모든 기능을 쓸 수 있어요. 기록은 이 기기에 저장돼요.','Every feature works without signing in. Your records stay on this device.'],
/* ---- 탭 ---- */
tabs:['화면 이동','Navigation'],tProfile:['프로필','Profile'],tEx:['운동','Exercise'],tSleep:['수면','Sleep'],tPulse:['맥박','Pulse'],tVid:['영상','Videos'],tSet:['설정','Settings'],
/* ---- 프로필 ---- */
pfH:['프로필 사진과 계정','Profile photo and account'],avAlt:['내 프로필 사진','My profile photo'],
avPick:['사진 고르기','Choose photo'],avChange:['사진 바꾸기','Change photo'],avDel:['사진 지우기','Remove photo'],
avLocal:['사진은 이 휴대폰에만 저장돼요.','Your photo is stored only on this phone.'],
avSaved:['사진을 저장했어요. 이 휴대폰에만 저장돼요.','Photo saved. It\u2019s stored only on this phone.'],
avFail:['사진을 열지 못했어요. 다른 사진을 골라 주세요.','Couldn\u2019t open that photo. Please choose another.'],
avConfirm:['프로필 사진을 지울까요?','Remove your profile photo?'],avGone:['사진을 지웠어요.','Photo removed.'],
acct:['계정','Account'],notIn:['로그인하지 않았어요','Not signed in'],gAcct:['Google 계정','Google account'],
basic:['기본 정보','Basic info'],age:['나이','Age'],sex:['성별','Sex'],male:['남성','Male'],female:['여성','Female'],sexNone:['선택 안 함','Prefer not to say'],
ht:['키 (cm)','Height (cm)'],wt:['몸무게 (kg)','Weight (kg)'],
pfLocal:['이 정보는 이 휴대폰에만 저장돼요. 동기화되지 않아요.','This info is stored only on this phone and isn\u2019t synced.'],
bmiNote:['건강 상태를 판단하는 값이 아니에요.','Not a measure of your health.'],bmiVal:['BMI {v} (참고용)','BMI {v} (reference only)'],
/* ---- 맥박 ---- */
pCount:['맥박 세기','Count your pulse'],pEmpty:['아직 기록이 없어요. 15초만 세어 볼까요?','No records yet. Try counting for 15 seconds.'],
left:['남은 시간','Time left'],sec:['초','s'],tMsg:['손목 안쪽에 두 손가락을 대고 세어 보세요','Place two fingers on the inside of your wrist and count'],
stop:['그만하기','Stop'],cntL:['15초 동안 센 횟수','Beats counted in 15 seconds'],cntAsk:['횟수를 입력해 주세요','Enter the count'],
cntRange:['1~60 사이 숫자를 입력해 주세요','Enter a number from 1 to 60'],cntOk:['분당 {v}회로 기록할게요','This will be saved as {v} bpm'],
rec:['기록하기','Save'],pStart:['15초 세기 시작','Start 15-second count'],recAt:['{d} 기록','Recorded {d}'],
recDel:['{d} 기록','record from {d}'],
wkAria:['{d} {v}','{d}: {v}'],wkAvg:['평균 {v}회/분','average {v} bpm'],
kicker:['1분 의학','1-minute medicine'],animH:['맥박은 어디에 먼저 도착할까?','Where does the pulse arrive first?'],
animAria:['심장에서 배 쪽 큰 혈관과 팔로 맥박이 동시에 출발하는 그림','A pulse leaving the heart at the same time toward the large belly artery and the arm'],
aBelly:['배 쪽 큰 혈관','Aorta (belly)'],aThigh:['허벅지 쪽','To the thigh'],aWrist:['손목','Wrist'],aHeart:['심장','Heart'],
aFirst:['{x}에 먼저 도착했어요','Arrived first at the {x}'],aBellyS:['배 쪽 큰 혈관','belly artery'],aWristS:['손목','wrist'],aGo:['동시에 출발!','They start together!'],
animSeg:['혈관 상태 바꾸기','Change artery type'],soft:['말랑한 혈관','Flexible artery'],stiff:['단단한 혈관','Stiff artery'],
animCap:['맥박이 배 쪽 큰 혈관과 팔로 동시에 출발해요. 큰 혈관이 단단해지면 그쪽이 먼저 도착해요.','The pulse sets off toward the large belly artery and the arm at the same time. When the large artery stiffens, the pulse gets there first.'],
animCap2:['말랑한 호스와 딱딱한 파이프를 떠올려 보세요.','Think of a soft hose versus a rigid pipe.'],replay:['다시 보기','Replay'],
refH:['안정 시 맥박 참고 자료','Resting pulse reference'],sexPick:['성별 선택','Choose sex'],m1:['남','M'],f1:['여','F'],
rAria:['연령대별 안정 시 맥박 분포 (5–95백분위, 평균)','Resting pulse by age group (5th–95th percentile, mean)'],
pct:['5–95백분위','5th–95th percentile'],mean:['평균','Mean'],adult:['성인 일반 범위 60–100','Typical adult range 60–100'],adultS:['성인 일반 범위','Typical adult range'],
rNote1:['참고용이에요. 범위는 사람들 사이의 분포일 뿐 기준이 아니에요.','For reference only. The ranges show how pulse varies between people; they aren\u2019t targets.'],
rNote2:['심장이나 뇌 질환이 있거나 맥박에 영향을 주는 약을 드신다면 의사와 상담하세요.','If you have a heart or brain condition, or take medicine that affects your pulse, talk to your doctor.'],
s1:['연령·성별 분포: Ostchega 외, NHSR No.41 (CDC, 2011), 미국 NHANES 1999–2008','Age/sex distribution: Ostchega et al., NHSR No. 41 (CDC, 2011), US NHANES 1999–2008'],
s2:['60–100 범위: 미국심장협회(AHA), All About Heart Rate','60–100 range: American Heart Association (AHA), All About Heart Rate'],
s3:['한국 평균: Park 외, BMC Public Health 2024;24:367 (KNHANES 2011–2014)','Korean data: Park et al., BMC Public Health 2024;24:367 (KNHANES 2011–2014)'],
ageB:[['20–39세','40–59세','60–79세','80세 이상'],['20–39','40–59','60–79','80+']],
myBand:['내 연령대','My age group'],me:['나','Me'],lastN:['최근 {n}회','Last {n} readings'],
rEmpty:['맥박을 세면 여기에 표시돼요','Your readings will show here'],
rMine:['내 최근 평균 <b>{v}회</b> <small>({l})</small>','My recent average <b>{v} bpm</b> <small>({l})</small>'],
rSame:['같은 연령대 평균 {v}회 ({s} {a})','Age-group mean {v} bpm ({s}, {a})'],
rKr:['미국 NHANES 1999–2008 · {s}. 한국 성인 {s} 평균은 {k}회예요 (KNHANES 2011–2014).','US NHANES 1999–2008 · {s}. Korean data: Korean adult {sl} average {k} bpm (KNHANES 2011–2014).'],
pwH:['최근 7일 맥박','Pulse, last 7 days'],pwEmpty:['아직 맥박 기록이 없어요.','No pulse records yet.'],wkAria0:['지난 7일 하루 평균 맥박','Daily average pulse over the last 7 days'],
pwHint:['최근 7일 · 평균 {v}회/분','Last 7 days · avg {v} bpm'],pwNone:['최근 7일 · 기록 없음','Last 7 days · no records'],
plH:['맥박 기록','Pulse log'],
/* ---- 운동 ---- */
exH:['3·6·9 운동 루틴','3·6·9 routines'],exAdd:['내 운동 직접 추가','Add your own exercise'],
str:['근력','Strength'],car:['유산소','Cardio'],routine:['루틴','Routine'],exercise:['운동','Exercise'],
exName:['운동 이름','Exercise name'],sets:['세트','Sets'],reps:['횟수','Reps'],kgOpt:['무게 kg (선택)','Weight kg (optional)'],date:['날짜','Date'],
minL:['시간 (분)','Time (min)'],kmOpt:['거리 km (선택)','Distance km (optional)'],
q_squat:['스쿼트','Squat'],q_pushup:['푸시업','Push-up'],q_plank:['플랭크','Plank'],q_dumbbell:['덤벨','Dumbbell'],
q_walk:['걷기','Walking'],q_run:['달리기','Running'],q_bike:['자전거','Cycling'],q_swim:['수영','Swimming'],
exvH:['주당 신체활동 참고 자료','Weekly activity reference'],
exvKey:['권장 중강도 150~300분 (WHO · 한국 지침)','Recommended 150–300 min moderate (WHO)'],myWk:['내 최근 7일','My last 7 days'],
exvStr:['근력운동 주 2일 이상 권장','Muscle-strengthening on 2+ days a week'],
exvVig:['고강도 1분은 중강도 2분으로 쳐요. 여기서는 기록한 시간을 그대로 더했어요.','1 vigorous minute counts as 2 moderate minutes. Here, logged minutes are simply added up.'],
sb:['Bull 외, Br J Sports Med 2020','Bull et al., Br J Sports Med 2020'],
sk1:['보건복지부·한국건강증진개발원, 한국인을 위한 신체활동 지침서 (2023)','Korean data: Ministry of Health and Welfare & KHEPI, Physical Activity Guide for Koreans (2023, in Korean)'],
sk2:['질병관리청 국가건강정보포털, 신체활동','Korean data: KDCA National Health Information Portal, Physical activity (in Korean)'],
exlH:['운동 기록','Exercise log'],exEmpty:['아직 기록이 없어요. 루틴을 완료하거나 직접 추가해 보세요.','No records yet. Finish a routine or add your own.'],
exSaved:['저장했어요. 운동 기록에서 볼 수 있어요.','Saved. See it in your exercise log.'],
sNeed:['운동 이름, 세트, 횟수를 넣어 주세요.','Enter a name, sets and reps.'],cNeed:['운동 이름과 시간을 넣어 주세요.','Enter a name and time.'],
setsReps:['{s}세트 × {r}회','{s} sets × {r} reps'],nMin:['{n}분','{n} min'],
exHint:[' · 근력 {s} · 유산소 {c}',' · strength {s} · cardio {c}'],exToday:['오늘 {n}번 기록했어요.',function(v){return v.n===1?'1 entry today.':v.n+' entries today.'}],
sHint:['이번 주 근력 {n}일',function(v){return 'Strength this week: '+v.n+(v.n===1?' day':' days')}],
cHint:['최근 7일 유산소 {n}분','Cardio, last 7 days: {n} min'],
rec150:['권장 150~300분','Recommended 150–300 min'],
exvMine:['내 최근 7일 <b>{n}분</b> · 권장 150~300분','My last 7 days <b>{n} min</b> · recommended 150–300 min'],
exvEmpty:['루틴을 완료하거나 유산소를 추가하면 최근 7일 합계가 여기에 표시돼요','Finish a routine or add cardio to see your 7-day total here'],
exLog:['{x} 운동 기록','{x} exercise record'],
r_stretch:['자리에서 스트레칭','Seated stretches'],r_stairs:['계단 걷기','Stair walking'],r_walk:['점심 산책','Lunchtime walk'],
rs_stretch:[['목을 천천히 좌우로 돌려요','어깨를 위로 올렸다 툭 내려요','깍지 끼고 팔을 위로 쭉 펴요','앉아서 상체를 좌우로 비틀어요','발목을 돌리고 크게 숨 쉬어요'],
 ['Slowly turn your head left and right','Lift your shoulders, then let them drop','Interlace your fingers and stretch your arms up','While seated, twist your upper body side to side','Roll your ankles and take deep breaths']],
rs_stairs:[['난간을 잡고 천천히 시작해요','한 층씩 편한 속도로 올라가요','숨이 차면 잠깐 쉬어요','내려올 때는 더 천천히','끝나면 종아리를 가볍게 풀어요'],
 ['Hold the handrail and start slowly','Climb one floor at a time at an easy pace','Rest briefly if you get out of breath','Go down even more slowly','Finish by gently loosening your calves']],
rs_walk:[['편한 신발로 밖에 나가요','처음 2분은 천천히 걸어요','조금 빠르게 6분 걸어요','마지막 1분은 천천히 정리해요'],
 ['Head outside in comfortable shoes','Walk slowly for the first 2 minutes','Walk a little faster for 6 minutes','Slow down for the last minute']],
rTitle:['{n}분 {x}','{n}-min {x}'],resume:['이어서','Resume'],pause:['잠시 멈춤','Pause'],restart:['다시 시작','Restart'],
doneMsg:['완료로 기록했어요.','Marked as done.'],
/* ---- 수면 ---- */
now:['지금','Now'],awake:['깨어 있어요','Awake'],awakeA:['깨어 있음','Awake'],asleep:['자는 중','Asleep'],
slBtn:['수면','Sleep'],wakeBtn:['기상','Wake'],slAria:['수면 기록하기','Log sleep start'],wakeAria:['기상 기록하기','Log wake-up'],
slHelp:['잠들 때 수면, 일어나면 기상을 눌러 주세요.','Tap Sleep when you go to bed and Wake when you get up.'],
since:['{d}부터 · {x}','Since {d} · {x}'],sinceS:['{d}부터','since {d}'],slLog:['{d} 수면 기록','sleep record from {d}'],
slvH:['수면시간 참고 자료','Sleep duration reference'],band:['권장 범위','Recommended range'],krAvg:['한국 평균','Korean average'],myAvg:['내 평균','My average'],
slvCap:['한국 평균은 시간일지로 잰 수면 행동 시간이에요 (2024 생활시간조사, 10세 이상).','Korean data: the Korean average is time spent sleeping from time-use diaries (Statistics Korea 2024 Time Use Survey, age 10+).'],
ss1:['Hirshkowitz 외, NSF 수면시간 권장 (Sleep Health 2015)','Hirshkowitz et al., NSF sleep duration recommendations (Sleep Health 2015)'],
ss2:['Watson 외, AASM/SRS 합의문 (J Clin Sleep Med 2015)','Watson et al., AASM/SRS consensus statement (J Clin Sleep Med 2015)'],
ss3:['통계청, 2024년 생활시간조사 결과','Korean data: Statistics Korea, 2024 Time Use Survey results (in Korean)'],
sllH:['수면 기록','Sleep log'],
recH:['권장 {a}~{b}시간','Recommended {a}–{b} h'],recHK:['권장 {a}~{b}시간 (NSF, {l})','Recommended {a}–{b} h (NSF, {l})'],
adultStd:['성인 기준','adults'],
nsfAge:[['1–2세','3–5세','6–13세','14–17세','18–25세','26–64세','65세 이상'],['age 1–2','age 3–5','age 6–13','age 14–17','age 18–25','age 26–64','age 65+']],
krAll:['한국 전체 평균','Korean data: national average'],
krAge:['같은 연령대({a}) 한국 평균','Korean data: average for {a}'],
krAges:[['10대','20대','30대','40대','50대','60세 이상'],['teens','20s','30s','40s','50s','age 60+']],
slMine:['내 평균 <b>{v}</b> · 권장 {a}~{b}시간','My average <b>{v}</b> · recommended {a}–{b} h'],
slEmpty:['수면과 기상을 기록하면 평균이 여기에 표시돼요','Log sleep and wake times to see your average here'],
slAdult:['성인 기준 (계정 탭에 나이를 넣으면 연령에 맞춰 보여 드려요)','Showing adult values (add your age in the Profile tab to match your age)'],
/* ---- 영상 ---- */
vidH:['건강 영상','Health videos'],vidNote:['공공기관·대학병원 채널의 교육 영상이에요.','Educational videos from official health organizations and hospitals.'],
cprH:['119 신고 안내','Emergency call'],cprT:['주변에 쓰러진 사람이 있으면 먼저 119에 신고하세요','If someone collapses, call your local emergency number first'],
call:['119 전화하기','Call 119'],cprK:['','(Korea: 119)'],
vidFoot:['영상은 각 기관의 유튜브 채널에서 가져와요. 참고·교육용이에요.','Videos come from each organization\u2019s YouTube channel. For education only.'],
v_cpr:['심폐소생술·AED','CPR & AED'],v_heart:['맥박·심장 건강','Pulse & heart'],v_ex:['운동·스트레칭','Exercise & stretching'],v_sl:['수면','Sleep'],
nVid:['영상 {n}개',function(v){return v.n===1?'1 video':v.n+' videos'}],play:['{x} 재생','Play {x}'],onYt:['유튜브에서 보기','Watch on YouTube'],
/* ---- 설정 ---- */
gSync:['Google 동기화','Google sync'],syncPrep:['준비 중','Coming soon'],
st_cfg:['꺼짐 · 준비 중','Off · coming soon'],st_login:['꺼짐','Off'],st_busy:['켜짐 · 동기화 중','On · syncing'],st_ok:['켜짐','On'],st_off:['오프라인','Offline'],st_err:['다시 시도해 주세요','Please try again'],
syncAria:['동기화 상태: {s}','Sync status: {s}'],
acctSub:['로그인하면 휴대폰을 바꿔도 기록을 이어서 볼 수 있어요.','Sign in to keep your records when you switch phones.'],
sub_cfg:['Google 로그인을 준비하고 있어요. 지금은 기록이 이 기기에 저장돼요.','Google sign-in is coming soon. For now, records are saved on this device.'],
sub_off:['인터넷에 다시 연결되면 이어서 동기화해요. 기록은 이 기기에 저장돼요.','Sync resumes when you\u2019re back online. Records are saved on this device.'],
sub_err:['동기화하지 못했어요. 잠시 후 다시 시도해 주세요.','Couldn\u2019t sync. Please try again shortly.'],
sub_busy:['기록을 맞추고 있어요.','Syncing your records\u2026'],sub_last:['마지막 동기화 {t}','Last synced {t}'],
syncNow:['지금 동기화','Sync now'],retry:['다시 시도','Retry'],
snote:['맥박·운동·수면 기록만 동기화돼요. 기본 정보(나이·성별·키·몸무게), 프로필 사진, 화면 설정은 이 기기에만 남아요. 로그인하지 않아도 모든 기능을 쓸 수 있어요.','Only pulse, exercise and sleep records sync. Basic info (age, sex, height, weight), your profile photo and display settings stay on this device. Every feature works without signing in.'],
signOut:['로그아웃','Sign out'],toLogin:['로그인 화면으로 돌아가기','Back to sign-in screen'],
outNote:['로그아웃해도 이 기기의 기록은 지워지지 않아요.','Signing out doesn\u2019t delete records on this device.'],
outDone:['로그아웃했어요. 이 기기의 기록은 그대로예요.','Signed out. Records on this device are unchanged.'],
lgPrep:['Google 로그인을 준비하고 있어요. 지금은 로그인 없이 그대로 쓰시면 돼요.','Google sign-in is coming soon. For now, just use the app without signing in.'],
offline:['인터넷 연결을 확인해 주세요','Check your internet connection'],wait:['잠시 후 다시 눌러 주세요','Please tap again in a moment'],
merged:['계정의 기록을 이 기기와 합쳤어요.','Merged your account records with this device.'],
dmH:['데이터 내보내기·불러오기','Export & import data'],
dmNote:['맥박·운동·수면 기록, 기본 정보, 프로필 사진을 JSON 파일 하나로 저장하거나, 저장한 파일에서 다시 불러올 수 있어요.','Save your pulse, exercise and sleep records, basic info and profile photo as one JSON file, or restore them from a saved file.'],
exp:['내보내기 (파일 저장)','Export (save file)'],shareB:['공유로 보내기','Share'],imp:['불러오기','Import'],
impNote:['불러오면 지금 이 기기에 있는 기록이 파일 내용으로 바뀌어요.','Importing replaces the records on this device with the file\u2019s contents.'],
shareMsg:['공유 화면을 열었어요. "파일에 저장"을 고르면 보관할 수 있어요.','Share sheet opened. Choose \u201cSave to Files\u201d to keep a copy.'],
expOk:['{f} 파일로 내보냈어요 (기록 {n}개).','Exported to {f} ({n} records).'],expFail:['내보내지 못했어요.','Couldn\u2019t export.'],
expNo:['이 브라우저에서는 파일을 저장하지 못했어요.','This browser couldn\u2019t save the file.'],shareFail:['공유하지 못했어요.','Couldn\u2019t share.'],
impBad:['파일을 읽지 못했어요. 이 앱에서 내보낸 JSON 파일인지 확인해 주세요.','Couldn\u2019t read the file. Make sure it\u2019s a JSON file exported from this app.'],
impAsk:['이 파일로 지금 기록을 바꿀까요?\n맥박 {p}개 · 운동 {e}개 · 수면 {s}개{x}\n이 기기의 기존 기록은 파일 내용으로 바뀌어요.','Replace your current records with this file?\nPulse {p} · Exercise {e} · Sleep {s}{x}\nRecords on this device will be replaced by the file\u2019s contents.'],
impPf:[' · 기본 정보',' · Basic info'],impAv:[' · 프로필 사진',' · Profile photo'],
impCancel:['불러오기를 취소했어요.','Import canceled.'],impOk:['불러왔어요. 기록 {n}개를 적용했어요.','Imported. {n} records applied.'],
fb:['앱 의견 보내기','Send feedback'],fbSub:['불편한 점이나 아이디어를 알려 주세요','Tell us about problems or ideas'],newTab:['새 탭에서 열림','Opens in a new tab'],
fbPrep:['의견 폼을 준비하고 있어요','The feedback form is coming soon'],fbPrep2:['의견 폼을 준비하고 있어요. 조금만 기다려 주세요.','The feedback form is coming soon. Please check back later.'],
fbNote:['의견은 Google 폼으로 받아 앱 개선에만 쓰고, 다른 곳에 공유하지 않아요.','Feedback is collected with Google Forms, used only to improve the app, and never shared.'],
gcH:['사용 통계','Usage stats'],
gcNote:['방문 수, 어떤 버튼을 눌렀는지, 어떤 영상을 눌렀는지(영상 번호)만 GoatCounter로 세요. 쿠키는 쓰지 않아요. 맥박·운동·수면 기록, 기본 정보, 프로필 사진은 보내지 않아요.','GoatCounter counts only visits, which buttons were tapped (including the language button) and which videos were tapped (video ID). No cookies. Pulse, exercise and sleep records, basic info and your profile photo are never sent.'],
foot1:['이 앱은 의료 서비스가 아니에요. 일반적인 건강 관리와 교육용으로만 써 주세요.','This app doesn\u2019t give medical advice. Use it for general wellness and education only.'],
foot2:['기록은 먼저 이 기기에 저장돼요. Google로 로그인하면 맥박·운동·수면 기록이 내 계정 공간에만 백업되고, 다른 곳에 공유되지 않아요.','Records are saved on this device first. If you sign in with Google, pulse, exercise and sleep records are backed up only to your own account space and never shared.']
};
/* index.html의 고정 문구 (D 키와 겹치지 않는 것만) */
var EXTRA={eg45:['예: 45','e.g. 45'],eg170:['예: 170','e.g. 170'],eg65:['예: 65','e.g. 65'],eg18:['예: 18','e.g. 18'],eg3:['예: 3','e.g. 3'],eg10:['예: 10','e.g. 10'],eg30:['예: 30','e.g. 30'],
 egSq:['예: 스쿼트','e.g. Squat'],egWk:['예: 걷기','e.g. Walking'],clock:['05:00','05:00']};
for(var k in EXTRA)D[k]=EXTRA[k];
var I=L==='en'?1:0;
function t(k,v){var e=D[k];if(!e)return k;var s=e[I];if(typeof s==='function')return s(v||{});if(typeof s!=='string')return s;
 if(v)s=s.replace(/\{(\w+)\}/g,function(m,n){return v[n]!=null?v[n]:m});return s}
/* 고정 문구 역색인: ko/en 원문 → 키 */
var REV={};for(var k2 in D){[0,1].forEach(function(i){var s=D[k2][i];if(typeof s==='string'&&s&&s.indexOf('{')<0&&!REV[s])REV[s]=k2})}
var ATTR=['aria-label','alt','placeholder','title'];
function tr(s){var x=s.trim();if(!x)return null;var k=REV[x];if(!k)return null;var n=D[k][I];if(typeof n!=='string'||!n||n===x)return null;return s.replace(x,n)}
function apply(root){root=root||document.body;if(!root)return;
 var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentNode;return p&&/^(SCRIPT|STYLE)$/.test(p.nodeName)||p.closest&&p.closest('[data-noi18n]')?2:1}}),n,r;
 while((n=w.nextNode()))if((r=tr(n.nodeValue))!=null)n.nodeValue=r;
 var els=root.querySelectorAll('['+ATTR.join('],[')+']');
 for(var i=0;i<els.length;i++)for(var j=0;j<ATTR.length;j++){var a=els[i].getAttribute(ATTR[j]);if(a!=null&&(r=tr(a))!=null)els[i].setAttribute(ATTR[j],r)}
 document.title=t('app');var m=document.querySelector('meta[name=apple-mobile-web-app-title]');if(m)m.setAttribute('content',t('app'))}
/* 날짜·시간: Intl */
var LOC=function(){return L==='en'?'en-US':'ko-KR'};
function df(o){return new Intl.DateTimeFormat(LOC(),o)}
var F={
 dt:function(ts){return df({month:L==='en'?'short':'long',day:'numeric',weekday:'short',hour:'numeric',minute:'2-digit'}).format(new Date(ts))},
 d:function(ts){return df({month:L==='en'?'short':'long',day:'numeric',weekday:'short'}).format(new Date(ts))},
 md:function(ts){return df({month:L==='en'?'short':'long',day:'numeric'}).format(new Date(ts))},
 time:function(ts){return df({hour:'numeric',minute:'2-digit'}).format(new Date(ts))},
 wd:function(ts){return df({weekday:'short'}).format(new Date(ts))},
 hm:function(m){m=Math.max(0,Math.round(m));var h=Math.floor(m/60),r=m%60;return L==='en'?(h?h+' h'+(r?' '+r+' min':''):r+' min'):(h?h+'시간'+(r?' '+r+'분':''):r+'분')}
};
function set(l){if(l!=='ko'&&l!=='en'||l===L)return;L=l;I=l==='en'?1:0;var u=ui();u.lang=l;try{localStorage.setItem(UK,JSON.stringify(u))}catch(e){}
 d.setAttribute('lang',l);apply(document.body);paintBtn();try{dispatchEvent(new CustomEvent('hc:lang',{detail:l}))}catch(e){}}
function paintBtn(){var b=document.getElementById('lgBtn');if(!b)return;b.innerHTML='<span'+(L==='ko'?' class="on"':'')+'>KO</span><i aria-hidden="true">/</i><span'+(L==='en'?' class="on"':'')+'>EN</span>';
 b.setAttribute('aria-label',t('lgAria'));b.setAttribute('lang',L)}
window.hcI18n={get lang(){return L},t:t,set:set,apply:apply,F:F,D:D,key:function(s){return REV[s]},
 init:function(){apply(document.body);paintBtn();var b=document.getElementById('lgBtn');if(b)b.onclick=function(){set(L==='ko'?'en':'ko')}}};
window.t=t;
})();
