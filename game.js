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

    { id: 1, name: "Cheddar", image: "images/rats/cheddar.png" },
    { id: 2, name: "Rocket", image: "images/rats/rocket.png" },
    { id: 3, name: "Pizza Pete", image: "images/rats/pizzapete.png" },
    { id: 4, name: "Peanut", image: "images/rats/peanut.png" },
    { id: 5, name: "Cowboy Jack", image: "images/rats/cowboyjack.png" },
    { id: 6, name: "Captain Whiskers", image: "images/rats/captainwhiskers.png" },
    { id: 7, name: "Shadow", image: "images/rats/shadow.png" },
    { id: 8, name: "King Gouda", image: "images/rats/kinggouda.png" },
    { id: 9, name: "Chef Alfredo", image: "images/rats/chefalfredo.png" },
    { id: 10, name: "Professor Pip", image: "images/rats/professorpip.png" },
    { id: 11, name: "Tank", image: "images/rats/tank.png" },
    { id: 12, name: "Slick", image: "images/rats/slick.png" },
    { id: 13, name: "Ace", image: "images/rats/ace.png" },
    { id: 14, name: "Rusty", image: "images/rats/rusty.png" },
    { id: 15, name: "Sparky", image: "images/rats/sparky.png" },
    { id: 16, name: "Turbo", image: "images/rats/turbo.png" },
    { id: 17, name: "Riff", image: "images/rats/riff.png" },
    { id: 18, name: "Sergeant Squeak", image: "images/rats/sergeantsqueak.png" },
    { id: 19, name: "Taco", image: "images/rats/taco.png" },
    { id: 20, name: "Donut", image: "images/rats/donut.png" },
    { id: 21, name: "Bubbles", image: "images/rats/bubbles.png" },
    { id: 22, name: "Dusty", image: "images/rats/dusty.png" },
    { id: 23, name: "Magnet", image: "images/rats/magnet.png" },
    { id: 24, name: "Lucky", image: "images/rats/lucky.png" }

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

        const card = document.createElement("div");

        card.className = "ratCard";

        card.dataset.id = rat.id;

        card.innerHTML = `

            <img class="draftRatImage"
                 src="${rat.image}"
                 alt="${rat.name}">

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

        const rat =
            RAT_DATABASE.find(r => r.id === id);

        Game.racers.push({

            id: rat.id,

            name: rat.name,

            image: rat.image,

            lane: 0,

            distance: 0,

            speed: 0,

            acceleration: 0,

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

    <div class="laneNumber">
        ${rat.lane}
    </div>

    <div class="laneName">
        <img class="lanePortrait"
             src="${rat.image}">
        ${rat.name}
    </div>

</div>

<div class="laneTrack">

    <img
        class="ratSprite"
        src="${rat.image}"
        data-rat="${rat.id}">

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

    // Sort racers by current position
    const racers = [...Game.racers]
        .sort((a, b) => {

            if (a.finished && b.finished)
                return a.finishTime - b.finishTime;

            if (a.finished)
                return -1;

            if (b.finished)
                return 1;

            return b.distance - a.distance;

        });

    leaderboard.innerHTML = "";

    racers.forEach((rat, index) => {

        const row = document.createElement("div");

        row.className = "leaderboardRow";

        let place = `${index + 1}.`;

        if (index === 0) place = "🥇";
        else if (index === 1) place = "🥈";
        else if (index === 2) place = "🥉";

        row.innerHTML = `

            <span>${place} ${rat.name}</span>

        `;

        leaderboard.appendChild(row);

    });

    if (racers.length > 0) {

        if (Game.raceFinished) {

            leaderName.textContent =
                `🏆 ${Game.results[0].name}`;

            distanceRemaining.textContent =
                "FINISHED";

        } else {

            leaderName.textContent =
                racers[0].name;

            distanceRemaining.textContent =
                Math.max(
                    0,
                    Math.ceil(
                        TRACK_LENGTH -
                        racers[0].distance
                    )
                );

        }

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
// MILESTONE 5 - RACE ENGINE
// PART 1
// ======================================================

const RACE_DURATION = 30;

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function initializeRaceEngine() {

    Game.results = [];

    Game.raceStarted = false;

    Game.raceFinished = false;

    Game.raceTime = 0;

    Game.countdownStart = null;

    Game.lastFrame = 0;

    Game.phase = "start";

    Game.racers.forEach(rat => {

        rat.distance = 0;

        rat.speed = 0;

        rat.finished = false;

        rat.finishTime = null;

        rat.started = false;

        rat.reactionDelay = randomBetween(0.05,0.80);

        rat.acceleration = randomBetween(11,17);

        rat.baseSpeed = randomBetween(27,31);

        rat.maxSpeed = randomBetween(35,40);

        rat.energy = randomBetween(94,106);

        rat.consistency = randomBetween(.97,1.03);

        rat.sprint = randomBetween(1.04,1.12);

        rat.state = "steady";

        rat.stateTimer = randomBetween(1.5,4);

        rat.eventTimer = randomBetween(2,4);

        rat.boost = 1;

    });

    raceClock.textContent = "3";

    requestAnimationFrame(countdownLoop);

}

// ======================================================
// COUNTDOWN
// ======================================================

function countdownLoop(timestamp) {

    if (!Game.countdownStart) {

        Game.countdownStart = timestamp;

        Game.lastCountdown = 3;

    }

    const elapsed =
        (timestamp - Game.countdownStart) / 1000;

    const count =
        Math.ceil(3 - elapsed);

    if (count > 0) {

        if (count !== Game.lastCountdown) {

            Game.lastCountdown = count;

            raceClock.textContent = count;

        }

        requestAnimationFrame(countdownLoop);

        return;

    }

    raceClock.textContent = "GO!";

    setTimeout(() => {

        Game.raceStarted = true;

        Game.lastFrame = performance.now();

        requestAnimationFrame(raceLoop);

    },500);

}

// ======================================================
// MAIN RACE LOOP
// ======================================================

function raceLoop(timestamp) {

    if (Game.raceFinished)
        return;

    const delta =
        (timestamp - Game.lastFrame) / 1000;

    Game.lastFrame = timestamp;

    Game.raceTime += delta;

    raceClock.textContent =
        Game.raceTime.toFixed(2);

    updateRacePhase();

    updateRacers(delta);

    updateLeaderboard();

    updateTrackSprites();

    checkForFinish();

    if (!Game.raceFinished) {

        requestAnimationFrame(raceLoop);

    }

}

// ======================================================
// RACE PHASE
// ======================================================

function updateRacePhase() {

    const percent =
        Game.raceTime / RACE_DURATION;

    if (percent < .25) {

        Game.phase = "start";

    }
    else if (percent < .75) {

        Game.phase = "middle";

    }
    else {

        Game.phase = "finish";

    }

}

// ======================================================
// UPDATE RACERS
// ======================================================

function updateRacers(delta) {

    // Current running order
    const order = [...Game.racers]
        .sort((a, b) => b.distance - a.distance);

    Game.racers.forEach(rat => {

        if (rat.finished)
            return;

        // Reaction delay
        if (!rat.started) {

            if (Game.raceTime < rat.reactionDelay)
                return;

            rat.started = true;

        }

        // Current position
        const position =
            order.findIndex(r => r.id === rat.id) + 1;

        // Change behavior every few seconds
        rat.stateTimer -= delta;

        if (rat.stateTimer <= 0) {

            rat.stateTimer =
                randomBetween(1.5, 3.5);

            let roll = Math.random();

            if (position <= 3) {

                // Leaders sometimes cool off
                if (roll < .40)
                    rat.state = "recover";
                else if (roll < .80)
                    rat.state = "steady";
                else
                    rat.state = "push";

            }
            else if (position >= 9) {

                // Back markers gamble
                if (roll < .55)
                    rat.state = "push";
                else if (roll < .80)
                    rat.state = "steady";
                else
                    rat.state = "recover";

            }
            else {

                // Mid-pack races hardest
                if (roll < .30)
                    rat.state = "recover";
                else if (roll < .65)
                    rat.state = "steady";
                else
                    rat.state = "push";

            }

        }

        // Smooth boost changes
        let targetBoost = 1;

        switch (rat.state) {

            case "recover":
                targetBoost = 0.93;
                break;

            case "steady":
                targetBoost = 1.00;
                break;

            case "push":
                targetBoost = 1.10;
                break;

        }

        // Final stretch
        if (Game.phase === "finish") {

            targetBoost *= rat.sprint;

            // Back half attacks harder
            if (position > 6)
                targetBoost *= 1.03;

        }

        // Smooth transition
        rat.boost +=
            (targetBoost - rat.boost) *
            2.5 * delta;

        // Accelerate toward target speed
        const targetSpeed =
            rat.baseSpeed *
            rat.boost *
            rat.consistency;

        if (rat.speed < targetSpeed) {

            rat.speed +=
                rat.acceleration * delta;

            if (rat.speed > targetSpeed)
                rat.speed = targetSpeed;

        } else {

            rat.speed -=
                rat.acceleration * .9 * delta;

            if (rat.speed < targetSpeed)
                rat.speed = targetSpeed;

        }

        // Small random wobble
        rat.speed *= randomBetween(.995, 1.005);

        // Never exceed max speed
        if (rat.speed > rat.maxSpeed)
            rat.speed = rat.maxSpeed;

        if (rat.speed < 0)
            rat.speed = 0;

        // Move
        rat.distance +=
            rat.speed * delta;

        if (rat.distance >= TRACK_LENGTH) {

            rat.distance = TRACK_LENGTH;

            rat.finished = true;

            rat.finishTime = Game.raceTime;

            Game.results.push(rat);

        }

    });

}
// ======================================================
// UPDATE TRACK SPRITES
// ======================================================

function updateTrackSprites() {

    const sprites =
        document.querySelectorAll(".ratSprite");

    const laneWidth =
        trackContainer.querySelector(".laneTrack")
            ?.clientWidth || 900;

    Game.racers.forEach(rat => {

        const sprite =
            document.querySelector(
                `[data-rat="${rat.id}"]`
            );

        if (!sprite)
            return;

        const x =
            (rat.distance / TRACK_LENGTH) *
            (laneWidth - 40);

        sprite.style.transform =
            `translateX(${x}px)`;

    });

}

// ======================================================
// CHECK FOR FINISH
// ======================================================

function checkForFinish() {

    if (Game.results.length <
        Game.racers.length)
        return;

    finishRace();

}

// ======================================================
// FINISH RACE
// ======================================================

function finishRace() {

    Game.raceFinished = true;
    Game.raceStarted = false;

    Game.results.sort(

        (a,b)=>
            a.finishTime-b.finishTime

    );

    leaderName.textContent =
        `🏆 ${Game.results[0].name}`;

    raceClock.textContent =
        Game.results[0].finishTime.toFixed(2);

    console.clear();

    console.table(

        Game.results.map((rat,index)=>({

            Place:index+1,
            Rat:rat.name,
            Time:rat.finishTime.toFixed(2)

        }))

    );

}

// ======================================================
// RACE AGAIN
// ======================================================

function resetRaceEngine() {

    Game.results=[];

    Game.raceStarted=false;

    Game.raceFinished=false;

    Game.raceTime=0;

    Game.lastFrame=0;

    Game.countdownStart=null;

    Game.racers.forEach(rat=>{

        rat.distance=0;

        rat.speed=0;

        rat.finished=false;

        rat.finishTime=null;

        rat.started=false;

    });

    buildTrack();

    buildLeaderboard();

    initializeRaceEngine();

}

// ======================================================
// DEBUG
// ======================================================

window.resetRaceEngine =
    resetRaceEngine;

console.log(
    "Milestone 5 Loaded"
);
// ======================================================
// OPTIONAL COMMENTARY
// ======================================================

const COMMENTARY = [

    "A great break from the gate!",
    "They're packed together!",
    "Someone is making a move!",
    "Huge burst of speed!",
    "The leader is under pressure!",
    "What a race!",
    "They're flying down the stretch!",
    "This one is going to be close!",
    "A late charge!",
    "Photo finish incoming!"

];

let commentaryTimer = 0;

function updateCommentary(delta) {

    commentaryTimer -= delta;

    if (commentaryTimer > 0)
        return;

    commentaryTimer =
        randomBetween(3,6);

    const log =
        document.getElementById("commentaryLog");

    if (!log)
        return;

    const leaders =
        [...Game.racers]
        .sort((a,b)=>b.distance-a.distance);

    const leader =
        leaders[0];

    const message =
        COMMENTARY[
            Math.floor(
                Math.random()*COMMENTARY.length
            )
        ];

    const line =
        document.createElement("div");

    line.textContent =
        `${leader.name}: ${message}`;

    log.prepend(line);

    while (log.children.length > 8) {

        log.removeChild(
            log.lastChild
        );

    }

}

// ======================================================
// MODIFY RACE LOOP
// ======================================================
//
// Inside raceLoop(),
// insert this line immediately after:
//
// updateRacers(delta);
//
//
// updateCommentary(delta);
//
// ======================================================
// RACE RESULTS TABLE
// ======================================================

function printResults() {

    console.group("Race Results");

    Game.results.forEach((rat,index)=>{

        console.log(

            `${index+1}. ${rat.name}  (${rat.finishTime.toFixed(2)}s)`

        );

    });

    console.groupEnd();

}

// ======================================================
// UPDATE finishRace()
// ======================================================
//
// Add this line at the END of finishRace():
//
// printResults();
//
// ======================================================

console.log("Race Engine Complete");
