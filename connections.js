/* --------- hearts background (same as your main page) --------- */
const hearts = document.getElementById('hearts');
if (hearts){
  const COUNT = 22;
  for (let i = 0; i < COUNT; i++){
    const h = document.createElement('div');
    h.className = 'heart';
    h.style.left = Math.random() * 100 + 'vw';
    h.style.bottom = (-10 - Math.random() * 30) + 'vh';
    h.style.animationDuration = (8 + Math.random()*8) + 's';
    h.style.animationDelay = (-Math.random()*10) + 's';
    h.style.opacity = (0.25 + Math.random()*0.6);
    const s = 10 + Math.random()*18;
    h.style.width = s + 'px';
    h.style.height = s + 'px';
    hearts.appendChild(h);
  }
}

/* --------- Connections (NYT-ish) --------- */
/*
  Customize these 4 groups: 4 items each, 16 unique items total.
*/
const GROUPS = [
  { name: "things i love about adnan", color: "solved-yellow", items: ["SKIBIDI", "CARING", "LOYAL", "MOGGER"] },
  { name: "our beloved games",                color: "solved-green",  items: ["MARVEL RIVALS", "PERSONA 5: THE PHANTOM X", "OVERWATCH", "ARKNIGHTS: ENDFIELD"] },
  { name: "places we have gooned passionately",               color: "solved-blue",   items: ["SCRANTON", "WILKES-BARRE", "WOODBRIDGE", "WHITE MARSH"] },
  { name: "songs that remind me of you",  color: "solved-purple", items: ["VERSACE ON THE FLOOR - BRUNO MARS", "MAN I NEED - OLIVIA DEAN", "MYSTERY OF LOVE - SUFJAN STEVENS", "AMAZING - REX ORANGE COUNTY"] },
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
      <div>${escapeHtml(g.name.toUpperCase())}</div>
      <div class="items">${g.items.map(escapeHtml).join(" · ")}</div>
    `;
    solvedEl.appendChild(row);
  }
}

function renderGrid(){
  gridEl.innerHTML = "";

  for (const w of tiles){
    if (locked.has(w)) continue;

    const tile = document.createElement("div");
    tile.className = "nyt-tile";
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
  void gridEl.offsetWidth; // reflow to restart animation
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
  msgEl.textContent = "you solved it… go back 😌💗";

  localStorage.setItem("adnan_connections_unlocked", "true");

  btnSubmit.disabled = true;

  setTimeout(() => {
    window.location.href = "./index.html";
  }, 1400);
}


  renderSolved();
  renderGrid();
});

reset();
