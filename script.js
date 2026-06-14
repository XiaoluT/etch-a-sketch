const container = document.querySelector("#container");

const resizeBtn = document.querySelector("#resizeBtn");

const gridSizeInput = document.querySelector("#gridSizeInput")

const blackBtn = document.querySelector("#blackBtn");
const rainbowBtn = document.querySelector("#rainbowBtn");
const darkenBtn = document.querySelector("#darkenBtn");
const eraserBtn = document.querySelector("#eraserBtn")
const clearBtn = document.querySelector("#clearBtn")

const modalOverlay = document.querySelector("#modalOverlay");

const cancelBtn = document.querySelector("#cancelBtn");

const confirmClearBtn = document.querySelector("#confirmClearBtn");

const modeButtons = document.querySelectorAll(".modeBtn")

function setActiveButton(activeButton) {
    modeButtons.forEach(btn => {
        btn.classList.remove("active");
    });
    activeButton.classList.add("active");
}

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

function setMode(mode, button) {
    currentMode = mode;
    setActiveButton(button);
}

let isDrawing = false;

container.addEventListener("mousedown", (e) => {
    isDrawing = true;

    if (e.target.classList.contains("square")) {
        paintSquare(e.target);
    }
});

document.addEventListener("mouseup", () => {
    isDrawing = false;
});

container.addEventListener("mouseover", (e) => {
    if (!isDrawing) return;

    if (!e.target.classList.contains("square")) return;

    paintSquare(e.target);
});

function resizeGrid() {
    let size = parseInt(gridSizeInput.value);

    if (isNaN(size)) return;

    size = clamp(size, 1, 100);

    createGrid(size);
}

resizeBtn.addEventListener("click", resizeGrid);

gridSizeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        resizeGrid();
    }
});

blackBtn.addEventListener("click", () => {
    setMode("black", blackBtn);
});

rainbowBtn.addEventListener("click", () => {
    setMode("rainbow", rainbowBtn);
});

darkenBtn.addEventListener("click", () => {
    setMode("darken", darkenBtn);
});

eraserBtn.addEventListener("click", () => {
    setMode("eraser", eraserBtn);
});

clearBtn.addEventListener("click", () => {
    modalOverlay.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
    modalOverlay.classList.add("hidden");
});

confirmClearBtn.addEventListener("click", () => {
    clearGrid();

    modalOverlay.classList.add("hidden");
});

modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.add("hidden");
    }
});



createGrid(16);
setActiveButton(blackBtn)
