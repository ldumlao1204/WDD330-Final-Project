import { getFavorites, removeFavorite } from "./storage.js";
import { formatPopulation, getCapital } from "./util.js";

//Get the page elements
const grid = document.getElementById("favorites-grid");
const template = document.getElementById("country-card-template");

// main function that runs every time the page needs to show the favorites list.
function renderFavorites() {
    const favorites = getFavorites();
    grid.innerHTML = "";

    if (favorites.length === 0) {
        grid.innerHTML = "<p class=\"empty-msg\">You have no saved favorites yet.<br>Browse countries and click &#9825; to save them here.</p>";
        return;
    }

    favorites.forEach(country => {
        const clone = template.content.cloneNode(true);

        const img = clone.querySelector(".card-flag");
        img.src = country.flags.svg || country.flags.png;
        img.alt = country.flags.alt || `Flag of ${country.name.common}`;

        clone.querySelector(".card-name").textContent = country.name.common;
        clone.querySelector(".card-capital").textContent = getCapital(country);
        clone.querySelector(".card-region").textContent = country.region;
        clone.querySelector(".card-population").textContent = formatPopulation(country.population);

        const viewBtn = clone.querySelector(".view-btn");
        viewBtn.addEventListener("click", () => {
            window.location.href = `country.html?code=${country.cca3}`;
        });

        const favBtn = clone.querySelector(".fav-btn");
        favBtn.textContent = "♥ Saved";
        favBtn.dataset.saved = "true";

        favBtn.addEventListener("click", () => {
            removeFavorite(country.cca3);
            renderFavorites();
        });

        grid.appendChild(clone);
    });
}

renderFavorites();