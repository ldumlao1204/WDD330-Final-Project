import { fetchAllCountries } from "./countries.js";
import { formatPopulation, getCapital } from "./util.js";
import { saveFavorite, removeFavorite, isFavorite } from "./storage.js";

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

// --- Country Cards (only runs on index.html) ---
const grid = document.getElementById("country-grid");
const template = document.getElementById("country-card-template");
const searchInput = document.getElementById("country-search");
const searchBtn = document.getElementById("search-btn");
const regionBtns = document.querySelectorAll(".region-btn");

let allCountries = [];
let activeRegion = "all";

// Clones the template for each country and fills in the data
function renderCards(countries) {
    grid.innerHTML = "";

    if (countries.length === 0) {
        grid.innerHTML = "<p class=\"empty-msg\">No countries found. Try a different search.</p>";
        return;
    }

    countries.forEach(country => {
        const clone = template.content.cloneNode(true);

        const img = clone.querySelector(".card-flag");
        img.src = country.flags.svg || country.flags.png;
        img.alt = country.flags.alt || `Flag of ${country.name.common}`;

        clone.querySelector(".card-name").textContent = country.name.common;
        clone.querySelector(".card-capital").textContent = getCapital(country);
        clone.querySelector(".card-region").textContent = country.region;
        clone.querySelector(".card-population").textContent = formatPopulation(country.population);

        // View Details — saves the country code in the URL and opens country.html
        const viewBtn = clone.querySelector(".view-btn");
        viewBtn.addEventListener("click", () => {
            window.location.href = `country.html?code=${country.cca3}`;
        });

        // Save / Unsave favorite
        const favBtn = clone.querySelector(".fav-btn");
        const alreadySaved = isFavorite(country.cca3);
        favBtn.textContent = alreadySaved ? "♥ Saved" : "♡ Save";
        favBtn.dataset.saved = String(alreadySaved);

        favBtn.addEventListener("click", () => {
            if (isFavorite(country.cca3)) {
                removeFavorite(country.cca3);
                favBtn.textContent = "♡ Save";
                favBtn.dataset.saved = "false";
            } else {
                saveFavorite(country);
                favBtn.textContent = "♥ Saved";
                favBtn.dataset.saved = "true";
            }
        });

        grid.appendChild(clone);
    });
}

// Filters the full country list by region and search text
function filterCountries() {
    const query = searchInput.value.toLowerCase().trim();
    let filtered = allCountries;

    if (activeRegion !== "all") {
        filtered = filtered.filter(c => c.region === activeRegion);
    }

    if (query) {
        filtered = filtered.filter(c =>
            c.name.common.toLowerCase().includes(query)
        );
    }

    renderCards(filtered);
}

// Region buttons — update active state and re-filter
if (regionBtns.length > 0) {
    regionBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            regionBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeRegion = btn.dataset.region;
            filterCountries();
        });
    });
}

// Search button click and live search as user types
if (searchBtn) searchBtn.addEventListener("click", filterCountries);
if (searchInput) searchInput.addEventListener("input", filterCountries);

// Fetches countries and renders them — called once when page loads
async function init() {
    if (!grid || !template) return;
    try {
        allCountries = await fetchAllCountries();
        renderCards(allCountries);
    } catch (error) {
        grid.innerHTML = `
            <div class="error-box">
                <p>⚠️ Could not load countries. Please check your connection.</p>
                <button class="retry-btn" id="retry-btn">Try Again</button>
            </div>
        `;
        document.getElementById("retry-btn").addEventListener("click", init);
    }
}

init();
