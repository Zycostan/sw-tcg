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
    const speed = getRandomStat(10, 100);
    const price = getRandomPrice(0.1, 1000);

    const card = document.createElement("div");
    card.className = "card";
    card.dataset.username = fileName.toLowerCase();

    const img = document.createElement("img");
    img.src = skinPath;
    img.alt = `${fileName}'s skin`;
    img.loading = "lazy";
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

    const abilityInfo = document.createElement("div");
    abilityInfo.className = "ability-info";
    abilityInfo.innerHTML = `
        <div><strong>Ability:</strong> ${ability}</div>
        <div class="ability-description">${description}</div>
    `;
    card.appendChild(abilityInfo);

    return card;
}

// Function to load skins and abilities
async function loadCards() {
    try {
        const skinsResponse = await fetch(skinsListPath);
        const abilitiesResponse = await fetch(abilitiesListPath);

        if (!skinsResponse.ok || !abilitiesResponse.ok) {
            throw new Error("Failed to load files");
        }

        const skins = (await skinsResponse.text()).trim().split("\n");
        const abilities = (await abilitiesResponse.text())
            .trim()
            .split("\n")
            .map((line) => line.split(":"));

        const container = document.getElementById("card-container");
        skins.forEach((skinPath) => {
            const fileName = skinPath.split("/").pop().split(".")[0];
            const [ability, description] = abilities[Math.floor(Math.random() * abilities.length)];
            const card = createCard(skinPath, fileName, ability, description);
            container.appendChild(card);
        });

        setupSearch();
    } catch (error) {
        console.error("Error loading cards:", error);
    }
}

// Function to set up search functionality
function setupSearch() {
    const searchBar = document.getElementById("search-bar");
    const cards = document.querySelectorAll(".card");

    searchBar.addEventListener("input", (event) => {
        const query = event.target.value.toLowerCase();
        cards.forEach((card) => {
            const username = card.dataset.username;
            card.style.display = username.includes(query) ? "" : "none";
        });
    });
}

// Load cards on page load
loadCards();
