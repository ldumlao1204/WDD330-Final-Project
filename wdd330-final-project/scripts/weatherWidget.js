import { getTempUnit, setTempUnit } from "./storage.js";

export class WeatherWidget {
    constructor(weather) {
        this.weather = weather;
        this.unit = getTempUnit();
    }

    convertTemp(celsius) {
        if (this.unit === "F") {
            return ((celsius * 9 / 5) + 32).toFixed(1) + "°F";
        }
        return celsius + "°C";
    }

    getIcon() {
        const code = this.weather.weathercode;
        if (code === 0) return "☀️";
        if (code <= 3) return "⛅";
        if (code <= 48) return "🌫️";
        if (code <= 67) return "🌧️";
        if (code <= 77) return "❄️";
        if (code <= 82) return "🌦️";
        if (code <= 99) return "⛈️";
        return "🌡️";
    }

    getLabel() {
        const code = this.weather.weathercode;
        if (code === 0) return "Clear Sky";
        if (code <= 3) return "Partly Cloudy";
        if (code <= 48) return "Foggy";
        if (code <= 67) return "Rainy";
        if (code <= 77) return "Snowy";
        if (code <= 82) return "Showers";
        if (code <= 99) return "Thunderstorm";
        return "Unknown";
    }
    getTime() {
        if (!this.weather.time) return "";
        const [, timePart] = this.weather.time.split("T");
        const [hour, minute] = timePart.split(":");
        const h = parseInt(hour);
        const ampm = h >= 12 ? "PM" : "AM";
        const hour12 = h % 12 || 12;
        return `${hour12}:${minute} ${ampm}`;
    }

    render() {
        return `<div class="weather-widget">
            <h3>Current Weather</h3>
            <p class="weather-icon">${this.getIcon()}</p>
            <p class="weather-label">${this.getLabel()}</p>
            <p class="weather-time">Local Time: ${this.getTime()}</p>
            <p class="weather-temp" id="weather-temp">${this.convertTemp(this.weather.temperature)}</p>
            <p class="weather-wind">Wind: ${this.weather.windspeed} km/h</p>
            <button class="temp-toggle" id="temp-toggle">${this.unit === "C" ? "Switch to °F" : "Switch to °C"}</button>
        </div>`;
    }

    attachToggle() {
        const btn = document.getElementById("temp-toggle");
        const tempEl = document.getElementById("weather-temp");
        if (!btn || !tempEl) return;
        btn.addEventListener("click", () => {
            this.unit = this.unit === "C" ? "F" : "C";
            setTempUnit(this.unit);
            tempEl.textContent = this.convertTemp(this.weather.temperature);
            btn.textContent = this.unit === "C" ? "Switch to °F" : "Switch to °C";
        });
    }
}