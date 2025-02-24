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
    canvas.height = Math.max(mechanismsContainer.offsetHeight, drugsContainer.offsetHeight) + 50;

    let connections = [];
    let startPoint = null;

    const drawLines = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const mechanismItems = mechanismsContainer.children;
        const drugItems = drugsContainer.children;

        const containerRect = document.querySelector('.game-container').getBoundingClientRect();

    connections.forEach(({ mechanismIndex, drugIndex }) => {
        const start = mechanismItems[mechanismIndex].getBoundingClientRect();
        const end = drugItems[drugIndex].getBoundingClientRect();

        // Canvas内の相対座標に変換
        const startX = start.right - containerRect.left + window.scrollX;
        const startY = start.top + start.height / 2 - containerRect.top + window.scrollY;
        const endX = end.left - containerRect.left + window.scrollX;
        const endY = end.top + end.height / 2 - containerRect.top + window.scrollY;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "#007bff";
        ctx.lineWidth = 3;
        ctx.stroke();
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

        connections.forEach(({ mechanismIndex, drugIndex }) => {
            const start = mechanismItems[mechanismIndex].getBoundingClientRect();
            const end = drugItems[drugIndex].getBoundingClientRect();

            const containerRect = document.querySelector('.game-container').getBoundingClientRect();

            ctx.beginPath();
            ctx.moveTo(50, 50);
            ctx.lineTo(300, 300);
            ctx.strokeStyle = "#007bff";
            ctx.lineWidth = 5;
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

        
