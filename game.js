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
const TRACK_LENGTH = 1500;

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

const RACE_DURATION = 45;

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

    // Random race style
    const raceScripts = [

        {
            name: "Breakaway",
            launch: 1.08,
            middle: 1.00,
            finish: 0.96
        },

        {
            name: "Comeback",
            launch: 0.95,
            middle: 1.00,
            finish: 1.10
        },

        {
            name: "Pack Battle",
            launch: 1.00,
            middle: 1.03,
            finish: 1.03
        },

        {
            name: "Late Charge",
            launch: 0.97,
            middle: 0.99,
            finish: 1.12
        },

        {
            name: "Wire To Wire",
            launch: 1.10,
            middle: 1.03,
            finish: 0.98
        },

        {
            name: "Chaotic",
            launch: randomBetween(0.95,1.10),
            middle: randomBetween(0.95,1.10),
            finish: randomBetween(0.95,1.10)
        }

    ];

    Game.raceScript =
        raceScripts[
            Math.floor(
                Math.random() *
                raceScripts.length
            )
        ];

    Game.racers.forEach(rat => {

        rat.distance = 0;
        rat.speed = 0;

        rat.finished = false;
        rat.finishTime = null;

        rat.started = false;

        rat.reactionDelay =
            randomBetween(0.05,0.45);

        // Physics

        rat.acceleration =
            randomBetween(12,18);

        rat.baseSpeed =
            randomBetween(27,31);

        rat.maxSpeed =
            randomBetween(36,42);

        rat.boost = 1.0;
        rat.targetBoost = 1.0;

        // Hidden ratings

        rat.stamina =
            randomBetween(0.92,1.08);

        rat.consistency =
            randomBetween(0.94,1.06);

        rat.passing =
            randomBetween(0.94,1.08);

        rat.clutch =
            randomBetween(0.94,1.10);

        rat.confidence = 1.0;

        // Assign a role

        const roles = [

            "Leader",
            "Closer",
            "Grinder",
            "Wildcard",
            "Chaser",
            "Sprinter"

        ];

        rat.role =
            roles[
                Math.floor(
                    Math.random() *
                    roles.length
                )
            ];

        rat.launchFactor =
            Game.raceScript.launch *
            randomBetween(0.97,1.03);

        rat.middleFactor =
            Game.raceScript.middle *
            randomBetween(0.97,1.03);

        rat.finishFactor =
            Game.raceScript.finish *
            randomBetween(0.97,1.03);

    });

    console.log(
        "Race Script:",
        Game.raceScript.name
    );

    raceClock.textContent = "3";

    requestAnimationFrame(
        countdownLoop
    );

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

    updateRaceDirector(delta);

    updateRacers(delta);

    updateLeaderboard();

    updateTrackSprites();

    updateCommentary(delta);

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
// RACE DIRECTOR
// ======================================================

