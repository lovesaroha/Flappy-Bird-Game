"use-strict";

/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

// Choose theme at random.
const colors = ["#D64163", "#fa625f", "#4874E2"];
const colorsDark = ["#c13b59", "#e15856", "#4168cb"];
const selColor = Math.floor(Math.random() * colors.length);
document.documentElement.style.setProperty('--primary', colors[selColor]);
document.documentElement.style.setProperty('--primary-dark', colorsDark[selColor]);

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
let distance = 0;
let speed = 3;
let obstacleGap = 500;
let score = 0;
let maxScore = 0;
let maxDistance = 0;


// Windows key event.
window.addEventListener("keydown", function (e) {
    if (e.keyCode == 32) {
        gameStarted = true;
        // Space key pressed.
        bird.moveUp();
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
        ctx.fillStyle = "#4D4D4D";
        ctx.textAlign = 'center';
        ctx.fillText("\uf6d8", this.x, this.y);
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
        let heightLimit = canvas.height - (2 * gap);
        this.top = Math.floor(Math.random() * heightLimit);
        let x = canvas.width + 100;
        if (xGap) {
            x = xGap + obstacleGap;
        }
        this.xPosition = x;
        this.bottom = this.top + gap;
        this.width = 10;
    }

    // Show function shows it on canvas.
    show() {
        // Show top.
        ctx.beginPath();
        ctx.fillStyle = "#666666";
        ctx.fillRect(this.xPosition, 0, this.width, this.top);

        // Show bottom.
        ctx.beginPath();
        ctx.fillStyle = "#666666";
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
let groundIcons = [];
let icons = ["\uf0c2", "\uf744", "\uf1bb", "\uf1ad"];


// Reset game function.
function resetGame() {
    distance = 0;
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
        clouds.push({ x: Math.random() * canvas.width, y: Math.random() * (canvas.height / 2), i: Math.floor(Math.random() * 2) });
    }
}

// Create ground details.
function createGround() {
    for (let i = 0; i < 6; i++) {
        groundIcons.push({ x: Math.random() * canvas.width, y: canvas.height - 5, i: Math.floor(Math.random() * 2) + 2 });
    }
}

createClouds();
createGround();

// Show clouds.
function showClouds() {
    if (clouds[0].x < 0) {
        clouds.shift();
        clouds.push({ x: canvas.width + (Math.random() * canvas.width), y: Math.random() * (canvas.height / 2) , i: Math.floor(Math.random() * 2)  });
    }
    for (let i = 0; i < clouds.length; i++) {
        if (gameStarted) {
            clouds[i].x -= 1;
        }
        ctx.font = '300 52px "Font Awesome 5 Pro"';
        ctx.fillStyle = "#666666";
        ctx.textAlign = 'center';
        ctx.fillText(icons[clouds[i].i], clouds[i].x, clouds[i].y);
    }
}

// Show ground function.
function showGround() {
    if (groundIcons[0].x < 0) {
        groundIcons.shift();
        groundIcons.push({ x: canvas.width + (Math.random() * canvas.width), y: canvas.height - 5, i: Math.floor(Math.random() * 2) + 2 });
    }
    for (let i = 0; i < groundIcons.length; i++) {
        if (gameStarted) {
            groundIcons[i].x -= 1.5;
        }
        ctx.font = `300 66px "Font Awesome 5 Pro"`;
        ctx.fillStyle = "#666666";
        ctx.textAlign = 'center';
        ctx.fillText(icons[groundIcons[i].i], groundIcons[i].x, groundIcons[i].y);
    }
}

draw();

// Draw function defined.
function draw() {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
    bird.show();
    bird.update();
    showClouds();
    showGround();
    if (gameStarted) {
        if (obstacleOne.xPosition < 0 - obstacleOne.width) {
            obstacleOne = obstacleTwo;
            obstacleTwo = new Obstacle(obstacleOne.xPosition);
        }
        if (bird.x > obstacleOne.xPosition && bird.x < obstacleOne.xPosition + obstacleOne.width) {
            score++;
        }
        obstacleOne.move();
        obstacleOne.show();
        obstacleTwo.move();
        obstacleTwo.show();
        distance++;
    }
    if (distance > maxDistance) {
        maxDistance = distance;
    }
    if (score > maxScore) {
        maxScore = score;
    }
    // Update dom elements.
    document.getElementById("score_ID").innerText = score;
    document.getElementById("maxScore_ID").innerText = maxScore;
    document.getElementById("distance_ID").innerText = distance;
    document.getElementById("maxDistance_ID").innerText = maxDistance;

    for (let i = 0; i < canvas.width; i = i + 20) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#eee";
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j = j + 20) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#eee";
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
    }
    window.requestAnimationFrame(draw);
}