export function showSkeletons(grid, count = 8) {
    grid.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const card = document.createElement("div");
        card.className = "country-card skeleton-card";
        card.innerHTML = `
            <div class="skeleton skeleton-flag"></div>
            <div class="skeleton-body">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-line"></div>
                <div class="skeleton skeleton-line short"></div>
                <div class="skeleton skeleton-line"></div>
            </div>
        `;
        grid.appendChild(card);
    }
}