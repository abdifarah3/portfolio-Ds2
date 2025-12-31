document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quizzForm");
  const buttonsContainer = document.querySelector(".quizz-buttons");

  if (!form || !buttonsContainer) return;

  // Réponses correctes + explications
  const answers = {
    q1: { correct: "c", text: "32" },
    q2: { correct: "c", text: "20 bugs (5 × 4 jours)" },
    q3: { correct: "a", text: "2 secondes (6 ÷ 3)" },
    q4: {
      correct: "b",
      text: "15 (nombres triangulaires : +2, +3, +4, +5...)",
    },
    q5: { correct: "a", text: "Mercredi (14 jours = 2 semaines)" },
    q6: { correct: "c", text: "24 (4 membres × 2 PR × 3 jours)" },
    q7: { correct: "b", text: "4 heures (2 développeurs se partagent les 8h)" },
    q8: { correct: "c", text: "80 (multiplication par 2 à chaque étape)" },
    q9: { correct: "b", text: "20 enregistrements par seconde (120 ÷ 6)" },
    q10: { correct: "c", text: "10000 combinaisons (10⁴ de 0000 à 9999)" },
    q11: { correct: "b", text: "30 ms de réduction (50 − 20)" },
    q12: { correct: "b", text: "15 (suite +3 : 3, 6, 9, 12, 15…)" },
    q13: { correct: "b", text: "6 éléments (5 + 3 − 2)" },
    q14: { correct: "b", text: "24 pages (12 en 30 min ⇒ 24 en 60 min)" },
    q15: { correct: "b", text: "25 (carrés parfaits : 1², 2², 3², 4², 5²…)" },
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstQuestion = form.querySelector(".question");
    if (firstQuestion) {
      firstQuestion.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    let score = 0;
    const total = Object.keys(answers).length;
    let allAnswered = true;
    let firstUnanswered = null;

    // Nettoyer les styles & explications précédentes
    form.querySelectorAll(".options label").forEach((label) => {
      label.classList.remove("answer-correct", "answer-incorrect");
    });
    form.querySelectorAll(".question-feedback").forEach((div) => div.remove());

    // Vérifier si toutes les questions sont répondues
    for (const qName of Object.keys(answers)) {
      const chosen = form.querySelector(`input[name="${qName}"]:checked`);
      if (!chosen) {
        allAnswered = false;
        if (!firstUnanswered) {
          firstUnanswered = form
            .querySelector(`.question input[name="${qName}"]`)
            ?.closest(".question");
        }
      }
    }

    if (!allAnswered) {
      if (firstUnanswered) {
        firstUnanswered.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      alert("Veuillez répondre à toutes les questions avant de soumettre.");
      return;
    }

    // Corriger chaque question et afficher l'explication sous la question
    for (const [qName, data] of Object.entries(answers)) {
      const questionBlock = form
        .querySelector(`.question input[name="${qName}"]`)
        ?.closest(".question");

      const chosen = form.querySelector(`input[name="${qName}"]:checked`);
      const correctInput = form.querySelector(
        `input[name="${qName}"][value="${data.correct}"]`
      );
      const correctLabel = correctInput ? correctInput.closest("label") : null;
      const chosenLabel = chosen ? chosen.closest("label") : null;

      // Cocher la bonne réponse
      if (correctInput) correctInput.checked = true;

      let isCorrect = false;

      if (chosen && chosen.value === data.correct) {
        score++;
        isCorrect = true;
        if (correctLabel) correctLabel.classList.add("answer-correct");
      } else {
        if (chosenLabel) chosenLabel.classList.add("answer-incorrect");
        if (correctLabel) correctLabel.classList.add("answer-correct");
      }

      // Désactiver les options
      if (questionBlock) {
        questionBlock
          .querySelectorAll('input[type="radio"]')
          .forEach((input) => (input.disabled = true));
      }

      // Créer un bloc d'explication sous la question
      if (questionBlock) {
        const feedback = document.createElement("div");
        feedback.className = "question-feedback";

        if (isCorrect) {
          feedback.classList.add("feedback-correct");
          feedback.textContent = `Correct ✔ Réponse : ${data.text}`;
        } else {
          feedback.classList.add("feedback-incorrect");
          feedback.textContent = `Incorrect ✘ Réponse correcte : ${data.text}`;
        }

        questionBlock.appendChild(feedback);
      }
    }

    const percent = Math.round((score / total) * 100);

    // Afficher un petit résumé dans le header du quiz
    const header = document.querySelector(".quizz-header .quizz-description");
    if (header) {
      header.textContent = `Score : ${score}/${total} (${percent} %)`;
    }

    // Cacher les boutons d'origine
    buttonsContainer.style.display = "none";

    // Créer le conteneur pour Refaire / Exit
    const actions = document.createElement("div");
    actions.className = "quizz-buttons";
    actions.innerHTML = `
      <button type="button" class="btn btn-primary" id="retryQuiz">Refaire</button>
      <button type="button" class="btn btn-secondary" id="exitQuiz">Exit</button>
    `;
    form.appendChild(actions);

    // Bouton Refaire
    const retryBtn = actions.querySelector("#retryQuiz");
    retryBtn.addEventListener("click", () => {
      form.reset();
      form
        .querySelectorAll('input[type="radio"]')
        .forEach((input) => (input.disabled = false));
      form.querySelectorAll(".options label").forEach((label) => {
        label.classList.remove("answer-correct", "answer-incorrect");
      });
      form.querySelectorAll(".question-feedback").forEach((div) => div.remove());

      // Remettre le texte d'introduction
      if (header) {
        header.textContent =
          "Répondez à ces questions de logique pour tester votre raisonnement. Vous verrez votre score et l'explication sous chaque question.";
      }

      actions.remove();
      buttonsContainer.style.display = "flex";
    });

    // Bouton Exit -> Accueil
    const exitBtn = actions.querySelector("#exitQuiz");
    exitBtn.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  });
});
