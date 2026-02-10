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

const grid = document.getElementById("grid");
const msg = document.getElementById("msg");

// We’ll use the same image for all pairs (you can add more later)
const images = [
  "./assets/us1.png",
  "./assets/us1.png",
  "./assets/us1.png",
  "./assets/us1.png",
  "./assets/us1.png",
  "./assets/us1.png",
  "./assets/us1.png",
  "./assets/us1.png",
];

function shuffle(arr){
  for (let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

const deck = shuffle([...images, ...images]).map((src, idx) => ({ id: idx, src }));

let first = null;
let lock = false;
let matchedCount = 0;

function makeCard(card){
  const el = document.createElement("div");
  el.className = "card-tile";
  el.dataset.id = card.id;
  el.dataset.src = card.src;

  const img = document.createElement("img");
  img.src = card.src;
  img.alt = "memory";
  el.appendChild(img);

  el.addEventListener("click", () => {
    if (lock) return;
    if (el.classList.contains("matched")) return;
    if (el.classList.contains("revealed")) return;

    el.classList.add("revealed");

    if (!first){
      first = el;
      return;
    }

    // second pick
    const second = el;
    lock = true;

    const a = first.dataset.src;
    const b = second.dataset.src;

    if (a === b){
      first.classList.add("matched");
      second.classList.add("matched");
      matchedCount += 2;
      first = null;
      lock = false;

      if (matchedCount === deck.length){
        msg.textContent = "KEY UNLOCKED 🔑 (going back...)";
        localStorage.setItem("key_memory", "true");
        setTimeout(()=> window.location.href="./index.html", 900);
      }
    } else {
      setTimeout(() => {
        first.classList.remove("revealed");
        second.classList.remove("revealed");
        first = null;
        lock = false;
      }, 650);
    }
  });

  return el;
}

grid.innerHTML = "";
deck.forEach(card => grid.appendChild(makeCard(card)));
msg.textContent = "find the matching pairs 💗";
