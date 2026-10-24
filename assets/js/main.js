const GOOGLE_SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbySUNrLeNOPExEpP19Z9Y1FSktXo_7EZZz94994ftnCYicx7he2py6Uzp7uLTKYshSW/exec";
const EMAIL_ENDPOINT = "https://formsubmit.co/ajax/hello@startupdost.online";

const form = document.querySelector("#contact-form");
const statusEl = document.querySelector("#form-status");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#nav");

document.querySelector("#year").textContent = new Date().getFullYear();

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

form?.addEventListener("submit", async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = Object.fromEntries(new FormData(form).entries());
  data._subject = "New StartupDost website enquiry";
  data._template = "table";

  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.querySelector("span").textContent = "…";
  statusEl.className = "form-status";
  statusEl.textContent = "Sending your enquiry…";

  try {
    const response = await fetch(EMAIL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();

    if (!response.ok || result.success !== "true" && result.success !== true) {
      throw new Error(result.message || "Email delivery was not confirmed.");
    }

    // Keep the existing spreadsheet logging as a secondary copy.
    if (GOOGLE_SHEETS_ENDPOINT) {
      fetch(GOOGLE_SHEETS_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: new URLSearchParams(data).toString()
      }).catch(() => {});
    }

    const thankYou = document.createElement("div");
    thankYou.className = "form-success";
    thankYou.setAttribute("role", "status");
    thankYou.setAttribute("aria-live", "polite");
    thankYou.innerHTML = '<span class="success-icon" aria-hidden="true">✓</span><p class="eyebrow">MESSAGE SENT</p><h3>Thank you for your enquiry!</h3><p>We appreciate you reaching out to StartupDost. Your enquiry has been sent to our team, and we’ll get back to you soon.</p>';
    form.replaceWith(thankYou);
  } catch (error) {
    statusEl.textContent = "We couldn't send your enquiry. Please email hello@startupdost.online directly.";
    statusEl.style.color = "#9a3d2b";
    submit.disabled = false;
    submit.querySelector("span").textContent = "↗";
  }
});
