/* <wise-text> — custom text tag. modes: split (letters), words (word mask reveal), type, rotate */
class WiseText extends HTMLElement{
  connectedCallback(){
    const m=this.getAttribute('mode')||'words',t=this.getAttribute('text')||this.textContent;
    this.setAttribute('aria-label',t);
    if(m==='split'){this.innerHTML=[...t].map(c=>`<span class="ch" aria-hidden="true" style="display:inline-block">${c}</span>`).join('')}
    else if(m==='words'){this.innerHTML=t.split(' ').map(w=>`<span class="w" aria-hidden="true"><span>${w}</span></span>`).join(' ')}
    else if(m==='type'){this.textContent=t;this._t=t}
    else if(m==='rotate'){this._w=(this.getAttribute('words')||'').split('|');this.textContent=this._w[0]||''}
  }
  play(){
    const m=this.getAttribute('mode'),R=matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(R)return;
    if(typeof gsap==='undefined')return;
    if(m==='split')gsap.from(this.querySelectorAll('.ch'),{yPercent:110,rotate:6,duration:1.1,ease:'expo.out',stagger:.045,delay:.2});
    if(m==='words')gsap.from(this.querySelectorAll('.w>span'),{yPercent:110,duration:1,ease:'expo.out',stagger:.06,scrollTrigger:{trigger:this,start:'top 88%'}});
    if(m==='type'){const t=this._t||'';this.textContent='';this.classList.add('caret');let i=0;const id=setInterval(()=>{this.textContent=t.slice(0,++i);if(i>=t.length){clearInterval(id);setTimeout(()=>this.classList.remove('caret'),1500)}},55)}
    if(m==='rotate'&&this._w&&this._w.length>1){let i=0;const w=this._w;setInterval(()=>{gsap.to(this,{yPercent:-40,opacity:0,duration:.35,onComplete:()=>{i=(i+1)%w.length;this.textContent=w[i];gsap.fromTo(this,{yPercent:40,opacity:0},{yPercent:0,opacity:1,duration:.45,ease:'power3.out'})}})},2200);this.style.display='inline-block'}
  }
}
customElements.define('wise-text',WiseText);

const yrEl=document.getElementById('yr');
if(yrEl)yrEl.textContent=new Date().getFullYear();
const root=document.documentElement;
try{const s=localStorage.getItem('theme');if(s)root.dataset.theme=s}catch(e){}
const themeBtn=document.getElementById('theme');
if(themeBtn){themeBtn.onclick=()=>{const n=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=n;try{localStorage.setItem('theme',n)}catch(e){}};}

if(typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined'){
  gsap.registerPlugin(ScrollTrigger);
}

let lenis;
if(typeof Lenis!=='undefined'){
  lenis=new Lenis({duration:1.15,smoothWheel:true});
  if(typeof ScrollTrigger!=='undefined'){
    lenis.on('scroll',ScrollTrigger.update);
  }
  if(typeof gsap!=='undefined'){
    gsap.ticker.add(t=>lenis.raf(t*1000));
    gsap.ticker.lagSmoothing(0);
  }
}

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const id=a.getAttribute('href');
  if(!id)return;
  if(id.length>1){
    const target=document.querySelector(id);
    if(target){
      e.preventDefault();
      if(lenis){lenis.scrollTo(id,{offset:-20})}else{target.scrollIntoView({behavior:'smooth'})}
    }
  }else{
    e.preventDefault();
    if(lenis){lenis.scrollTo(0)}else{window.scrollTo({top:0,behavior:'smooth'})}
  }
}));

document.querySelectorAll('wise-text').forEach(w=>w.play());

