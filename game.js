// ======================================================
// RAT RACING 2.0
// NEW GAME ENGINE
// PART 1 - FOUNDATION
// ======================================================

// ------------------------------------------------------
// RAT ROSTER
// ------------------------------------------------------

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

// ------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------

const TRACK_LENGTH = 1000;
const RACE_TIME = 30000;
const RACERS_PER_RACE = 12;

let selected = [];

// ------------------------------------------------------
// DOM
// ------------------------------------------------------

const ratGrid = document.getElementById("ratGrid");
const selectedCount = document.getElementById("selectedCount");
const startRaceButton = document.getElementById("startRace");

const selectionScreen = document.getElementById("selectionScreen");
const raceScreen = document.getElementById("raceScreen");
const winnerScreen = document.getElementById("winnerScreen");

const trackArea = document.getElementById("trackArea");

const leaderList = document.getElementById("leaderList");
const leaderName = document.getElementById("leaderName");

const winnerName = document.getElementById("winnerName");
const raceAgainButton = document.getElementById("raceAgain");

// ------------------------------------------------------
// GAME STATE
// ------------------------------------------------------

const race = {

    running: false,

    racers: [],

    animationId: null,

    startTime: 0,

    previousFrame: 0

};

// ------------------------------------------------------
// HELPERS
// ------------------------------------------------------

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function shuffle(array) {

    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [copy[i], copy[j]] = [copy[j], copy[i]];

    }

    return copy;

}

// ------------------------------------------------------
// RAT SELECTION
// ------------------------------------------------------

function updateCounter() {

    selectedCount.textContent =
        `${selected.length} / ${RACERS_PER_RACE} Selected`;

    startRaceButton.disabled =
        selected.length !== RACERS_PER_RACE;

}

function toggleRat(index, card) {

    const existing = selected.indexOf(index);

    if (existing >= 0) {

        selected.splice(existing, 1);

        card.classList.remove("selected");

    } else {

        if (selected.length >= RACERS_PER_RACE)
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

        card.addEventListener("click", () => {

            toggleRat(index, card);

        });

        ratGrid.appendChild(card);

    });

}

buildRatCards();
updateCounter();
// ======================================================
// PART 2 - RACE SETUP
// ======================================================

// ------------------------------------------------------
// CREATE RACERS
// ------------------------------------------------------

function createRace() {

    race.racers = [];

    selected.forEach((ratIndex, lane) => {

        race.racers.push({

            lane,
            ratIndex,

            progress: 0,

            speed: random(7.5, 8.5),

            targetSpeed: random(8, 10),

            momentum: random(.85, 1.15),

            surgeTimer: random(500,2500),

            fatigue: 1,

            finished:false,

            finishTime:0

        });

    });

}

// ------------------------------------------------------
// BUILD TRACK
// ------------------------------------------------------

function buildTrack(){

    trackArea.innerHTML="";
    leaderList.innerHTML="";

    race.racers.forEach(racer=>{

        const lane=document.createElement("div");

        lane.className="trackLane";

        const runner=document.createElement("div");

        runner.className="runner";

        runner.id=`runner-${racer.lane}`;

        runner.textContent="🐀";

        lane.appendChild(runner);

        trackArea.appendChild(lane);

        const li=document.createElement("li");

        li.id=`leader-${racer.lane}`;

        li.textContent=rats[racer.ratIndex].name;

        leaderList.appendChild(li);

    });

}

// ------------------------------------------------------
// START RACE
// ------------------------------------------------------

function startRace(){

    createRace();

    buildTrack();

    selectionScreen.classList.add("hidden");

    winnerScreen.classList.add("hidden");

    raceScreen.classList.remove("hidden");

    race.running=true;

    race.startTime=performance.now();

    race.previousFrame=performance.now();

    requestAnimationFrame(raceLoop);

}

startRaceButton.addEventListener("click",()=>{

    if(selected.length!==RACERS_PER_RACE)
        return;

    startRace();

});

// ======================================================
// PART 3
// RACE PHYSICS
// ======================================================

