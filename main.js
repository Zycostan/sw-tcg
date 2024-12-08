// Path to the skins_list.txt and abilities_list.txt files
const skinsListPath = "skins_list.txt";
const abilitiesListPath = "abilities_list.txt";

// Function to generate a random number within a range
function getRandomStat(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random price between $0.1 and $1000
function getRandomPrice() {
    const minPrice = 0.1;
    const maxPrice = 1000;
    return (Math.random() * (maxPrice - minPrice) + minPrice).toFixed(2);
}

// Function to fetch abilities from the abilities_list.txt file
async function fetchAbilities() {
    try {
        const response = await fetch(abilitiesListPath);
        if (!response.ok) throw new Error("Failed to load abilities list");
        const text = await response.text();
        return text.trim().split("\n");
    } catch (error) {
        console.error("Error loading abilities:", error);
        return [];
    }
}

// Function to generate a random rarity (common, rare, holographic)
function getRandomRarity() {
    const rarities = ['common', 'rare', 'holographic'];
    return rarities[Math.floor(Math.random() * rarities.length)];
}

// Function to create a card element
function createCard(skinPath, fileName, ability, attack, defense, speed, rarity, price) {
    const card = document.createElement("div");
    card.className = `card ${rarity}`; // Add rarity class (common, rare, holographic)
    card.dataset.username = fileName.toLowerCase(); // Add username for search filtering
    card.dataset.attack = attack;
    card.dataset.defense = defense;
    card.dataset.speed = speed;

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
    `;
    card.appendChild(stats);

    const abilityElement = document.createElement("div");
    abilityElement.className = "ability";
    abilityElement.textContent = ability || "No Ability";
    card.appendChild(abilityElement);

    // Add price element
    const priceElement = document.createElement("div");
    priceElement.className = "price";
    priceElement.textContent = `$${price}`; // Display price with a dollar sign
    card.appendChild(priceElement);

    return card;
}

// Function to load skins and abilities
async function loadSkins() {
    try {
        // Fetch abilities and skins
        const [abilities, skinsResponse] = await Promise.all([fetchAbilities(), fetch(skinsListPath)]);

        if (!skinsResponse.ok) throw new Error("Failed to load skins list");
        const text = await skinsResponse.text();
        const skins = text.trim().split("\n");

        const container = document.getElementById("card-container");

        // Create cards and sort them alphabetically
        const cards = skins.map((skinPath, index) => {
            const fileName = skinPath.split("/").pop().split(".")[0]; // Extract username
            const ability = abilities[index % abilities.length]; // Assign abilities in a loop
            const attack = getRandomStat(10, 100);
            const defense = getRandomStat(10, 100);
            const speed = getRandomStat(10, 100);
            const rarity = getRandomRarity(); // Assign rarity to the card
            const price = getRandomPrice(); // Assign price to the card
            return createCard(skinPath, fileName, ability, attack, defense, speed, rarity, price);
        });

        // Sort cards alphabetically by username
        cards.sort((a, b) => {
            const nameA = a.querySelector(".username").textContent.toLowerCase();
            const nameB = b.querySelector(".username").textContent.toLowerCase();
            return nameA.localeCompare(nameB);
        });

        // Append sorted cards to the container
        cards.forEach((card) => container.appendChild(card));

        // Attach search and filter functionality
        setupSearch(cards);
        setupFilters(cards);
    } catch (error) {
        console.error("Error loading skins:", error);
    }
}

// Function to set up search functionality
function setupSearch(cards) {
    const searchBar = document.getElementById("search-bar");

    searchBar.addEventListener("input", (event) => {
        const query = event.target.value.toLowerCase();

        cards.forEach((card) => {
            const username = card.dataset.username;
            if (username.includes(query)) {
                card.style.display = ""; // Show card
            } else {
                card.style.display = "none"; // Hide card
            }
        });
    });
}

// Function to set up filter functionality
function setupFilters(cards) {
    const attackFilter = document.getElementById("filter-attack");
    const defenseFilter = document.getElementById("filter-defense");
    const speedFilter = document.getElementById("filter-speed");

    const attackValueDisplay = document.getElementById("attack-value");
    const defenseValueDisplay = document.getElementById("defense-value");
    const speedValueDisplay = document.getElementById("speed-value");

    // Filter by attack stat
    attackFilter.addEventListener("input", (event) => {
        const value = event.target.value;
        attackValueDisplay.textContent = value;
        filterCards(cards, value, "attack");
    });

    // Filter by defense stat
    defenseFilter.addEventListener("input", (event) => {
        const value = event.target.value;
        defenseValueDisplay.textContent = value;
        filterCards(cards, value, "defense");
    });

    // Filter by speed stat
    speedFilter.addEventListener("input", (event) => {
        const value = event.target.value;
        speedValueDisplay.textContent = value;
        filterCards(cards, value, "speed");
    });
}

// Function to filter cards based on selected stat value
function filterCards(cards, value, stat) {
    cards.forEach((card) => {
        const statValue = parseInt(card.dataset[stat]);
        if (statValue >= value) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

// Load skins on page load
loadSkins();
