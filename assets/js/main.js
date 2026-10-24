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

form?.addEventListener("submit", async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const statusEl = form.querySelector("#form-status");
  const submit = form.querySelector('button[type="submit"]');
  const originalButtonText = submit?.innerHTML || "Send inquiry";
  const data = new URLSearchParams(new FormData(form));
  data.set("_subject", "New StartupDost website enquiry");
  data.set("_template", "table");

  if (submit) {
    submit.disabled = true;
    submit.textContent = "Sending…";
  }
  if (statusEl) {
    statusEl.className = "form-status";
    statusEl.style.color = "";
    statusEl.textContent = "Sending your enquiry…";
  }

  try {
    const response = await fetch(EMAIL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Accept": "application/json"
      },
      body: data.toString()
    });

    let result = {};
    try { result = await response.json(); } catch (_) {}

    if (!response.ok || !(result.success === true || result.success === "true")) {
      throw new Error(result.message || "The email service did not confirm the submission.");
    }

    const thankYou = document.createElement("div");
    thankYou.className = "form-success";
    thankYou.setAttribute("role", "status");
    thankYou.setAttribute("aria-live", "polite");
    thankYou.innerHTML = '<span class="success-icon" aria-hidden="true">✓</span><p class="eyebrow">MESSAGE SENT</p><h3>Thank you for your enquiry!</h3><p>Your enquiry has been submitted. We’ll get back to you soon.</p>';
    form.replaceWith(thankYou);
  } catch (error) {
    if (statusEl) {
      statusEl.textContent = "We couldn't submit your enquiry. Please email hello@startupdost.online directly, or try again in a moment.";
      statusEl.style.color = "#9a3d2b";
    }
    if (submit) {
      submit.disabled = false;
      submit.innerHTML = originalButtonText;
    }
  }
});
