let gameOver = false;
let gameWon = false;
let aiIntervalHandle;
let formationOffsetX = 0;
let lastShotTime = 0;
let wave = 1;
let keys ={};

const maxRows = 7;   // cap so it doesn’t overflow screen
const waveDisplay = document.getElementById("wave");
const fireCooldown = 150; // milliseconds between shots
let gameStartTime = Date.now();
const gameDuration = 90 * 1000; // 90 seconds in milliseconds
const timerDisplay=document.getElementById("timer");
const canvas =document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let player = { x: 280, y: 550, width: 40, height: 20 };
let alienBullets = [];
let bullets = [];
let aliens = [];
let alienSpeed = 0.25;
const aiMessage = document.getElementById("aiMessage");
const scoreDisplay = document.getElementById("score");
function createAliens() {
  aliens = [];

  // Rows increase with wave, capped at maxRows
  let rows = Math.min(2 + wave, maxRows); 
  // Wave 1 → 3 rows (2 + 1)
  // Wave 2 → 4 rows
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < 8; col++) {
      aliens.push({
        x: 60 + col * 60,
        y: 50 + row * 40,
        alive: true
      });
    }
  }

  // Slight speed increase per wave
  alienSpeed = 0.25 + (wave * 0.03);
}

createAliens();

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  // Restart if game ended
  if ((e.key === "r" || e.key === "R") && (gameOver || gameWon)) {
    resetGame();
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// end-screen render function
function drawEndScreen(message) {
  gameOver = true;
  gameWon = true;

  aiMessage.style.display = "none";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Black background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // White centered text
  ctx.fillStyle = "white";
  ctx.font = "28px monospace";
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
  ctx.font = "18px monospace";
  ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 40);
}

function update() {
const groundY = player.y + player.height + 5; 
for (let a of aliens) {
  if (!a.alive) continue;

  if (a.y + 20 >= groundY) {
    gameOver = true;
    drawEndScreen("GAME OVER — INVASION SUCCESSFUL");
    return;
  }
}

if (gameOver || gameWon) return;
// collision check
for (let b of alienBullets) {
  if (
    b.x < player.x + player.width &&
    b.x + 4 > player.x &&
    b.y < player.y + player.height &&
    b.y + 10 > player.y
  ) {
    gameOver = true;
    drawEndScreen("GAME OVER — HUMAN DEFEATED");
    return;  // Now this REALLY exits update()
  }
}

// Game Over
  aliens.forEach(a => {
    if  ( a.alive &&  a.x + formationOffsetX < player.x + player.width &&
  a.x + formationOffsetX + 30 > player.x &&
  a.y + 20 > player.y &&
  a.y < player.y + player.height
) {
      gameOver = true;
  drawEndScreen("GAME OVER — HUMAN DEFEATED");
  ctx.shadowColor = "white";
  ctx.shadowBlur = 5;
  return;
    }
  });
ctx.clearRect(0, 0, canvas.width, canvas.height);

waveDisplay.innerText = "Wave: " + wave;
  // Track player behavior
  trackPlayerPosition(player.x, canvas.width,player.width);

  if (keys["ArrowLeft"]) {
    player.x -= 2.5;
    if (player.x < 0) player.x = 0;
  }

  if (keys["ArrowRight"]) {
    player.x += 2.5;
    if (player.x + player.width > canvas.width)
      player.x = canvas.width - player.width;
  }

  if (keys[" "]) {
    const now = Date.now();
    if (now - lastShotTime > fireCooldown) {
      bullets.push({ x: player.x + player.width / 2 - 2, y: player.y });
      lastShotTime = now;
    }
  }
  // Bottom base line
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, player.y + player.height + 5);
  ctx.lineTo(canvas.width, player.y + player.height + 5);
  ctx.stroke();

  // Draw player
  ctx.fillStyle = "#00ff59";
  ctx.fillRect(player.x, player.y, player.width, player.height);

 // Bullets
for (let i = 0; i < bullets.length; i++) {
  bullets[i].y -= 2;
  ctx.fillStyle = "#ff9500";
  ctx.fillRect(bullets[i].x, bullets[i].y, 4, 12);
}

// Alien bullets
ctx.fillStyle = "yellow";
for (let i = 0; i < alienBullets.length; i++) {
  alienBullets[i].y += 1;
  ctx.fillRect(alienBullets[i].x, alienBullets[i].y, 4, 10);
}



// Remove offscreen alien bullets
alienBullets = alienBullets.filter(b => b.y < canvas.height + 20);


