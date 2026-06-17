const FAVORITES_KEY = "wte_favorites"; //name used to store data in localStorage. wte stands for  World Travel Explorer
const TEMP_UNIT_KEY = "wte_temp_unit";

//getFavorites() read the saved list
export function getFavorites() {  
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
}

//saveFavorite(country) — adds one country to the list 
export function saveFavorite(country) {     
    const favorites = getFavorites();
    if (!favorites.find(c => c.cca3 === country.cca3)) {  // cca3 is the 3-letter country code from API (ex. PHL for Philippines)
        favorites.push(country);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}

//remove Favorite(cca3) — removes one country
export function removeFavorite(cca3) {
    const favorites = getFavorites();
    const updated = favorites.filter(c => c.cca3 !== cca3);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

// isFavorite(cca3) — checks if already saved
export function isFavorite(cca3) {
    return getFavorites().some(c => c.cca3 === cca3);
}

// getTempUnit() / setTempUnit() — temperature preference
export function getTempUnit() {
    return localStorage.getItem(TEMP_UNIT_KEY) || "C";
}

export function setTempUnit(unit) {
    localStorage.setItem(TEMP_UNIT_KEY, unit);
}

export function clearFavorites() {
    localStorage.removeItem(FAVORITES_KEY);
}

export function getFavoritesCount() {
    return getFavorites().length;
}