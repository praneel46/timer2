let seconds = 0;
let interval = null;

const totalSeconds = 120; // 🔥 2 MIN TEST

let particleSpeed = 1;
let particleColor = "orange";

function startApp() {
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("timerScreen").classList.remove("hidden");

  enterFullscreen();
  startParticles();
  startTimer();
}

function enterFullscreen() {
  let elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen();
}

/* TIMER */
function updateDisplay() {
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;

  let timer = document.getElementById("timer");

  timer.innerText =
    `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

  // ⚠️ LAST 1 MIN
  if (seconds >= totalSeconds - 60) {
    timer.classList.add("warning");
    particleSpeed = 2;
  }

  // 💥 LAST 10 SEC
  if (seconds >= totalSeconds - 10) {
    particleSpeed = 5;
    particleColor = "red";
    timer.classList.add("shake");
  }
}

function startTimer() {
  interval = setInterval(() => {
    seconds++;
    updateDisplay();

    if (seconds >= totalSeconds) {
      clearInterval(interval);

      // 🔊 BUZZER (FIXED)
      let sound = document.getElementById("buzzer");
      sound.currentTime = 0;
      sound.volume = 1;
      sound.play().catch(() => {
        console.log("Sound blocked");
      });

      flashScreen();
    }
  }, 1000);
}

/* FLASH */
function flashScreen() {
  let count = 0;
  let flash = setInterval(() => {
    document.body.style.background =
      count % 2 === 0 ? "red" : "black";

    count++;
    if (count > 10) clearInterval(flash);
  }, 150);
}

/* PARTICLES */
function startParticles() {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: canvas.height,
      size: Math.random() * 4,
      speed: Math.random() * 2 + 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      ctx.fillStyle = particleColor;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      p.y -= p.speed * particleSpeed;

      if (p.y < 0) {
        p.y = canvas.height;
        p.x = Math.random() * canvas.width;
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}
