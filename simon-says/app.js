// Game and user sequences
let gameSeq = [];
let userSeq = [];

let started = false;
let level = 0;
let highScore = 0;

let btns = ["yellow", "red", "green", "purple"];

let h2 = document.querySelector("h2");
let h3 = document.querySelector("h3");

// Start the game when any key is pressed
document.addEventListener("keypress", function() {
    if(started == false) {
        started = true;
        levelUp();
    }
});

// Flash effect for the button selected by the game
function gameFlash(btn) {
    btn.classList.add("flash");

    setTimeout(function() {
        btn.classList.remove("flash");
    }, 250);
}

// Flash effect for the button clicked by the user
function userFlash(btn) {
    btn.classList.add("userflash");

    setTimeout(function() {
        btn.classList.remove("userflash");
    }, 250);
}

// Generate the next level and add a random color to the sequence
function levelUp() {
    userSeq = [];

    level++;

    h2.innerText = `Level ${level}`;

    let randIdx = Math.floor(Math.random() * 4);
    let randColor = btns[randIdx];
    let randBtn = document.querySelector(`.${randColor}`);

    gameSeq.push(randColor);

    gameFlash(randBtn);
}

// Check whether the user's answer matches the game sequence
function checkAns(idx) {
    if(userSeq[idx] == gameSeq[idx]) {
        if(userSeq.length == gameSeq.length) {
            setTimeout(levelUp, 750);
        }
    } else {
        // Update the highest score
        if(level > highScore) {
            highScore = level;
            h3.innerText = `Highest Score: ${highScore}`;
        }

        // Display game-over message
        h2.innerHTML = `Game over! Your score was <b>${level}</b> <br> Press any key to restart the game.`;

        // Show a brief red background effect after game over 
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(() => {
            document.querySelector("body").style.backgroundColor = "white";
        }, 80);

        reset();
    }
}

// Handle the user's button click
function btnPress() {
    let btn = this;

    userFlash(btn);

    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    checkAns(userSeq.length - 1);
}

let allBtns = document.querySelectorAll(".btn");
for(btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

// Reset the game to its initial state
function reset() {
    gameSeq = [];
    userSeq = [];
    started = false;
    level = 0;
}