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

  const payload = Object.fromEntries(new FormData(form).entries());
  payload._subject = "New StartupDost website enquiry";
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
