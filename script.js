/* ==========================================================
   T&T Construction - script.js
   EDIT THE SETTINGS BELOW with the real business details.
   ========================================================== */

// ----- SETTINGS (edit these) -----
// International format, digits only, no "+" or spaces. Example South Africa: 27712345678
const WHATSAPP_NUMBER = "27000000000";   // PLACEHOLDER - replace
const PHONE_NUMBER = "+27000000000";     // PLACEHOLDER - replace
// ---------------------------------

const NUMBERS_ARE_PLACEHOLDERS = /^270{9}$/.test(WHATSAPP_NUMBER);

document.documentElement.classList.remove("no-js");

// ----- Dynamic copyright year -----
document.getElementById("year").textContent = new Date().getFullYear();

// ----- Mobile navigation -----
const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");

function setNav(open) {
  primaryNav.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
}
navToggle.addEventListener("click", () => setNav(!primaryNav.classList.contains("open")));
// Close the menu after choosing a link
primaryNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setNav(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setNav(false); });

// ----- Fade-in on scroll (subtle animation) -----
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add("visible"));
}

// ----- Highlight the current section in the nav -----
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".primary-nav a:not(.btn)");
window.addEventListener("scroll", () => {
  let current = "home";
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
}, { passive: true });

// ----- Broken-image fallback: dark background stays visible if a photo fails to load -----
document.querySelectorAll("img").forEach(img => {
  img.addEventListener("error", () => { img.style.visibility = "hidden"; });
});

// ----- Service cards: pre-select the service in the form -----
const serviceSelect = document.getElementById("service");
document.querySelectorAll("[data-service]").forEach(btn => {
  btn.addEventListener("click", () => {
    serviceSelect.value = btn.dataset.service;
    document.getElementById("quote").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => document.getElementById("fullName").focus({ preventScroll: true }), 700);
  });
});

// ----- Contact buttons -----
const waLink = document.getElementById("waLink");
const callLink = document.getElementById("callLink");
waLink.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Hello T&T Construction, I would like to ask about your services.");
callLink.href = "tel:" + PHONE_NUMBER;
if (NUMBERS_ARE_PLACEHOLDERS) {
  [waLink, callLink].forEach(link => link.addEventListener("click", e => {
    e.preventDefault();
    alert("Contact numbers have not been set yet. Edit WHATSAPP_NUMBER and PHONE_NUMBER at the top of script.js.");
  }));
}

// ----- Quote form -----
const form = document.getElementById("quoteForm");
const formMessage = document.getElementById("formMessage");
const reviewBox = document.getElementById("reviewBox");
const reviewText = document.getElementById("reviewText");

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = "form-message is-" + type;
  formMessage.hidden = false;
}

function setError(id, message) {
  const input = document.getElementById(id);
  document.getElementById(id + "-error").textContent = message;
  input.classList.toggle("invalid", Boolean(message));
  input.setAttribute("aria-invalid", message ? "true" : "false");
  return !message;
}

function validate() {
  const v = id => document.getElementById(id).value.trim();
  const phoneDigits = v("phone").replace(/[\s()\-+]/g, "");
  const results = [
    setError("fullName", v("fullName").length < 2 ? "Please enter your full name." : ""),
    setError("phone", !/^\d{9,15}$/.test(phoneDigits) ? "Please enter a valid phone number (9 to 15 digits)." : ""),
    setError("email", v("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email")) ? "Please enter a valid email address or leave it blank." : ""),
    setError("service", !v("service") ? "Please choose a type of service." : ""),
    setError("location", v("location").length < 2 ? "Please enter the project location." : ""),
    setError("description", v("description").length < 10 ? "Please describe your project (at least 10 characters)." : "")
  ];
  return results.every(Boolean);
}

function buildMessage() {
  const v = id => document.getElementById(id).value.trim();
  return [
    "Hello T&T Construction, I would like to request a quotation.",
    "",
    "Name: " + v("fullName"),
    "Phone: " + v("phone"),
    "Email: " + (v("email") || "Not provided"),
    "Service: " + v("service"),
    "Location: " + v("location"),
    "Budget: " + (v("budget") || "Not provided"),
    "",
    "Project description:",
    v("description")
  ].join("\n");
}

form.addEventListener("submit", e => {
  e.preventDefault();
  reviewBox.hidden = true;
  if (!validate()) {
    showMessage("Please fix the highlighted fields and try again.", "error");
    const firstBad = form.querySelector(".invalid");
    if (firstBad) firstBad.focus();
    return;
  }
  // Show the customer exactly what will be sent, so they can confirm it
  reviewText.textContent = buildMessage();
  reviewBox.hidden = false;
  showMessage("Your details look good. Please review the message below, then confirm.", "success");
  reviewBox.scrollIntoView({ behavior: "smooth", block: "center" });
});

// Clear an error as soon as the user fixes the field
form.querySelectorAll("input, select, textarea").forEach(el => {
  el.addEventListener("input", () => { if (el.classList.contains("invalid")) setError(el.id, ""); });
});

document.getElementById("editBtn").addEventListener("click", () => {
  reviewBox.hidden = true;
  formMessage.hidden = true;
  document.getElementById("fullName").focus();
});

document.getElementById("confirmBtn").addEventListener("click", () => {
  if (NUMBERS_ARE_PLACEHOLDERS) {
    showMessage("WhatsApp is not set up yet. The website owner must add the real number in script.js.", "error");
    return;
  }
  const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(buildMessage());
  window.open(url, "_blank", "noopener");
  showMessage("WhatsApp should now be open with your message. Press Send there to submit your request. It has not been sent yet.", "success");
});