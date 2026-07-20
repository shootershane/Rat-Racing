const rats = [
    {name:"Cheddar", bio:"Cocky champion", icon:"🐭"},
    {name:"Rocket", bio:"Always talking trash", icon:"🐭"},
    {name:"Pizza Pete", bio:"Powered by pizza", icon:"🐭"},
    {name:"Peanut", bio:"Small but fearless", icon:"🐭"},
    {name:"Cowboy Jack", bio:"Yee-haw!", icon:"🐭"},
    {name:"Captain Whiskers", bio:"Pirate legend", icon:"🐭"},
    {name:"Shadow", bio:"Silent ninja", icon:"🐭"},
    {name:"King Gouda", bio:"Royal cheese lover", icon:"🐭"},
    {name:"Chef Alfredo", bio:"Master cook", icon:"🐭"},
    {name:"Professor Pip", bio:"Crazy inventor", icon:"🐭"},
    {name:"Tank", bio:"Big muscles", icon:"🐭"},
    {name:"Slick", bio:"Too cool", icon:"🐭"},
    {name:"Ace", bio:"Born to race", icon:"🐭"},
    {name:"Rusty", bio:"Construction pro", icon:"🐭"},
    {name:"Sparky", bio:"Firefighter", icon:"🐭"},
    {name:"Turbo", bio:"Speed addict", icon:"🐭"},
    {name:"Riff", bio:"Rock star", icon:"🐭"},
    {name:"Sergeant Squeak", bio:"Never quits", icon:"🐭"},
    {name:"Taco", bio:"Always hungry", icon:"🐭"},
    {name:"Donut", bio:"Sweet racer", icon:"🐭"},
    {name:"Bubbles", bio:"Full of energy", icon:"🐭"},
    {name:"Dusty", bio:"Keeps it clean", icon:"🐭"},
    {name:"Magnet", bio:"Loves gadgets", icon:"🐭"},
    {name:"Lucky", bio:"Trusts good fortune", icon:"🐭"}
];

const selected = [];

const grid = document.getElementById("ratGrid");
console.log(grid);
const counter = document.getElementById("selectedCount");
const startButton = document.getElementById("startRace");

function updateCounter() {
    counter.textContent = `${selected.length} / 12 Selected`;
    startButton.disabled = selected.length !== 12;
}

function buildGrid() {

    grid.innerHTML = "";

    rats.forEach((rat,index)=>{

        const card = document.createElement("div");
        card.className = "ratCard";

        card.innerHTML = `
            <div class="ratPortrait">${rat.icon}</div>
            <div class="ratName">${rat.name}</div>
            <div class="ratBio">${rat.bio}</div>
        `;

        card.addEventListener("click",()=>{

            const alreadySelected = selected.includes(index);

            if(alreadySelected){

                selected.splice(selected.indexOf(index),1);
                card.classList.remove("selected");

            }else{

                if(selected.length>=12)
                    return;

                selected.push(index);
                card.classList.add("selected");

            }

            updateCounter();

        });

        grid.appendChild(card);

    });

}

startButton.addEventListener("click",()=>{

    document.getElementById("selectionScreen").classList.add("hidden");
    document.getElementById("raceScreen").classList.remove("hidden");

    alert("Part 2 will build the race track!");
/* ======================================================
   PART 2 - BUILD THE RACE TRACK
   ====================================================== */

const trackArea = document.getElementById("trackArea");
const leaderList = document.getElementById("leaderList");

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
        runner.id = `runner${lane}`;

        runner.textContent = `${rat.icon} ${rat.name}`;

        laneDiv.appendChild(runner);
        trackArea.appendChild(laneDiv);

        // Initial leaderboard
        const place = document.createElement("li");
        place.id = `place${lane}`;
        place.textContent = rat.name;

        leaderList.appendChild(place);

    });

}

/* ======================================================
   Replace the temporary Start button behavior
   ====================================================== */

startButton.removeEventListener("click", ()=>{});

startButton.onclick = () => {

    document
        .getElementById("selectionScreen")
        .classList.add("hidden");

    document
        .getElementById("raceScreen")
        .classList.remove("hidden");

    buildTrack();

};
});

buildGrid();
updateCounter();
