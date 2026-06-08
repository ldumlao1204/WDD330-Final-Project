// Set current year
const currentYearSpan = document.getElementById('currentyear');
currentYearSpan.textContent = new Date().getFullYear();

// Set last modified date
const lastModifiedSpan = document.getElementById('last-modified');
lastModifiedSpan.textContent = document.lastModified;
