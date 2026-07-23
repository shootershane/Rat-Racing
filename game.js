"use strict";

// ======================================================
// RAT RACING 2.0
// Milestone 3
// Foundation + Draft + Race Setup
// ======================================================

// ======================================================
// GAME SETTINGS
// ======================================================

const TOTAL_RACERS = 12;
const TRACK_LENGTH = 1000;

// ======================================================
// APP STATE
// ======================================================

const Game = {

    version: "2.0",

    initialized: false,

    selectedRats: [],

    racers: [],

    raceStarted: false,

    raceFinished: false,

    raceTime: 0,

    results: []

};

// ======================================================
// RAT DATABASE
// ======================================================

const RAT_DATABASE = [

    { id: 1, name: "Cheddar" },
    { id: 2, name: "Rocket" },
    { id: 3, name: "Pizza Pete" },
    { id: 4, name: "Peanut" },
    { id: 5, name: "Cowboy Jack" },
    { id: 6, name: "Captain Whiskers" },
    { id: 7, name: "Shadow" },
    { id: 8, name: "King Gouda" },
    { id: 9, name: "Chef Alfredo" },
    { id: 10, name: "Professor Pip" },
    { id: 11, name: "Tank" },
    { id: 12, name: "Slick" },
    { id: 13, name: "Ace" },
    { id: 14, name: "Rusty" },
    { id: 15, name: "Sparky" },
    { id: 16, name: "Turbo" },
    { id: 17, name: "Riff" },
    { id: 18, name: "Sergeant Squeak" },
    { id: 19, name: "Taco" },
    { id: 20, name: "Donut" },
    { id: 21, name: "Bubbles" },
    { id: 22, name: "Dusty" },
    { id: 23, name: "Magnet" },
    { id: 24, name: "Lucky" }

];

// ======================================================
// DOM REFERENCES
// ======================================================

const statusText =
    document.getElementById("statusText");

const initializeButton =
    document.getElementById("initializeButton");

const homeScreen =
    document.getElementById("homeScreen");

const draftScreen =
    document.getElementById("draftScreen");

const raceScreen =
    document.getElementById("raceScreen");

const ratGrid =
    document.getElementById("ratGrid");

const selectedCount =
    document.getElementById("selectedCount");

const startRaceButton =
    document.getElementById("startRaceButton");

const trackContainer =
    document.getElementById("trackContainer");

const leaderboard =
    document.getElementById("leaderboard");

const raceClock =
    document.getElementById("raceClock");

const distanceRemaining =
    document.getElementById("distanceRemaining");

const leaderName =
    document.getElementById("leaderName");

// ======================================================
// STARTUP
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    init
);

function init() {

    console.log("Rat Racing 2.0 Loaded");

    if (statusText) {

        statusText.textContent =
            "JavaScript Ready";

    }

    if (initializeButton) {

        initializeButton.addEventListener(
            "click",
            initializeProject
        );

    }

    if (startRaceButton) {

        startRaceButton.addEventListener(
            "click",
            startRace
        );

    }

    buildRatGrid();

    updateDraftUI();

}

// ======================================================
// INITIALIZE PROJECT
// ======================================================

function initializeProject() {

    if (Game.initialized)
        return;

    Game.initialized = true;

    initializeButton.disabled = true;

    statusText.textContent =
        "Project Initialized!";

    setTimeout(() => {

        homeScreen.classList.add("hidden");

        draftScreen.classList.remove("hidden");

    }, 500);

}

// ======================================================
// BUILD RAT GRID
// ======================================================

function buildRatGrid() {

    ratGrid.innerHTML = "";

    RAT_DATABASE.forEach(rat => {

        const card =
            document.createElement("div");

        card.className =
            "ratCard";

        card.dataset.id =
            rat.id;

        card.innerHTML = `

            <div class="ratEmoji">🐀</div>

            <h3>${rat.name}</h3>

            <p>Rat #${rat.id}</p>

        `;

        card.addEventListener(
            "click",
            () => toggleRatSelection(rat.id, card)
        );

        ratGrid.appendChild(card);

    });

}

