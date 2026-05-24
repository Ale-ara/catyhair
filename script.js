const phoneNumber = "5521980722830";

document.querySelectorAll("[data-year]").forEach((item) => {
  item.textContent = new Date().getFullYear();
});

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

function syncHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 12);
}

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

const stage = document.querySelector("[data-gallery-stage]");
const slides = stage ? Array.from(stage.querySelectorAll("img")) : [];
const dots = document.querySelector("[data-gallery-dots]");
const prev = document.querySelector("[data-gallery-prev]");
const next = document.querySelector("[data-gallery-next]");
let currentSlide = 0;
let galleryTimer;

function showSlide(index) {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === currentSlide);
  });
  dots?.querySelectorAll("button").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentSlide);
  });
}

function startGallery() {
  window.clearInterval(galleryTimer);
  galleryTimer = window.setInterval(() => showSlide(currentSlide + 1), 4200);
}

slides.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Ver imagem ${index + 1}`);
  dot.addEventListener("click", () => {
    showSlide(index);
    startGallery();
  });
  dots?.appendChild(dot);
});

prev?.addEventListener("click", () => {
  showSlide(currentSlide - 1);
  startGallery();
});

next?.addEventListener("click", () => {
  showSlide(currentSlide + 1);
  startGallery();
});

showSlide(0);
startGallery();

const contactForm = document.querySelector("[data-contact-form]");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = String(data.get("name") || "").trim();
  const service = String(data.get("service") || "").trim();
  const message = String(data.get("message") || "").trim();

  const lines = ["Ol\u00e1! Vim pelo site Studio Caty Hair e gostaria de atendimento."];
  if (name) lines.push(`Nome: ${name}`);
  if (service) lines.push(`Servi\u00e7o: ${service}`);
  if (message) lines.push(`Mensagem: ${message}`);

  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
});
