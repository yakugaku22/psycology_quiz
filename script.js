document.addEventListener("DOMContentLoaded", async () => {
    const mechanismsContainer = document.getElementById("mechanisms");
    const drugsContainer = document.getElementById("drugs");
    const canvas = document.getElementById("canvas");
    const checkButton = document.getElementById("check-button");
    const resultDisplay = document.getElementById("result");

    const ctx = canvas.getContext("2d");
    const response = await fetch("data.json");
    const data = await response.json();
    const selectedPairs = data.sort(() => 0.5 - Math.random()).slice(0, 10);
    
    canvas.width = mechanismsContainer.offsetWidth + drugsContainer.offsetWidth + 100;
    canvas.height = Math.max(mechanismsContainer.offsetHeight, drugsContainer.offsetHeight);


    let selectedMechanism = null;
    let connections = [];

    const renderItems = (container, items, type) => {
        items.forEach((item, index) => {
            const div = document.createElement("div");
            div.classList.add("item");
            div.textContent = item;
            div.dataset.index = index;
            div.dataset.type = type;
            div.addEventListener("click", () => handleClick(div));
            container.appendChild(div);
        });
    };

    const handleClick = (element) => {
        if (element.dataset.type === "mechanism") {
            selectedMechanism = element;
        } else if (selectedMechanism) {
            connections.push({
                mechanismIndex: parseInt(selectedMechanism.dataset.index),
                drugIndex: parseInt(element.dataset.index)
            });
            selectedMechanism = null;
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

            const offsetX = window.scrollX;
            const offsetY = window.scrollY;

            ctx.beginPath();
            ctx.moveTo(start.right - offsetX, start.top + start.height / 2 - offsetY);
            ctx.lineTo(end.left - offsetX, end.top + end.height / 2 - offsetY);
            ctx.strokeStyle = "#007bff";
            ctx.lineWidth = 2;
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

    renderItems(mechanismsContainer, selectedPairs.map(pair => pair.mechanism), "mechanism");
    renderItems(drugsContainer, selectedPairs.map(pair => pair.drug).sort(() => 0.5 - Math.random()), "drug");
});