// ======================================================
// RAT SELECTION
// ======================================================

function toggleRatSelection(id, card) {

    const index =
        Game.selectedRats.indexOf(id);

    if (index !== -1) {

        Game.selectedRats.splice(index, 1);

        card.classList.remove(
            "selected"
        );

    } else {

        if (
            Game.selectedRats.length >= TOTAL_RACERS
        ) {
            return;
        }

        Game.selectedRats.push(id);

        card.classList.add(
            "selected"
        );

    }

    updateDraftUI();

}

// ======================================================
// UPDATE DRAFT UI
// ======================================================

function updateDraftUI() {

    selectedCount.textContent =

        `${Game.selectedRats.length} / ${TOTAL_RACERS} Selected`;

    startRaceButton.disabled =

        Game.selectedRats.length !== TOTAL_RACERS;

}
// ======================================================
// START RACE
// (Milestone 4)
// ======================================================

function startRace() {

    Game.racers = [];
    Game.results = [];

    Game.raceStarted = false;
    Game.raceFinished = false;
    Game.raceTime = 0;

    Game.selectedRats.forEach(id => {

        const rat = RAT_DATABASE.find(r => r.id === id);

        Game.racers.push({

            id: rat.id,
            name: rat.name,

            lane: 0,

            distance: 0,
            speed: 0,
            targetSpeed: 0,

            acceleration: 0,
            topSpeed: 0,
            consistency: 0,
            burst: 0,
            stamina: 0,

            finished: false,
            finishTime: null

        });

    });

    assignRandomLanes();

    buildTrack();

    buildLeaderboard();

    draftScreen.classList.add("hidden");

    raceScreen.classList.remove("hidden");

    prepareRace();

    initializeRaceEngine();

}
// ======================================================
// ASSIGN RANDOM LANES
// ======================================================

function assignRandomLanes() {

    const lanes = [];

    for (let i = 1; i <= TOTAL_RACERS; i++) {

        lanes.push(i);

    }

    shuffleArray(lanes);

    Game.racers.forEach((rat, index) => {

        rat.lane = lanes[index];

    });

}

// ======================================================
// BUILD TRACK
// ======================================================

function buildTrack() {

    trackContainer.innerHTML = "";

    const racers = [...Game.racers];

    racers.sort((a, b) => a.lane - b.lane);

    racers.forEach(rat => {

        const lane = document.createElement("div");

        lane.className = "trackLane";

        lane.innerHTML = `

<div class="laneLabel">

${rat.lane}

</div>

<div class="laneTrack">

<div class="ratSprite"

data-rat="${rat.id}">

🐀

</div>

</div>

`;

        trackContainer.appendChild(lane);

    });

}

// ======================================================
// BUILD LEADERBOARD
// ======================================================

function buildLeaderboard() {

    leaderboard.innerHTML = "";

    const racers = [...Game.racers];

    racers.sort((a, b) => a.lane - b.lane);

    racers.forEach(rat => {

        const row = document.createElement("div");

        row.className = "leaderboardRow";

        row.id = `leader-${rat.id}`;

        row.innerHTML = `

<span>

${rat.name}

</span>

<span>

0'

</span>

`;

        leaderboard.appendChild(row);

    });

}

// ======================================================
// SHUFFLE ARRAY
// ======================================================

function shuffleArray(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

}
// ======================================================
// RESET RACE
// ======================================================

function resetRaceState() {

    Game.raceStarted = false;

    Game.raceFinished = false;

    Game.raceTime = 0;

    Game.results = [];

    Game.racers.forEach(rat => {

        rat.distance = 0;
        rat.speed = 0;
        rat.finished = false;
        rat.finishTime = null;

    });

}

// ======================================================
// UPDATE LEADERBOARD
// ======================================================

