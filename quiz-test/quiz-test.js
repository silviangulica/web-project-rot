let currentQuiz = JSON.parse(localStorage.getItem("currentQuiz"));
const unansweredQuestionsText = document.querySelector(
  ".quiz__stat-remaining #remaining-questions"
);
const correctAnswersText = document.querySelector(
  ".quiz__stat-correct #correct-answers"
);
const wrongAnswersText = document.querySelector(
  ".quiz__stat-wrong #wrong-answers"
);
const answers = document.querySelectorAll(".quiz__answers .quiz__answer-btn");
const skipButton = document.querySelector(".quiz__skip-btn");
const submitButton = document.querySelector(".quiz__submit-btn");
const image = document.querySelector(".quiz__image img");
const timer = document.querySelector(".quiz__stat-time #remaining-time");
const quizTitle = document.querySelector(".quiz__title");
const quizQuestion = document.querySelector(".quiz__question-text");
const quizAnswers = document.querySelectorAll(".quiz__answer-btn");
let countDownDate;
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let wrongAnswersCount = 0;
const currentState = JSON.parse(localStorage.getItem("currentState"));
(async () => {
  await checkIfUserAuthDidNotExpire();
  if (currentQuiz == null) {
    window.location.href = "../quizzes/quiz.html";
  }
  if (currentState === null) beginQuiz();

  setInterval(() => {
    let now = new Date().getTime();
    let time = countDownDate - now;
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((time % (1000 * 60)) / 1000);
    timer.textContent = `${minutes}:${seconds > 9 ? seconds : "0" + seconds}`;

    if (time < 0) {
      timer.textContent = "0:00";
      submitQuiz();
    }
  }, 1000);
})();

function changeNavBarColor() {
  const navbar = document.querySelector(".nav");

  if (window.scrollY >= 25) {
    navbar.classList.add("nav--scrolled");
  } else {
    navbar.classList.remove("nav--scrolled");
  }
}

window.addEventListener("scroll", changeNavBarColor);

answers.forEach((answer) => {
  answer.addEventListener("click", (e) => {
    if (e.currentTarget.classList.contains("quiz__answer-btn--not-chosen")) {
      e.currentTarget.classList.remove("quiz__answer-btn--not-chosen");
      e.currentTarget.classList.add("quiz__answer-btn--chosen");
    } else if (e.currentTarget.classList.contains("quiz__answer-btn--chosen")) {
      e.currentTarget.classList.remove("quiz__answer-btn--chosen");
      e.currentTarget.classList.add("quiz__answer-btn--not-chosen");
    }
  });
});

skipButton.addEventListener("click", () => {
  if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    currentQuestionIndex++;
    updateQuizPage();
  } else if (currentQuiz.questions.length >= 1) {
    currentQuestionIndex = 0;
    updateQuizPage();
  } else {
    skipButton.disabled = true;
  }
});
async function beginQuiz() {
  await sendStartQuizRequest();
  updateQuizPage();
}

const submitQuiz = async () => {
  console.log("OK");
};

submitButton.addEventListener("click", async () => {
  let chosenAnswers = [];
  answers.forEach((answer) => {
    if (answer.classList.contains("quiz__answer-btn--chosen")) {
      chosenAnswers.push(
        answer.querySelector(".quiz__answer-text").textContent
      );
    }
  });

  await sendCurrentQuestionAnswers(chosenAnswers);
  if (chosenAnswers.length === 0) return;
  skipButton.dispatchEvent(new Event("click"));
});

const sendStartQuizRequest = async () => {
  const response = await fetch(
    `http://localhost:8081/quiz/start?quizId=${currentQuiz._id}`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  const data = await response.json();
  console.log(data);
  if (response.ok) {
    countDownDate = data.message + 1000 * 60 * 30;
    console.log(countDownDate);
  } else {
    authStatusCodesCheck(response);
    console.log(response);
    alert("Something went wrong");
  }
};

function updateQuizPage() {
  unansweredQuestionsText.textContent = currentQuiz.questions.length;
  correctAnswersText.textContent = correctAnswersCount;
  wrongAnswersText.textContent = wrongAnswersCount;
  loadQuestion(currentQuestionIndex);
  answers.forEach((answer) => {
    answer.classList.remove("quiz__answer-btn--chosen");
    answer.classList.add("quiz__answer-btn--not-chosen");
  });
}

function loadQuestion(index) {
  quizTitle.textContent = "Întrebarea " + (index + 1);
  quizQuestion.textContent = currentQuiz.questions[index].question;
  console.log(currentQuiz.questions[index]);
  if (currentQuiz.questions[index].image_url === "none") {
    image.style.display = "none";
  } else {
    image.style.display = "block";
    image.src = currentQuiz.questions[index].image_url;
  }
  quizAnswers.forEach((answer, i) => {
    answer.querySelector(".quiz__answer-text").textContent =
      currentQuiz.questions[index].answers[i];
  });
}

async function sendCurrentQuestionAnswers(chosenAnswers) {
  console.log(currentQuiz.questions[currentQuestionIndex]._id);
  const response = await fetch(
    `http://localhost:8081/quiz/answer?quizId=${currentQuiz._id}&questionId=${currentQuiz.questions[currentQuestionIndex]._id}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chosenAnswers),
    }
  );
  const data = await response.json();
  console.log(data);

  if (response.ok) {
    if (data.correct === true) {
      correctAnswersCount++;
    } else {
      wrongAnswersCount++;
    }
    removeQuestion(currentQuestionIndex);
  } else {
    authStatusCodesCheck(response);
    console.log(response);
    alert("Something went wrong");
  }
}

function removeQuestion(currentQuestionIndex) {
  currentQuiz.questions.splice(currentQuestionIndex, 1);
}
