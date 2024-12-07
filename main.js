// Path to the skins_list.txt and abilities_list.txt files
const skinsListPath = "skins_list.txt";
const abilitiesListPath = "abilities_list.txt";

// Function to generate a random number within a range
function getRandomStat(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random price between $0.10 and $1,000
function getRandomPrice(min, max) {
    const price = Math.random() * (max - min) + min;
    return price.toFixed(2); // Format to 2 decimal places
}

// Function to create a card element
function createCard(skinPath, fileName, ability, description) {
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
        <div><strong>Ability:</strong> ${ability}</div>
        <div class="ability-description">${description}</div>
    `;
    card.appendChild(stats);

    return card;
}

// Function to load skins and abilities
async function loadContent() {
    try {
        const [skinsResponse, abilitiesResponse] = await Promise.all([
            fetch(skinsListPath),
            fetch(abilitiesListPath),
        ]);

        if (!skinsResponse.ok) throw new Error("Failed to load skins list");
        if (!abilitiesResponse.ok) throw new Error("Failed to load abilities list");

        const skinsText = await skinsResponse.text();
        const abilitiesText = await abilitiesResponse.text();

        const skins = skinsText.trim().split("\n");
        const abilities = abilitiesText
            .trim()
            .split("\n")
            .map((line) => {
                const [name, description] = line.split("|");
                return { name, description };
            });

        const container = document.getElementById("card-container");
        skins.forEach((skinPath) => {
            const fileName = skinPath.split("/").pop().split(".")[0]; // Extract username
            const randomAbility = abilities[Math.floor(Math.random() * abilities.length)];
            const card = createCard(
                skinPath,
                fileName,
                randomAbility.name,
                randomAbility.description
            );
            container.appendChild(card);
        });

        // Attach optimized search functionality
        setupSearch(skins);
    } catch (error) {
        console.error("Error loading content:", error);
    }
}

// Optimized search functionality using a debounce function
function setupSearch() {
    const searchBar = document.getElementById("search-bar");
    const cards = document.querySelectorAll(".card");

    let timeout;
    searchBar.addEventListener("input", (event) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const query = event.target.value.toLowerCase();
            cards.forEach((card) => {
                const username = card.dataset.username;
                if (username.includes(query)) {
                    card.style.display = ""; // Show card
                } else {
                    card.style.display = "none"; // Hide card
                }
            });
        }, 300); // Debounce time to reduce lag
    });
}

// Load skins and abilities on page load
loadContent();
