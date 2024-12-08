// Path to the skins_list.txt and abilities_list.txt files
const skinsListPath = "skins_list.txt";
const abilitiesListPath = "abilities_list.txt";

// Function to generate a random number within a range
function getRandomStat(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random price between 1 and 500
function getRandomPrice(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

// Function to create a card element with randomized price
function createCard(skinPath, fileName, ability) {
    const attack = getRandomStat(10, 100);
    const defense = getRandomStat(10, 100);
    const speed = getRandomStat(10, 100); // Randomized speed stat
    const price = getRandomPrice(1, 500); // Randomized price between 1 and 500

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
    `;
    card.appendChild(stats);

    const abilityElement = document.createElement("div");
    abilityElement.className = "ability";
    abilityElement.textContent = ability || "No Ability";
    card.appendChild(abilityElement);

    const priceElement = document.createElement("div");
    priceElement.className = "price";
    priceElement.textContent = `$${price}`; // Display the price
    card.appendChild(priceElement);

    // Add click event to open the modal
    card.addEventListener("click", () => openModal(skinPath, fileName, ability, attack, defense, speed, price));

    return card;
}

// Function to open the modal with player details, including price
function openModal(skinPath, fileName, ability, attack, defense, speed, price) {
    const modal = document.getElementById("card-modal");
    const modalSkin = modal.querySelector(".modal-skin");
    const modalUsername = modal.querySelector(".modal-username");
    const modalAbility = modal.querySelector(".modal-ability");
    const modalAttack = modal.querySelector(".modal-attack");
    const modalDefense = modal.querySelector(".modal-defense");
    const modalSpeed = modal.querySelector(".modal-speed");
    const modalPrice = modal.querySelector(".modal-price"); // New element for price

    modalSkin.src = skinPath; // Set the skin image in the modal
    modalUsername.textContent = fileName; // Set username in the modal
    modalAbility.textContent = ability || "No Ability"; // Set ability name
    modalAttack.textContent = attack; // Set attack stat
    modalDefense.textContent = defense; // Set defense stat
    modalSpeed.textContent = speed; // Set speed stat
    modalPrice.textContent = `$${price}`; // Set price in the modal

    // Show the modal
    modal.style.display = "block";

    // Add event listener to close the modal
    const closeButton = modal.querySelector(".close-button");
    closeButton.onclick = () => modal.style.display = "none";

    // Close modal when clicking outside the modal content
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
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
            return createCard(skinPath, fileName, ability);
        });

        // Sort cards alphabetically by username
        cards.sort((a, b) => {
            const nameA = a.querySelector(".username").textContent.toLowerCase();
            const nameB = b.querySelector(".username").textContent.toLowerCase();
            return nameA.localeCompare(nameB);
        });

        // Append sorted cards to the container
        cards.forEach((card) => container.appendChild(card));

        // Attach search functionality
        setupSearch();
    } catch (error) {
        console.error("Error loading skins:", error);
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
            if (username.includes(query)) {
                card.style.display = ""; // Show card
            } else {
                card.style.display = "none"; // Hide card
            }
        });
    });
}

// Load skins on page load
loadSkins();
