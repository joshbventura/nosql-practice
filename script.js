document.addEventListener("DOMContentLoaded", () => {
  // ===== HEARTS BACKGROUND =====
  const heartsWrap = document.getElementById("hearts");

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

  for (let i = 0; i < 10; i++) spawnHeart();
  setInterval(spawnHeart, 650);

  // ===== MUSIC (resume across pages) =====
  const bgm = document.getElementById("bgm");
  const musicBtn = document.getElementById("musicBtn");

  if (bgm && musicBtn) {
    bgm.volume = 0.2;

    const savedTime = localStorage.getItem("music_time");
    if (savedTime) bgm.currentTime = parseFloat(savedTime);

    const wasOn = localStorage.getItem("music_on") === "true";
    if (wasOn) bgm.play().catch(() => {});

    setInterval(() => {
      if (!bgm.paused) localStorage.setItem("music_time", String(bgm.currentTime));
    }, 700);

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

  // ===== READ MORE =====
  const note = document.getElementById("note");
  const toggleBtn = document.getElementById("toggleNote");

  if (note && toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      note.classList.toggle("collapsed");
      toggleBtn.textContent = note.classList.contains("collapsed") ? "read more" : "read less";
    });
  }

  // ===== 3 KEY SYSTEM =====
  const clickMore = document.getElementById("clickMore");
  const keyStatus = document.getElementById("keyStatus");

  function getKeyCount() {
    const keys = [
      localStorage.getItem("key_connections") === "true",
      localStorage.getItem("key_memory") === "true",
      localStorage.getItem("key_quiz") === "true",
    ];
    return keys.filter(Boolean).length;
  }

  function renderKeys() {
    const count = getKeyCount();
    const total = 3;

    const icons =
      (localStorage.getItem("key_connections") === "true" ? "🔑" : "🗝️") + " " +
      (localStorage.getItem("key_memory") === "true" ? "🔑" : "🗝️") + " " +
      (localStorage.getItem("key_quiz") === "true" ? "🔑" : "🗝️");

    if (keyStatus) keyStatus.textContent = `Keys: ${count}/${total} ${icons} ${count === total ? "🔓" : "🔒"}`;

    if (!clickMore) return;

    if (count === total) {
      clickMore.disabled = false;
      clickMore.classList.remove("locked");
      clickMore.textContent = "click for more 💗";
      clickMore.onclick = () => window.location.href = "./valentine.html";
    } else {
      clickMore.disabled = true;
      clickMore.classList.add("locked");
      clickMore.textContent = "🔒 locked — collect 3 keys";
      clickMore.onclick = null;
    }
  }

  renderKeys();
});


});



