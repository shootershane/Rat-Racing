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

// =====================================================
// PART 2 - Build Track & Start Race
// =====================================================

// Build the race track
function buildTrack() {

    trackArea.innerHTML = "";
    leaderList.innerHTML = "";

    race.racers.forEach((racer) => {

        const lane = document.createElement("div");
        lane.className = "trackLane";

        const runner = document.createElement("div");
        runner.className = "runner";
        runner.id = `runner-${racer.lane}`;
        runner.textContent = "🐀";

        lane.appendChild(runner);
        trackArea.appendChild(lane);

        const li = document.createElement("li");
        li.id = `leader-${racer.lane}`;
        li.textContent = rats[racer.ratIndex].name;

        leaderList.appendChild(li);

    });

}

// Start race button
startRaceButton.addEventListener("click", () => {

    if (selected.length !== 12) return;

    createRace();
    buildTrack();

    selectionScreen.classList.add("hidden");
    raceScreen.classList.remove("hidden");

    race.running = true;
    lastFrame = 0;

    requestAnimationFrame(raceLoop);

});
// =====================================================
// PART 3A - Race Engine
// =====================================================

function updateRace(delta) {

    let finished = 0;

    race.racers.forEach(racer => {

        if (racer.finished) {
            finished++;
            return;
        }

        // Random target speed (changes every frame)
        const targetSpeed = 7 + Math.random() * 6;

        // Smoothly move toward that speed
        racer.speed += (targetSpeed - racer.speed) * 0.04;

        // Move forward
        racer.progress += racer.speed * delta * 0.08;

        if (racer.progress >= TRACK_LENGTH) {

            racer.progress = TRACK_LENGTH;
            racer.finished = true;
            finished++;

        }

    });

    const leaders = [...race.racers].sort(
        (a, b) => b.progress - a.progress
    );

    updateGraphics();
    updateLeaderboard(leaders);

    leaderName.textContent =
        rats[leaders[0].ratIndex].name;

    if (finished === race.racers.length) {
        finishRace();
    }

}        

    });

    const leaders = [...race.racers].sort(
    (a, b) => b.progress - a.progress
);

updateGraphics();
updateLeaderboard(leaders);

leaderName.textContent =
    rats[leaders[0].ratIndex].name;

    if(finished===race.racers.length){

        finishRace();

    }

}
let lastFrame = 0;

function raceLoop(time){

    if(!race.running) return;

    if(!lastFrame)
        lastFrame=time;

    const delta=time-lastFrame;

    lastFrame=time;

    updateRace(delta);

    race.animationId=
        requestAnimationFrame(raceLoop);

}
function updateGraphics(){

    race.racers.forEach(racer=>{

        const runner=
            document.getElementById(
                `runner-${racer.lane}`
            );

        if(!runner) return;

        const percent=
            racer.progress/TRACK_LENGTH;

        runner.style.left=
            `${percent*94}%`;

    });

}
function updateLeaderboard(leaders){

    leaderList.innerHTML = "";

    leaders.forEach((racer, index) => {

        const li = document.createElement("li");

        li.textContent =
            `${index + 1}. ${rats[racer.ratIndex].name}`;

        leaderList.appendChild(li);

    });

}
function finishRace(){

    race.running=false;

    cancelAnimationFrame(
        race.animationId
    );

    const winner = [...race.racers].sort(
    (a, b) => b.progress - a.progress
)[0];
    setTimeout(()=>{

        raceScreen.classList.add("hidden");

        document
            .getElementById("winnerName")
            .textContent=
            rats[winner.ratIndex].name;

        document
            .getElementById("winnerScreen")
            .classList.remove("hidden");

    },1000);

}
