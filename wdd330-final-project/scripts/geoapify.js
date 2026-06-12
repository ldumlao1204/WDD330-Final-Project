const GEOAPIFY_KEY = "77adbbd4d65d4c33ba6c88a3fd9abc44";

export function formatCategory(category) {
    const labels = {
        "tourism.sights": "Tourist Attraction",
        "tourism.attraction": "Attraction",
        "entertainment": "Entertainment",
        "natural": "Nature",
        "religion": "Religious Site",
        "heritage": "Heritage Site"
    };
    return labels[category] || "Point of Interest";
}

export async function fetchNearbyAttractions(lat, lng) {
    const url = `https://api.geoapify.com/v2/places?categories=tourism.sights&filter=circle:${lng},${lat},50000&limit=5&apiKey=${GEOAPIFY_KEY}`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return data.features || [];
}
