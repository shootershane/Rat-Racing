
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
// Dynamic Race Engine
// =====================================================

let raceInterval = null;

function startRace() {

    selectionScreen.classList.add("hidden");
    raceScreen.classList.remove("hidden");

    buildTrack();

    clearInterval(raceInterval);

    const finish = trackArea.clientWidth - 80;

    const racers = selected.map((ratIndex, lane) => ({
        lane,
        position: 0,
        speed: 2 + Math.random()
    }));

    raceInterval = setInterval(() => {

        racers.forEach(racer => {

            // Random burst or slowdown
            racer.speed += (Math.random() - 0.48) * 0.35;

            // Keep speeds reasonable
            if (racer.speed < 0.5) racer.speed = 0.5;
            if (racer.speed > 4.5) racer.speed = 4.5;

            // Move forward
            racer.position += racer.speed;

            // Gradually reduce bursts
            racer.speed *= 0.97;

            // Don't pass finish line
            if (racer.position > finish) {
                racer.position = finish;
            }

            const runner = document.getElementById("runner" + racer.lane);

            if (runner) {
                runner.style.left = racer.position + "px";
            }

        });

        // Sort racers by position
        const standings = [...racers].sort((a, b) => b.position - a.position);

        // Update leaderboard
        leaderList.innerHTML = "";

        standings.forEach((racer, place) => {

            const li = document.createElement("li");
            li.textContent =
                `${place + 1}. ${rats[selected[racer.lane]].name}`;

            leaderList.appendChild(li);

        });

        // Update TV leader
        document.getElementById("leaderName").textContent =
            rats[selected[standings[0].lane]].name;

        // Finish race
        if (standings[0].position >= finish) {

            clearInterval(raceInterval);

            setTimeout(() => {

                alert(
                    "🏆 " +
                    rats[selected[standings[0].lane]].name +
                    " Wins!"
                );

            }, 500);

        }

    }, 16);

}

startRaceButton.addEventListener("click", startRace);


Sent from Yahoo Mail for iPhone
