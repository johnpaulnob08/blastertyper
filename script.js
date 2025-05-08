document.addEventListener("DOMContentLoaded", () => {
  const bodyId = document.body.id;

  if (bodyId === "index") {
    // Animate game title zoom in
    const gameTitle = document.querySelector(".game-title");
    gameTitle.style.transform = "scale(0.5)";
    gameTitle.style.transition = "transform 1.5s ease-out";
    
    window.addEventListener("load", () => {
      requestAnimationFrame(() => {
        gameTitle.style.transform = "scale(1)";
      });
    });    

    // Hover animation for floating elements
    ["ufo", "rocket1", "rocket2", "spaceman"].forEach(className => {
      const el = document.querySelector(`.${className}`);
      if (el) el.classList.add("hovering");
    });

  } else if (bodyId === "login-register") {
    // Save register form data and redirect
    const signupBtn = document.querySelector(".signup-button");
    if (signupBtn && window.location.href.includes("register.html")) {
      signupBtn.addEventListener("click", () => {
        const username = document.querySelector('input[placeholder="Enter username"]').value;
        const password = document.querySelector('input[placeholder="Enter password"]').value;
        localStorage.setItem("registeredUser", username);
        localStorage.setItem("registeredPass", password);
      });
    }

    // Redirect to homepage if credentials match
    const loginBtn = document.querySelector(".login-button");
    if (loginBtn && window.location.href.includes("login_page.html")) {
      loginBtn.addEventListener("click", (e) => {
        const inputUser = document.querySelector('input[placeholder="Enter username"]').value;
        const inputPass = document.querySelector('input[placeholder="Enter password"]').value;
        const storedUser = localStorage.getItem("registeredUser");
        const storedPass = localStorage.getItem("registeredPass");

        if (inputUser !== storedUser || inputPass !== storedPass) {
          alert("Incorrect username or password");
          e.preventDefault(); // cancel link navigation
        }
      });
    }

  } else if (bodyId === "home") {
    // Hover white rocket
    const whiteRocket = document.querySelector(".white-rocket");
    if (whiteRocket) whiteRocket.classList.add("hovering");

    // Difficulty buttons highlight and remember selection
    const modeButtons = document.querySelectorAll(".mode");
    const savedDifficulty = localStorage.getItem("selectedDifficulty");

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
        localStorage.setItem("selectedDifficulty", btn.dataset.mode);
      });
    });

    // Load and display dummy game data
    const recent = document.querySelector(".recent-placeholder");
    const dummyData = [
      { username: "Player1", score: 25 },
      { username: "Player2", score: 40 },
      { username: "Player3", score: 15 },
      { username: localStorage.getItem("registeredUser"), score: 20 }
    ];

    dummyData.sort((a, b) => b.score - a.score);

    const top3 = dummyData.slice(0, 3);
    const currentPlayer = dummyData.find(player => player.username === localStorage.getItem("registeredUser"));

    top3.forEach(player => {
      const el = document.createElement("p");
      el.textContent = `${player.username}: ${player.score}`;
      el.style.fontWeight = "bold";
      recent.appendChild(el);
    });

    const spacer = document.createElement("div");
    spacer.style.height = "20px";
    recent.appendChild(spacer);

    const current = document.createElement("p");
    current.textContent = `${currentPlayer.username}: ${currentPlayer.score}`;
    current.style.color = "lightblue";
    recent.appendChild(current);

    // Blast button hover and redirect
    const blastBtn = document.querySelector(".blast-button");
    blastBtn.classList.add("hovering");
  }

  else if (bodyId === "game") {
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
  
    let words = ["space", "blast", "rocket", "type", "alien", "orbit"];
    let activeWords = [];
    let bullets = [];
    let interval;
    let score = 0;
  
    function spawnWord() {
      const word = words[Math.floor(Math.random() * words.length)];
      const y = Math.random() * (canvas.height - 40) + 20;
      const speed = Math.random() * 1.5 + 0.5;
      const color = ["#FFD700", "#00FFFF", "#FF69B4", "#ADFF2F", "#FF4500"][Math.floor(Math.random() * 5)];
      activeWords.push({ text: word, x: 0, y, speed, color });
    }
  
    function drawWordsAndBullets() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Draw and move words
      ctx.font = "bold 22px 'Courier New', monospace";
      activeWords.forEach(word => {
        ctx.fillStyle = word.color;
        ctx.fillText(word.text, word.x, word.y);
        word.x += word.speed;
      });
  
      // Draw and move bullets
      bullets.forEach((bullet, i) => {
        const img = new Image();
        img.src = "balls.png";
        ctx.drawImage(img, bullet.x, bullet.y - 10, 20, 20);
        bullet.x -= 5;
  
        // Collision detection
        activeWords.forEach((word, j) => {
          const wordWidth = ctx.measureText(word.text).width;
          if (
            bullet.x < word.x + wordWidth &&
            bullet.x + 20 > word.x &&
            bullet.y > word.y - 20 &&
            bullet.y < word.y + 10
          ) {
            activeWords.splice(j, 1); // remove word
            bullets.splice(i, 1);     // remove bullet
            score++;
          }
        });
      });
  
      // Remove offscreen bullets
      bullets = bullets.filter(b => b.x > 0);
  
      // Check game over (word reaches rocket)
      activeWords.forEach(word => {
        if (word.x > canvas.width - 100) {
          clearInterval(interval);
          showGameOver();
        }
      });
    }
  
    function startGame() {
      interval = setInterval(() => {
        drawWordsAndBullets();
        if (Math.random() < 0.02) spawnWord();
      }, 30);
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
  
    function shootBall(y) {
      bullets.push({ x: canvas.width - 100, y }); // Start from rocket's position
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
      msg.style.fontSize = "20px";
      msg.style.textAlign = "center";
  
      const playAgainBtn = document.createElement("button");
      playAgainBtn.textContent = "Play Again";
      playAgainBtn.onclick = () => window.location.reload();
  
      const menuBtn = document.createElement("button");
      menuBtn.textContent = "Menu";
      menuBtn.onclick = () => location.href = "homepage.html";
  
      box.append(msg, playAgainBtn, menuBtn);
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
  
    startGame();
  }});  