function updateRacer(racer,delta){

    if(racer.finished)
        return;

    racer.surgeTimer-=delta;

    // Every few seconds the rat picks a
    // completely new desired pace.

    if(racer.surgeTimer<=0){

        racer.targetSpeed=random(6.5,12);

        racer.momentum=random(.90,1.10);

        racer.surgeTimer=random(700,2400);

    }

    // Last 20% of race everyone gets
    // slightly more aggressive.

    const percent=racer.progress/TRACK_LENGTH;

    if(percent>.80){

        racer.targetSpeed+=random(.2,.8);

    }

    // Very small fatigue.
    // Everyone receives the same formula.

    racer.fatigue=
        clamp(
            1-(percent*.08),
            .90,
            1
        );

    // Smooth acceleration.

    racer.speed+=
        (
            racer.targetSpeed-
            racer.speed
        )*.03;

    // Apply momentum.

    racer.speed*=racer.momentum;

    // Apply fatigue.

    racer.speed*=racer.fatigue;

    // Tiny randomness every frame.

    racer.speed+=random(-.08,.08);

    racer.speed=
        clamp(
            racer.speed,
            5,
            13
        );

    racer.progress+=
        racer.speed*
        delta*
        .01;

    if(racer.progress>=TRACK_LENGTH){

        racer.progress=TRACK_LENGTH;

        racer.finished=true;

        racer.finishTime=
            performance.now()-
            race.startTime;

    }

}
// ======================================================
// PART 4 - RACE LOOP
// ======================================================

function raceLoop(timestamp){

    if(!race.running)
        return;

    const delta =
        timestamp - race.previousFrame;

    race.previousFrame = timestamp;

    updateRace(delta);

    race.animationId =
        requestAnimationFrame(raceLoop);

}

// ------------------------------------------------------
// UPDATE ENTIRE RACE
// ------------------------------------------------------

function updateRace(delta){

    race.racers.forEach(racer=>{

        updateRacer(racer,delta);

    });

    const leaders=[...race.racers].sort(

        (a,b)=>b.progress-a.progress

    );

    updateGraphics();

    updateLeaderboard(leaders);

    leaderName.textContent=
        rats[leaders[0].ratIndex].name;

    if(
        race.racers.every(
            r=>r.finished
        )
    ){
        finishRace();
    }

}

// ======================================================
// GRAPHICS
// ======================================================

function updateGraphics(){

    race.racers.forEach(racer=>{

        const runner=
            document.getElementById(
                `runner-${racer.lane}`
            );

        if(!runner)
            return;

        const percent =
            racer.progress /
            TRACK_LENGTH;

        runner.style.left =
            `${percent*94}%`;

    });

}

// ======================================================
// LEADERBOARD
// ======================================================

function updateLeaderboard(leaders){

    leaderList.innerHTML="";

    leaders.forEach((racer,index)=>{

        const li=document.createElement("li");

        const percent=
            (
                racer.progress/
                TRACK_LENGTH
            )*100;

        li.textContent=
            `${index+1}. ${rats[racer.ratIndex].name} (${percent.toFixed(1)}%)`;

        leaderList.appendChild(li);

    });

}

// ======================================================
// FINISH
// ======================================================

function finishRace(){

    race.running=false;

    cancelAnimationFrame(
        race.animationId
    );

    const winner=[...race.racers].sort(

        (a,b)=>

            a.finishTime-
            b.finishTime

    )[0];

    setTimeout(()=>{

        raceScreen.classList.add("hidden");

        winnerName.textContent=
            rats[winner.ratIndex].name;

        winnerScreen.classList.remove(
            "hidden"
        );

    },1200);

}

// ======================================================
// RESET
// ======================================================

function resetGame(){

    race.running=false;

    cancelAnimationFrame(
        race.animationId
    );

    race.racers=[];

    selected=[];

    document
        .querySelectorAll(".ratCard")
        .forEach(card=>{

            card.classList.remove(
                "selected"
            );

        });

    updateCounter();

    leaderList.innerHTML="";

    leaderName.textContent="---";

    trackArea.innerHTML="";

    winnerScreen.classList.add(
        "hidden"
    );

    raceScreen.classList.add(
        "hidden"
    );

    selectionScreen.classList.remove(
        "hidden"
    );

}

raceAgainButton.addEventListener(

    "click",

    resetGame

);
