/* ============================================================
   🔥 FUNÇÕES ÚTEIS
============================================================ */

function qs(el){ return document.querySelector(el); }
function qsa(el){ return document.querySelectorAll(el); }

/* Delay Promisificado */
function wait(ms){ return new Promise(res => setTimeout(res, ms)); }

/* ============================================================
   🎬 SLIDESHOW
============================================================ */
const slides = qsa('.slide');
const dots = qs('#dots');
let idx = 0;

slides.forEach((s,i)=>{
  let d = document.createElement('div');
  d.className = 'dot' + (i===0?' active':'');
  d.onclick = ()=> goSlide(i);
  dots.appendChild(d);
});

function goSlide(i){
  slides.forEach((s,n)=> s.classList.toggle('active',n===i));
  [...dots.children].forEach((d,n)=> d.classList.toggle('active',n===i));
  idx = i;
}

setInterval(()=> goSlide((idx+1)%slides.length), 3500);


/* ============================================================
   🍔 MENU MOBILE FULLSCREEN
============================================================ */
const menuToggle = qs('#menuToggle');
const mobileMenu = qs('#mobileMenu');

menuToggle.onclick = ()=>{
  menuToggle.classList.toggle('active');
  mobileMenu.classList.toggle('open');
};

document.addEventListener('click', e=>{
  if(!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)){
    mobileMenu.classList.remove('open');
    menuToggle.classList.remove('active');
  }
});


/* ============================================================
   💬 CHAT - BOT INTELIGENTE PREMIUM
============================================================ */

const chatToggle = qs('#chatToggle');
const chatPanel  = qs('#chatPanel');
const chatBody   = qs('#chatBody');
const chatService = qs('#chatService');
const chatName = qs('#chatName');
const chatSend = qs('#chatSend');
const chatBackdrop = qs('#chatBackdrop');
const fabs = qs('.fabs');

let chatOpenedOnce = false;

/* BOT digitando... */
function botTyping(){
  const d = document.createElement('div');
  d.className = 'msg bot typing';
  d.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
  chatBody.appendChild(d);
  chatBody.scrollTop = chatBody.scrollHeight;
  return d;
}

/* Remove typing */
function removeTyping(el){
  if(el && el.parentNode) el.parentNode.removeChild(el);
}

/* Mensagem Bot com delay humanizado */
async function sendBot(text, ms=900){
  const typing = botTyping();
  await wait(ms);
  removeTyping(typing);

  const d = document.createElement("div");
  d.className = "msg bot";
  d.textContent = text;
  chatBody.appendChild(d);
  chatBody.scrollTop = chatBody.scrollHeight;
}

/* Usuário */
function sendUser(text){
  const d = document.createElement("div");
  d.className = "msg user";
  d.textContent = text;
  chatBody.appendChild(d);
  chatBody.scrollTop = chatBody.scrollHeight;
}



/* ============================================================
   📥 ABRIR / FECHAR
============================================================ */

chatToggle.onclick = async ()=>{

  const open = chatPanel.classList.contains('open');

  if(open){
    chatPanel.classList.remove('open');
    chatBackdrop.classList.remove('show');
    fabs.classList.remove('hidden-fabs');
  } else {
    chatPanel.classList.add('open');
    chatBackdrop.classList.add('show');
    fabs.classList.add('hidden-fabs');

    if(!chatOpenedOnce){
      await sendBot("Olá! 👋 Eu sou a Caty.");
      await sendBot("Qual serviço você deseja?");
      chatOpenedOnce = true;
    }
  }
};

chatBackdrop.onclick = ()=>{
  chatPanel.classList.remove('open');
  chatBackdrop.classList.remove('show');
  fabs.classList.remove('hidden-fabs');
};


/* ============================================================
   📤 Envio para WhatsApp
============================================================ */

chatSend.onclick = async ()=>{

  const service = chatService.value.trim();
  const name = chatName.value.trim();

  if(!service){
    await sendBot("Selecione um serviço antes 🙂");
    return;
  }

  sendUser(service + (name ? ` • ${name}` : ""));

  await sendBot("Perfeito! Preparando seu WhatsApp...", 700);

  const msg = encodeURIComponent(
    `Olá! Gostaria de um orçamento para *${service}*.\n` +
    (name ? `Nome: ${name}\n` : "") +
    `Vim pelo site Studio Caty Hair.`
  );

  window.open(`https://wa.me/5521980722830?text=${msg}`, "_blank");

  await wait(300);
  await sendBot("Prontinho! 💛 Se precisar de algo, estou aqui.");
};


/* ============================================================
   📩 FORMULÁRIO DO CONTATO
============================================================ */

qs("#sendContact").onclick = ()=>{

  const n = qs("#fname").value;
  const p = qs("#fphone").value;
  const m = qs("#fmsg").value;

  const msg = encodeURIComponent(
    `Olá! Gostaria de agendar:\n` +
    `Nome: ${n}\nTelefone: ${p}\nMensagem: ${m}\n` +
    `Vim pelo site.`
  );

  window.open(`https://wa.me/5521980722830?text=${msg}`,"_blank");
};


/* ============================================================
   📱 PWA (Service Worker)
============================================================ */

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("/sw.js");
}