function updateRaceDirector(delta) {

    const racePercent =
        Game.raceTime / RACE_DURATION;

    Game.racers.sort(
        (a, b) => b.distance - a.distance
    );

    const leaderDistance =
        Game.racers[0].distance;

    Game.racers.forEach((rat, index) => {

        let target =
            rat.baseSpeed;

        // -------------------------
        // Race script influence
        // -------------------------

        if (racePercent < 0.25) {

            target *= rat.launchFactor;

        }
        else if (racePercent < 0.75) {

            target *= rat.middleFactor;

        }
        else {

            target *= rat.finishFactor;

        }

        // -------------------------
        // Hidden role behavior
        // -------------------------

        switch (rat.role) {

            case "Leader":

                if (index === 0) {

                    target *= 1.05;

                }

                break;

            case "Closer":

                if (racePercent > 0.70) {

                    target *=
                        1.08 * rat.clutch;

                }

                break;

            case "Grinder":

                target *= rat.stamina;

                break;

            case "Sprinter":

                if (racePercent < 0.20) {

                    target *= 1.08;

                }

                break;

            case "Chaser":

                if (index > 0 && index < 5) {

                    target *=
                        1.03 * rat.passing;

                }

                break;

            case "Wildcard":

                target *=
                    randomBetween(
                        0.97,
                        1.03
                    );

                break;

        }

        // -------------------------
        // Pack positioning
        // -------------------------

        const gap =
            leaderDistance - rat.distance;

        if (gap > 180) {

            target *= 1.08;

        }
        else if (gap > 100) {

            target *= 1.04;

        }
        else if (gap < 20 && index === 0) {

            target *= 0.98;

        }
                // -------------------------
        // Confidence
        // -------------------------

        if (index === 0) {

            rat.confidence +=
                0.10 * delta;

        }
        else {

            rat.confidence -=
                0.03 * delta;

        }

        rat.confidence = Math.max(
            0.90,
            Math.min(
                1.15,
                rat.confidence
            )
        );

        target *= rat.confidence;

        // -------------------------
        // Random surges
        // -------------------------

        if (Math.random() < 0.006) {

            rat.targetBoost =
                randomBetween(
                    1.03,
                    1.10
                );

        }

        rat.boost +=
            (rat.targetBoost - rat.boost) *
            delta * 2.0;

        target *= rat.boost;

        if (
            Math.abs(
                rat.boost -
                rat.targetBoost
            ) < 0.01
        ) {

            rat.targetBoost = 1.0;

        }

        // -------------------------
        // Smooth target speed
        // -------------------------

        rat.targetSpeed = Math.min(
            target,
            rat.maxSpeed
        );

    });

}
// ======================================================
// UPDATE RACERS
// ======================================================

function updateRacers(delta) {

    Game.racers.forEach(rat => {

        if (rat.finished) return;

        // -------------------------
        // Reaction delay
        // -------------------------

        if (!rat.started) {

            if (Game.raceTime >= rat.reactionDelay) {

                rat.started = true;

            } else {

                return;

            }

        }

        // -------------------------
        // Smooth acceleration
        // -------------------------

        const accelRate =
            rat.acceleration * delta;

        if (rat.speed < rat.targetSpeed) {

            rat.speed = Math.min(
                rat.speed + accelRate,
                rat.targetSpeed
            );

        } else {

            rat.speed = Math.max(
                rat.speed - accelRate * 0.8,
                rat.targetSpeed
            );

        }

        // -------------------------
        // Fatigue
        // -------------------------

        const racePercent =
            Game.raceTime / RACE_DURATION;

        let fatigue = 1.0;

        if (racePercent > 0.55) {

            fatigue -=
                (racePercent - 0.55) *
                0.18 *
                (2 - rat.stamina);

        }

        // -------------------------
        // Drafting
        // -------------------------

        let draftBonus = 1.0;

        Game.racers.forEach(other => {

            if (other === rat) return;

            const gap =
                other.distance - rat.distance;

            if (gap > 15 && gap < 70) {

                draftBonus = Math.max(
                    draftBonus,
                    1.025
                );

            }

        });

        // -------------------------
        // Passing bonus
        // -------------------------

        let passBonus = 1.0;

        Game.racers.forEach(other => {

            if (other === rat) return;

            const gap =
                other.distance - rat.distance;

            if (gap > 0 && gap < 35) {

                passBonus =
                    Math.max(
                        passBonus,
                        rat.passing
                    );

            }

        });

        let finalSpeed =
            rat.speed *
            fatigue *
            draftBonus *
            passBonus;
                // -------------------------
        // Small random movement
        // -------------------------

        finalSpeed *= randomBetween(
            0.998,
            1.002
        );

        // -------------------------
        // Move the rat
        // -------------------------

        rat.distance +=
            finalSpeed * delta;

        rat.speed = finalSpeed;

        // -------------------------
        // Finish detection
        // -------------------------

        if (rat.distance >= TRACK_LENGTH) {

            rat.distance =
                TRACK_LENGTH;

            rat.finished = true;

            rat.finishTime =
                Game.raceTime;

            Game.results.push(rat);

        }

    });

    // -------------------------
    // Keep leaderboard updated
    // -------------------------

    Game.racers.sort(
        (a, b) => b.distance - a.distance
    );

    // -------------------------
    // End race
    // -------------------------

    if (
        !Game.raceFinished &&
        Game.results.length === Game.racers.length
    ) {

        Game.raceFinished = true;

        finishRace();

    }

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
