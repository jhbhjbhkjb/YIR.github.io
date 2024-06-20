const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = 400;
const HEIGHT = 600;
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 60;
const PLATFORM_WIDTH = 70;
const PLATFORM_HEIGHT = 10;
const GRAVITY = 1;
const JUMP = -15;
const MIN_PLATFORM_GAP = 50;
const MAX_PLATFORM_GAP = 120;

let player = {
    x: WIDTH / 2 - PLAYER_WIDTH / 2,
    y: HEIGHT / 2 - PLAYER_HEIGHT / 2,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    velocity: 0,
    speed: 5
};

let platforms = [];
let lastPlatformY = HEIGHT;
for (let i = 0; i < 10; i++) {
    let y = lastPlatformY - Math.random() * (MAX_PLATFORM_GAP - MIN_PLATFORM_GAP) - MIN_PLATFORM_GAP;
    platforms.push({
        x: Math.random() * (WIDTH - PLATFORM_WIDTH),
        y: y,
        width: PLATFORM_WIDTH,
        height: PLATFORM_HEIGHT
    });
    lastPlatformY = y;
}

function drawPlayer() {
    ctx.fillStyle = "green";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = "black";
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function update() {
    player.velocity += GRAVITY;
    player.y += player.velocity;

    if (player.velocity > 0) {
        platforms.forEach(platform => {
            if (player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y + player.height > platform.y &&
                player.y + player.height < platform.y + platform.height) {
                player.velocity = JUMP;
            }
        });
    }

    if (player.y <= HEIGHT / 2) {
        player.y += Math.abs(player.velocity);
        platforms.forEach(platform => {
            platform.y += Math.abs(player.velocity);
            if (platform.y > HEIGHT) {
                let newY = platform.y - HEIGHT - Math.random() * (MAX_PLATFORM_GAP - MIN_PLATFORM_GAP) - MIN_PLATFORM_GAP;
                platform.y = newY;
                platform.x = Math.random() * (WIDTH - PLATFORM_WIDTH);
            }
        });
    }

    if (player.y > HEIGHT) {
        player.y = HEIGHT / 2 - PLAYER_HEIGHT / 2;
        player.velocity = 0;
        platforms.forEach(platform => {
            let newY = Math.random() * (HEIGHT - PLATFORM_HEIGHT);
            platform.y = newY;
        });
    }
}

function movePlayer() {
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x + player.width < WIDTH) {
        player.x += player.speed;
    }
}

let keys = {};
window.addEventListener("keydown", function (e) {
    keys[e.key] = true;
});
window.addEventListener("keyup", function (e) {
    keys[e.key] = false;
});

function gameLoop() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawPlayer();
    drawPlatforms();
    update();
    movePlayer();
    requestAnimationFrame(gameLoop);
}

gameLoop();
