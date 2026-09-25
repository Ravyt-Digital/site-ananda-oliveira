const header=document.querySelector('header');
const onScroll=()=>header.classList.toggle('is-scrolled',scrollY>60);
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#site-nav');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu')});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));
const seasons={
 'Primavera':{tag:'Quente · Clara · Luminosa',tint:'#FBF1E6',text:'Energia solar e frescor. Tons vivos e aquecidos que trazem leveza e brilho ao rosto.',colors:['#F4A582','#F7C873','#9BC53D','#F28C8C','#FFD6A5','#4FB0A5','#E86A33','#FBE7C6']},
 'Verão':{tag:'Fria · Suave · Delicada',tint:'#EEF0F5',text:'Elegância silenciosa. Cores esfumadas e frias que conversam com uma beleza serena.',colors:['#A7B8D1','#C9A7C7','#8FA9B8','#E3B5C1','#7D8CA3','#B5C7C0','#D8C3D8','#6E7F99']},
 'Outono':{tag:'Quente · Profunda · Terrosa',tint:'#F4EADF',text:'Riqueza e acolhimento. Tons de terra, especiarias e folhagens que transmitem maturidade.',colors:['#8B4513','#B5651D','#6B7F3A','#C68642','#7A3E2B','#A0522D','#D2A15D','#4F5D2F']},
 'Inverno':{tag:'Fria · Intensa · Contrastante',tint:'#ECECF2',text:'Impacto e magnetismo. Cores puras e marcantes para quem nasceu para o alto contraste.',colors:['#0B1F4B','#B0003A','#111111','#FFFFFF','#4B0082','#006D6F','#C71585','#5A5A66']}
};
const seasonSection=document.querySelector('#estacoes');
const seasonButtons=[...seasonSection.querySelectorAll('button')];
const seasonView=seasonSection.querySelector('.grid.max-w-6xl');
const seasonTag=seasonView.querySelector('p');const seasonTitle=seasonView.querySelector('h3');const seasonText=seasonView.querySelector('p:last-child');
const swatches=[...seasonView.querySelectorAll('.grid.grid-cols-4>div')];
const seasonNav=seasonButtons[0].parentElement;
const seasonPill=document.createElement('span');
seasonPill.className='season-pill';seasonPill.setAttribute('aria-hidden','true');seasonNav.prepend(seasonPill);
let activeSeasonButton=seasonButtons[0];let seasonTimer;
function positionSeasonPill(){
 const rect=activeSeasonButton.getBoundingClientRect(),parent=seasonNav.getBoundingClientRect();
 Object.assign(seasonPill.style,{left:`${rect.left-parent.left}px`,top:`${rect.top-parent.top}px`,width:`${rect.width}px`,height:`${rect.height}px`});
}
seasonButtons.forEach(button=>button.addEventListener('click',()=>{
 const name=button.textContent.trim(),season=seasons[name];if(!season)return;
 activeSeasonButton=button;positionSeasonPill();
 seasonButtons.forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});
 seasonSection.style.backgroundColor=season.tint;
 const copy=seasonView.firstElementChild;copy.classList.add('changing');
 swatches.forEach(swatch=>swatch.classList.add('changing'));
 clearTimeout(seasonTimer);
 seasonTimer=setTimeout(()=>{
   seasonTag.textContent=season.tag;seasonTitle.textContent=name;seasonText.textContent=season.text;
   swatches.forEach((swatch,i)=>swatch.style.backgroundColor=season.colors[i]);
   requestAnimationFrame(()=>{copy.classList.remove('changing');swatches.forEach(swatch=>swatch.classList.remove('changing'))});
 },180);
}));
seasonButtons[0]?.classList.add('active');seasonButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===0)));
requestAnimationFrame(positionSeasonPill);
window.addEventListener('resize',positionSeasonPill,{passive:true});
document.querySelectorAll('#duvidas button').forEach(button=>button.addEventListener('click',()=>{
 const panel=document.getElementById(button.getAttribute('aria-controls'));
 const expand=button.getAttribute('aria-expanded')!=='true';
 button.setAttribute('aria-expanded',String(expand));panel.hidden=!expand;
}));

// Media stays on its poster until it is close to the visible area.
const videos=[...document.querySelectorAll('video[data-src]')];
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(({target, isIntersecting})=>{
   if(isIntersecting && !reducedMotion.matches){
     if(!target.src){target.src=matchMedia('(max-width: 680px)').matches && target.dataset.mobileSrc || target.dataset.src;target.load()}
     target.play().catch(()=>{});
   }else target.pause();
 }),{rootMargin:'180px 0px'});
 videos.forEach(video=>observer.observe(video));
}else videos.forEach(video=>{video.src=video.dataset.mobileSrc||video.dataset.src;video.load()});

