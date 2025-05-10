document.addEventListener("DOMContentLoaded", () => {
  const bodyId = document.body.id;

  if (bodyId === "index") {
    const gameTitle = document.querySelector(".game-title");
    gameTitle.style.transform = "scale(0.5)";
    gameTitle.style.transition = "transform 1.5s ease-out";

    window.addEventListener("load", () => {
      requestAnimationFrame(() => {
        gameTitle.style.transform = "scale(1)";
      });
    });

    ["ufo", "rocket1", "rocket2", "spaceman"].forEach(className => {
      const el = document.querySelector(`.${className}`);
      if (el) el.classList.add("hovering");
    });

  } else if (bodyId === "login-register") {
    const signupBtn = document.querySelector(".signup-button");
    if (signupBtn && window.location.href.includes("register.html")) {
      signupBtn.addEventListener("click", () => {
        const username = document.querySelector('input[placeholder="Enter username"]').value;
        const password = document.querySelector('input[placeholder="Enter password"]').value;
        localStorage.setItem("registeredUser", username);
        localStorage.setItem("registeredPass", password);
      });
    }

    const loginBtn = document.querySelector(".login-button");
    if (loginBtn && window.location.href.includes("login_page.html")) {
      loginBtn.addEventListener("click", (e) => {
        const inputUser = document.querySelector('input[placeholder="Enter username"]').value;
        const inputPass = document.querySelector('input[placeholder="Enter password"]').value;
        const storedUser = localStorage.getItem("registeredUser");
        const storedPass = localStorage.getItem("registeredPass");

        if (inputUser !== storedUser || inputPass !== storedPass) {
          alert("Incorrect username or password");
          e.preventDefault();
        }
      });
    }

  } else if (bodyId === "home") {
  const whiteRocket = document.querySelector(".white-rocket");
  if (whiteRocket) whiteRocket.classList.add("hovering");

  const modeButtons = document.querySelectorAll(".mode");
  const savedDifficulty = localStorage.getItem("gameDifficulty");

  if (savedDifficulty) {
    modeButtons.forEach(btn => {
      if (btn.dataset.mode === savedDifficulty) {
        btn.classList.add("active");
      }
    });
  }

  modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      modeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      localStorage.setItem("gameDifficulty", btn.dataset.mode);
    });
  });

  const startGameLink = document.getElementById("startGameLink");
  if (startGameLink) {
    startGameLink.addEventListener("click", () => {
      const nameInput = document.getElementById("playerName");
      if (nameInput && nameInput.value.trim() !== "") {
        localStorage.setItem("playerName", nameInput.value.trim());
      }
    });
  }

  const settingsBtn = document.getElementById("settingsBtn");
  const settingsPopup = document.getElementById("settingsPopup");
  const soundToggle = document.getElementById("soundToggle");
  const musicToggle = document.getElementById("musicToggle");
  const exitBtn = document.getElementById("exitBtn");

  let soundOn = true;
  let musicOn = true;

  if (settingsBtn && settingsPopup) {
    settingsBtn.addEventListener("click", () => {
      settingsPopup.classList.toggle("hidden");
    });
  }

  if (soundToggle) {
    soundToggle.addEventListener("click", () => {
      soundOn = !soundOn;
      soundToggle.src = soundOn ? "sound_on.png" : "sound_off.png";
      console.log(`Sound is now ${soundOn ? "ON" : "OFF"}`);
    });
  }

  if (musicToggle) {
    musicToggle.addEventListener("click", () => {
      musicOn = !musicOn;
      musicToggle.classList.toggle("grayscale", !musicOn);
      console.log(`Music is now ${musicOn ? "ON" : "OFF"}`);
    });
  }

  if (exitBtn) {
    exitBtn.addEventListener("click", () => {
      console.log("Exiting game...");
      window.close();
    });
  }

  const blastBtn = document.querySelector(".blast-button");
  if (blastBtn) {
    blastBtn.classList.add("hovering");
  }

  } else if (bodyId === "game") {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const wordInput = document.getElementById("wordInput");
    const rocket = document.getElementById("rocket");
    const pauseBtn = document.getElementById("pause");
    const pauseModal = document.getElementById("pauseModal");
    const resumeBtn = document.getElementById("resume");
    const restartBtn = document.getElementById("restart");
    const settingsModal = document.getElementById("settingsModal");
    const openSettings = document.getElementById("openSettings");
    const toggleSound = document.getElementById("toggleSound");
    const toggleMusic = document.getElementById("toggleMusic");

    let soundOn = true;
    let musicOn = true;
    let difficulty = localStorage.getItem("gameDifficulty") || "medium";
    let baseSpeed;

    switch (difficulty) {
      case "easy": baseSpeed = 0.7; break;
      case "hard": baseSpeed = 3.0; break;
      default: baseSpeed = 1.2;
    }

    const allWords = ["space", "blast", "rocket", "type", "alien", "orbit", "laser", "comet", "nova", "meteor", "galaxy", "asteroid", "ship", "planet", "blackhole"];
    let activeWords = [], bullets = [], interval, score = 0;

    const ballImg = new Image();
    ballImg.src = "balls.png";

    function spawnWord() {
      const word = allWords[Math.floor(Math.random() * allWords.length)];
      const y = Math.random() * (canvas.height - 40) + 20;
      const speed = baseSpeed + Math.random();
      const color = "#FFD700";
      activeWords.push({ text: word, x: 0, y, speed, color });
    }

    function drawWordsAndBullets() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "bold 22px 'Courier New', monospace";
      activeWords.forEach(word => {
        ctx.fillStyle = word.color;
        ctx.fillText(word.text, word.x, word.y);
        word.x += word.speed;
      });

      bullets.forEach((bullet, i) => {
        ctx.drawImage(ballImg, bullet.x, bullet.y - 10, 20, 20);
        bullet.x -= 15;

        activeWords.forEach((word, j) => {
          const wordWidth = ctx.measureText(word.text).width;
          if (bullet.x < word.x + wordWidth && bullet.x + 20 > word.x &&
              bullet.y > word.y - 20 && bullet.y < word.y + 10) {
            activeWords.splice(j, 1);
            bullets.splice(i, 1);
            score++;
          }
        });
      });

      bullets = bullets.filter(b => b.x > 0);

      activeWords.forEach(word => {
        if (word.x > canvas.width - 100) {
          clearInterval(interval);
          showGameOver();
        }
      });
    }

    function shootBall(y) {
      bullets.push({ x: canvas.width - 100, y });
    }

    wordInput.addEventListener("input", () => {
      const input = wordInput.value.trim();
      const index = activeWords.findIndex(word => word.text === input);
      if (index !== -1) {
        const targetY = activeWords[index].y;
        rocket.style.top = `${targetY}px`;
        shootBall(targetY);
        wordInput.value = "";
      }
    });

    function startGame() {
      interval = setInterval(() => {
        drawWordsAndBullets();
        if (Math.random() < 0.025) spawnWord();
      }, 30);
    }

    function showGameOver() {
      const modal = document.createElement("div");
      modal.classList.add("modal");
      modal.style.display = "flex";

      const box = document.createElement("div");
      box.classList.add("modal-content");

      const msg = document.createElement("p");
      msg.textContent = "Game Over!";
      msg.style.color = "white";
      msg.style.fontSize = "24px";
      msg.style.textAlign = "center";

      const scoreDisplay = document.createElement("p");
      scoreDisplay.textContent = `Your Score: ${score}`;
      scoreDisplay.style.color = "yellow";
      scoreDisplay.style.fontSize = "20px";
      scoreDisplay.style.textAlign = "center";
      scoreDisplay.style.marginBottom = "20px";

      const playAgainBtn = document.createElement("button");
      playAgainBtn.textContent = "Play Again";
      playAgainBtn.onclick = () => window.location.reload();

      const menuBtn = document.createElement("button");
      menuBtn.textContent = "Menu";
      menuBtn.onclick = () => location.href = "homepage.html";

      box.append(msg, scoreDisplay, playAgainBtn, menuBtn);
      modal.appendChild(box);
      document.body.appendChild(modal);
    }

    pauseBtn.addEventListener("click", () => {
      pauseModal.style.display = "flex";
      clearInterval(interval);
    });

    resumeBtn.addEventListener("click", () => {
      pauseModal.style.display = "none";
      startGame();
    });

    restartBtn.addEventListener("click", () => {
      location.reload();
    });

    openSettings.addEventListener("click", () => {
      pauseModal.style.display = "none";
      settingsModal.style.display = "flex";
    });

    toggleSound.addEventListener("click", () => {
      soundOn = !soundOn;
      toggleSound.textContent = `Sound: ${soundOn ? "On" : "Off"}`;
    });

    toggleMusic.addEventListener("click", () => {
      musicOn = !musicOn;
      toggleMusic.textContent = `Music: ${musicOn ? "On" : "Off"}`;
    });

    startGame();
  }
});
