// Game sequences
let gameSeq = [];
let userSeq = [];

// Game state
let started = false;
let level = 0;

// Current and highest scores
let score = 0;
let highScore = Number(localStorage.getItem("simonHighScore")) || 0;

// Controls when player can click buttons
let acceptingInput = false;

// Available button colors
let btns = ["yellow", "red", "green", "purple"];

// HTML elements
let h2 = document.querySelector("h2");
let scoreDisplay = document.querySelector("#score");
let highScoreDisplay = document.querySelector("#high-score");
let startBtn = document.querySelector("#start-btn");

// Display saved high score
highScoreDisplay.innerText = highScore;

// Progress bar elements
let progressText = document.querySelector("#progress-text");
let progressFill = document.querySelector("#progress-fill");

// Game sounds
let buttonSound = new Audio("sounds/button-click.wav");
let gameOverSound = new Audio("sounds/game-over.wav");

// Start or restart the game
startBtn.addEventListener("click", startGame);


// Start a new game
function startGame() {
    gameSeq = [];
    userSeq = [];

    level = 0;
    score = 0;

    started = true;
    acceptingInput = false;

    scoreDisplay.innerText = score;

    startBtn.innerText = "Restart Game";

    document.body.classList.remove("game-over");

    h2.innerText = "Get ready!";

    updateProgress();

    setTimeout(function() {
        levelUp();
    }, 1000);
}


// Flash effect for the button selected by the game
function gameFlash(btn) {
    buttonSound.currentTime = 0;
    buttonSound.play();

    btn.classList.add("flash");

    setTimeout(function() {
        btn.classList.remove("flash");
    }, 250);
}


// Flash effect for the button clicked by the user
function userFlash(btn) {
    buttonSound.currentTime = 0;
    buttonSound.play();

    btn.classList.add("userflash");

    setTimeout(function() {
        btn.classList.remove("userflash");
    }, 250);
}


// Generate the next level and add a random color
function levelUp() {
    userSeq = [];

    level++;

    h2.innerText = `Level ${level}`;

    let randIdx = Math.floor(Math.random() * 4);
    let randColor = btns[randIdx];

    let randBtn = document.querySelector(`.${randColor}`);

    gameSeq.push(randColor);

    updateProgress();

    acceptingInput = false;

    gameFlash(randBtn);

    // Allow the user to click after the game flash
    setTimeout(function() {
        acceptingInput = true;
    }, 400);
}


// Update level progress
function updateProgress() {
    let completed = userSeq.length;
    let total = gameSeq.length;

    progressText.innerText = `${completed} / ${total}`;

    let progress = total === 0 ? 0 : (completed / total) * 100;

    progressFill.style.width = `${progress}%`;
}


// Check whether the user's answer is correct
function checkAns(idx) {
    if(userSeq[idx] == gameSeq[idx]) {
        // Update progress after every correct click
        updateProgress();

        // Check if the complete sequence is correct
        if(userSeq.length == gameSeq.length) {
            // Add 10 points for completing a level
            score += 10;

            scoreDisplay.innerText = score;

            if(score > highScore) {
                highScore = score;

                highScoreDisplay.innerText = highScore;

                // Save the highest score in browser storage
                localStorage.setItem("simonHighScore", highScore);
            }

            acceptingInput = false;

            // Move to the next level
            setTimeout(levelUp, 750);
        }

    } else {
        gameOver();
    }
}


// Handle the user's button click
function btnPress() {
    // Ignore clicks before the game starts
    if(!started || !acceptingInput) {
        return;
    }

    let btn = this;

    userFlash(btn);

    let userColor = btn.getAttribute("id");

    userSeq.push(userColor);

    checkAns(userSeq.length - 1);
}


// Display game-over state
function gameOver() {
    started = false;
    acceptingInput = false;

    gameOverSound.currentTime = 0;
    gameOverSound.play();

    document.body.classList.remove("game-over");
    void document.body.offsetWidth;
    document.body.classList.add("game-over");

    h2.innerHTML = `
        Game Over!<br>
        Your Score: <b>${score}</b><br>
        Level Reached: <b>${level}</b>
    `;

    startBtn.innerText = "Play Again";
}


// Select all game buttons
let allBtns = document.querySelectorAll(".btn");


// Add click event to every game button
for(let btn of allBtns) {
    btn.addEventListener("click", btnPress);
}
