let display = document.getElementById("display");
let history = [];
let hasError = false;

function addValue(value) {
    if (hasError) {
        display.value = "";
        hasError = false;
    }
    display.value += value;
}

function clearDisplay() {
    display.value = "";
    hasError = false;
}

function backspace() {
    if (hasError) {
        display.value = "";
        hasError = false;
        return;
    }
    display.value = display.value.slice(0, -1);
}

function percentage(value) {
    if (hasError) {
        display.value = "";
        hasError = false;
    }
    display.value += value;
}

document.getElementById("equal").addEventListener("click", function () {
    try {
        let expression = display.value;

        // Brainrot trigger
        if (expression === "6+7" || expression === "7+6") {
            startBrainrotGame();
            display.value = "BRAINROT!!!";
            return;
        }

        // If error previously
        hasError = false;

        // % Handle
        expression = expression.replace(/(\d+)%/g, '($1/100)');
        expression = expression.replace(/\)(\d)/g, ')*$1');

        let result = eval(expression);

        history.push(`${expression} = ${result}`);
        updateHistory();

        if (!isFinite(result)) {
            display.value = "Error";
            hasError = true;
            return;
        }

        display.value = result;
    }
    catch (error) {
        display.value = "Error";
        hasError = true;
    }
});

function updateHistory() {
    const historyDiv = document.getElementById("history");

    historyDiv.innerHTML = history
        .slice(-5)
        .map(item => `<div>${item}</div>`)
        .join("");
}

// Brainrot Game Logic
let score = 0;
let gameInterval;
let spawnInterval;
let lives = 5;
const heartsDisplay = document.getElementById("hearts");
const gameContainer = document.getElementById("game-container");
const gameArea = document.getElementById("game-area");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const closeGameBtn = document.getElementById("close-game");
const gameMsg = document.getElementById("game-msg");

function startBrainrotGame() {
    score = 0;
    lives = 5;

    scoreDisplay.innerText = "Score: 0";
    heartsDisplay.innerText = "❤️❤️❤️❤️❤️";

    gameContainer.style.display = "flex";
    gameMsg.classList.remove("fade-out");
    void gameMsg.offsetWidth;
    gameMsg.classList.add("fade-out");

    const objects = document.querySelectorAll(".falling-object");
    objects.forEach(obj => obj.remove());

    spawnInterval = setInterval(spawnObject, 800);
    gameInterval = setInterval(updateGame, 20);
}

function spawnObject() {
    const obj = document.createElement("div");
    obj.classList.add("falling-object");
    const icons = ["💀", "🤡", "🚽", "🥑", "🍕", "🔥", "💨"];
    obj.innerText = icons[Math.floor(Math.random() * icons.length)];
    obj.style.left = Math.random() * (gameArea.clientWidth - 30) + "px";
    gameArea.appendChild(obj);
}

function updateGame() {
    const objects = document.querySelectorAll(".falling-object");
    const playerRect = player.getBoundingClientRect();

    objects.forEach(obj => {
        let top = parseFloat(obj.style.top || -50);
        top += 3; // Falling speed
        obj.style.top = top + "px";

        const objRect = obj.getBoundingClientRect();

        // Collision detection
        if (
            objRect.bottom >= playerRect.top &&
            objRect.right >= playerRect.left &&
            objRect.left <= playerRect.right &&
            objRect.top <= playerRect.bottom
        ) {
            score++;
            scoreDisplay.innerText = "Score: " + score;
            obj.remove();
        }

        // Remove if out of bounds
        if (top > gameArea.clientHeight) {
            obj.remove();

            lives--;
            updateHearts();

            if (lives <= 0) {
                endGame();
            }
        }
    });

    function updateHearts() {
        let hearts = "";
        for (let i = 0; i < lives; i++) {
            hearts += "❤️";
        }
        heartsDisplay.innerText = hearts;
    }

    function endGame() {
        clearInterval(gameInterval);
        clearInterval(spawnInterval);

        gameArea.innerHTML = `
        <div style="color:white; text-align:center; margin-top:40%;">
            <h1>GAME OVER</h1>
            <p>Final Score: ${score}</p>
        </div>
    `;
    }
}

// Player Movement (Mouse/Touch)
gameArea.addEventListener("mousemove", (e) => {
    const rect = gameArea.getBoundingClientRect();
    let x = e.clientX - rect.left;
    movePlayer(x);
});

gameArea.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const rect = gameArea.getBoundingClientRect();
    let x = e.touches[0].clientX - rect.left;
    movePlayer(x);
}, { passive: false });

function movePlayer(x) {
    if (x < 25) x = 25;
    if (x > gameArea.clientWidth - 25) x = gameArea.clientWidth - 25;
    player.style.left = x + "px";
}

closeGameBtn.addEventListener("click", () => {
    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    gameContainer.style.display = "none";
});
