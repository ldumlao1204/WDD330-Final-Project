// Converts raw number to comma-separated string — 109581078 → "109,581,078"
export function formatPopulation(number) {
    return number.toLocaleString();
}

// API returns capital as an array — some countries have no capital, so we default to "N/A"
export function getCapital(country) {
    return country.capital && country.capital.length > 0
        ? country.capital[0]
        : "N/A";
}

// API returns currencies as an object, not an array — Object.values() extracts them
export function getCurrencies(country) {
    if (!country.currencies) return "N/A";
    return Object.values(country.currencies)
        .map(c => `${c.name} (${c.symbol || ""})`)
        .join(", ");
}

// API returns languages as an object — Object.values() + join() makes a readable string
export function getLanguages(country) {
    if (!country.languages) return "N/A";
    return Object.values(country.languages).join(", ");
}