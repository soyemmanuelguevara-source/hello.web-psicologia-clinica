(function () {
  "use strict";

  const WHATSAPP_NUMBER = "526692287675";

  document.body.classList.add("loading");

  window.addEventListener("load", () => {
    const loader = document.getElementById("loading-screen");
    window.setTimeout(() => {
      loader?.classList.add("is-hidden");
      document.body.classList.remove("loading");
    }, 1700);
  });

  const header = document.getElementById("site-header");
  const nav = document.getElementById("main-nav");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.querySelectorAll(".nav-link");

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  navToggle?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", Boolean(isOpen));
    navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("is-open");
      navToggle?.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  const setActiveNav = () => {
    const current = sections
      .filter((section) => window.scrollY >= section.offsetTop - 140)
      .at(-1);

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current?.id}`);
    });
  };

  setActiveNav();
  window.addEventListener("scroll", setActiveNav, { passive: true });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -70px 0px" });

  document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));

  const typewriter = document.getElementById("typewriter");
  const words = [
    "ansiedad",
    "depresión",
    "estrés",
    "terapia de pareja",
    "hipnosis clínica",
    "sexualidad"
  ];

  let wordIndex = 0;
  let letterIndex = 0;
  let deleting = false;

  function typeLoop() {
    if (!typewriter) return;

    const current = words[wordIndex];
    typewriter.textContent = current.slice(0, letterIndex);

    if (!deleting && letterIndex < current.length) {
      letterIndex += 1;
      window.setTimeout(typeLoop, 72);
      return;
    }

    if (!deleting && letterIndex === current.length) {
      deleting = true;
      window.setTimeout(typeLoop, 1050);
      return;
    }

    if (deleting && letterIndex > 0) {
      letterIndex -= 1;
      window.setTimeout(typeLoop, 38);
      return;
    }

    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    window.setTimeout(typeLoop, 260);
  }

  typeLoop();

  const counters = document.querySelectorAll("[data-count]");
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.getAttribute("data-count"));
      const duration = 1300;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString("es-MX");
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: .6 });

  counters.forEach((counter) => countObserver.observe(counter));

  const form = document.getElementById("whatsapp-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const service = String(data.get("service") || "").trim();
    const message = String(data.get("message") || "").trim();

    const text = [
      "Hola, me gustaría agendar una cita con Psicología Clínica.",
      name ? `Nombre: ${name}` : "",
      service ? `Servicio de interés: ${service}` : "",
      message ? `Mensaje: ${message}` : ""
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas?.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas && ctx && !prefersReducedMotion) {
    let width = 0;
    let height = 0;
    let particles = [];
    let mouse = { x: null, y: null };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.max(48, Math.min(98, Math.floor(width / 18)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .32,
        vy: (Math.random() - .5) * .32,
        r: Math.random() * 1.9 + .7,
        a: Math.random() * .42 + .22
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 120) {
            p.x += dx / 120;
            p.y += dy / 120;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 230, 206, ${p.a})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const distance = Math.hypot(p.x - q.x, p.y - q.y);
          if (distance < 118) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(168, 230, 206, ${(.18 * (1 - distance / 118)).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (event) => {
      mouse = { x: event.clientX, y: event.clientY };
    }, { passive: true });
    window.addEventListener("mouseleave", () => {
      mouse = { x: null, y: null };
    });
  }
})();
