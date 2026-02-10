document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("memGrid");
  const movesEl = document.getElementById("moves");
  const pairsEl = document.getElementById("pairs");
  const msgEl = document.getElementById("memMsg");
  const resetBtn = document.getElementById("resetMem");

  const photos = [
    "./assets/us1.png",
    "./assets/us2.png",
    "./assets/us3.png",
    "./assets/us4.png",
    "./assets/us5.png",
    "./assets/us6.png",
  ];

  function shuffle(a){
    a = [...a];
    for (let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  let cards = [];
  let flipped = [];
  let locked = false;
  let moves = 0;
  let matchedPairs = 0;

  function updateUI(){
    movesEl.textContent = `Moves: ${moves}`;
    pairsEl.textContent = `Pairs: ${matchedPairs}/${photos.length}`;
  }

  function build(){
    grid.innerHTML = "";
    msgEl.textContent = "";
    moves = 0;
    matchedPairs = 0;
    flipped = [];
    locked = false;

    cards = shuffle(photos.flatMap((src, idx) => ([{src, id: idx},{src, id: idx}])));

    cards.forEach((c) => {
      const el = document.createElement("div");
      el.className = "mcard";
      el.dataset.id = String(c.id);

      el.innerHTML = `
        <div class="front">💗</div>
        <div class="back" style="background-image:url('${c.src}')"></div>
      `;

      el.addEventListener("click", () => onClick(el));
      grid.appendChild(el);
    });

    updateUI();
  }

  function onClick(el){
    if (locked) return;
    if (el.classList.contains("matched")) return;
    if (el.classList.contains("flipped")) return;

    el.classList.add("flipped");
    flipped.push(el);

    if (flipped.length === 2){
      moves++;
      updateUI();
      checkMatch();
    }
  }

  function checkMatch(){
    const [a,b] = flipped;
    const match = a.dataset.id === b.dataset.id;

    if (match){
      a.classList.add("matched");
      b.classList.add("matched");
      flipped = [];
      matchedPairs++;
      updateUI();

      if (matchedPairs === photos.length){
        msgEl.textContent = "KEY FOUND 🔑 returning you…";
        localStorage.setItem("key_memory", "true");
        setTimeout(() => window.location.href = "./index.html", 1400);
      }
      return;
    }

    locked = true;
    setTimeout(() => {
      a.classList.remove("flipped");
      b.classList.remove("flipped");
      flipped = [];
      locked = false;
    }, 650);
  }

  resetBtn?.addEventListener("click", build);
  build();
});
