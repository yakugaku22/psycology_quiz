document.addEventListener("DOMContentLoaded", async () => {
    const mechanismsContainer = document.getElementById("mechanisms");
    const drugsContainer = document.getElementById("drugs");
    const checkButton = document.getElementById("check-answer");
    const resultDisplay = document.getElementById("result");
    
    // データを読み込む
    const response = await fetch("data.json");
    const data = await response.json();
    
    // ランダムに10問を選択
    const selectedPairs = data.sort(() => 0.5 - Math.random()).slice(0, 10);
    
    // シャッフルして表示
    const mechanisms = selectedPairs.map(pair => pair.mechanism);
    const drugs = selectedPairs.map(pair => pair.drug).sort(() => 0.5 - Math.random());
    
    mechanisms.forEach(text => {
        const div = document.createElement("div");
        div.textContent = text;
        div.classList.add("draggable-item");
        div.draggable = true;
        div.dataset.type = "mechanism";
        mechanismsContainer.appendChild(div);
    });
    
    drugs.forEach(text => {
        const div = document.createElement("div");
        div.textContent = text;
        div.classList.add("draggable-item");
        div.draggable = true;
        div.dataset.type = "drug";
        drugsContainer.appendChild(div);
    });

    let draggedItem = null;

    document.querySelectorAll(".draggable-item").forEach(item => {
        item.addEventListener("dragstart", (e) => {
            draggedItem = e.target;
        });
    });

    document.querySelectorAll(".column").forEach(column => {
        column.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        column.addEventListener("drop", (e) => {
            if (draggedItem && column.id !== draggedItem.parentElement.id) {
                column.appendChild(draggedItem);
                draggedItem = null;
            }
        });
    });

    checkButton.addEventListener("click", () => {
        let correct = 0;
        const mechanismItems = mechanismsContainer.children;
        const drugItems = drugsContainer.children;
        
        for (let i = 0; i < mechanismItems.length; i++) {
            const mechanismText = mechanismItems[i].textContent;
            const drugText = drugItems[i].textContent;
            
            const correctPair = selectedPairs.find(pair => pair.mechanism === mechanismText);
            if (correctPair && correctPair.drug === drugText) {
                correct++;
            }
        }
        
        resultDisplay.textContent = `正解数: ${correct} / 10`;
    });
});

