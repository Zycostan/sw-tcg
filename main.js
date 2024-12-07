// Path to skins list file
const skinsListPath = "skins_list.txt";

// Function to generate a random number within a range
function getRandomStat(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random price between $0.10 and $1,000
function getRandomPrice(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2); // Format to 2 decimal places
}

// Function to create a card element
function createCard(skinPath, fileName) {
    const attack = getRandomStat(10, 100);
    const defense = getRandomStat(10, 100);
    const speed = getRandomStat(10, 100); // Randomized speed stat
    const price = getRandomPrice(0.1, 1000); // Randomized price

    const card = document.createElement("div");
    card.className = "card";
    card.dataset.username = fileName.toLowerCase(); // Add username for search filtering

    const img = document.createElement("img");
    img.src = skinPath;
    img.loading = "lazy"; // Enable lazy loading
    img.alt = `${fileName}'s skin`; // Add alt text for better accessibility
    card.appendChild(img);

    const username = document.createElement("div");
    username.className = "username";
    username.textContent = fileName;
    card.appendChild(username);

    const stats = document.createElement("div");
    stats.className = "stats";
    stats.innerHTML = `
        <div><strong>Attack:</strong> ${attack}</div>
        <div><strong>Defense:</strong> ${defense}</div>
        <div><strong>Speed:</strong> ${speed}</div>
        <div><strong>Price:</strong> $${price}</div>
    `;
    card.appendChild(stats);

    return card;
}

// Function to load skins
async function loadSkins() {
    const container = document.getElementById("card-container");
    const searchBar = document.getElementById("search-bar");

    try {
        const response = await fetch(skinsListPath);
        if (!response.ok) throw new Error("Failed to load skins list");

        const skins = (await response.text())
            .trim()
            .split("\n")
            .map(skinPath => {
                const fileName = skinPath.split("/").pop().split(".")[0]; // Extract username
                const card = createCard(skinPath, fileName);
                return card;
            });

        // Append all cards in one go for better performance
        container.append(...skins);

        // Attach search functionality
        setupSearch(skins, searchBar);
    } catch (error) {
        console.error("Error loading skins:", error);
    }
}

// Function to set up search functionality
function setupSearch(cards, searchBar) {
    searchBar.addEventListener("input", (event) => {
        const query = event.target.value.toLowerCase();

        // Use a simple loop to filter cards based on username
        cards.forEach((card) => {
            const username = card.dataset.username;
            card.style.display = username.includes(query) ? "" : "none";
        });
    });
}

// Load skins on page load
loadSkins();
