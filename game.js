
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


// ---------- START GAME ----------

buildRatCards();

updateCounter();
// =====================================================
// RAT RACING
// GAME.JS - PART 2
// Build the race track
// =====================================================

// ---------- MORE ELEMENTS ----------

const selectionScreen = document.getElementById("selectionScreen");
const raceScreen = document.getElementById("raceScreen");
const trackArea = document.getElementById("trackArea");
const leaderList = document.getElementById("leaderList");

// ---------- BUILD TRACK ----------

function buildTrack() {

    trackArea.innerHTML = "";
    leaderList.innerHTML = "";

    selected.forEach((ratIndex, lane) => {

        const rat = rats[ratIndex];

        // Create lane
        const laneDiv = document.createElement("div");
        laneDiv.className = "trackLane";

        // Create runner
        const runner = document.createElement("div");
        runner.className = "runner";
        runner.id = "runner" + lane;

        runner.textContent = "🐀 " + rat.name;

        laneDiv.appendChild(runner);
        trackArea.appendChild(laneDiv);

        // Leaderboard
        const item = document.createElement("li");
        item.id = "leader" + lane;
        item.textContent = rat.name;

        leaderList.appendChild(item);

    });

}

// ---------- REPLACE START BUTTON ----------

// Remove the old click event


// New start function
function startRace() {

    selectionScreen.classList.add("hidden");
    raceScreen.classList.remove("hidden");

    buildTrack();

}

// Add new click event
startRaceButton.addEventListener("click", startRace);
// =====================================================
// RAT RACING
// GAME.JS - PART 3
// Race Engine
// =====================================================

let raceInterval = null;
let raceFinished = false;

function startRace() {

    selectionScreen.classList.add("hidden");
    raceScreen.classList.remove("hidden");

    buildTrack();

    raceFinished = false;

    const positions = [];

    for (let i = 0; i < selected.length; i++) {
        positions.push(0);
    }

    raceInterval = setInterval(function () {

        if (raceFinished) return;

        // Move every rat
        selected.forEach((ratIndex, lane) => {

            const runner = document.getElementById("runner" + lane);

            // Random movement
            positions[lane] += Math.random() * 6;

            if (positions[lane] > 100)
                positions[lane] = 100;

            runner.style.left = positions[lane] + "%";

        });

        // Live leaderboard
        const standings = positions
            .map((distance, lane) => ({
                lane,
                distance
            }))
            .sort((a, b) => b.distance - a.distance);

        leaderList.innerHTML = "";

        standings.forEach((entry, place) => {

            const rat =
                rats[selected[entry.lane]];

            const item =
                document.createElement("li");

            item.textContent =
                (place + 1) + ". " + rat.name;

            leaderList.appendChild(item);

        });

        // Winner
        const winner =
            standings[0];

        if (winner.distance >= 100) {

            raceFinished = true;

            clearInterval(raceInterval);

            const winningRat =
                rats[selected[winner.lane]];

            alert("🏆 " + winningRat.name + " wins!");

        }

    }, 60);

}

