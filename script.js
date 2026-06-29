// State
const state = {
    mode: "black",
    color: "red",
    isDrawing: false,
};


// DOM
const DOM = {
    container: document.querySelector("#container"),
    resizeForm: document.querySelector("#resizeForm"),
    gridSizeInput: document.querySelector("#gridSizeInput"),

    blackBtn: document.querySelector("#blackBtn"),
    rainbowBtn: document.querySelector("#rainbowBtn"),
    darkenBtn: document.querySelector("#darkenBtn"),
    colorModeBtn: document.querySelector("#colorModeBtn"),

    eraserBtn: document.querySelector("#eraserBtn"),
    clearBtn: document.querySelector("#clearBtn"),

    modalOverlay: document.querySelector("#modalOverlay"),
    cancelBtn: document.querySelector("#cancelBtn"),
    confirmClearBtn: document.querySelector("#confirmClearBtn"),

    colorButtons: document.querySelectorAll(".color-btn"),
    customColorPicker: document.querySelector("#customColorPicker"),
    colorPalette: document.querySelector("#colorPalette"),

    saveBtn: document.querySelector("#saveBtn"),
};


// Utils
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function getRandomColor() {
    return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
}


// Grid
const GRID = {
    size: 16,
    containerSize: 960,

    create(size) {
        DOM.container.innerHTML = "";
        const squareSize = this.containerSize / size;

        for (let i = 0; i < size * size; i++) {
            const square = document.createElement("div");
            square.classList.add("square");

            square.style.width = `${squareSize}px`;
            square.style.height = `${squareSize}px`;

            square.dataset.darkness = 0;

            DOM.container.appendChild(square);
        }
    },

    clear() {
        DOM.container.querySelectorAll(".square").forEach(square => {
            square.style.backgroundColor = "";
            square.style.opacity = "1";
            square.dataset.darkness = 0;
        });
    }
};


// Painter
const Painter = {
    paint(square) {
        switch (state.mode) {
            case "black":
                square.style.backgroundColor = "black";
                square.style.opacity = 1;
                break;

            case "rainbow":
                square.style.backgroundColor = getRandomColor();
                square.style.opacity = 1;
                break;

            case "darken":
                let d = Number(square.dataset.darkness);
                d = Math.min(d + 10, 100);
                square.dataset.darkness = d;
                square.style.backgroundColor = "black";
                square.style.opacity = d / 100;
                break;

            case "color":
                square.style.backgroundColor = state.color;
                square.style.opacity = 1;
                square.dataset.darkness = 0;
                break;

            case "eraser":
                square.style.backgroundColor = "";
                square.style.opacity = 1;
                square.dataset.darkness = 0;
                break;
        }
    }
};


// UI
const UI = {
    setActiveButton(active) {
        document.querySelectorAll(".modeBtn").forEach(btn => btn.classList.remove("active"));

        active.classList.add("active");
    },

    setColorActive(el) {
        DOM.colorButtons.forEach(btn => btn.classList.remove("active"));
        DOM.customColorPicker.classList.remove("active");

        if (el) el.classList.add('active');
    },

    showPalette(show) {
        DOM.colorPalette.classList.toggle("hidden", !show);
    },

    initSelectedColor() {
        const selectedBtn = document.querySelector(`.color-btn[data-color="${state.color}"]`);

        this.setColorActive(selectedBtn);

    }
};

const Save = {
    async saveAsPNG() {
        const canvas = await html2canvas(DOM.container);

        const link = document.createElement("a");

        link.download = "etch-a-sketch.png";
        link.href = canvas.toDataURL("image/png");

        link.click();
    }
};


// Events
const Events = {
    init() {
        // drawing
        DOM.container.addEventListener("mousedown", e => {
            state.isDrawing = true;
            if (e.target.classList.contains("square")) {
                Painter.paint(e.target);
            }
        });

        document.addEventListener("mouseup", () => {
            state.isDrawing = false;
        });

        DOM.container.addEventListener("mouseover", e => {
            if (!state.isDrawing) return;
            if (!e.target.classList.contains("square")) return;

            Painter.paint(e.target);
        });

        // Grid
        DOM.resizeForm.addEventListener("submit", (e) => {
            e.preventDefault();
            this.resizeGrid();
        });

        // modes
        DOM.blackBtn.addEventListener("click", () => this.setMode("black", DOM.blackBtn));
        DOM.rainbowBtn.addEventListener("click", () => this.setMode("rainbow", DOM.rainbowBtn));
        DOM.darkenBtn.addEventListener("click", () => this.setMode("darken", DOM.darkenBtn));
        DOM.eraserBtn.addEventListener("click", () => this.setMode("eraser", DOM.eraserBtn));

        // color mode
        DOM.colorModeBtn.addEventListener("click", () => {
            this.setMode("color", DOM.colorModeBtn);
            UI.showPalette(true);
        });

        DOM.colorButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                state.color = btn.dataset.color;
                this.setMode("color", DOM.colorModeBtn);
                UI.setColorActive(btn);
            })
        });

        DOM.customColorPicker.addEventListener("input", () => {
            state.color = DOM.customColorPicker.value;
            this.setMode("color", DOM.colorModeBtn);
            UI.setColorActive(DOM.customColorPicker);
        });

        // clear modal
        DOM.clearBtn.addEventListener("click", () => DOM.modalOverlay.classList.remove("hidden"));
        DOM.cancelBtn.addEventListener("click", () => DOM.modalOverlay.classList.add("hidden"));

        DOM.confirmClearBtn.addEventListener("click", () => {
            GRID.clear();
            DOM.modalOverlay.classList.add("hidden");
        });

        DOM.modalOverlay.addEventListener("click", e => {
            if (e.target === DOM.modalOverlay) {
                DOM.modalOverlay.classList.add("hidden");
            }
        });

        DOM.saveBtn.addEventListener("click", () => {
            Save.saveAsPNG();
        });
    },

    resizeGrid() {
        let size = parseInt(DOM.gridSizeInput.value);

        if (isNaN(size)) return;

        size = clamp(size, 1, 100);

        GRID.create(size);
    },

    setMode(mode, btn) {
        state.mode = mode;
        UI.setActiveButton(btn);
        UI.showPalette(mode === "color");
    }
};


GRID.create(16);
UI.setActiveButton(DOM.blackBtn);
UI.initSelectedColor();
Events.init();
