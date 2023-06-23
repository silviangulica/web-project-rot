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
quizTitle.textContent = currentQuiz.quizTitle;
const quizQuestion = document.querySelector(".quiz__question-text");
const quizAnswers = document.querySelectorAll(".quiz__answer-btn");
let countDownDate;
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let wrongAnswersCount = 0;

let currentState = JSON.parse(localStorage.getItem("currentState"));

(async () => {
  await checkIfUserAuthDidNotExpire();
  if (currentQuiz == null) {
    window.location.href = "../quizzes/quiz.html";
  }
  beginQuiz();
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

const submitQuiz = async () => {
  const response = await fetch(
    `http://127.0.0.1:8081/users/quizzes?quizId=${currentQuiz._id}`,
    {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({ action: "end" }),
    }
  );
  const data = await response.json();
  console.log(data);
  if (response.ok) {
    console.log("Quiz submitted");
    localStorage.removeItem("currentQuiz");
    localStorage.removeItem("currentState");
    window.location.href = "../quizzes/quiz.html";
  } else {
    authStatusCodesCheck(response);
    console.log(response);
    alert("Something went wrong");
  }
};

skipButton.addEventListener("click", () => {
  if (currentQuiz.questions.length === 0) {
    submitQuiz();
  }
  if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    currentQuestionIndex++;
    updateQuizPage();
  } else {
    currentQuestionIndex = 0;
    updateQuizPage();
  }
  saveState();
});
async function beginQuiz() {
  if (currentState === null) await sendStartQuizRequest();
  else loadState();
  updateQuizPage();
}

submitButton.addEventListener("click", async () => {
  let chosenAnswers = [];
  answers.forEach((answer) => {
    if (answer.classList.contains("quiz__answer-btn--chosen")) {
      chosenAnswers.push(
        answer.querySelector(".quiz__answer-text").textContent
      );
    }
  });
  if (chosenAnswers.length === 0) return;
  await sendCurrentQuestionAnswers(chosenAnswers);
  skipButton.dispatchEvent(new Event("click"));
});

const sendStartQuizRequest = async () => {
  const response = await fetch(
    `http://127.0.0.1:8081/users/quizzes?quizId=${currentQuiz._id}`,
    {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({ action: "start" }),
    }
  );
  const data = await response.json();
  console.log(data);
  if (response.ok) {
    countDownDate = data.message + 1000 * 60 * 30;
    console.log(countDownDate);
    saveState();
  } else {
    authStatusCodesCheck(response);
    console.log(response);
    alert("Something went wrong");
  }
};

function updateQuizPage() {
  loadQuestion(currentQuestionIndex);
  unansweredQuestionsText.textContent = currentQuiz.questions.length;
  correctAnswersText.textContent = correctAnswersCount;
  wrongAnswersText.textContent = wrongAnswersCount;

  answers.forEach((answer) => {
    answer.classList.remove("quiz__answer-btn--chosen");
    answer.classList.add("quiz__answer-btn--not-chosen");
  });
}

function loadQuestion(index) {
  submitButton.disabled = false;
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
  submitButton.disabled = true;
  console.log(currentQuiz._id);
  console.log(currentQuiz.questions[currentQuestionIndex]._id);
  const response = await fetch(
    `http://127.0.0.1:8081/users/quizzes/questions?quizId=${currentQuiz._id}&questionId=${currentQuiz.questions[currentQuestionIndex]._id}`,
    {
      method: "PATCH",
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
    if (data.finished === true) {
      submitQuiz();
    }
    if (data.correct === true) {
      correctAnswersCount++;
    } else {
      wrongAnswersCount++;
    }
    removeQuestion(currentQuestionIndex);
    saveState();
  } else {
    authStatusCodesCheck(response);
    console.log(response);
    alert("Something went wrong");
  }
}

function removeQuestion(currentQuestionIndex) {
  currentQuiz.questions.splice(currentQuestionIndex, 1);

  if (currentQuiz.questions.length === 0) {
    skipButton.disabled = true;
    skipButton.style.display = "none";
  }
}

function loadState() {
  if (currentState !== null) {
    countDownDate = currentState.countDownDate;
    currentQuestionIndex = currentState.currentQuestionIndex;
    correctAnswersCount = currentState.correctAnswersCount;
    wrongAnswersCount = currentState.wrongAnswersCount;
    currentQuiz = currentState.currentQuiz;
  }
}

function saveState() {
  localStorage.removeItem("currentState");
  currentState = {
    countDownDate,
    currentQuestionIndex,
    correctAnswersCount,
    wrongAnswersCount,
    currentQuiz,
  };
  localStorage.setItem("currentState", JSON.stringify(currentState));
}
