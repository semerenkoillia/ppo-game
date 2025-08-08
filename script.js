
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const boomSound = document.getElementById("boom");

let drones = [];
let score = 0;
let gameTime = 60;
let gameRunning = true;

function spawnDrone() {
  if (!gameRunning) return;
  const size = 40;
  const x = Math.random() * (canvas.width - size);
  drones.push({ x, y: -size, size, speed: 2 + Math.random() * 3 });
  setTimeout(spawnDrone, 1000 + Math.random() * 1500);
}

function drawDrone(drone) {
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(drone.x + drone.size/2, drone.y + drone.size/2, drone.size/2, 0, Math.PI * 2);
  ctx.fill();
}

function update() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drones.forEach(drone => {
    drone.y += drone.speed;
    drawDrone(drone);
  });

  drones = drones.filter(d => d.y < canvas.height + d.size);

  requestAnimationFrame(update);
}

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let i = 0; i < drones.length; i++) {
    const d = drones[i];
    const dx = x - (d.x + d.size / 2);
    const dy = y - (d.y + d.size / 2);
    if (Math.sqrt(dx * dx + dy * dy) < d.size / 2) {
      drones.splice(i, 1);
      score++;
      document.getElementById("score").innerText = score;
      boomSound.currentTime = 0;
      boomSound.play();
      break;
    }
  }
});

function countdown() {
  if (!gameRunning) return;
  if (gameTime <= 0) {
    gameRunning = false;
    alert("Гру завершено! Твій рахунок: " + score);
    return;
  }
  gameTime--;
  document.getElementById("timer").innerText = gameTime;
  setTimeout(countdown, 1000);
}

spawnDrone();
update();
countdown();
