
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

        runner.textContent = "🐀 ";
        runner.title = rat.name;

        laneDiv.appendChild(runner);
        trackArea.appendChild(laneDiv);

        // Leaderboard
        const item = document.createElement("li");
        item.id = "leader" + lane;
        item.textContent = rat.name;

        leaderList.appendChild(item);

    });

}

// =====================================================
// RAT RACING
// GAME.JS - PART 3
// Smooth Race Engine
// =====================================================

let raceInterval = null;

function startRace() {

    selectionScreen.classList.add("hidden");
    raceScreen.classList.remove("hidden");

    buildTrack();

    clearInterval(raceInterval);

    const racers = selected.map((ratIndex, lane) => ({
        lane,
        speed: 0,
        position: 0
    }));

    raceInterval = setInterval(() => {

        racers.forEach(racer => {

            // Smooth acceleration/deceleration
            const targetSpeed = 1.1 + Math.random() * 0.5;

// Smoothly accelerate toward the target speed
racer.speed += (targetSpeed - racer.speed) * 0.03;

// Tiny random burst to keep the race exciting
racer.speed += (Math.random() - 0.5) * 0.03;

// Keep speeds realistic
if (racer.speed < 0.8) racer.speed = 0.8;
if (racer.speed > 1.8) racer.speed = 1.8;

racer.position += racer.speed;
            if (racer.position > 100) {
                racer.position = 100;
            }

            document.getElementById("runner" + racer.lane).style.left =
                racer.position + "%";
        });

        racers.sort((a, b) => b.position - a.position);

        leaderList.innerHTML = "";

        racers.forEach((racer, place) => {

            const li = document.createElement("li");

            li.textContent =
                `${place + 1}. ${rats[selected[racer.lane]].name}`;

            leaderList.appendChild(li);

        });

        document.getElementById("leaderName").textContent =
            rats[selected[racers[0].lane]].name;

        if (racers[0].position >= 100) {

            clearInterval(raceInterval);

            setTimeout(() => {

                alert("🏆 " +
                    rats[selected[racers[0].lane]].name +
                    " Wins!");

            }, 300);

        }

    }, 16);

}

startRaceButton.addEventListener("click", startRace);