// Match the original pinned horizontal journey while keeping native vertical scrolling.
const services=document.querySelector('#servicos');
const servicesTrack=services.querySelector('.sticky>div');
const heroCopy=document.querySelector('[data-parallax="hero-copy"]');
const heroImage=document.querySelector('[data-parallax="hero-image"]');
const aboutImage=document.querySelector('[data-parallax="about"]');
const scrollCue=document.querySelector('#inicio>div:last-child');
let serviceTravel=0,serviceRange=1,ticking=false;
const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
function measureMotion(){
 serviceTravel=Math.max(0,servicesTrack.scrollWidth-innerWidth);
 serviceRange=Math.max(1,services.offsetHeight-innerHeight);
 updateMotion();
}
function interpolateColor(from,to,p){
 const f=from.match(/\w\w/g).map(x=>parseInt(x,16)),t=to.match(/\w\w/g).map(x=>parseInt(x,16));
 return `rgb(${f.map((v,i)=>Math.round(v+(t[i]-v)*p)).join(',')})`;
}
function updateMotion(){
 ticking=false;
 if(reducedMotion.matches)return;
 const top=services.getBoundingClientRect().top;
 const progress=clamp(-top/serviceRange,0,1);
 services.style.setProperty('--services-x',`${(-progress*serviceTravel).toFixed(1)}px`);
 services.style.backgroundColor=progress<.5?interpolateColor('#E9EDF2','#F4ECE6',progress*2):interpolateColor('#F4ECE6','#F1DFD0',(progress-.5)*2);
 const y=scrollY;
 if(y<innerHeight*1.5){
   heroCopy.style.transform=`translate3d(0,${(-Math.min(y,900)/900*120).toFixed(1)}px,0)`;
   heroCopy.style.opacity=String(1-clamp(y/600,0,1));
   heroImage.style.transform=`translate3d(0,${(Math.min(y,900)/900*180).toFixed(1)}px,0)`;
   if(scrollCue)scrollCue.style.opacity=String(1-clamp(y/600,0,1));
 }
 const about=document.querySelector('#sobre').getBoundingClientRect();
 if(about.top<innerHeight && about.bottom>0 && aboutImage){
   const p=clamp((innerHeight-about.top)/(innerHeight+about.height),0,1);
   aboutImage.style.transform=`translate3d(0,${((p-.5)*20).toFixed(1)}%,0)`;
 }
}
function scheduleMotion(){if(!ticking){ticking=true;requestAnimationFrame(updateMotion)}}
window.addEventListener('scroll',scheduleMotion,{passive:true});
window.addEventListener('resize',measureMotion,{passive:true});
if('ResizeObserver' in window)new ResizeObserver(measureMotion).observe(servicesTrack);
measureMotion();

// Re-entering the viewport replays the supplied scroll reveal.
if('IntersectionObserver' in window && !reducedMotion.matches){
 const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
   entry.target.classList.toggle('in-view',entry.isIntersecting);
 }),{threshold:.14,rootMargin:'0px 0px -5% 0px'});
 document.querySelectorAll('[data-reveal]').forEach(el=>revealObserver.observe(el));
}

// The final call-to-action follows the pointer and eases back on mouse leave.
const magneticButton=document.querySelector('#contato a.rounded-full');
if(magneticButton && matchMedia('(hover:hover) and (pointer:fine)').matches && !reducedMotion.matches){
 magneticButton.addEventListener('pointermove',event=>{
   const r=magneticButton.getBoundingClientRect();
   const x=(event.clientX-(r.left+r.width/2))*.35,y=(event.clientY-(r.top+r.height/2))*.35;
   magneticButton.style.transform=`translate3d(${x}px,${y}px,0) scale(1.06)`;
 });
 magneticButton.addEventListener('pointerleave',()=>magneticButton.style.transform='translate3d(0,0,0) scale(1)');
}

// Subtle cursor light on the four method cards; complements existing scroll reveals.
if(matchMedia('(hover:hover) and (pointer:fine)').matches && !reducedMotion.matches){
 document.querySelectorAll('#metodo [data-reveal].group').forEach(card=>{
  card.addEventListener('pointermove',event=>{
   const bounds=card.getBoundingClientRect();
   card.style.setProperty('--spot-x',`${event.clientX-bounds.left}px`);
   card.style.setProperty('--spot-y',`${event.clientY-bounds.top}px`);
  },{passive:true});
 });
}
