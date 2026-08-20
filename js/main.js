const WA_NUMBER = "529381619732";

function hideLoader() {
  const loader = document.getElementById("loader");
  window.setTimeout(() => loader?.classList.add("is-hidden"), 120);
}

document.addEventListener("DOMContentLoaded", hideLoader);
window.addEventListener("load", hideLoader);

const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mob-menu");

function syncNavbar() {
  navbar?.classList.toggle("is-scrolled", window.scrollY > 18);
}

window.addEventListener("scroll", syncNavbar, { passive: true });
syncNavbar();

hamburger?.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("is-active");
  hamburger.setAttribute("aria-expanded", String(isOpen));
  mobileMenu?.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger?.classList.remove("is-active");
    hamburger?.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  });
});

const marquee = document.getElementById("marquee");
if (marquee) {
  const services = [
    "Copias en blanco y negro",
    "Impresiones a color",
    "Impresión de fotos",
    "Diseño e impresión de lonas",
    "Venta y renta de copiadoras",
    "Mantenimiento de impresoras",
    "Tóner original y genérico",
    "Cámaras CCTV e IP",
    "Mantenimiento de equipo de cómputo",
    "Instalación de redes",
    "Atención personalizada"
  ];

  marquee.innerHTML = [...services, ...services]
    .map((service) => `<span>${service}</span>`)
    .join("");
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const numberFormatter = new Intl.NumberFormat("es-MX");
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.count || 0);
      const suffix = element.dataset.suffix || "";
      const duration = 1100;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        element.textContent = `${numberFormatter.format(value)}${suffix}`;

        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      statObserver.unobserve(element);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".stat-num").forEach((element) => {
  statObserver.observe(element);
});

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

const form = document.getElementById("wa-form");
form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("f-name")?.value.trim();
  const interest = document.getElementById("f-interest")?.value.trim();
  const message = document.getElementById("f-msg")?.value.trim();

  if (!name || !message) {
    form.reportValidity();
    return;
  }

  const text = [
    "Hola, visité su sitio web y me gustaría cotizar un servicio.",
    `Nombre: ${name}`,
    `Necesito: ${interest}`,
    `Detalle: ${message}`
  ].join("\n");

  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
});

const canvas = document.getElementById("hero-canvas");
const ctx = canvas?.getContext("2d");
const particles = [];

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(canvas.offsetWidth * ratio);
  canvas.height = Math.floor(canvas.offsetHeight * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function seedParticles() {
  if (!canvas) return;
  particles.length = 0;
  const count = window.innerWidth < 700 ? 32 : 58;

  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: -0.08 + Math.random() * 0.16,
      vy: 0.12 + Math.random() * 0.28,
      size: 1 + Math.random() * 2,
      alpha: 0.18 + Math.random() * 0.32
    });
  }
}

function drawParticles() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.y > canvas.offsetHeight + 12) particle.y = -12;
    if (particle.x < -12) particle.x = canvas.offsetWidth + 12;
    if (particle.x > canvas.offsetWidth + 12) particle.x = -12;

    ctx.beginPath();
    ctx.rect(particle.x, particle.y, particle.size, particle.size * 1.8);
    ctx.fillStyle = `rgba(255, 215, 0, ${particle.alpha})`;
    ctx.fill();
  });

  requestAnimationFrame(drawParticles);
}

if (canvas && ctx) {
  resizeCanvas();
  seedParticles();
  drawParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    seedParticles();
  });
}
