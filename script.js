const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 480;

let bird = {
    x: 50,
    y: 150,
    width: 34,
    height: 24,
    frame: 0,
    gravity: 0.4,
    lift: -10,
    velocity: 0
};

let pipes = [];
let base = { x: 0, y: canvas.height - 112 };
let score = 0;
let gameState = "start"; // start, play, over

const birdImages = [
    "bluebird-downflap.png",
    "bluebird-midflap.png",
    "bluebird-upflap.png"
];

const scoreImages = [
    "0.png", "1.png", "2.png", "3.png", "4.png",
    "5.png", "6.png", "7.png", "8.png", "9.png"
];

const backgroundImg = new Image();
backgroundImg.src = "background-day.png";

const baseImg = new Image();
baseImg.src = "base.png";

const pipeUpImg = new Image();
pipeUpImg.src = "pipe-green.png";

const pipeDownImg = new Image();
pipeDownImg.src = "pipe facing down.png";

const birdImg = new Image();
const startScreen = new Image();
startScreen.src = "message.png";

const gameOverScreen = new Image();
gameOverScreen.src = "gameover.png";

// Start game on tap
canvas.addEventListener("click", () => {
    if (gameState === "start") {
        gameState = "play";
    } else if (gameState === "over") {
        resetGame();
    }
    bird.velocity = bird.lift;
});

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameState = "start";
}

// Update game objects
function update() {
    if (gameState === "play") {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y + bird.height >= canvas.height - 112) {
            gameState = "over";
        }

        if (bird.y <= 0) {
            bird.y = 0;
            bird.velocity = 0;
        }

        // Pipe logic
        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
            let pipeHeight = Math.random() * (canvas.height - 300) + 50;
            pipes.push({ x: canvas.width, y: pipeHeight });
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= 2;

            if (pipes[i].x + pipeUpImg.width < 0) {
                pipes.splice(i, 1);
                score++;
            }

            if (
                bird.x + bird.width > pipes[i].x &&
                bird.x < pipes[i].x + pipeUpImg.width &&
                (bird.y < pipes[i].y || bird.y + bird.height > pipes[i].y + 100)
            ) {
                gameState = "over";
            }
        }

        // Base movement
        base.x -= 2;
        if (base.x <= -canvas.width) {
            base.x = 0;
        }
    }
}

// Draw game objects
function draw() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    pipes.forEach(pipe => {
        ctx.drawImage(pipeDownImg, pipe.x, pipe.y - pipeDownImg.height);
        ctx.drawImage(pipeUpImg, pipe.x, pipe.y + 100);
    });

    ctx.drawImage(baseImg, base.x, base.y, canvas.width, 112);
    ctx.drawImage(baseImg, base.x + canvas.width, base.y, canvas.width, 112);

    birdImg.src = birdImages[Math.floor(bird.frame / 5) % birdImages.length];
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (gameState === "start") {
        ctx.drawImage(startScreen, (canvas.width - startScreen.width) / 2, 50);
    } else if (gameState === "over") {
        ctx.drawImage(gameOverScreen, (canvas.width - gameOverScreen.width) / 2, 50);
    }

    displayScore();
}

function displayScore() {
    const scoreboard = document.getElementById("scoreboard");
    scoreboard.innerHTML = '';
    const scoreString = score.toString();
    for (let char of scoreString) {
        const img = document.createElement("img");
        img.src = scoreImages[parseInt(char)];
        scoreboard.appendChild(img);
    }
}

// Main game loop
function gameLoop() {
    update();
    draw();
    bird.frame++;
    requestAnimationFrame(gameLoop);
}

gameLoop();
