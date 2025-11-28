/* ============================
   app.js — menu, chat, slideshow
   ============================ */

const WA_NUMBER = "5521980722830"; // alterar aqui se desejar

/* elements */
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuInner = mobileMenu?.querySelector('.mobile-menu-inner');
const menuLinks = mobileMenu?.querySelectorAll('a') || [];

const chatToggle = document.getElementById('chatToggle');
const chatPanel = document.getElementById('chatPanel');
const chatBody = document.getElementById('chatBody');
const chatSend = document.getElementById('chatSend');
const chatName = document.getElementById('chatName');
const chatBackdrop = document.getElementById('chatBackdrop');
const fabs = document.getElementById('fabs');

const btnWhats = document.getElementById('btnWhats');
const ctaBook = document.getElementById('ctaBook');
const sendContact = document.getElementById('sendContact');

const heroVideo = document.getElementById('heroVideo');
const soundBtn = document.getElementById('soundBtn');

/* custom select */
const customSelectBtn = document.getElementById('customSelectBtn');
const customSelectList = document.getElementById('customSelectList');
const customSelectValue = document.getElementById('customSelectValue');

let customSelected = ""; // guarda valor selecionado

/* small helpers */
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ========== slideshow ========= */
(function initSlideshow(){
  const slides = Array.from(document.querySelectorAll('.slideshow .slide'));
  const dotsWrap = document.getElementById('dots');
  if(!slides.length || !dotsWrap) return;
  let idx = 0, timer = null, INTERVAL = 3600;

  slides.forEach((s,i)=>{
    const d = document.createElement('div');
    d.className = 'dot' + (i===0 ? ' active' : '');
    d.addEventListener('click', ()=> go(i));
    dotsWrap.appendChild(d);
  });

  function show(i){
    slides.forEach((s,ii)=> s.classList.toggle('active', ii===i));
    Array.from(dotsWrap.children).forEach((d,ii)=> d.classList.toggle('active', ii===i));
  }
  function next(){ idx = (idx+1)%slides.length; show(idx); }
  function go(i){ idx = i; show(idx); reset(); }
  function reset(){ if(timer) clearInterval(timer); timer = setInterval(next, INTERVAL); }

  show(idx); reset();
  const slideshow = document.getElementById('slideshow');
  if(slideshow){
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting) reset(); else clearInterval(timer);
      });
    }, {threshold:0.18});
    obs.observe(slideshow);
  }
})();

/* ========== hero video controls ========= */
(function(){
  if(!heroVideo) return;
  heroVideo.muted = true;
  heroVideo.playsInline = true;
  heroVideo.loop = true;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting) heroVideo.play().catch(()=>{});
      else heroVideo.pause();
    });
  }, {threshold:0.35});
  obs.observe(heroVideo);
  if(soundBtn){
    soundBtn.addEventListener('click', ()=>{
      heroVideo.muted = false;
      heroVideo.volume = 1;
      soundBtn.style.display = 'none';
      heroVideo.play().catch(()=>{});
    });
  }
})();

