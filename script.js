import { categories } from "./categories.js";

let currentWords = [];
let currentWord = "";
let score = 0;
let time = 30;
let timer;

document.querySelectorAll(".category-btn").forEach(button => {
    button.addEventListener("click", () => {
        currentWords = categories[button.dataset.category].slice(); // 選択カテゴリの問題リスト
        startGame();
    });
});

function startGame() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    score = 0;
    time = 30;
    document.getElementById("points").textContent = score;
    document.getElementById("time").textContent = time;
    nextWord();

    timer = setInterval(() => {
        time--;
        document.getElementById("time").textContent = time;
        if (time === 0) endGame();
    }, 1000);
}

function nextWord() {
    if (currentWords.length === 0) {
        currentWords = categories[Object.keys(categories)[Math.floor(Math.random() * 8)]].slice(); // ランダムカテゴリから補充
    }
    currentWord = currentWords[Math.floor(Math.random() * currentWords.length)];
    document.getElementById("question").textContent = currentWord;
    document.getElementById("answer").value = "";
}

document.getElementById("answer").addEventListener("input", (e) => {
    if (e.target.value === currentWord) {
        score++;
        document.getElementById("points").textContent = score;
        nextWord();
    }
});

document.getElementById("quit").addEventListener("click", endGame);

function endGame() {
    clearInterval(timer);
    alert(`ゲーム終了！スコア: ${score}`);
    location.reload();
}