function updateLeaderboard() {

    const racers = [...Game.racers];

    racers.sort((a, b) => b.distance - a.distance);

    racers.forEach(rat => {

        const row = document.getElementById(`leader-${rat.id}`);

        if (!row) return;

        const spans = row.querySelectorAll("span");

        spans[0].textContent = rat.name;

        spans[1].textContent =
            `${Math.floor(rat.distance)}'`;

    });

    if (racers.length > 0) {

        leaderName.textContent = racers[0].name;

        distanceRemaining.textContent =
            Math.max(
                0,
                Math.ceil(TRACK_LENGTH - racers[0].distance)
            );

    }

}

// ======================================================
// PREPARE RACE
// ======================================================

function prepareRace() {

    resetRaceState();

    updateLeaderboard();

    raceClock.textContent = "0.00";

}

// ======================================================
// PLACEHOLDER
// (Milestone 4 will replace this)
// ======================================================

function beginRace() {

    console.log("Race engine coming in Milestone 4.");

}

// ======================================================
// READY
// ======================================================

console.log("Milestone 3 Loaded");
// ======================================================
// INITIALIZE RACE ENGINE
// ======================================================

function initializeRaceEngine() {

    Game.racers.forEach(rat => {

        rat.acceleration = randomBetween(0.05, 0.10);

        rat.topSpeed = randomBetween(4.5, 6.3);

        rat.consistency = randomBetween(0.90, 1.10);

        rat.burst = randomBetween(0.95, 1.20);

        rat.stamina = randomBetween(0.85, 1.00);

        rat.targetSpeed = rat.topSpeed;

        rat.speed = 0;

        rat.distance = 0;

    });

    Game.lastFrame = performance.now();

    Game.raceStarted = true;

    requestAnimationFrame(raceLoop);

}

// ======================================================
// RANDOM NUMBER
// ======================================================

function randomBetween(min, max) {

    return Math.random() * (max - min) + min;

}

// ======================================================
// RACE LOOP
// ======================================================

function raceLoop(timestamp) {

    if (!Game.raceStarted)
        return;

    const delta = (timestamp - Game.lastFrame) / 16.666;

    Game.lastFrame = timestamp;

    Game.raceTime += delta / 60;

    raceClock.textContent =
        Game.raceTime.toFixed(2);

    updateRacers(delta);

    updateTrackSprites();

    updateLeaderboard();

    if (!Game.raceFinished) {

        requestAnimationFrame(raceLoop);

    }

}
// ======================================================
// UPDATE RACERS
// ======================================================

function updateRacers(delta) {

    let finishedCount = 0;

    Game.racers.forEach(rat => {

        if (rat.finished) {
            finishedCount++;
            return;
        }

        // Small random pace changes
        if (Math.random() < 0.025) {

            const modifier =
                randomBetween(rat.consistency, rat.burst);

            rat.targetSpeed =
                rat.topSpeed * modifier;

        }

        // Smooth acceleration toward target speed
        rat.speed +=
            (rat.targetSpeed - rat.speed) *
            rat.acceleration;

        // Stamina slowly affects pace late in race
        const staminaFactor =
            1 -
            ((rat.distance / TRACK_LENGTH) * (1 - rat.stamina));

        rat.distance +=
            rat.speed *
            staminaFactor *
            delta;

        // Finish line
        if (rat.distance >= TRACK_LENGTH) {

            rat.distance = TRACK_LENGTH;

            rat.finished = true;

            rat.finishTime = Game.raceTime;

            Game.results.push(rat);

            finishedCount++;

        }

    });

    if (finishedCount === TOTAL_RACERS) {

        finishRace();

    }

}
// ======================================================
// UPDATE TRACK SPRITES
// ======================================================

function updateTrackSprites() {

    const width =
        trackContainer.clientWidth - 80;

    Game.racers.forEach(rat => {

        const sprite =
            document.querySelector(
                `[data-rat="${rat.id}"]`
            );

        if (!sprite)
            return;

        const percent =
            rat.distance / TRACK_LENGTH;

        sprite.style.left =
            `${percent * width}px`;

    });

}// ======================================================
// FINISH RACE
// ======================================================

function finishRace() {

    if (Game.raceFinished)
        return;

    Game.raceFinished = true;

    Game.raceStarted = false;

    console.table(Game.results);

    console.log(
        "Winner:",
        Game.results[0].name
    );

}
