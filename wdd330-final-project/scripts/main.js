// ============================================================
// main.js — Hamburger menu + Dark/Light mode toggle
// This file uses ES Module syntax (type="module" in HTML)
// ============================================================

// --- Hamburger Menu ---
// We select the button and the nav by their id attributes
const hamBtn = document.getElementById("ham-btn");
const mainNav = document.getElementById("main-nav");

if (hamBtn && mainNav) {
    hamBtn.addEventListener("click", () => {
        // .toggle() adds the class if it's missing, removes it if it's there
        const isOpen = mainNav.classList.toggle("open");
        // Update aria-expanded so screen readers know the state
        hamBtn.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the mobile menu when user clicks any nav link
    mainNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("open");
            hamBtn.setAttribute("aria-expanded", "false");
        });
    });
}

// --- Dark / Light Mode Toggle ---
const themeBtn = document.getElementById("theme-toggle");
const html = document.documentElement; // this is the <html> element

function applyTheme(theme) {
    // Sets data-theme="dark" or data-theme="light" on <html>
    // The CSS then uses [data-theme="dark"] { } to swap the color variables
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme); // remember the choice across visits
    if (themeBtn) {
        themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
        themeBtn.setAttribute(
            "aria-label",
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        );
    }
}

// Read the saved theme from localStorage when the page first loads
const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        const current = html.getAttribute("data-theme");
        applyTheme(current === "dark" ? "light" : "dark");
    });
}
