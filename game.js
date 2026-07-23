"use strict";

// ======================================================
// RAT RACING 2.0
// Milestone 1 - Foundation
// ======================================================

// ======================================================
// APP STATE
// ======================================================

const Game = {
    version: "2.0",
    initialized: false,
    selectedRats: [],
    racers: [],
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
// DOM ELEMENTS
// ======================================================

const statusText = document.getElementById("statusText");
const initializeButton = document.getElementById("initializeButton");

const homeScreen = document.getElementById("homeScreen");
const draftScreen = document.getElementById("draftScreen");

const ratGrid = document.getElementById("ratGrid");

// ======================================================
// STARTUP
// ======================================================

document.addEventListener("DOMContentLoaded", init);

function init() {

    console.log("Rat Racing 2.0 Loaded");

    if (statusText) {
        statusText.textContent = "JavaScript Ready";
    }

    if (initializeButton) {
        initializeButton.addEventListener("click", initializeProject);
    }

    buildRatGrid();
}

// ======================================================
// INITIALIZE PROJECT
// ======================================================

function initializeProject() {

    if (Game.initialized) return;

    Game.initialized = true;

    console.log("Project Initialized");

    if (statusText) {
        statusText.textContent = "Project Initialized!";
    }

    initializeButton.disabled = true;

    setTimeout(() => {

        homeScreen.classList.add("hidden");
        draftScreen.classList.remove("hidden");

    }, 500);

}

// ======================================================
// BUILD RAT GRID
// ======================================================

function buildRatGrid() {

    if (!ratGrid) {
        console.error("ratGrid element not found.");
        return;
    }

    ratGrid.innerHTML = "";

    RAT_DATABASE.forEach(rat => {

        const card = document.createElement("div");

        card.className = "ratCard";
        card.dataset.id = rat.id;

        card.innerHTML = `
            <div class="ratEmoji">🐀</div>
            <h3>${rat.name}</h3>
            <p>Rat #${rat.id}</p>
        `;

        ratGrid.appendChild(card);

    });

    console.log(`${RAT_DATABASE.length} rat cards created.`);

}
