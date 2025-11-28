/* ============================================================
   1. YEAR
=========================================================== */
document.getElementById("yr").textContent = new Date().getFullYear();


/* ============================================================
   2. REVEAL ON SCROLL
=========================================================== */
document.querySelectorAll(".reveal").forEach(el => {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });
  io.observe(el);
});


/* ============================================================
   3. HERO BACKGROUND MOVEMENT
=========================================================== */
const hero = document.querySelector(".hero");
const heroBg = document.querySelector(".hero-bg");

if (hero && heroBg) {
  hero.addEventListener("mousemove", e => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    heroBg.style.transform = `translate(${x * 6}px, ${y * 6}px) scale(1.06)`;
  });

  hero.addEventListener("mouseleave", () =>
    heroBg.style.transform = "scale(1.04)"
  );
}


/* ============================================================
   4. HERO VIDEO AUTOPLAY ON VISIBILITY
=========================================================== */
const heroVideo = document.getElementById("heroVideo");
const soundBtn = document.getElementById("soundBtn");

if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.playsInline = true;

  const vidObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) heroVideo.play().catch(() => {});
      else heroVideo.pause();
    });
  }, { threshold: 0.35 });

  vidObs.observe(heroVideo);
}

if (soundBtn) {
  soundBtn.addEventListener("click", () => {
    heroVideo.muted = false;
    heroVideo.volume = 1;
    soundBtn.style.display = "none";
    heroVideo.play();
  });
}


/* ============================================================
   5. SLIDESHOW (GALLERY)
=========================================================== */
(function () {
  const slides = [...document.querySelectorAll(".slideshow .slide")];
  const dotsWrap = document.getElementById("dots");
  let idx = 0, timer = null, INTERVAL = 3600;

  slides.forEach((s, i) => {
    const d = document.createElement("div");
    d.className = "dot" + (i === 0 ? " active" : "");
    d.addEventListener("click", () => go(i));
    dotsWrap.appendChild(d);
  });

  function show(i) {
    slides.forEach((s, ii) => s.classList.toggle("active", ii === i));
    [...dotsWrap.children].forEach((d, ii) => d.classList.toggle("active", ii === i));
  }

  function next() { idx = (idx + 1) % slides.length; show(idx); }
  function go(i) { idx = i; show(idx); reset(); }
  function reset() { clearInterval(timer); timer = setInterval(next, INTERVAL); }

  show(idx);
  reset();

  const slideshow = document.getElementById("slideshow");
  if (slideshow) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) reset();
        else clearInterval(timer);
      });
    }, { threshold: 0.2 });

    obs.observe(slideshow);
  }
})();


/* ============================================================
   6. FLOATING BUTTONS (mobile adjust)
=========================================================== */
(function () {
  const fabs = document.querySelector(".fabs");
  function adjust() {
    if (window.innerWidth < 520) {
      fabs.style.left = "10px";
      fabs.style.bottom = "80px";
    } else {
      fabs.style.left = "14px";
      fabs.style.bottom = "16px";
    }
  }
  adjust();
  window.addEventListener("resize", adjust);
})();



/* ============================================================
   7. MENU MOBILE FULLSCREEN
=========================================================== */
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("open");
  mobileMenu.classList.toggle("open");
});


/* ============================================================
   8. CHAT SYSTEM (COM TYPING ANIMATION)
=========================================================== */

const chatToggle = document.getElementById("chatToggle");
const chatPanel = document.getElementById("chatPanel");
const chatBody = document.getElementById("chatBody");
const chatSend = document.getElementById("chatSend");
const chatService = document.getElementById("chatService");
const chatName = document.getElementById("chatName");
const chatBackdrop = document.getElementById("chatBackdrop");
const fabs = document.querySelector(".fabs");

let firstMessageShown = false;

/* --- animação digitando --- */
function showTyping() {
  const box = document.createElement("div");
  box.className = "msg bot typing";
  box.innerHTML = `
    <div class="dot-typing"></div>
    <div class="dot-typing"></div>
    <div class="dot-typing"></div>
  `;
  chatBody.appendChild(box);
  chatBody.scrollTop = chatBody.scrollHeight;
  return box;
}

function pushBot(text, delay = 600) {
  const t = showTyping();
  setTimeout(() => {
    t.remove();
    const d = document.createElement("div");
    d.className = "msg bot";
    d.innerText = text;
    chatBody.appendChild(d);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, delay);
}

function pushUser(text) {
  const d = document.createElement("div");
  d.className = "msg user";
  d.innerText = text;
  chatBody.appendChild(d);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function openChat() {
  chatPanel.classList.add("open");
  chatBackdrop.classList.add("show");
  fabs.classList.add("hidden-fabs");

  if (!firstMessageShown) {
    firstMessageShown = true;
    pushBot("Olá! 😊 Escolha o serviço e me diga seu nome. Vou montar sua mensagem!");
  }
}

function closeChat() {
  chatPanel.classList.remove("open");
  chatBackdrop.classList.remove("show");
  fabs.classList.remove("hidden-fabs");
}

/* BOTÃO FLUTUANTE DO CHAT */
chatToggle.addEventListener("click", () => {
  chatPanel.classList.contains("open") ? closeChat() : openChat();
});

/* FECHAR AO CLICAR NO FUNDO ESCURECIDO */
chatBackdrop.addEventListener("click", closeChat);


/* CTA abre chat */
document.getElementById("btnWhats").addEventListener("click", e => {
  e.preventDefault();
  openChat();
  pushBot("Vamos começar seu orçamento! Selecione o serviço.");
  setTimeout(() => chatService.focus(), 350);
});

/* CTA scroll */
document.getElementById("ctaBook").addEventListener("click", () => {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});


/* ENVIAR PARA WHATSAPP */
chatSend.addEventListener("click", () => {
  const service = chatService.value.trim();
  const name = chatName.value.trim();

  if (!service) {
    pushBot("Você precisa escolher um serviço antes.");
    chatService.style.boxShadow = "0 0 0 3px rgba(255,0,0,0.25)";
    setTimeout(() => chatService.style.boxShadow = "", 700);
    return;
  }

  pushUser(`${service}${name ? " • " + name : ""}`);
  pushBot("Perfeito! Enviando para o WhatsApp...");

  let msg = `Olá! Gostaria de um orçamento para *${service}*.\n`;
  if (name) msg += `Nome: ${name}\n`;
  msg += `\nVim pelo site: Studio Caty Hair.`;

  window.open(
    `https://wa.me/5521980722830?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
});


/* ============================================================
   9. CONTACT FORM (WhatsApp)
=========================================================== */
document.getElementById("sendContact").addEventListener("click", () => {
  const n = document.getElementById("fname").value.trim();
  const p = document.getElementById("fphone").value.trim();
  const m = document.getElementById("fmsg").value.trim();

  let msg = `Olá! Gostaria de um orçamento.\n`;
  if (n) msg += `Nome: ${n}\n`;
  if (p) msg += `Telefone: ${p}\n`;
  if (m) msg += `Mensagem: ${m}\n`;
  msg += "\nVim pelo site.";

  window.open(
    `https://wa.me/5521980722830?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
});


/* ============================================================
   10. ESC CLOSE
=========================================================== */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeChat();
});


/* ============================================================
   11. INITIAL HELPER MESSAGE (não repete)
=========================================================== */
setTimeout(() => {
  if (!firstMessageShown) {
    pushBot("Olá! Precisa de um orçamento? Clique no botão 💬 ou no 'Pedir Orçamento'!");
    firstMessageShown = true;
  }
}, 900);
