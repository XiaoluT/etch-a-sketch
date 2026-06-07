const container = document.querySelector("#container")
const button = document.querySelector("#resizeBtn")

const containerSize = 960;

function createGrid(size) {
    container.innerHTML = "";

    const squareSize = containerSize / size;

    for (let i = 0; i < size * size; i++) {
        const square = document.createElement("div");

        square.classList.add("square");

        square.style.width = `${squareSize}px`;
        square.style.height = `${squareSize}px`;

        square.addEventListener("mouseover", () => {
            square.style.backgroundColor = "black";
        });

        container.appendChild(square);
    }
}

button.addEventListener("click", () => {
    let size = prompt("Enter grid size (max 100):");

    size = parseInt(size);

    if (isNaN(size)) return;

    if (size < 1) size = 1;

    if (size > 100) size = 100;

    createGrid(size);
})

createGrid(16);