/* ========== mobile menu (open/close, click outside) ========= */
(function initMobileMenu(){
  if(!menuBtn || !mobileMenu) return;
  menuBtn.addEventListener('click', (e)=>{
    const open = mobileMenu.classList.toggle('open');
    menuBtn.classList.toggle('open', open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // close when click a link inside
  menuLinks.forEach(a=>{
    a.addEventListener('click', (ev)=>{
      mobileMenu.classList.remove('open');
      menuBtn.classList.remove('open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    });
  });

  // click outside: listen on document and ensure click not inside menu or button
  document.addEventListener('click', (ev)=>{
    if(!mobileMenu.classList.contains('open')) return;
    const target = ev.target;
    if(menuBtn.contains(target) || mobileMenu.contains(target)) return;
    // outside -> close
    mobileMenu.classList.remove('open');
    menuBtn.classList.remove('open');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  });

  // ESC closes menu
  document.addEventListener('keydown', (ev)=> {
    if(ev.key === 'Escape'){
      mobileMenu.classList.remove('open');
      menuBtn.classList.remove('open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      closeChat();
    }
  });
})();

/* ========== custom select (no native dropdown) ========= */
(function initCustomSelect(){
  if(!customSelectBtn || !customSelectList) return;

  function openList(){
    customSelectList.classList.add('open');
    customSelectBtn.setAttribute('aria-expanded','true');
    customSelectList.setAttribute('aria-hidden','false');
  }
  function closeList(){
    customSelectList.classList.remove('open');
    customSelectBtn.setAttribute('aria-expanded','false');
    customSelectList.setAttribute('aria-hidden','true');
  }
  customSelectBtn.addEventListener('click',(ev)=>{
    ev.stopPropagation();
    customSelectList.classList.toggle('open');
    const nowOpen = customSelectList.classList.contains('open');
    customSelectBtn.setAttribute('aria-expanded', nowOpen ? 'true' : 'false');
    customSelectList.setAttribute('aria-hidden', !nowOpen);
  });

  customSelectList.addEventListener('click', (ev)=>{
    const li = ev.target.closest('li');
    if(!li) return;
    const val = li.dataset.value;
    customSelected = val;
    customSelectValue.textContent = val;
    closeList();
  });

  // close on outside click
  document.addEventListener('click', (ev)=>{
    if(customSelectList.classList.contains('open') && !customSelectBtn.contains(ev.target) && !customSelectList.contains(ev.target)){
      closeList();
    }
  });

  // keyboard
  customSelectBtn.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowDown'){ e.preventDefault(); openList(); customSelectList.querySelector('li')?.focus(); }
    if(e.key === 'Escape') closeList();
  });
})();

/* ========== chat (typing bubble, open/close, hide fabs) ========= */
let isTyping = false;

function showTypingThenPush(text){
  if(!chatBody) return;
  if(isTyping) return;
  isTyping = true;
  const typing = document.createElement('div');
  typing.className = 'msg typing';
  typing.innerHTML = '<div class="dot-typing"></div><div class="dot-typing"></div><div class="dot-typing"></div>';
  chatBody.appendChild(typing);
  chatBody.scrollTop = chatBody.scrollHeight;
  const estimated = Math.min(1800, 400 + (text.length * 18));
  setTimeout(()=>{
    typing.remove();
    const d = document.createElement('div');
    d.className = 'msg bot';
    d.innerText = text;
    chatBody.appendChild(d);
    chatBody.scrollTop = chatBody.scrollHeight;
    isTyping = false;
  }, estimated);
}

function pushUser(text){
  if(!chatBody) return;
  const d = document.createElement('div');
  d.className = 'msg user';
  d.innerText = text;
  chatBody.appendChild(d);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function openChat(initialMessage){
  if(!chatPanel || !chatBackdrop) return;
  chatPanel.classList.add('open');
  chatBackdrop.classList.add('show');
  if(fabs) fabs.classList.add('hidden-fabs');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  if(initialMessage) showTypingThenPush(initialMessage);
}

let chatOpenedOnce = false;

chatToggle.addEventListener('click', () => {
  const isOpen = chatPanel.classList.contains('open');

  if (isOpen) {
    // fechar
    chatPanel.classList.remove('open');
    chatBackdrop.classList.remove('show');
  } else {
    // abrir
    chatPanel.classList.add('open');
    chatBackdrop.classList.add('show');

    // mensagem inicial apenas 1 vez
    if (!chatOpenedOnce) {
      pushBot("Olá! 👋 Eu sou a Caty — qual serviço você deseja?");
      chatOpenedOnce = true;
    }
  }
});


// close when clicking outside or on backdrop
chatBackdrop?.addEventListener('click', closeChat);
document.addEventListener('click', (ev)=>{
  if(!chatPanel.classList.contains('open')) return;
  const inside = chatPanel.contains(ev.target) || chatToggle.contains(ev.target);
  if(!inside) closeChat();
});

/* ========== send chat -> whatsapp (uses custom select value) ========= */
chatSend?.addEventListener('click', ()=>{
  // value from customSelected
  const service = customSelected || "";
  const name = (chatName?.value || '').trim();

  if(!service){
    showTypingThenPush('Ops — selecione um serviço antes de abrir o WhatsApp, por favor.');
    // visual feedback: pulse select button
    customSelectBtn.style.boxShadow = '0 0 0 3px rgba(255,0,0,0.12)';
    setTimeout(()=> customSelectBtn.style.boxShadow = '', 900);
    return;
  }

  pushUser(`${service}${name ? (' • ' + name) : ''}`);
  showTypingThenPush('Perfeito — abrindo o WhatsApp com a mensagem pronta.');

  let msg = `Olá! Gostaria de um orçamento para *${service}*.\n`;
  if(name) msg += `Nome: ${name}\n`;
  msg += `\nVim pelo site: Studio Caty Hair.`;

  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
});

/* ========== contact form -> whatsapp ========= */
sendContact?.addEventListener('click', ()=>{
  const n = (document.getElementById('fname') || {}).value || "";
  const p = (document.getElementById('fphone') || {}).value || "";
  const m = (document.getElementById('fmsg') || {}).value || "";
  let text = `Olá! Gostaria de um orçamento.\n`;
  if(n) text += `Nome: ${n}\n`;
  if(p) text += `Telefone: ${p}\n`;
  if(m) text += `Mensagem: ${m}\n`;
  text += `\nVim pelo site.`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
});

/* ========== initial helper bubble (only once per session) ========= */
(function initialHint(){
  const seenKey = 'caty_chat_seen_v1';
  const seen = sessionStorage.getItem(seenKey);
  if(!seen){
    setTimeout(()=>{
      if(chatPanel && chatPanel.classList.contains('open')) return;
      const helper = document.createElement('div');
      helper.className = 'msg bot';
      helper.innerText = "Olá! Precisa de um orçamento? Toque no botão 💬 ou use 'Pedir Orçamento'.";
      if(chatBody) {
        chatBody.appendChild(helper);
        chatBody.scrollTop = chatBody.scrollHeight;
        setTimeout(()=> helper.remove(), 6000);
      }
      sessionStorage.setItem(seenKey,'1');
    }, 900);
  }
})();

/* ========== hide/show fabs based on chat (safety) ========= */
function ensureFabs(){
  if(!fabs) return;
  // already handled in openChat/closeChat via class added/removed
}

/* ========== btnWhats (open chat and focus) ========= */
btnWhats?.addEventListener('click', (e)=>{
  e.preventDefault();
  openChat('Vamos começar seu orçamento! Selecione o serviço e escreva seu nome (opcional).');
  setTimeout(()=> { customSelectBtn?.focus(); }, 260);
});

/* ========== misc interactions: close mobile menu / chat on resize (cleanup) ========= */
window.addEventListener('resize', ()=>{
  // ensure mobile menu hidden if resized to desktop
  if(window.innerWidth > 980){
    mobileMenu.classList.remove('open');
    menuBtn.classList.remove('open');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }
});

/* ========== accessibility: ESC closes chat/menu ========= */
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    mobileMenu.classList.remove('open'); menuBtn.classList.remove('open');
    closeChat();
  }
});

/* ========== basic log ========= */
console.log('app.js loaded');
