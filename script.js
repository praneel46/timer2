let seconds = 0;
let interval = null;

const totalSeconds = 1200;

let particleSpeed = 1;
let particleColor = "orange";

let lastSpokenSecond = null;
let last5minAnnounced = false;

/* ================= START ================= */
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

  playIntroVoice(); // 🎤 fixed flow
}

/* ================= INTRO VOICE (FIXED) ================= */
function playIntroVoice() {
  speechSynthesis.cancel();

  setTimeout(() => {
    let msg = new SpeechSynthesisUtterance(
      "Ladies and gentlemen... fasten your seatbelts... the quiz begins now!"
    );

    msg.rate = 0.9;
    msg.pitch = 1;
    msg.volume = 1;

    speechSynthesis.speak(msg);

    // ✅ PERFECT SYNC (no timeout guessing)
    msg.onend = () => {
      showIntro();
    };

  }, 300); // small delay fixes browser block
}

/* ================= FULLSCREEN ================= */
function enterFullscreen() {
  let elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen();
}

/* ================= INTRO 3 2 1 GO ================= */
function showIntro() {
  let intro = document.getElementById("introText");

  let steps = ["3", "2", "1", "GO"];
  let i = 0;

  let intervalIntro = setInterval(() => {
    intro.innerText = steps[i];

    intro.classList.remove("fire-show");
    void intro.offsetWidth;
    intro.classList.add("fire-show");

    // 💣 SCREEN BLAST at GO
    if (steps[i] === "GO") {
      document.body.classList.add("blast");

      setTimeout(() => {
        document.body.classList.remove("blast");
      }, 300);
    }

    i++;

    if (i >= steps.length) {
      clearInterval(intervalIntro);

      setTimeout(() => {
        intro.innerText = "";
        startTimer();
      }, 700);
    }
  }, 1000);
}

/* ================= VOICE ================= */
function speak(text) {
  let msg = new SpeechSynthesisUtterance(text);
  msg.rate = 1;

  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}

/* ================= TIMER DISPLAY ================= */
function updateDisplay() {
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;

  let timer = document.getElementById("timer");

  timer.innerText =
    `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

  updateProgressBar();

  // 🔊 LAST 5 MIN ANNOUNCEMENT
  if (seconds === totalSeconds - 300 && !last5minAnnounced) {
    speak("Last 5 minutes remaining");
    last5minAnnounced = true;
  }

  // 🎨 COLOR TRANSITIONS
  if (seconds >= totalSeconds - 300) {
    particleColor = "darkred";
  }

  if (seconds >= totalSeconds - 120) {
    particleSpeed = 3;
  }

  if (seconds >= totalSeconds - 60) {
    timer.classList.add("warning");
    particleColor = "red";
    particleSpeed = 6;
    timer.classList.add("shake");
  }

  // 💥 LAST 10 SEC COUNTDOWN
  if (seconds >= totalSeconds - 10) {
    let remaining = totalSeconds - seconds;

    if (remaining !== lastSpokenSecond && remaining > 0) {
      speak(remaining.toString());
      lastSpokenSecond = remaining;
    }
  }
}

/* ================= PROGRESS BAR ================= */
function updateProgressBar() {
  let progress = (seconds / totalSeconds) * 100;
  let bar = document.getElementById("progressBar");

  bar.style.width = progress + "%";

  if (seconds >= totalSeconds - 300) {
    bar.style.background = "darkred";
  }

  if (seconds >= totalSeconds - 60) {
    bar.style.background = "red";
  }
}

/* ================= TIMER LOOP ================= */
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

/* ================= BUZZER ================= */
function playBuzzer() {
  let sound = document.getElementById("buzzer");

  sound.pause();
  sound.currentTime = 0;
  sound.volume = 1;
  sound.loop = true;

  sound.play().catch(() => {
    console.log("Buzzer blocked");
  });
}

/* ================= END EFFECT ================= */
function triggerEndEffects() {
  let timer = document.getElementById("timer");

  timer.classList.add("shake");
  playBuzzer();

  flashScreen();
}

/* ================= FLASH ================= */
function flashScreen() {
  let count = 0;

  let flash = setInterval(() => {
    document.body.style.background =
      count % 2 === 0 ? "red" : "black";

    count++;

    if (count > 14) clearInterval(flash);
  }, 120);
}

/* ================= PARTICLES ================= */
function startParticles() {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];

  for (let i = 0; i < 200; i++) {
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
          : particleColor === "darkred"
          ? "rgba(180,0,0,0.8)"
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
