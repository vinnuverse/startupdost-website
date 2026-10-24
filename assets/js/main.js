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

// The contact form uses its native POST action in index.html.
// Avoid intercepting submission with AJAX: this works without CORS/AJAX
// response parsing and lets FormSubmit handle validation and delivery.
