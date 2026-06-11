const API_URL = "https://restcountries.com/v5/all?fields=name,capital,region,population,flags,cca3,borders,latlng,currencies,languages";

// Fetches all countries from REST Countries API and returns them sorted A–Z
export async function fetchAllCountries() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`Failed to load countries. Status: ${response.status}`);
    }
    const data = await response.json();
    return data.sort((a, b) => a.name.common.localeCompare(b.name.common));
}

// Fetches a single country by its 3-letter code (e.g. "PHL" for Philippines)
export async function fetchCountryByCode(code) {
    const response = await fetch(`https://restcountries.com/v5/alpha/${code}?fields=name,capital,region,population,flags,cca3,borders,latlng,currencies,languages`);
    if (!response.ok) {
        throw new Error(`Country not found. Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}