if(typeof gsap!=='undefined'){
  gsap.to('.progress',{scaleX:1,ease:'none',scrollTrigger:{scrub:.2,start:0,end:'max'}});
  /* hero */
  gsap.from('.portrait .frame',{y:60,opacity:0,duration:1.4,ease:'expo.out',delay:.3});
  gsap.from('.lead,.cta,.stats>div,.nav',{y:30,opacity:0,duration:1,stagger:.12,ease:'power3.out',delay:.6});
  gsap.to('.portrait',{yPercent:-8,ease:'none',scrollTrigger:{trigger:'.hero',scrub:true,start:'top top',end:'bottom top'}});
  gsap.to('.o1',{y:200,ease:'none',scrollTrigger:{trigger:'.hero',scrub:true,start:'top top',end:'bottom top'}});

  /* reveals */
  gsap.utils.toArray('.reveal,.card,.site').forEach(el=>gsap.from(el,{y:60,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%'}}));
  gsap.to('.marquee .track',{xPercent:-6,ease:'none',scrollTrigger:{trigger:'.marquee',scrub:1}});

  /* timeline */
  gsap.to('.spine i',{scaleY:1,ease:'none',scrollTrigger:{trigger:'.timeline',start:'top 70%',end:'bottom 70%',scrub:true}});
  gsap.utils.toArray('.tl-item').forEach(el=>gsap.from(el,{x:40,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%'}}));
}

/* stats counter */
document.querySelectorAll('[data-count]').forEach(el=>{
  const n=+el.dataset.count,s=el.dataset.suf||'';
  let done=false;
  const run=()=>{
    if(done)return;done=true;
    if(typeof gsap!=='undefined'){
      const o={v:0};
      gsap.to(o,{v:n,duration:2.4,ease:'power2.out',onUpdate:()=>el.textContent=Math.round(o.v)+s});
    }else{
      el.textContent=n+s;
    }
  };
  if(typeof IntersectionObserver!=='undefined'){
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          obs.disconnect();
          run();
        }
      });
    },{threshold:0.3});
    obs.observe(el);
  }else{
    run();
  }
});

/* libs */
if(typeof Swiper!=='undefined'){
  new Swiper('.li-swiper',{slidesPerView:'auto',spaceBetween:22,grabCursor:true,freeMode:{enabled:true,sticky:false},pagination:{el:'.swiper-pagination',type:'bullets',clickable:true},navigation:{nextEl:'.next',prevEl:'.prev'},mousewheel:false});
}
if(typeof GLightbox!=='undefined'){
  GLightbox({selector:'.glightbox',touchNavigation:true,loop:true});
}

/* tabs */
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('on'));
  b.classList.add('on');
  const p=document.querySelector(`.panel[data-p="${b.dataset.t}"]`);
  if(p)p.classList.add('on');
});

/* cursor + magnetic */
const c=document.querySelector('.cursor');
if(c&&matchMedia('(hover:hover)').matches&&typeof gsap!=='undefined'){
  const mx=gsap.quickTo(c,'x',{duration:.25}),my=gsap.quickTo(c,'y',{duration:.25});
  addEventListener('mousemove',e=>{c.classList.add('on');mx(e.clientX);my(e.clientY)});
  document.querySelectorAll('a,button,.card').forEach(el=>{el.addEventListener('mouseenter',()=>c.classList.add('big'));el.addEventListener('mouseleave',()=>c.classList.remove('big'))});
  document.querySelectorAll('.mag').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();gsap.to(el,{x:(e.clientX-r.left-r.width/2)*.25,y:(e.clientY-r.top-r.height/2)*.35,duration:.4})});el.addEventListener('mouseleave',()=>gsap.to(el,{x:0,y:0,duration:.7,ease:'elastic.out(1,.4)'}))});
  if(typeof VanillaTilt!=='undefined'){
    VanillaTilt.init(document.querySelectorAll('.tilt'));
  }
}

/* copy email with full fallback */
const copyBtn=document.getElementById('copy');
if(copyBtn){
  copyBtn.onclick=e=>{
    const email='maniahakumari05@gmail.com';
    const showCopied=()=>{
      e.target.textContent='Copied ✓';
      setTimeout(()=>{if(e.target)e.target.textContent='Copy email'},2000);
    };
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(email).then(showCopied).catch(()=>{
        fallbackCopy(email,showCopied);
      });
    }else{
      fallbackCopy(email,showCopied);
    }
  };
}

function fallbackCopy(text,cb){
  try{
    const ta=document.createElement('textarea');
    ta.value=text;
    ta.style.position='fixed';
    ta.style.opacity='0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    if(cb)cb();
  }catch(err){}
}
