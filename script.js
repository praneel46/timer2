let seconds = 0;
let interval = null;

const totalSeconds = 1200;

let particleSpeed = 1;
let particleColor = "orange";

let lastSpokenSecond = null;

/* START */
function startApp() {
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("timerScreen").classList.remove("hidden");

  enterFullscreen();

  // 🔊 AUDIO UNLOCK
  let sound = document.getElementById("buzzer");
  sound.volume = 1;
  sound.play().then(() => {
    sound.pause();
    sound.currentTime = 0;
  }).catch(() => {});

  speechSynthesis.cancel();

  startParticles();

  // 🎬 CINEMATIC INTRO
  showIntro();
}

function enterFullscreen() {
  let elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen();
}

/* 🎬 INTRO */
function showIntro() {
  let timer = document.getElementById("timer");

  timer.classList.add("intro-text");

  timer.innerText = "READY";

  setTimeout(() => {
    timer.innerText = "SET";
    timer.classList.add("show");
  }, 1000);

  setTimeout(() => {
    timer.innerText = "GO";
    timer.classList.add("show");
  }, 2000);

  setTimeout(() => {
    timer.classList.remove("intro-text", "show");
    timer.innerText = "00:00";
    startTimer();
  }, 3000);
}

/* 🎤 VOICE */
function speak(num) {
  let msg = new SpeechSynthesisUtterance(num.toString());
  msg.rate = 1;
  msg.pitch = 1;
  msg.volume = 1;

  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}

/* TIMER DISPLAY */
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
    let remaining = totalSeconds - seconds;

    particleSpeed = 7;
    particleColor = "red";

    timer.classList.add("shake");

    if (remaining !== lastSpokenSecond && remaining > 0) {
      speak(remaining);
      lastSpokenSecond = remaining;
    }
  }
}

/* TIMER LOOP */
function startTimer() {
  interval = setInterval(() => {
    seconds++;
    updateDisplay();

    if (seconds >= totalSeconds) {
      clearInterval(interval);
      triggerEndEffects();
    }
  }, 1000);
}

/* 🔊 BUZZER */
function playBuzzer() {
  let sound = document.getElementById("buzzer");

  sound.pause();
  sound.currentTime = 0;
  sound.volume = 1;
  sound.loop = true;

  sound.play().catch(() => {
    console.log("Sound blocked");
  });
}

/* 💣 END EFFECT */
function triggerEndEffects() {
  let timer = document.getElementById("timer");

  timer.classList.add("explode"); // 💣 explosion

  playBuzzer();

  setTimeout(() => {
    flashScreen();
  }, 300);
}

/* 🔴 FLASH */
function flashScreen() {
  let count = 0;

  let flash = setInterval(() => {
    document.body.style.background =
      count % 2 === 0 ? "red" : "black";

    count++;

    if (count > 14) clearInterval(flash);
  }, 120);
}

/* 🔥 PARTICLES */
function startParticles() {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];

  for (let i = 0; i < 180; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: canvas.height,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      ctx.fillStyle =
        particleColor === "red"
          ? "rgba(255,50,0,0.9)"
          : "rgba(255,140,0,0.7)";

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      p.y -= p.speed * particleSpeed;
      p.x += (Math.random() - 0.5) * 1.5;

      if (p.y < 0) {
        p.y = canvas.height;
        p.x = Math.random() * canvas.width;
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}
