const container = document.querySelector("#container");

const resizeBtn = document.querySelector("#resizeBtn");
const blackBtn = document.querySelector("#blackBtn");
const rainbowBtn = document.querySelector("#rainbowBtn");
const darkenBtn = document.querySelector("#darkenBtn");
const eraserBtn = document.querySelector("#eraserBtn")
const clearBtn = document.querySelector("#clearBtn")

const containerSize = 960;

let currentMode = "black";

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgb(${r}, ${g}, ${b})`;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function paintSquare(square) {
    if (currentMode === "black") {
        square.style.backgroundColor = "black";
        square.style.opacity = "1";
    }

    else if (currentMode === "rainbow") {
        square.style.backgroundColor = getRandomColor();
        square.style.opacity = "1";
    }

    else if (currentMode === "darken") {
        let darkness = Number(square.dataset.darkness);

        if (darkness < 100) {
            darkness += 10;
        }

        square.dataset.darkness = darkness;

        square.style.backgroundColor = "black";
        square.style.opacity = darkness / 100;
    }

    else if (currentMode === "eraser") {
        square.style.backgroundColor = "";
        square.style.opacity = "1";

        square.dataset.darkness = 0;
    }
}

function clearGrid() {
    container.querySelectorAll(".square").forEach(square => {
        square.style.backgroundColor = "";
        square.style.opacity = "1";
        square.dataset.darkness = 0;
    });
}

function createGrid(size) {
    container.innerHTML = "";

    const squareSize = containerSize / size;

    for (let i = 0; i < size * size; i++) {
        const square = document.createElement("div");

        square.classList.add("square");

        square.style.width = `${squareSize}px`;
        square.style.height = `${squareSize}px`;

        square.dataset.darkness = 0;
        container.appendChild(square);
    }
}

container.addEventListener("mouseover", (e) => {
    if (!e.target.classList.contains("square")) return;

    paintSquare(e.target);
});

resizeBtn.addEventListener("click", () => {
    let size = prompt("Enter grid size (1 - 100):");

    size = parseInt(size);

    if (isNaN(size)) return;

    size = clamp(size, 1, 100);

    createGrid(size);
});

blackBtn.addEventListener("click", () => {
    currentMode = "black";
});

rainbowBtn.addEventListener("click", () => {
    currentMode = "rainbow";
});

darkenBtn.addEventListener("click", () => {
    currentMode = "darken";
});

eraserBtn.addEventListener("click", () => {
    currentMode = "eraser";
});

clearBtn.addEventListener("click", clearGrid);

createGrid(16);





