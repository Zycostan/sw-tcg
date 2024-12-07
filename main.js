// Path to the skins_list.txt file
const skinsListPath = "skins_list.txt";

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

// Function to load skins in batches
async function loadSkins(batchSize = 10) {
    try {
        const response = await fetch(skinsListPath);
        if (!response.ok) throw new Error("Failed to load skins list");

        const text = await response.text();
        const skins = text.trim().split("\n");

        const container = document.getElementById("card-container");
        let loadedCount = 0;

        // Load a batch of skins
        function loadBatch() {
            const batch = skins.slice(loadedCount, loadedCount + batchSize);
            batch.forEach((skinPath) => {
                const fileName = skinPath.split("/").pop().split(".")[0]; // Extract username
                const card = createCard(skinPath, fileName);
                container.appendChild(card);
            });
            loadedCount += batch.length;
            if (loadedCount < skins.length) {
                // Check if more images need to be loaded when scrolling
                checkIfNeedToLoadMore();
            }
        }

        // Initially load the first batch
        loadBatch();

        // Attach scroll event to load more when scrolling near the bottom
        function checkIfNeedToLoadMore() {
            const scrollPosition = window.scrollY + window.innerHeight;
            const pageHeight = document.documentElement.scrollHeight;
            if (scrollPosition >= pageHeight - 200) { // 200px from the bottom
                loadBatch();
            }
        }

        window.addEventListener('scroll', checkIfNeedToLoadMore);

        // Attach search functionality
        setupSearch();
    } catch (error) {
        console.error("Error loading skins:", error);
    }
}

// Function to set up search functionality with debounce
function setupSearch() {
    const searchBar = document.getElementById("search-bar");
    const cards = document.querySelectorAll(".card");
    let timeoutId;

    searchBar.addEventListener("input", (event) => {
        clearTimeout(timeoutId); // Clear the previous timeout
        const query = event.target.value.toLowerCase();

        timeoutId = setTimeout(() => {
            cards.forEach((card) => {
                const username = card.dataset.username;
                if (username.includes(query)) {
                    card.style.display = ""; // Show card
                } else {
                    card.style.display = "none"; // Hide card
                }
            });
        }, 300); // Delay search for 300ms after user stops typing
    });
}

// Load skins on page load
loadSkins();
