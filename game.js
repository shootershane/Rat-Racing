
// =====================================================
// RAT RACING
// GAME.JS - PART 1
// Replace your entire game.js with this file.
// =====================================================

// ---------- RAT DATA ----------

const rats = [
    { name: "Cheddar", bio: "Cocky Champion" },
    { name: "Rocket", bio: "Trash Talker" },
    { name: "Pizza Pete", bio: "Powered By Pizza" },
    { name: "Peanut", bio: "Tiny But Fearless" },
    { name: "Cowboy Jack", bio: "Wild West Racer" },
    { name: "Captain Whiskers", bio: "Pirate Legend" },
    { name: "Shadow", bio: "Sneaky Ninja" },
    { name: "King Gouda", bio: "Royal Racer" },
    { name: "Chef Alfredo", bio: "Master Chef" },
    { name: "Professor Pip", bio: "Crazy Inventor" },
    { name: "Tank", bio: "Built Like A Truck" },
    { name: "Slick", bio: "Too Cool" },
    { name: "Ace", bio: "Natural Winner" },
    { name: "Rusty", bio: "Construction Rat" },
    { name: "Sparky", bio: "Firefighter" },
    { name: "Turbo", bio: "Loves Speed" },
    { name: "Riff", bio: "Rock Star" },
    { name: "Sergeant Squeak", bio: "Never Gives Up" },
    { name: "Taco", bio: "Always Hungry" },
    { name: "Donut", bio: "Sweet Tooth" },
    { name: "Bubbles", bio: "Happy Go Lucky" },
    { name: "Dusty", bio: "Janitor" },
    { name: "Magnet", bio: "Gadget Builder" },
    { name: "Lucky", bio: "Feels Lucky" }
];

// ---------- GAME STATE ----------

const selected = [];

// ---------- ELEMENTS ----------

const ratGrid = document.getElementById("ratGrid");
const selectedCount = document.getElementById("selectedCount");
const startRaceButton = document.getElementById("startRace");

// ---------- FUNCTIONS ----------

function updateCounter() {

    selectedCount.textContent =
        `${selected.length} / 12 Selected`;

    startRaceButton.disabled =
        selected.length !== 12;

}

function toggleRat(index, card) {

    const alreadySelected = selected.includes(index);

    if (alreadySelected) {

        selected.splice(selected.indexOf(index), 1);

        card.classList.remove("selected");

    } else {

        if (selected.length >= 12)
            return;

        selected.push(index);

        card.classList.add("selected");

    }

    updateCounter();

}

function buildRatCards() {

    ratGrid.innerHTML = "";

    rats.forEach((rat, index) => {

        const card = document.createElement("div");

        card.className = "ratCard";

        card.innerHTML = `
            <div class="ratPortrait">🐀</div>
            <div class="ratName">${rat.name}</div>
            <div class="ratBio">${rat.bio}</div>
        `;

        card.addEventListener("click", function () {

            toggleRat(index, card);

        });

        ratGrid.appendChild(card);

    });

}

// ---------- START BUTTON ----------

function startRace() {

    alert("Race engine coming in Part 2.");

}

startRaceButton.addEventListener("click", startRace);

// ---------- START GAME ----------

buildRatCards();

updateCounter();
