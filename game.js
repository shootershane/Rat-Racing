// =====================================================
// RAT RACING 2.0
// PART 1
// =====================================================

// ----------------------------
// RAT DATA
// ----------------------------

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

// ----------------------------
// CONSTANTS
// ----------------------------

const TRACK_LENGTH = 1000;
const TARGET_RACE_TIME = 30000;

let selected = [];

let race = {
    running: false,
    racers: [],
    animationId: null,
    startTime: 0
};

// ----------------------------
// DOM
// ----------------------------

const ratGrid = document.getElementById("ratGrid");
const selectedCount = document.getElementById("selectedCount");
const startRaceButton = document.getElementById("startRace");

const selectionScreen = document.getElementById("selectionScreen");
const raceScreen = document.getElementById("raceScreen");

const trackArea = document.getElementById("trackArea");
const leaderList = document.getElementById("leaderList");
const leaderName = document.getElementById("leaderName");

// ----------------------------
// SELECTION
// ----------------------------

function updateCounter() {

    selectedCount.textContent = `${selected.length} / 12 Selected`;

    startRaceButton.disabled = selected.length !== 12;

}

function toggleRat(index, card) {

    const existing = selected.indexOf(index);

    if (existing >= 0) {

        selected.splice(existing, 1);
        card.classList.remove("selected");

    } else {

        if (selected.length >= 12) return;

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

        card.onclick = () => toggleRat(index, card);

        ratGrid.appendChild(card);

    });

}

buildRatCards();
updateCounter();

// ----------------------------
// RACE PROFILE
// ----------------------------

function generateProfile() {

    return {

        acceleration: 0.85 + Math.random() * 0.15,
        topSpeed: 28 + Math.random() * 4,
        stamina: 0.85 + Math.random() * 0.15,
        consistency: 0.85 + Math.random() * 0.15

    };

}

function createRace() {

    race.racers = [];

    selected.forEach((ratIndex, lane) => {

        race.racers.push({

            lane,
            ratIndex,

            profile: generateProfile(),

            progress: 0,
            speed: 0,

            finished: false,
            finishMs: null

        });

    });

}

