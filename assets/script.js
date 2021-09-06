"use-strict";

/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

// Themes.
const themes = [{ normal: "#5468e7", veryLight: "#eef0fd" }, { normal: "#e94c2b", veryLight: "#fdedea" }];

// Choose random color theme.
let colorTheme = themes[Math.floor(Math.random() * themes.length)];

// This function set random color theme.
function setTheme() {
    // Change css values.
    document.documentElement.style.setProperty("--primary", colorTheme.normal);
}

// Set random theme.
setTheme();

// Get canvas info from DOM.
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Obstacles defined.
let obstacles = [];

// Default variables.
let lift = -12;
let gravity = 0.5;
let gameStarted = false;
let gap = 160;
let speed = 3;
let obstacleGap = 500;
let score = 0;
let maxScore = 0;
let keyPressed = false;


// Windows key down event.
window.addEventListener("keydown", function (e) {
    e.preventDefault();
    if (e.key == " " && !keyPressed) {
        gameStarted = true;
        // Space key pressed.
        bird.moveUp();
        keyPressed = true;
    }
});

// Windows key up event.
window.addEventListener("keyup", function (e) {
    e.preventDefault();
    if (e.key == " ") {
        keyPressed = false;
    }
});

// Bird object defined.
class Bird {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.velocity = 0;
    }

    // Show function shows bird on canvas.
    show() {
        ctx.font = '300 46px "Font Awesome 5 Pro"';
        ctx.fillStyle = colorTheme.normal;
        ctx.textAlign = 'center';
        ctx.fillText("\uf4ba", this.x, this.y);
    }

    // Move up function moves bird up.
    moveUp() {
        this.velocity += lift;
    }

    // Update bird.
    update() {
        if (gameStarted) {
            this.velocity += gravity;
            this.y += this.velocity;
        }
        // Detect collision.
        if ((bird.x + 23 > obstacleOne.xPosition) && (bird.x - 23 < obstacleOne.xPosition + obstacleOne.width)) {
            if (bird.y - 23 < obstacleOne.top || bird.y + 23 > obstacleOne.bottom) {
                // Collision.
                resetGame();
            }
        }
    }
}

let bird = new Bird();

// Obstacle object.
class Obstacle {
    constructor(xGap) {
        this.top = Math.floor(Math.random() * (canvas.height - gap));
        let x = canvas.width + 100;
        if (xGap) {
            x = xGap + obstacleGap;
        }
        this.xPosition = x;
        this.bottom = this.top + gap;
        this.width = 10;
        this.cross = false;
    }
 
    // Show function shows it on canvas.
    show() {
        // Show top.
        ctx.beginPath();
        ctx.fillStyle = colorTheme.normal;
        ctx.fillRect(this.xPosition, 0, this.width, this.top);

        // Show bottom.
        ctx.beginPath();
        ctx.fillStyle = colorTheme.normal;
        ctx.fillRect(this.xPosition, this.bottom, this.width, canvas.height - this.bottom);
        ctx.stroke();
    }

    // Move function moves obstacle.
    move() {
        this.xPosition -= speed;
    }
}

// Obstacles defined.
let obstacleOne = new Obstacle();
let obstacleTwo = new Obstacle(obstacleOne.xPosition);
let clouds = [];


// Reset game function.
function resetGame() {
    score = 0;
    bird = new Bird();
    obstacleOne = new Obstacle();
    obstacleTwo = new Obstacle(obstacleOne.xPosition);
    gameStarted = false;
}


// Create clouds.
function createClouds() {
    let total = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < total; i++) {
        clouds.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height });
    }
}

createClouds();

// Show clouds.
function showClouds() {
    if (clouds[0].x < 0) {
        clouds.shift();
        clouds.push({ x: canvas.width + (Math.random() * 100), y: Math.random() * canvas.height });
    }
    for (let i = 0; i < clouds.length; i++) {
        if (gameStarted) {
            clouds[i].x -= 1;
        }
        ctx.font = '300 60px "Font Awesome 5 Pro"';
        ctx.fillStyle = colorTheme.veryLight;
        ctx.textAlign = 'center';
        ctx.fillText("\uf0c2", clouds[i].x, clouds[i].y);
    }
}

draw();

// Draw function defined.
function draw() {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    bird.show();
    bird.update();
    if (gameStarted) {
        if (obstacleOne.xPosition < 0 - obstacleOne.width) {
            obstacleOne = obstacleTwo;
            obstacleTwo = new Obstacle(obstacleOne.xPosition);
        }
        if (bird.x > obstacleOne.xPosition) {
            if (!obstacleOne.cross) {
                score++;
                document.getElementById("score_id").innerText = score;
                speed += 0.1;
            }
            obstacleOne.cross = true;
        }
        obstacleOne.move();
        obstacleOne.show();
        obstacleTwo.move();
        obstacleTwo.show();
    }
    showClouds();
    if (score > maxScore) {
        maxScore = score;
    }
    // Update dom elements.
    document.getElementById("maxScore_id").innerText = maxScore;
    window.requestAnimationFrame(draw);
}