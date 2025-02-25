document.addEventListener("DOMContentLoaded", async () => {
    const mechanismsContainer = document.getElementById("mechanisms");
    const drugsContainer = document.getElementById("drugs");
    const canvas = document.getElementById("canvas");
    const checkButton = document.getElementById("check-button");
    const resetButton = document.getElementById("reset-button");
    const resultDisplay = document.getElementById("result");

    const ctx = canvas.getContext("2d");
    const response = await fetch("data.json");
    const data = await response.json();
    const selectedPairs = data.sort(() => 0.5 - Math.random()).slice(0, 10);

    canvas.width = mechanismsContainer.offsetWidth + drugsContainer.offsetWidth + 100;
    canvas.height = Math.max(mechanismsContainer.offsetHeight, drugsContainer.offsetHeight);

    let connections = [];
    let startPoint = null;

    const renderItems = (container, items, type) => {
        items.forEach((item, index) => {
            const div = document.createElement("div");
            div.classList.add("item");
            div.textContent = item;
            div.dataset.index = index;
            div.dataset.type = type;
            div.addEventListener("mousedown", () => startDraw(div));
            div.addEventListener("mouseup", () => endDraw(div));
            div.addEventListener("touchstart", () => startDraw(div));
            div.addEventListener("touchend", () => endDraw(div));
            container.appendChild(div);
        });
    };

    const startDraw = (element) => {
        if (element.dataset.type === "mechanism") {
            startPoint = element;
        }
    };

    const endDraw = (element) => {
        if (startPoint && element.dataset.type === "drug") {
            connections.push({
                mechanismIndex: parseInt(startPoint.dataset.index),
                drugIndex: parseInt(element.dataset.index)
            });
            startPoint = null;
            drawLines();
        }
    };

    const drawLines = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const mechanismItems = mechanismsContainer.children;
        const drugItems = drugsContainer.children;

        const canvasRect = canvas.getBoundingClientRect();

        connections.forEach(({ mechanismIndex, drugIndex }) => {
            const start = mechanismItems[mechanismIndex].getBoundingClientRect();
            const end = drugItems[drugIndex].getBoundingClientRect();

            const startX = start.right - canvasRect.left;
            const startY = start.top + start.height / 2 - canvasRect.top;
            const endX = end.left - canvasRect.left;
            const endY = end.top + end.height / 2 - canvasRect.top;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = "#007bff";
            ctx.lineWidth = 3;
            ctx.stroke();
        });
    };

    checkButton.addEventListener("click", () => {
        let correctCount = 0;
        connections.forEach(({ mechanismIndex, drugIndex }) => {
            if (selectedPairs[mechanismIndex].drug === selectedPairs.map(pair => pair.drug)[drugIndex]) {
                correctCount++;
            }
        });
        resultDisplay.textContent = `正解数: ${correctCount} / 10`;
    });

    resetButton.addEventListener("click", () => {
        connections = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    renderItems(mechanismsContainer, selectedPairs.map(pair => pair.mechanism), "mechanism");
    renderItems(drugsContainer, selectedPairs.map(pair => pair.drug).sort(() => 0.5 - Math.random()), "drug");
});
