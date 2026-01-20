let playerStats = {
  leftTime: 0,
  centerTime: 0,
  rightTime: 0,
  score: 0
};

function trackPlayerPosition(x, canvasWidth, playerWidth) {
  // Track ship CENTER, not left edge
  let centerX = x + playerWidth / 2;
  let zone = centerX / canvasWidth;

  if (zone < 0.333) playerStats.leftTime++;
  else if (zone < 0.666) playerStats.centerTime++;
  else playerStats.rightTime++;
}


function analyzePlayer() {
  let dominant =
    playerStats.leftTime > playerStats.centerTime &&
    playerStats.leftTime > playerStats.rightTime ? "left" :
    playerStats.centerTime > playerStats.rightTime ? "center" : "right";

  // RESET stats after each analysis → makes AI react to recent behavior
  playerStats.leftTime = 0;
  playerStats.centerTime = 0;
  playerStats.rightTime = 0;

  return {
    targetZone: dominant,
    speedMultiplier: playerStats.score > 100 ? 1.15 : 1.0
  };
}


function generateTaunt(result) {
  const taunts = {
    left: "YOU HIDE ON THE LEFT. WE ADAPT.",
    center: "CENTER CAMPER DETECTED.",
    right: "RIGHT SIDE WON'T SAVE YOU."
  };
  return taunts[result.targetZone];
}