// Remove off-screen bullets
bullets = bullets.filter(b => b.y > -20);


  // Alien movement
  let hitEdge = false;
  aliens.forEach(a => {
    if (!a.alive) return;
    a.x += alienSpeed;
    if (a.x > canvas.width - 30 || a.x < 0) hitEdge = true;

  });

  if (hitEdge) {
    alienSpeed *= -1;
    aliens.forEach(a => a.y += 3 );
  }

  // Draw aliens
  aliens.forEach(a => {
    if (!a.alive) return;
    ctx.fillStyle = "red";
    ctx.fillRect(a.x + formationOffsetX, a.y, 30, 20);

  });

// Collision detection: one bullet kills one alien
for (let b = bullets.length - 1; b >= 0; b--) {
  for (let a = 0; a < aliens.length; a++) {
    if (aliens[a].alive &&
    bullets[b].x < (aliens[a].x + formationOffsetX) + 30 &&
    bullets[b].x + 4 > (aliens[a].x + formationOffsetX) &&
    bullets[b].y < aliens[a].y + 20 &&
    bullets[b].y + 10 > aliens[a].y) {

      aliens[a].alive = false;
      playerStats.score += 10;

      // remove bullet after hit
      bullets.splice(b, 1);
      break;
    }
  }
}

if (aliens.every(a => !a.alive)) {
  // If time still remains, spawn next wave
  let elapsed = Date.now() - gameStartTime;
  if (elapsed < gameDuration) {
    wave++;
    createAliens();
    aiMessage.innerText = "WAVE " + wave + " INCOMING...";
  } 
  else {
    gameWon = true;
    drawEndScreen("TIME UP — HUMAN SURVIVES");
  }
}

  // Update score UI
  scoreDisplay.innerText = "Score: " + playerStats.score;

// Timer countdown
let elapsed = Date.now() - gameStartTime;
let remaining = Math.max(0, Math.ceil((gameDuration - elapsed) / 1000));
timerDisplay.innerText = "Time: " + remaining;
if (remaining <= 0 && !gameWon) {
  gameWon = true;
  drawEndScreen("TIME UP — HUMAN SURVIVES");
  return;
}  
  if (!gameOver && ! gameWon)
    requestAnimationFrame(update);
}

function resetGame() {
  // Reset flags
  gameOver = false;
  gameWon = false;
  gameStartTime = Date.now();
  wave = 1;

  // Reset player
  player.x = canvas.width / 2 - player.width / 2;
  aiMessage.style.display = "block";

  // Reset bullets
  bullets = [];
  alienBullets = [];

  // Reset aliens
  createAliens();

  // Reset alien speed
  alienSpeed = 0.25;

  // Reset AI stats
  playerStats.leftTime = 0;
  playerStats.centerTime = 0;
  playerStats.rightTime = 0;
  playerStats.score = 0;

  // Reset UI
  aiMessage.innerText = "INVADERS INITIALIZING...";
  scoreDisplay.innerText = "Score: 0";

  // Restart AI interval
  startAIInterval();

  // Restart game loop
  update();
}

update();
startAIInterval();

// ===== AI ADAPTATION CYCLE =====
setInterval(() => {
  
  if (gameOver || gameWon) return;

  // pick a random alive alien
  let shooters = aliens.filter(a => a.alive);
  if (shooters.length === 0) return;

  let shooter = shooters[Math.floor(Math.random() * shooters.length)];

  alienBullets.push({
    x: shooter.x + 15,
    y: shooter.y + 20
  });

}, 1000); // alien fires every 1 second

function startAIInterval() {
   clearInterval(aiIntervalHandle); // clear old one if exists
  const aiInterval = setInterval(() => {
    if (gameOver || gameWon) {
      clearInterval(aiInterval);
      return;
    }

    aiMessage.innerText = "INVADERS ANALYZING...";

    let result = analyzePlayer();
    alienSpeed = result.speedMultiplier * (alienSpeed > 0 ? 1 : -1);

//AI movement block
aliens.forEach(a => {
  if (!a.alive) return;
  const dodgeStrength = 10;   // horizontal drift amount
  const spreadStrength = 6;   // center spread amount

  // Player favors left → aliens slowly drift right
  if (result.targetZone === "left") {
    a.x += dodgeStrength;
  }
  // Player favors right → aliens slowly drift left
  if (result.targetZone === "right") {
    a.x -= dodgeStrength;
  }

  // Player center → aliens gently spread outward
  if (result.targetZone === "center") {
    if (a.x < canvas.width / 2) a.x -= spreadStrength;
    else a.x += spreadStrength;
  }
});
// Clamp aliens inside screen after AI movement
aliens.forEach(a => {
  if (!a.alive) return;
  if (a.x < 0) a.x = 0;
  if (a.x > canvas.width - 30) a.x = canvas.width - 30;
});


    canvas.style.borderColor = "white";
    setTimeout(() => {
      canvas.style.borderColor = "#00ff00";
    }, 200);

    setTimeout(() => {
      if (!gameOver && !gameWon) {
        aiMessage.innerText = generateTaunt(result);
      }
    }, 300);

  }, 2000);
}
