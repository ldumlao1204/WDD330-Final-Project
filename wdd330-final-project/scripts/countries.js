const DATA_URL = "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";

// Fetches all countries and returns them sorted A–Z
export async function fetchAllCountries() {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
        throw new Error(`Failed to load countries. Status: ${response.status}`);
    }
    const data = await response.json();
    return data.sort((a, b) => a.name.common.localeCompare(b.name.common));
}

// Finds a single country by its 3-letter code (e.g. "PHL" for Philippines)
export async function fetchCountryByCode(code) {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
        throw new Error(`Failed to load countries. Status: ${response.status}`);
    }
    const data = await response.json();
    const country = data.find(c => c.cca3 === code);
    if (!country) throw new Error(`Country not found: ${code}`);
    return country;
}   

    // Searches countries by name — uses filter() to find matches
export function searchCountriesByName(countries, query) {
    const q = query.toLowerCase().trim();
    return countries.filter(c => c.name.common.toLowerCase().includes(q));
}

// Filters countries by region — uses filter() to match the region
export function filterByRegion(countries, region) {
    if (region === "all") return countries;
    return countries.filter(c => c.region === region);
}

// Fetches full country data for a list of border codes — uses map() + Promise.all()
export async function fetchBorderCountries(codes) {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
        throw new Error(`Failed to load countries. Status: ${response.status}`);
    }
    const data = await response.json();
    return codes.map(code => data.find(c => c.cca3 === code)).filter(Boolean);
}

