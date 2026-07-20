// =====================================================
// RAT RACING 2.0
// PART 1 - Core Engine
// =====================================================

const TRACK_LENGTH = 1000;
const TARGET_RACE_TIME = 30000; // 30 seconds

let selected = [];

let race = {
    running: false,
    startTime: 0,
    finishTime: 0,
    racers: [],
    animationId: null
};

// DOM

const ratGrid = document.getElementById("ratGrid");
const selectedCount = document.getElementById("selectedCount");
const startRaceButton = document.getElementById("startRace");

const selectionScreen = document.getElementById("selectionScreen");
const raceScreen = document.getElementById("raceScreen");

const trackArea = document.getElementById("trackArea");
const leaderList = document.getElementById("leaderList");
const leaderName = document.getElementById("leaderName");


// ----------------------------
// Selection
// ----------------------------

function updateCounter() {

    selectedCount.textContent =
        `${selected.length} / 12 Selected`;

    startRaceButton.disabled =
        selected.length !== 12;

}

function toggleRat(index, card){

    const i = selected.indexOf(index);

    if(i >= 0){

        selected.splice(i,1);
        card.classList.remove("selected");

    }else{

        if(selected.length >= 12) return;

        selected.push(index);
        card.classList.add("selected");

    }

    updateCounter();

}

function buildRatCards(){

    ratGrid.innerHTML="";

    rats.forEach((rat,index)=>{

        const card=document.createElement("div");

        card.className="ratCard";

        card.innerHTML=`
            <div class="ratPortrait">🐀</div>
            <div class="ratName">${rat.name}</div>
            <div class="ratBio">${rat.bio}</div>
        `;

        card.onclick=()=>toggleRat(index,card);

        ratGrid.appendChild(card);

    });

}
console.log(rats.length);
console.log(ratGrid);
console.log("Part 1 loaded*);
buildRatCards();
updateCounter();


// ----------------------------
// Generate Race Profiles
// ----------------------------

function generateProfile(){

    return{

        acceleration:0.85+Math.random()*0.15,

        topSpeed:28+Math.random()*4,

        stamina:0.85+Math.random()*0.15,

        consistency:0.85+Math.random()*0.15

    };

}


// ----------------------------
// Build Racers
// ----------------------------

function createRace(){

    race.racers=[];

    selected.forEach((ratIndex,lane)=>{

        race.racers.push({

            lane,

            ratIndex,

            profile:generateProfile(),

            progress:0,

            speed:0,

            finished:false,

            finishMs:null

        });

    });

}
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

