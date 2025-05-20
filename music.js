let audio;
const pageId = document.body.id;

if (pageId === "index" || pageId === "login-register") {
  audio = new Audio("bgm2.mp3");
} else if (pageId === "home") {
  audio = new Audio("bgm3.mp3");
} else if (pageId === "game") {
  audio = new Audio("bgm.mp3");
} else {
  audio = new Audio("bgm.mp3");
}

audio.loop = true;

let musicOn = localStorage.getItem("musicOn");
if (musicOn === null) {
  musicOn = "true";
  localStorage.setItem("musicOn", musicOn);
}
musicOn = musicOn === "true";

audio.volume = pageId === "game" ? 0.5 : 1.0;

function updateAudioState() {
  if (musicOn) {
    audio.play().catch(() => {
      document.body.addEventListener("click", () => audio.play(), { once: true });
    });
  } else {
    audio.pause();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateAudioState();

  window.toggleMusic = () => {
    musicOn = !musicOn;
    localStorage.setItem("musicOn", musicOn);
    updateAudioState();
    updateToggleButtons();
  };

  function updateToggleButtons() {
    const musicToggle = document.getElementById("musicToggle");
    if (musicToggle) {
      musicToggle.classList.toggle("grayscale", !musicOn);
    }

    const toggleMusicBtn = document.getElementById("toggleMusic");
    if (toggleMusicBtn) {
      toggleMusicBtn.textContent = `Music: ${musicOn ? "On" : "Off"}`;
    }
  }

  const musicToggleBtn = document.getElementById("musicToggle");
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener("click", () => window.toggleMusic());
  }

  const toggleMusicBtn = document.getElementById("toggleMusic");
  if (toggleMusicBtn) {
    toggleMusicBtn.addEventListener("click", () => window.toggleMusic());
  }

  updateToggleButtons();
  window.bgmAudio = audio;
});
