const EMAIL_ENDPOINT = "https://formsubmit.co/ajax/hello@startupdost.online";
const form = document.querySelector("#contact-form");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#nav");
const year = document.querySelector("#year");

if (year) year.textContent = new Date().getFullYear();

menuToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open") ?? false;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

// Progressive reveal: content remains visible if IntersectionObserver is unavailable.
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealTargets = document.querySelectorAll(".work .section-heading, .work-card, .work-note, .service-card, .about-copy, .about-stamp, .contact-copy, .contact-form");
  revealTargets.forEach((element, index) => {
    element.classList.add("js-reveal");
    element.style.transitionDelay = (index % 3) * 70 + "ms";
  });
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealTargets.forEach(element => revealObserver.observe(element));
}

// Custom cursor on mouse/trackpad devices only. Native touch and reduced-motion stay untouched.
if (window.matchMedia("(pointer:fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const cursor = document.createElement("span");
  const ring = document.createElement("span");
  cursor.className = "sd-cursor";
  ring.className = "sd-cursor-ring";
  cursor.setAttribute("aria-hidden", "true");
  ring.setAttribute("aria-hidden", "true");
  document.body.append(cursor, ring);
  let pointerX = -100, pointerY = -100, ringX = -100, ringY = -100;
  document.addEventListener("mousemove", event => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursor.style.left = pointerX + "px";
    cursor.style.top = pointerY + "px";
    document.body.classList.add("cursor-ready");
  }, { passive: true });
  const animateRing = () => {
    ringX += (pointerX - ringX) * 0.19;
    ringY += (pointerY - ringY) * 0.19;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    requestAnimationFrame(animateRing);
  };
  requestAnimationFrame(animateRing);
  document.addEventListener("mouseover", event => {
    if (event.target.closest("a, button, .work-card, select, input, textarea")) document.body.classList.add("cursor-hover");
  });
  document.addEventListener("mouseout", event => {
    if (event.target.closest("a, button, .work-card, select, input, textarea")) document.body.classList.remove("cursor-hover");
  });
  document.addEventListener("mouseleave", () => document.body.classList.remove("cursor-ready"));
  document.addEventListener("mouseenter", () => document.body.classList.add("cursor-ready"));
}

// Small tilt on the portfolio cards for a tactile, dimensional feel.
if (window.matchMedia("(pointer:fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".work-card").forEach(card => {
    card.addEventListener("mousemove", event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1100px) rotateY(${x * 2.6}deg) rotateX(${y * -2.2}deg) translateY(-3px)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
}

form?.addEventListener("submit", async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const statusEl = form.querySelector("#form-status");
  const submit = form.querySelector('button[type="submit"]');
  const originalButtonText = submit?.innerHTML || "Send inquiry";

  const payload = Object.fromEntries(new FormData(form).entries());
  const selectedService = (payload.service || "General enquiry").trim();
  payload._subject = `New enquiry - ${selectedService}`;
  payload._template = "table";

  if (submit) {
    submit.disabled = true;
    submit.textContent = "Sending…";
  }
  if (statusEl) {
    statusEl.style.color = "";
    statusEl.textContent = "Sending your enquiry…";
  }

  try {
    const response = await fetch(EMAIL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok || !(result.success === true || result.success === "true")) {
      throw new Error(result.message || "Submission was not accepted.");
    }

    form.innerHTML = '<div class="form-top"><span>PROJECT INQUIRY</span><span>THANK YOU ✳</span></div><div class="form-success" role="status" aria-live="polite"><span class="success-icon" aria-hidden="true">✓</span><p class="eyebrow">MESSAGE SENT</p><h3>Thank you for your enquiry!</h3><p>Your enquiry has been submitted. We’ll get back to you soon.</p></div>';
  } catch (error) {
    if (statusEl) {
      statusEl.textContent = "We couldn't send your enquiry. Please try again or email hello@startupdost.online directly.";
      statusEl.style.color = "#9a3d2b";
    }
    if (submit) {
      submit.disabled = false;
      submit.innerHTML = originalButtonText;
    }
  }
});


// Accessible tabs for the homepage capability showcase.
const solutionTabs = [...document.querySelectorAll("[data-solution-tab]")];
const solutionPanels = solutionTabs.map(tab => document.getElementById(tab.dataset.solutionTab)).filter(Boolean);
function activateSolutionTab(tab, moveFocus = false) {
  const targetId = tab.dataset.solutionTab;
  solutionTabs.forEach(item => {
    const active = item === tab;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-selected", String(active));
    item.tabIndex = active ? 0 : -1;
  });
  solutionPanels.forEach(panel => {
    const active = panel.id === targetId;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });
  if (moveFocus) tab.focus();
}
solutionTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateSolutionTab(tab));
  tab.addEventListener("keydown", event => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % solutionTabs.length;
    if (event.key === "ArrowLeft") next = (index - 1 + solutionTabs.length) % solutionTabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = solutionTabs.length - 1;
    activateSolutionTab(solutionTabs[next], true);
  });
});

// Lightweight, responsive hero particles; no external library or images required.
const particleCanvas = document.querySelector(".hero-particles");
if (particleCanvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const ctx = particleCanvas.getContext("2d");
  if (ctx) {
    let particles = [];
    let width = 0, height = 0, frame = 0;
    const pointer = { x: -1000, y: -1000 };
    const resizeParticles = () => {
      const rect = particleCanvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width; height = rect.height;
      particleCanvas.width = Math.round(width * dpr);
      particleCanvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(58, Math.max(22, Math.round(width / 20)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - .5) * .24, vy: (Math.random() - .5) * .24,
        r: Math.random() * 1.8 + .7
      }));
    };
    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        const dx = p.x - pointer.x, dy = p.y - pointer.y;
        if (dx * dx + dy * dy < 10000) { p.x += dx * .0008; p.y += dy * .0008; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(197, 255, 74, .72)"; ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j], x = p.x - q.x, y = p.y - q.y;
          const distance = Math.hypot(x, y);
          if (distance < 105) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(197, 255, 74, " + (.18 * (1 - distance / 105)) + ")";
            ctx.lineWidth = .7; ctx.stroke();
          }
        }
      }
      frame = requestAnimationFrame(drawParticles);
    };
    resizeParticles();
    frame = requestAnimationFrame(drawParticles);
    window.addEventListener("resize", resizeParticles, { passive: true });
    particleCanvas.closest(".hero")?.addEventListener("pointermove", event => {
      const rect = particleCanvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left; pointer.y = event.clientY - rect.top;
    }, { passive: true });
    particleCanvas.closest(".hero")?.addEventListener("pointerleave", () => {
      pointer.x = -1000; pointer.y = -1000;
    }, { passive: true });
    window.addEventListener("pagehide", () => cancelAnimationFrame(frame), { once: true });
  }
}
