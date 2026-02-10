// music resume
(function(){
  const bgm = document.getElementById("bgm");
  if (!bgm) return;
  bgm.volume = 0.2;
  const t = localStorage.getItem("music_time");
  if (t) bgm.currentTime = parseFloat(t);
  const wasOn = localStorage.getItem("music_on") === "true";
  if (wasOn) bgm.play().catch(()=>{});
  setInterval(() => {
    if (!bgm.paused) localStorage.setItem("music_time", String(bgm.currentTime));
  }, 700);
})();

// hearts
(function(){
  const hearts = document.getElementById("hearts");
  if (!hearts) return;
  for (let i=0;i<22;i++){
    const h=document.createElement("div");
    h.className="heart";
    h.style.left=Math.random()*100+"vw";
    h.style.bottom=(-10-Math.random()*30)+"vh";
    h.style.animationDuration=(8+Math.random()*8)+"s";
    h.style.animationDelay=(-Math.random()*10)+"s";
    h.style.opacity=(0.25+Math.random()*0.6);
    const s=10+Math.random()*18;
    h.style.width=s+"px"; h.style.height=s+"px";
    hearts.appendChild(h);
  }
})();

const msg = document.getElementById("msg");
const picked = new Map(); // q -> right/wrong

function checkWin(){
  if (picked.size < 3) return;
  const allRight = Array.from(picked.values()).every(v => v === "right");
  if (allRight){
    msg.textContent = "KEY UNLOCKED 🔑 (going back...)";
    localStorage.setItem("key_quiz", "true");
    setTimeout(()=> window.location.href="./index.html", 900);
  } else {
    msg.textContent = "not quite 😭 try again (pick better answers)";
  }
}

document.querySelectorAll(".opt").forEach(btn => {
  btn.addEventListener("click", () => {
    const q = btn.dataset.q;
    const a = btn.dataset.a;

    // clear styles in that question
    document.querySelectorAll(`.opt[data-q="${q}"]`).forEach(b => {
      b.classList.remove("correct","wrong");
    });

    btn.classList.add(a === "right" ? "correct" : "wrong");
    picked.set(q, a);

    checkWin();
  });
});

