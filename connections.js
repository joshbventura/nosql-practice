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

// hearts (reuse)
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

/* Customize groups */
const GROUPS = [
  { name: "things i love about adnan", color: "solved-yellow", items: ["CARING", "LOYAL", "SMART", "FUNNY"] },
  { name: "our beloved games", color: "solved-green", items: ["MARVEL RIVALS", "PERSONA 5: THE PHANTOM X", "OVERWATCH", "ARKNIGHTS: ENDFIELD"] },
  { name: "places we have been", color: "solved-blue", items: ["SCRANTON", "WILKES-BARRE", "WOODBRIDGE", "WHITE MARSH"] },
  { name: "songs that remind me of you", color: "solved-purple", items: ["VERSACE ON THE FLOOR - BRUNO MARS", "MAN I NEED - OLIVIA DEAN", "MYSTERY OF LOVE - SUFJAN STEVENS", "AMAZING - REX ORANGE COUNTY"] },
];

const gridEl = document.getElementById("nytGrid");
const solvedEl = document.getElementById("nytSolved");
const msgEl = document.getElementById("nytMsg");
const dotsEl = document.getElementById("nytDots");

const btnShuffle = document.getElementById("nytShuffle");
const btnDeselect = document.getElementById("nytDeselect");
const btnSubmit = document.getElementById("nytSubmit");

let tiles = [];
let selected = new Set();
let solved = new Set();
let locked = new Set();

let mistakesUsed = 0;
const MAX_MISTAKES = 4;

function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function flatten(){
  const all = [];
  for (const g of GROUPS) for (const w of g.items) all.push(w);
  return all;
}
function escapeHtml(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderDots(){
  dotsEl.innerHTML = "";
  for (let i=0;i<MAX_MISTAKES;i++){
    const d = document.createElement("span");
    d.className = "dot" + (i < mistakesUsed ? " used" : "");
    dotsEl.appendChild(d);
  }
}

function renderSolved(){
  solvedEl.innerHTML = "";
  for (const g of GROUPS){
    if (!solved.has(g.name)) continue;

    const row = document.createElement("div");
    row.className = `solved-row ${g.color}`;
    row.innerHTML = `
      <div class="solved-name">${escapeHtml(g.name)}</div>
      <div class="solved-items">${g.items.map(escapeHtml).join(" · ")}</div>
    `;
    solvedEl.appendChild(row);
  }
}

function renderGrid(){
  gridEl.innerHTML = "";

  for (const w of tiles){
    if (locked.has(w)) continue;

    const tile = document.createElement("div");
    tile.className = "tile";
    tile.textContent = w;

    if (selected.has(w)) tile.classList.add("selected");

    tile.addEventListener("click", () => {
      if (selected.has(w)) selected.delete(w);
      else {
        if (selected.size >= 4) return;
        selected.add(w);
      }
      msgEl.textContent = "";
      renderGrid();
    });

    gridEl.appendChild(tile);
  }
}

function selectionMatchGroup(selArr){
  const sel = new Set(selArr);
  for (const g of GROUPS){
    if (solved.has(g.name)) continue;
    let c = 0;
    for (const w of sel) if (g.items.includes(w)) c++;
    if (c === 4) return g;
  }
  return null;
}

function oneAway(selArr){
  const sel = new Set(selArr);
  for (const g of GROUPS){
    if (solved.has(g.name)) continue;
    let c = 0;
    for (const w of sel) if (g.items.includes(w)) c++;
    if (c === 3) return true;
  }
  return false;
}

function lockGroup(g){
  solved.add(g.name);
  for (const w of g.items) locked.add(w);
  tiles = tiles.filter(x => !locked.has(x));
}

function shakeGrid(){
  gridEl.classList.remove("shake");
  void gridEl.offsetWidth;
  gridEl.classList.add("shake");
  setTimeout(()=> gridEl.classList.remove("shake"), 500);
}

function reset(){
  tiles = shuffle(flatten());
  selected.clear();
  solved.clear();
  locked.clear();
  mistakesUsed = 0;
  msgEl.textContent = "";
  btnSubmit.disabled = false;
  btnShuffle.disabled = false;
  btnDeselect.disabled = false;

  renderDots();
  renderSolved();
  renderGrid();
}

btnShuffle.addEventListener("click", () => {
  tiles = shuffle(tiles);
  msgEl.textContent = "";
  renderGrid();
});

btnDeselect.addEventListener("click", () => {
  selected.clear();
  msgEl.textContent = "";
  renderGrid();
});

btnSubmit.addEventListener("click", () => {
  if (selected.size !== 4){
    msgEl.textContent = "Select 4 tiles.";
    shakeGrid();
    return;
  }

  const selArr = Array.from(selected);
  const g = selectionMatchGroup(selArr);

  if (g){
    lockGroup(g);
    msgEl.textContent = "Nice.";
  } else {
    msgEl.textContent = oneAway(selArr) ? "One away…" : "Nope.";
    mistakesUsed++;
    renderDots();
    shakeGrid();

    if (mistakesUsed >= MAX_MISTAKES){
      msgEl.textContent = "Out of mistakes 😭 (refresh to try again)";
      btnSubmit.disabled = true;
      btnShuffle.disabled = true;
      btnDeselect.disabled = true;
    }
  }

  selected.clear();

  if (solved.size === 4){
    msgEl.textContent = "You did it 🏆";
    btnSubmit.disabled = true;

    // ✅ key 1/3
    localStorage.setItem("key_connections", "true");

    // go back home after a sec so the key counter updates
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 900);
  }

  renderSolved();
  renderGrid();
});

reset();
