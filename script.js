// 10 CARS DATA
const cars = [
  { name: "BMW M4 Competition", color: "#0066FF", speed: 6 },
  { name: "BMW M3 Racing Red", color: "#FF1100", speed: 7 },
  { name: "BMW i8 Electric Green", color: "#00FF66", speed: 8 },
  { name: "BMW Stealth Black", color: "#222222", speed: 7 },
  { name: "Audi R8 Yellow", color: "#FFCC00", speed: 6 },
  { name: "Porsche White", color: "#FFFFFF", speed: 8 },
  { name: "Lamborghini Orange", color: "#FF6600", speed: 9 },
  { name: "Ferrari Crimson", color: "#990000", speed: 9 },
  { name: "Bugatti Purple", color: "#8800CC", speed: 10 },
  { name: "Golden Supercar", color: "#FFD700", speed: 10 }
];

let selectedCarIndex = 0;
let score = 0;
let isGameOver = false;
let animationId;

// HTML Elements
const selectionScreen = document.getElementById('selection-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const carNameText = document.getElementById('car-name');
const previewBox = document.getElementById('preview-box');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State
let playerX = 0;
let enemyCars = [];
let roadOffset = 0;

function updateSelectionUI() {
  const car = cars[selectedCarIndex];
  carNameText.innerText = car.name;
  previewBox.style.backgroundColor = car.color;
}

function nextCar() {
  selectedCarIndex = (selectedCarIndex + 1) % cars.length;
  updateSelectionUI();
}

function prevCar() {
  selectedCarIndex = (selectedCarIndex - 1 + cars.length) % cars.length;
  updateSelectionUI();
}

updateSelectionUI();

// Resize Canvas for Fullscreen Feel
function setupCanvas() {
  canvas.width = Math.min(window.innerWidth, 400);
  canvas.height = window.innerHeight;
  playerX = canvas.width / 2 - 20;
}

function startGame() {
  selectionScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  setupCanvas();
  resetGame();
  gameLoop();
}

function resetGame() {
  score = 0;
  isGameOver = false;
  enemyCars = [];
  playerX = canvas.width / 2 - 20;
  gameOverScreen.classList.add('hidden');
}

function restartGame() {
  resetGame();
  gameLoop();
}

// Touch Controls
document.getElementById('left-btn').addEventListener('touchstart', (e) => { e.preventDefault(); moveLeft(); });
document.getElementById('right-btn').addEventListener('touchstart', (e) => { e.preventDefault(); moveRight(); });
document.getElementById('left-btn').addEventListener('click', moveLeft);
document.getElementById('right-btn').addEventListener('click', moveRight);

// Keyboard Controls (For PC Testing)
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') moveLeft();
  if (e.key === 'ArrowRight') moveRight();
});

function moveLeft() {
  if (playerX > 60) playerX -= 40;
}

function moveRight() {
  if (playerX < canvas.width - 100) playerX += 40;
}

// Game Engine / Loop
function gameLoop() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw Road
  ctx.fillStyle = '#444';
  ctx.fillRect(40, 0, canvas.width - 80, canvas.height);

  // Moving Grass Edge
  ctx.fillStyle = '#008800';
  ctx.fillRect(0, 0, 40, canvas.height);
  ctx.fillRect(canvas.width - 40, 0, 40, canvas.height);

  // Road Lines Animation
  ctx.strokeStyle = '#FFF';
  ctx.setLineDash([20, 20]);
  ctx.lineDashOffset = -roadOffset;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  roadOffset += 8;

  // 2. Draw Player Car
  ctx.fillStyle = cars[selectedCarIndex].color;
  ctx.fillRect(playerX, canvas.height - 120, 40, 70);
  // Headlights
  ctx.fillStyle = '#FFFF00';
  ctx.fillRect(playerX + 5, canvas.height - 120, 8, 5);
  ctx.fillRect(playerX + 27, canvas.height - 120, 8, 5);

  // 3. Spawn Enemy Cars
  if (Math.random() < 0.02) {
    let randomX = 50 + Math.floor(Math.random() * (canvas.width - 140));
    enemyCars.push({ x: randomX, y: -80, speed: 4 + Math.random() * 4 });
  }

  // 4. Update & Draw Enemy Cars
  for (let i = 0; i < enemyCars.length; i++) {
    let enemy = enemyCars[i];
    enemy.y += enemy.speed;

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(enemy.x, enemy.y, 40, 70);

    // Collision Check
    if (
      playerX < enemy.x + 40 &&
      playerX + 40 > enemy.x &&
      canvas.height - 120 < enemy.y + 70 &&
      canvas.height - 50 > enemy.y
    ) {
      endGame();
    }

    // Pass Enemy (Score)
    if (enemy.y > canvas.height) {
      enemyCars.splice(i, 1);
      score += 10;
      document.getElementById('score-text').innerText = 'SCORE: ' + score;
    }
  }

  animationId = requestAnimationFrame(gameLoop);
}

function endGame() {
  isGameOver = true;
  cancelAnimationFrame(animationId);
  document.getElementById('final-score').innerText = 'Final Score: ' + score;
  gameOverScreen.classList.remove('hidden');
}
