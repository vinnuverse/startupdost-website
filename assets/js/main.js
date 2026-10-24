const GOOGLE_SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbySUNrLeNOPExEpP19Z9Y1FSktXo_7EZZz94994ftnCYicx7he2py6Uzp7uLTKYshSW/exec";

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
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.querySelector("span").textContent = "…";
  statusEl.className = "form-status";
  if (!GOOGLE_SHEETS_ENDPOINT) {
    statusEl.textContent = "The form is ready, but submissions are not connected yet. Please email hello@startupdost.online, or configure the Google Sheets endpoint in assets/js/main.js.";
    statusEl.style.color = "#9a5b19";
    submit.disabled = false;
    submit.querySelector("span").textContent = "↗";
    return;
  }
  try {
    await fetch(GOOGLE_SHEETS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams(data).toString()
    });
    statusEl.textContent = "Your inquiry request was sent. Because Google Apps Script does not expose the result to this page in no-cors mode, please verify the new row in our Google Sheet. If it does not appear, email hello@startupdost.online.";
    statusEl.style.color = "#9a5b19";
    form.reset();
  } catch (error) {
    statusEl.textContent = "We couldn't submit your inquiry right now. Please email hello@startupdost.online.";
    statusEl.style.color = "#9a3d2b";
  } finally {
    submit.disabled = false;
    submit.querySelector("span").textContent = "↗";
  }
});
