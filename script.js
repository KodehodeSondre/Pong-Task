const leftpaddle = document.querySelector("#leftPaddle");
const rightpaddle = document.querySelector("#rightPaddle");
const ball = document.querySelector("#ball");
const arena = document.querySelector("#arena");
const leftscore = document.querySelector("#scorecontentleft");
const rightscore = document.querySelector("#scorecontentright");
const victoryMessage = document.querySelector("#victoryMessage"); 

let leftPaddlePosition = 60;
let rightPaddlePosition = 60;
let ballX = 180;
let ballY = 180;
let ballSpeedX = 3;
let ballSpeedY = 3;
let scoreLeft = 0;
let scoreRight = 0;
let isGameRunning = false;

const keysPressed = {}; 

// SCORE COUNTER
function updateScore() {
    leftscore.textContent = scoreLeft;
    rightscore.textContent = scoreRight;

    if (scoreLeft === 5 || scoreRight === 5) {
        displayVictoryMessage(scoreLeft === 5 ? "Left Player Wins!" : "Right Player Wins!");
        resetGame();
    }
}

// DISPLAY VICTORY MESSAGE
function displayVictoryMessage(message) {
    victoryMessage.textContent = message;
    victoryMessage.style.display = "block";
    isGameRunning = false;
    playSoundEffect("./sfx/victory.mp3");
    playSoundEffect("./sfx/yay.mp3");
}

// RESET GAME
function resetGame() {
    scoreLeft = 0;
    scoreRight = 0;
    updateScore();
    resetBall();
    setTimeout(() => {
        victoryMessage.style.display = "none";
        isGameRunning = false; 
    }, 3000); 
}

// TOGGLE GAME
function toggleGame() {
    if (victoryMessage.style.display === "block") return; 
    isGameRunning = !isGameRunning;
    if (isGameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

// PADDLE MOVEMENT HANDLING
function movePaddles() {
    const arenaBounds = arena.getBoundingClientRect();
    const leftPaddleBounds = leftpaddle.getBoundingClientRect();
    const rightPaddleBounds = rightpaddle.getBoundingClientRect();

    if (keysPressed["w"] && leftPaddleBounds.top - 10 >= arenaBounds.top) {
        leftPaddlePosition -= 10;
    }
    if (keysPressed["s"] && leftPaddleBounds.bottom + 10 <= arenaBounds.bottom) {
        leftPaddlePosition += 10;
    }
    if (keysPressed["i"] && rightPaddleBounds.top - 10 >= arenaBounds.top) {
        rightPaddlePosition -= 10;
    }
    if (keysPressed["k"] && rightPaddleBounds.bottom + 10 <= arenaBounds.bottom) {
        rightPaddlePosition += 10;
    }

    leftpaddle.style.top = leftPaddlePosition + "px";
    rightpaddle.style.top = rightPaddlePosition + "px";
}

// KEYDOWN CHECK
window.addEventListener("keydown", (e) => {
    keysPressed[e.key] = true;
    if (e.key === "p") {
        toggleGame(); 
    }
});

window.addEventListener("keyup", (e) => {
    keysPressed[e.key] = false;
});

// BALL MOVEMENT
function moveBall() {
    const arenaBounds = arena.getBoundingClientRect();
    const ballBounds = ball.getBoundingClientRect();
    const leftPaddleBounds = leftpaddle.getBoundingClientRect();
    const rightPaddleBounds = rightpaddle.getBoundingClientRect();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballBounds.top <= arenaBounds.top) {
        ballSpeedY = Math.abs(ballSpeedY); 
        ballY = arenaBounds.top + 1; 
        playSoundEffect("./sfx/boing.mp3");
    }

   
    if (ballBounds.bottom >= arenaBounds.bottom) {
        ballSpeedY = -Math.abs(ballSpeedY);
        ballY = arenaBounds.bottom - ballBounds.height - 1; 
        playSoundEffect("./sfx/boing.mp3");
    }

    if (
        ballBounds.left <= leftPaddleBounds.right &&
        ballBounds.top < leftPaddleBounds.bottom &&
        ballBounds.bottom > leftPaddleBounds.top
    ) {
        ballSpeedX = Math.abs(ballSpeedX);
        ballX = leftPaddleBounds.right + ballBounds.width; 
        playSoundEffect("./sfx/boing.mp3");
    }

    if (
        ballBounds.right >= rightPaddleBounds.left &&
        ballBounds.top < rightPaddleBounds.bottom &&
        ballBounds.bottom > rightPaddleBounds.top
    ) {
        ballSpeedX = -Math.abs(ballSpeedX); 
        ballX = rightPaddleBounds.left - ballBounds.width - 1; 
        playSoundEffect("./sfx/boing.mp3");
    }

   
    if (ballBounds.left <= arenaBounds.left) {
        scoreRight++;
        updateScore();
        resetBall();
        playSoundEffect("./sfx/score.mp3");
        return;

    } else if (ballBounds.right >= arenaBounds.right) {
        scoreLeft++;
        updateScore();
        resetBall();
        playSoundEffect("./sfx/score.mp3");
        return;
    }

    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
}

// RESET BALL
function resetBall() {
    ballX = arena.clientWidth / 2 - 10; 
    ballY = arena.clientHeight / 2 - 10;
    ballSpeedX = Math.random() > 0.5 ? 3 : -3;
    ballSpeedY = Math.random() > 0.5 ? 3 : -3;
    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
}

// SOUND EFFECT
function playSoundEffect(soundUrl) {
    const audio = new Audio(soundUrl);
    audio.play().catch(error => {
        console.error("Error playing:", error);
    });
}

// GAME LOOP
function gameLoop() {
    if (!isGameRunning) return; 
    movePaddles();
    moveBall();
    requestAnimationFrame(gameLoop);
}
resetBall();
updateScore();
