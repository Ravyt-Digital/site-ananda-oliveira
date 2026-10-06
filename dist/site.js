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

// Current identity and contact details for Ananda Oliveira.
document.title='Ananda Oliveira Consultora de Imagem e Estilo em Teresina';
const heroHeading=document.querySelector('#inicio h1');
if(heroHeading){
 heroHeading.innerHTML='<span class="block overflow-hidden pb-2"><span class="block">Descubra sua verdadeira identidade</span></span>';
}
document.querySelectorAll('a[href="https://instagram.com/casinhadebiju"]').forEach(link=>{
 link.href='https://www.instagram.com/anandanconsultora/';
 link.innerHTML=link.innerHTML.replace('@casinhadebiju','@anandanconsultora');
});

// Booking actions go directly to WhatsApp.
const bookingUrl='http://wa.me/5586988631206';
document.querySelectorAll('header a[href*="anandanconsultora"], #contato a[href*="anandanconsultora"]').forEach(link=>{
 link.href=bookingUrl;
 link.removeAttribute('target');
 link.removeAttribute('rel');
});

// Use the requested accent colour only on the final word of the hero title.
if(heroHeading){
 heroHeading.innerHTML='<span class="block overflow-hidden pb-2"><span class="block">Descubra sua verdadeira <span style="color:#E182B7">identidade</span></span></span>';
}

// Replace the service carousel with the current service menu supplied by Ananda.
const serviceTrack=document.querySelector('#servicos > div > div');
if(serviceTrack){
 const serviceItems=[
  ['01','Análise de Coloração Pessoal','Descubra quais cores mais favorecem você, além de estampas, maquiagem, cabelo e acessórios. Você recebe uma cartela impressa e um dossiê completo. Atendimento presencial.','assets/servico-coloracao-pessoal.webp'],
  ['02','Análise de Corpo, Rosto e Estilo','Descubra seu tipo de corpo, as roupas que mais valorizam você, cortes de cabelo, óculos, acessórios e ajustes para comunicar sua imagem. Inclui dossiê. Pode ser online.','assets/153a3f2cdfa41f4a_5a4787bba_generated_35bf22bb.webp'],
  ['03','Detox de Guarda-Roupa','Análise do guarda-roupa para decidir o que manter, reformar ou descartar, tornando tudo mais inteligente e prático para sua rotina. Pode ser online.','assets/a4728b2eeef58675_4c5a09830_generated_802ea5df.webp'],
  ['04','Personal Shopping','Compras orientadas de acordo com seu estilo e orçamento, incluindo a montagem de 20 looks. Pode ser realizado online.','assets/7a52e133928d917c_037bafacc_generated_1bceab5e.webp'],
  ['05','Mala Planejada','Montagem da mala de viagem com looks assertivos, organizados de acordo com sua programação e destino.','assets/5091e63567b3b5d8_761af2b14_generated_ce485b64.webp']
 ];
 serviceTrack.innerHTML='<div class="w-[80vw] shrink-0 md:w-[34vw]"><p class="mb-6 text-[12px] uppercase tracking-[0.35em] text-[#B8336A]">Consultoria personalizada</p><h2 class="font-display text-6xl font-light italic leading-[0.95] text-[#1A1A1A] md:text-8xl">Serviços para traduzir sua identidade</h2><p class="mt-8 max-w-sm text-lg leading-relaxed text-[#4A4E4D]">Escolha a experiência que combina com o momento que você está vivendo.</p></div>'+serviceItems.map(item=>`<article class="group grid w-[84vw] shrink-0 grid-cols-1 gap-6 md:w-[58vw] md:grid-cols-2 md:gap-10 lg:w-[48vw]"><div class="relative aspect-[4/5] max-h-[38vh] overflow-hidden rounded-[2px] md:max-h-[70vh]"><img alt="${item[1]}" class="w-full h-full inset-0 absolute object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-110" loading="eager" decoding="async" src="${item[3]}"><span class="absolute left-4 top-4 font-display text-5xl italic text-white mix-blend-difference">${item[0]}</span></div><div class="flex flex-col justify-center"><h3 class="font-display text-4xl font-light italic text-[#1A1A1A] md:text-5xl">${item[1]}</h3><p class="mt-4 text-base leading-relaxed text-[#4A4E4D] md:text-lg">${item[2]}</p><a class="mt-8 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.25em] text-[#1A1A1A]" href="${bookingUrl}">Agendar este serviço <span aria-hidden="true">↗</span></a></div></article>`).join('');
 serviceTrack.querySelectorAll('a[href="'+bookingUrl+'"]').forEach(link=>{link.target='_self'});
}

// Replace the favicon with Ananda's symbol from the supplied logo.
const favicon=document.querySelector('link[rel="icon"]');
if(favicon) favicon.href='assets/ananda-oliveira-icon.png';

// Remove the two outdated backstage pieces supplied for replacement.
const backstageSection=[...document.querySelectorAll('section')].find(section=>section.textContent.includes('Bastidores'));
if(backstageSection){
 const backstageGrid=backstageSection.querySelector('.grid');
 backstageGrid?.querySelector('img[src*="7ba74b93282deea9"]')?.closest('[data-reveal]')?.remove();
 backstageGrid?.querySelector('video[data-src*="8721c0b639083c0b"]')?.closest('[data-reveal]')?.remove();
}
