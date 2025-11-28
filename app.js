/* ============================================================
   📅 Ano Automático
============================================================ */
document.querySelectorAll("#yr").forEach(y => y.textContent = new Date().getFullYear());



/* ============================================================
   🟡 HERO - efeito de movimento
============================================================ */
const hero = document.querySelector(".hero");
const heroBg = document.querySelector(".hero-bg");

if(hero && heroBg){
  hero.addEventListener("mousemove", e => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;

    heroBg.style.transform = `translate(${x * 6}px, ${y * 6}px) scale(1.06)`;
  });

  hero.addEventListener("mouseleave", () => {
    heroBg.style.transform = "scale(1.04)";
  });
}



/* ============================================================
   🎥 HERO VIDEO – autoplay + botão de som
============================================================ */
const heroVideo = document.getElementById("heroVideo");
const soundBtn = document.getElementById("soundBtn");

if(heroVideo){
  heroVideo.muted = true;
  heroVideo.play().catch(()=>{});

  const obsVideo = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) heroVideo.play().catch(()=>{});
      else heroVideo.pause();
    });
  }, { threshold: 0.4 });

  obsVideo.observe(heroVideo);
}

if(soundBtn){
  soundBtn.addEventListener("click", () => {
    heroVideo.muted = false;
    soundBtn.style.display = "none";
  });
}



/* ============================================================
   🖼️ GALERIA SLIDESHOW AUTOMÁTICO
============================================================ */
(function(){
  const slides = document.querySelectorAll(".slide");
  const dotsWrap = document.getElementById("dots");
  let index = 0;
  let timer;
  const interval = 3500;

  slides.forEach((s, i) => {
    const d = document.createElement("div");
    d.className = "dot" + (i === 0 ? " active" : "");
    d.addEventListener("click", () => go(i));
    dotsWrap.appendChild(d);
  });

  function show(i){
    slides.forEach((s, ii) => s.classList.toggle("active", ii === i));
    dotsWrap.querySelectorAll(".dot").forEach((d, ii) => d.classList.toggle("active", ii === i));
  }

  function next(){
    index = (index + 1) % slides.length;
    show(index);
  }

  function go(i){
    index = i;
    show(index);
    reset();
  }

  function reset(){
    clearInterval(timer);
    timer = setInterval(next, interval);
  }

  reset();
})();



/* ============================================================
   🍔 MENU FULLSCREEN PREMIUM
============================================================ */
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("open");
  mobileMenu.classList.toggle("open");
});


// Fechar menu ao clicar fora
document.addEventListener("click", (e)=>{
  if(!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)){
    mobileMenu.classList.remove("open");
    menuBtn.classList.remove("open");
  }
});

// Fechar ao clicar em item
document.querySelectorAll(".mobile-menu a").forEach(a=>{
  a.addEventListener("click", ()=>{
    mobileMenu.classList.remove("open");
    menuBtn.classList.remove("open");
  });
});



/* ============================================================
   💬 CHAT SYSTEM PREMIUM
============================================================ */
const chatToggle = document.getElementById("chatToggle");
const chatPanel = document.getElementById("chatPanel");
const chatBody = document.getElementById("chatBody");
const chatBackdrop = document.getElementById("chatBackdrop");
const chatService = document.getElementById("chatService");
const chatName = document.getElementById("chatName");
const chatSend = document.getElementById("chatSend");
const fabs = document.querySelector(".fabs");

let firstOpen = true;



/* ------------------------------------------------------------
   ✨ Funções de mensagens com typing animation
------------------------------------------------------------ */
function botTyping(callback){
  const bubble = document.createElement("div");
  bubble.className = "msg bot typing";
  bubble.innerHTML = `
    <div class="dot-typing"></div>
    <div class="dot-typing"></div>
    <div class="dot-typing"></div>
  `;

  chatBody.appendChild(bubble);
  chatBody.scrollTop = chatBody.scrollHeight;

  setTimeout(()=>{
    bubble.remove();
    callback();
  }, 800);
}

function pushBot(text){
  botTyping(()=>{
    const msg = document.createElement("div");
    msg.className = "msg bot";
    msg.innerText = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  });
}

function pushUser(text){
  const msg = document.createElement("div");
  msg.className = "msg user";
  msg.innerText = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}



/* ------------------------------------------------------------
   🟡 Abrir / fechar chat
------------------------------------------------------------ */
function openChat(){
  chatBackdrop.classList.add("show");
  chatPanel.classList.add("open");
  fabs.classList.add("hidden");

  if(firstOpen){
    firstOpen = false;
    pushBot("Olá! 😊 Qual serviço você deseja?");
  }
}

function closeChat(){
  chatBackdrop.classList.remove("show");
  chatPanel.classList.remove("open");
  fabs.classList.remove("hidden");
}

chatToggle.addEventListener("click", ()=>{
  if(chatPanel.classList.contains("open")){
    closeChat();
  } else {
    openChat();
  }
});

chatBackdrop.addEventListener("click", closeChat);


/* Abrir o chat ao clicar no botão do Hero */
document.getElementById("btnWhats").addEventListener("click", e=>{
  e.preventDefault();
  openChat();

  pushBot("Vamos começar seu orçamento! Selecione o serviço e coloque seu nome.");
  setTimeout(()=> chatService.focus(), 200);
});



/* ------------------------------------------------------------
   📤 Enviar mensagem para WhatsApp
------------------------------------------------------------ */
chatSend.addEventListener("click", ()=>{

  const service = chatService.value.trim();
  const name = chatName.value.trim();

  if(!service){
    pushBot("Por favor, selecione o serviço.");
    chatService.style.boxShadow = "0 0 0 3px rgba(255,0,0,0.25)";
    setTimeout(()=> chatService.style.boxShadow = "", 500);
    return;
  }

  pushUser(`${service}${name ? " • " + name : ""}`);

  pushBot("Perfeito! Estou abrindo o WhatsApp pra você. 💛");

  let msg = `Olá! Gostaria de um orçamento para *${service}*.`;
  if(name) msg += `\nNome: ${name}`;
  msg += `\n\nVim pelo site.`;

  window.open(
    `https://wa.me/5521980722830?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
});



/* ------------------------------------------------------------
   📞 Envio do formulário de Contato
------------------------------------------------------------ */
document.getElementById("sendContact").addEventListener("click", ()=>{
  const n = fname.value.trim();
  const p = fphone.value.trim();
  const m = fmsg.value.trim();

  let text = "Olá! Gostaria de um orçamento.\n";
  if(n) text += `Nome: ${n}\n`;
  if(p) text += `Telefone: ${p}\n`;
  if(m) text += `Mensagem: ${m}\n`;
  text += `\nVim pelo site.`;

  window.open(
    `https://wa.me/5521980722830?text=${encodeURIComponent(text)}`,
    "_blank"
  );
});



/* ============================================================
   ⌨️ ESC para fechar chat
============================================================ */
document.addEventListener("keydown", e=>{
  if(e.key === "Escape") closeChat();
});
