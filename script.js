let seconds = 0;
let interval = null;

const totalSeconds = 120; // 🔥 test (change to 1200 later)

let particleSpeed = 1;
let particleColor = "orange";

let speaking = false;

/* START */
function startApp() {
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("timerScreen").classList.remove("hidden");

  enterFullscreen();
  speechSynthesis.cancel(); // 🔥 clear any previous voice

  startParticles();
  startTimer();
}

function enterFullscreen() {
  let elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen();
}

/* 🎤 PERFECT SYNC VOICE */
function speak(num) {
  if (speaking) return;

  speaking = true;

  let msg = new SpeechSynthesisUtterance(num.toString());
  msg.rate = 1;
  msg.pitch = 1;
  msg.volume = 1;

  msg.onend = () => {
    speaking = false;
  };

  speechSynthesis.cancel(); // clear queue
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

    particleSpeed = 6;
    particleColor = "red";

    timer.classList.add("shake");

    // 🎤 synced countdown
    if (remaining > 0) {
      speak(remaining);
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

/* 🔊 FIXED BUZZER */
function playBuzzer() {
  let sound = document.getElementById("buzzer");

  sound.pause();            // reset properly
  sound.currentTime = 0;
  sound.volume = 1;
  sound.loop = true;

  let promise = sound.play();

  if (promise !== undefined) {
    promise.catch(() => {
      console.log("Sound blocked by browser");
    });
  }
}

/* 💥 FINAL EFFECT */
function triggerEndEffects() {
  playBuzzer();

  document.getElementById("timer").classList.add("shake");

  flashScreen();
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

  for (let i = 0; i < 150; i++) {
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
