document.addEventListener("DOMContentLoaded", () => {
  // ===== HEARTS BACKGROUND =====
  const heartsWrap = document.getElementById("hearts");
  // ---- MUSIC ----
// ---- MUSIC CONTINUOUS SYSTEM ----
const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");

if (bgm && musicBtn) {
  bgm.volume = 0.2;

  // restore last time
  const savedTime = localStorage.getItem("music_time");
  if (savedTime) bgm.currentTime = parseFloat(savedTime);

  // auto resume if it was on before
  const wasOn = localStorage.getItem("music_on") === "true";
  if (wasOn) bgm.play().catch(() => {});

  // save time while playing
  setInterval(() => {
    if (!bgm.paused) localStorage.setItem("music_time", String(bgm.currentTime));
  }, 700);

  // toggle
  musicBtn.textContent = wasOn ? "🔇 mute music" : "🎵 play music";

  musicBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      if (bgm.paused) {
        await bgm.play();
        localStorage.setItem("music_on", "true");
        musicBtn.textContent = "🔇 mute music";
      } else {
        bgm.pause();
        localStorage.setItem("music_on", "false");
        musicBtn.textContent = "🎵 play music";
      }
    } catch (err) {
      console.log("Audio play failed:", err);
    }
  });
}

  function spawnHeart() {
    if (!heartsWrap) return;

    const h = document.createElement("div");
    h.className = "heart";

    const left = Math.random() * 100;
    const size = 10 + Math.random() * 14;
    const dur = 6 + Math.random() * 7;

    h.style.left = left + "vw";
    h.style.bottom = "-20px";
    h.style.width = size + "px";
    h.style.height = size + "px";
    h.style.animationDuration = dur + "s";
    h.style.opacity = (0.35 + Math.random() * 0.45).toFixed(2);

    heartsWrap.appendChild(h);

    setTimeout(() => h.remove(), dur * 1000 + 500);
  }

  // spawn a few instantly + keep spawning
  for (let i = 0; i < 10; i++) spawnHeart();
  setInterval(spawnHeart, 650);

  // ===== BUTTONS =====
  const note = document.getElementById("note");
  const toggleBtn = document.getElementById("toggleNote");
  const clickMore = document.getElementById("clickMore");

  // read more toggle
  if (note && toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      note.classList.toggle("collapsed");
      toggleBtn.textContent = note.classList.contains("collapsed") ? "read more" : "read less";
    });
  }

// ---- LOCK / UNLOCK LOGIC ----
if (clickMore) {
  const unlocked = localStorage.getItem("adnan_connections_unlocked") === "true";

  if (unlocked) {
    clickMore.disabled = false;
    clickMore.classList.remove("locked");
    clickMore.textContent = "click for more 💗";

    clickMore.addEventListener("click", () => {
      window.location.href = "./valentine.html";
    });
  } else {
    clickMore.disabled = true;
    clickMore.classList.add("locked");
    clickMore.textContent = "🔒 locked — solve connections";
  }
}

});



