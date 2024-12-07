// Path to the skins_list.txt and abilities_list.txt files
const skinsListPath = "skins_list.txt";
const abilitiesListPath = "abilities_list.txt";

// Function to get a random ability from the fetched abilities list
async function getRandomAbility() {
    const abilities = await loadAbilities();
    return abilities[Math.floor(Math.random() * abilities.length)];
}

// Function to load the abilities from the file
async function loadAbilities() {
    try {
        const response = await fetch(abilitiesListPath);
        if (!response.ok) throw new Error("Failed to load abilities list");

        const text = await response.text();
        const abilities = text.trim().split("\n").map(line => {
            const [name, description] = line.split("|");
            return { name: name.trim(), description: description.trim() };
        });

        return abilities;
    } catch (error) {
        console.error("Error loading abilities:", error);
        return [];
    }
}

// Function to generate a random number within a range
function getRandomStat(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to create a card element
async function createCard(skinPath, fileName) {
    const attack = getRandomStat(10, 100);
    const defense = getRandomStat(10, 100);
    const speed = getRandomStat(10, 100);
    const ability = await getRandomAbility(); // Fetch random ability

    const card = document.createElement("div");
    card.className = "card";
    card.dataset.username = fileName.toLowerCase();

    const img = document.createElement("img");
    img.src = skinPath;
    img.alt = `${fileName}'s skin`;
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

    const abilityDescription = document.createElement("div");
    abilityDescription.className = "ability-description";
    abilityDescription.innerHTML = `
        <div><strong>${ability.name}</strong></div>
        <div>${ability.description}</div>
    `;
    card.appendChild(abilityDescription);

    return card;
}

// Function to load skins from the file
async function loadSkins() {
    try {
        const response = await fetch(skinsListPath);
        if (!response.ok) throw new Error("Failed to load skins list");

        const text = await response.text();
        const skins = text.trim().split("\n");

        const container = document.getElementById("card-container");
        skins.forEach((skinPath) => {
            const fileName = skinPath.split("/").pop().split(".")[0];
            createCard(skinPath, fileName).then(card => container.appendChild(card));
        });

        setupSearch();
    } catch (error) {
        console.error("Error loading skins:", error);
    }
}

// Function to set up search functionality
function setupSearch() {
    const searchBar = document.getElementById("search-bar");
    const cards = document.querySelectorAll(".card");

    let debounceTimeout;
    searchBar.addEventListener("input", (event) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            const query = event.target.value.toLowerCase();
            cards.forEach((card) => {
                const username = card.dataset.username;
                card.style.display = username.includes(query) ? "" : "none";
            });
        }, 200);
    });
}

// Load skins on page load
loadSkins();
