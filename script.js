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

  // click for more = cute glow + little text swap
  if (clickMore) {
    let flipped = false;
    clickMore.addEventListener("click", () => {
      clickMore.classList.toggle("is-glow");
      flipped = !flipped;
      clickMore.textContent = flipped ? "ok i’m soft now 🥺" : "click for more 💗";
    });
  }
});



