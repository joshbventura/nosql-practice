// Floating hearts
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

// Reveal note
const revealBtn = document.getElementById('revealBtn');
const hiddenNote = document.getElementById('hiddenNote');
if (revealBtn && hiddenNote){
  revealBtn.addEventListener('click', () => {
    const showing = hiddenNote.style.display === 'block';
    hiddenNote.style.display = showing ? 'none' : 'block';
    revealBtn.textContent = showing ? 'click for more 💗' : 'ok i’m soft now 🥺';
  });
}

// Confetti
const confettiBtn = document.getElementById('confettiBtn');
if (confettiBtn){
  confettiBtn.addEventListener('click', () => {
    for (let i=0; i<120; i++){
      const p = document.createElement('div');
      p.style.position = 'fixed';
      p.style.left = (Math.random()*100) + 'vw';
      p.style.top = (-10) + 'px';
      p.style.width = (6 + Math.random()*6) + 'px';
      p.style.height = (6 + Math.random()*10) + 'px';
      p.style.background = `rgba(255, ${120 + Math.floor(Math.random()*120)}, ${180 + Math.floor(Math.random()*60)}, 0.9)`;
      p.style.borderRadius = '4px';
      p.style.zIndex = '9999';
      p.style.transform = `rotate(${Math.random()*360}deg)`;
      p.style.transition = 'transform 1.2s linear, top 1.2s linear, opacity 1.2s linear';
      document.body.appendChild(p);

      requestAnimationFrame(() => {
        p.style.top = (window.innerHeight + 40) + 'px';
        p.style.transform = `translateX(${(-80 + Math.random()*160)}px) rotate(${Math.random()*720}deg)`;
        p.style.opacity = '0';
      });

      setTimeout(() => p.remove(), 1300);
    }
  });
}

/* ------------------ CONNECTIONS GAME ------------------ */
/*
  Edit these 4 groups (4 items each). Must be 16 unique total.
*/
const GROUPS = [
  { name: "things that make adnan adnan", items: ["GENTLE", "SMART", "LOYAL", "FUNNY"] },
  { name: "our games", items: ["MARVEL RIVALS", "PERSONA 5", "GENSHIN", "MINECRAFT"] },
  { name: "our places / memories", items: ["SCRANTON", "CHILI'S", "AIRBNB", "MOVIE NIGHT"] },
  { name: "songs that feel like us", items: ["SONG A", "SONG B", "SONG C", "SONG D"] }
];

let tiles = [];
let selected = new Set();
let solvedGroups = [];
let locked = new Set();

const gridEl = document.getElementById("connGrid");
const msgEl = document.getElementById("connMsg");
const solvedEl = document.getElementById("connSolved");

const btnShuffle = document.getElementById("connShuffle");
const btnDeselect = document.getElementById("connDeselect");
const btnSubmit = document.getElementById("connSubmit");

function flattenGroups(){
  const all = [];
  for (const g of GROUPS) for (const it of g.items) all.push(it);
  return all;
}

function shuffle(array){
  for (let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function render(){
  if (!gridEl) return;

  gridEl.innerHTML = "";
  for (const word of tiles){
    const div = document.createElement("div");
    div.className = "tile";
    div.textContent = word;

    if (selected.has(word)) div.classList.add("selected");
    if (locked.has(word)) div.classList.add("locked");

    div.addEventListener("click", () => {
      if (locked.has(word)) return;

      if (selected.has(word)) selected.delete(word);
      else {
        if (selected.size >= 4) return;
        selected.add(word);
      }
      if (msgEl) msgEl.textContent = "";
      render();
    });

    gridEl.appendChild(div);
  }

  if (solvedEl){
    solvedEl.innerHTML = "";
    for (const sg of solvedGroups){
      const card = document.createElement("div");
      card.className = "solved-card";
      card.innerHTML = `
        <div class="solved-title">✅ ${escapeHtml(sg.name)}</div>
        <div class="solved-items">${sg.items.map(escapeHtml).join(" · ")}</div>
      `;
      solvedEl.appendChild(card);
    }
  }
}

function findGroupForSelection(selArr){
  const selSet = new Set(selArr);
  for (let i=0; i<GROUPS.length; i++){
    const g = GROUPS[i];
    let matchCount = 0;
    for (const w of selSet) if (g.items.includes(w)) matchCount++;
    if (matchCount === 4) return i;
  }
  return -1;
}

function oneAway(selArr){
  const selSet = new Set(selArr);
  for (const g of GROUPS){
    if (solvedGroups.some(sg => sg.name === g.name)) continue;
    let c = 0;
    for (const w of selSet) if (g.items.includes(w)) c++;
    if (c === 3) return true;
  }
  return false;
}

function lockGroup(group){
  for (const w of group.items) locked.add(w);
  solvedGroups.push(group);

  // move solved items to end (nice vibe)
  tiles = tiles.filter(w => !locked.has(w)).concat(group.items);
}

function resetGame(){
  tiles = shuffle(flattenGroups());
  selected = new Set();
  solvedGroups = [];
  locked = new Set();
  if (msgEl) msgEl.textContent = "";
  render();
}

if (btnShuffle){
  btnShuffle.addEventListener("click", () => {
    const unlocked = tiles.filter(w => !locked.has(w));
    const lockedOnes = tiles.filter(w => locked.has(w));
    tiles = shuffle(unlocked).concat(lockedOnes);
    if (msgEl) msgEl.textContent = "";
    render();
  });
}

if (btnDeselect){
  btnDeselect.addEventListener("click", () => {
    selected.clear();
    if (msgEl) msgEl.textContent = "";
    render();
  });
}

if (btnSubmit){
  btnSubmit.addEventListener("click", () => {
    if (selected.size !== 4){
      if (msgEl) msgEl.textContent = "pick exactly 4 🫵";
      return;
    }

    const selArr = Array.from(selected);
    const idx = findGroupForSelection(selArr);

    if (idx !== -1){
      const g = GROUPS[idx];
      if (!solvedGroups.some(sg => sg.name === g.name)){
        lockGroup(g);
        if (msgEl) msgEl.textContent = "✅ nailed it.";
      } else {
        if (msgEl) msgEl.textContent = "you already solved that bestie 😭";
      }
    } else if (oneAway(selArr)){
      if (msgEl) msgEl.textContent = "🟨 one away… you’re so close.";
    } else {
      if (msgEl) msgEl.textContent = "❌ nope. but i respect the confidence.";
    }

    selected.clear();

    if (solvedGroups.length === 4){
      if (msgEl) msgEl.textContent = "🏆 YOU WON. ok genius.";
    }

    render();
  });
}

// start
resetGame();

