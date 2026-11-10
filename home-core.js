/* منطق مشترك: توليد مهام اليوم وحساب النقاط */
const DEF={sleep:'20:30',wake:'06:30',bf:'07:00',lunch:'13:00',lunchPm:'11:00',dinner:'19:30',swap:false,pin:''};
const m2t=m=>{m=((m%1440)+1440)%1440;const h=Math.floor(m/60),n=m%60;return (h%12||12)+':'+String(n).padStart(2,'0')+' '+(h<12?'ص':'م')};
const t2m=t=>{const[a,b]=(t||'0:0').split(':');return +a*60+ +b};
const dayKey=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
function shiftOf(c,di){return((di<2)!==!!c.swap)?'am':'pm'}
function gen(c,subs,di){
 c={...DEF,...c};const sh=shiftOf(c,di),T=[],w=t2m(c.wake),sl=t2m(c.sleep),bf=t2m(c.bf);
 const busy=[],add=(id,title,f,t,p,x)=>T.push({id,title,from:f,to:t,pts:p,...x});
 add('wake','استيقظت من النوم',w,w+30,5);
 add('bf','تناولت فطوري',bf,bf+30,5);
 const lu=t2m(sh==='am'?c.lunch:c.lunchPm),dn=t2m(c.dinner);
 add('lunch','تناولت غدائي',lu,lu+30,8);add('dinner','تناولت عشائي',dn,dn+30,8);
 busy.push([lu,lu+45],[dn,dn+45],[sh==='am'?480:720,(sh==='am'?720:960)+20],[sl-30,sl+60]);
 busy.sort((a,b)=>a[0]-b[0]);
 const q=[],rot=[['play','لعبت وارتحت'],['read','قرأت كتابًا'],['rest','أخذت راحة'],['write','كتبت ودوّنت']];let r=0;
 (subs||[]).forEach((s,i)=>{q.push(['study','أتممت درس '+s,s]);if(i%2)q.push(rot[r++%4])});
 let cur=bf+30,k=0;
 for(const[b0,b1]of busy.concat([[sl-30,sl-30]])){
  while(b0-cur>=40&&k<14){const it=q.length?q.shift():rot[r++%4],e=cur+Math.min(45,b0-cur);
   add('b'+k++,it[1],cur,e,it[0]==='study'?6:3,{kind:it[0]});cur=e}
  cur=Math.max(cur,b1)}
 add('sleep','أنا نائم الآن 😴',sl-30,sl+30,20,{pin:1});
 return T.sort((a,b)=>a.from-b.from)}
/* نقاط: ضمن النافذة كاملة، وبعد انتهائها تُغلق المهمة */
function pts(t,mins){if(mins<t.from)return -1;if(mins<=t.to)return t.pts;return 0}
/* تطبيع الاسم للبحث */
const nm=s=>(s||'').replace(/[\u064B-\u065F\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ئ/g,'ي').replace(/ؤ/g,'و').replace(/ء/g,'').replace(/[^\u0621-\u064Aa-zA-Z0-9\s]/g,'').trim().split(/\s+/).filter(Boolean).join('_');
const cmp=s=>nm(s).replace(/_/g,'');
const nkeys=n=>{const w=(n||'').trim().split(/\s+/);return[...new Set([nm(n),nm(w.slice(0,3).join(' '))])].filter(Boolean)};
