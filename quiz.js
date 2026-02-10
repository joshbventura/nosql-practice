document.addEventListener("DOMContentLoaded", () => {
  const quizBox = document.getElementById("quizBox");
  const msg = document.getElementById("quizMsg");

  const QUESTIONS = [
    {
      q: "what game do we both love the most?",
      choices: ["MARVEL RIVALS", "tetris", "candy crush", "solitaire"],
      answer: "MARVEL RIVALS",
    },
    {
      q: "where was our first meet-up trip?",
      choices: ["SCRANTON", "miami", "tokyo", "london"],
      answer: "SCRANTON",
    },
    {
      q: "what’s my official job?",
      choices: ["love you forever", "ignore you", "tax you", "none"],
      answer: "love you forever",
    },
  ];

  let i = 0;
  let score = 0;

  function render(){
    const cur = QUESTIONS[i];
    quizBox.innerHTML = `
      <h3>Q${i+1}. ${cur.q}</h3>
      <div class="choices">
        ${cur.choices.map(c => `<button class="btn ghost choice" type="button" data-choice="${c}">${c}</button>`).join("")}
      </div>
    `;

    quizBox.querySelectorAll("[data-choice]").forEach(btn => {
      btn.addEventListener("click", () => pick(btn.dataset.choice));
    });

    msg.textContent = "";
  }

  function pick(choice){
    const cur = QUESTIONS[i];
    if (choice === cur.answer) score++;

    i++;
    if (i >= QUESTIONS.length){
      if (score === QUESTIONS.length){
        msg.textContent = "PERFECT 🔑 key earned! returning you…";
        localStorage.setItem("key_quiz", "true");
        setTimeout(() => window.location.href="./index.html", 1400);
      } else {
        msg.textContent = `you got ${score}/${QUESTIONS.length} 😭 try again`;
        i = 0; score = 0;
        setTimeout(render, 900);
      }
      return;
    }
    render();
  }

  render();
});
