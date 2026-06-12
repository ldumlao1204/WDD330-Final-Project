import { fetchCountryByCode } from "./countries.js";
import { fetchPlaces } from "./geoapify.js";
import { formatPopulation, getCapital, getCurrencies, getLanguages } from "./util.js";
import { saveFavorite, removeFavorite, isFavorite } from "./storage.js";

const params = new URLSearchParams(window.location.search);
const code = params.get("code");

const container = document.getElementById("country-detail");

async function fetchWeather(lat, lng) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data.current_weather;
}

function getWeatherIcon(weathercode) {
    if (weathercode === 0) return "☀️";
    if (weathercode <= 3) return "⛅";
    if (weathercode <= 48) return "🌫️";
    if (weathercode <= 67) return "🌧️";
    if (weathercode <= 77) return "❄️";
    if (weathercode <= 82) return "🌦️";
    if (weathercode <= 99) return "⛈️";
    return "🌡️";
}

async function renderCountry() {
    if (!code) {
        container.innerHTML = "<p class=\"error-msg\">No country selected. <a href=\"index.html\">Go back home</a></p>";
        return;
    }

    try {
        const country = await fetchCountryByCode(code);

        const weather = country.latlng && country.latlng.length >= 2
            ? await fetchWeather(country.latlng[0], country.latlng[1])
            : null;
        
        const places = country.latlng && country.latlng.length >= 2
            ? await fetchPlaces(country.latlng[0], country.latlng[1])
            : [];

        const borderChips = country.borders && country.borders.length > 0
            ? country.borders.map(b => `<a href="country.html?code=${b}" class="border-chip">${b}</a>`).join("")
            : "<span class=\"no-borders\">No bordering countries</span>";

        const placesBlock = places.length > 0
            ? `<div class="places-section">
        <h3>Points of Interest</h3>
        <ul class="places-list">
            ${places.map(p => `
                <li class="place-item">
                    <span class="place-name">${p.properties.name || "Unnamed Place"}</span>
                    <span class="place-address">${p.properties.formatted || ""}</span>
                </li>`).join("")}
        </ul>
        </div>`
            : "";
        
        const weatherBlock = weather
            ? `<div class="weather-widget">
                <h3>Current Weather</h3>
                <p class="weather-icon">${getWeatherIcon(weather.weathercode)}</p>
                <p class="weather-temp">${weather.temperature}°C</p>
                <p class="weather-wind">Wind: ${weather.windspeed} km/h</p>
               </div>`
            : "";

        container.innerHTML = `
            <div class="detail-card">
                <img class="detail-flag" src="https://flagcdn.com/w320/${country.cca2.toLowerCase()}.png" alt="Flag of ${country.name.common}">
                <div class="detail-info">
                    <h1 class="detail-name">${country.name.common}</h1>
                    <p><strong>Official Name:</strong> ${country.name.official}</p>
                    <p><strong>Capital:</strong> ${getCapital(country)}</p>
                    <p><strong>Region:</strong> ${country.region}</p>
                    <p><strong>Area:</strong> ${country.area ? country.area.toLocaleString() + " km²" : "N/A"}</p>
                    <p><strong>Currencies:</strong> ${getCurrencies(country)}</p>
                    <p><strong>Languages:</strong> ${getLanguages(country)}</p>
                </div>
                ${weatherBlock}
                <div class="borders-section">
                    <h3>Bordering Countries</h3>
                    <div class="border-chips">${borderChips}</div>
                </div>
                 ${placesBlock}
                <div class="detail-actions">
                    <button class="fav-btn detail-fav-btn" id="detail-fav-btn" data-saved="${isFavorite(code)}">
                        ${isFavorite(code) ? "♥ Saved" : "♡ Save"}
                    </button>
                </div>
            </div>
        `;

        const favBtn = document.getElementById("detail-fav-btn");
        favBtn.addEventListener("click", () => {
            if (isFavorite(code)) {
                removeFavorite(code);
                favBtn.textContent = "♡ Save";
                favBtn.dataset.saved = "false";
            } else {
                saveFavorite(country);
                favBtn.textContent = "♥ Saved";
                favBtn.dataset.saved = "true";
            }
        });

    } catch (error) {
        container.innerHTML = "<p class=\"error-msg\">⚠️ Could not load country details. <a href=\"index.html\">Go back home</a></p>";
    }
}

renderCountry();