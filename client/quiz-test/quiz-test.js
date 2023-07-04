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
const seeCorrectAnswersButton = document.querySelector(
  ".quiz__see-correct-answers-btn"
);
seeCorrectAnswersButton.disabled = true;
const image = document.querySelector(".quiz__image img");
const timer = document.querySelector(".quiz__stat-time #remaining-time");
const quizTitle = document.querySelector(".quiz__title");
const quizQuestion = document.querySelector(".quiz__question-text");
const quizAnswers = document.querySelectorAll(".quiz__answer-btn");
let startTime;
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let wrongAnswersCount = 0;
let failedQuestions = [];
let isFinished;
let wasSeeAnswersButtonClicked = false;
let endTime;
let currentState = JSON.parse(localStorage.getItem("currentState"));

/* If quiz is not finished, a timer is started and the current question is loaded
 */
(async () => {
  await checkIfUserAuthDidNotExpire();

  beginQuiz();

  setInterval(() => {
    if (isFinished === true) {
      return;
    }
    if (
      localStorage.getItem("currentQuiz") == null ||
      localStorage.getItem("currentState") == null
    ) {
      window.location.href = "../quizzes/quiz.html";
    }
    updateTimer();
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

/* Does a PATCH request to set the endTime which will be returned if everything's ok
On success: call setEndScreen() + set isFinished to true
*/
const submitQuiz = async () => {
  const response = await fetch(
    domain + `/users/quizzes?quizId=${currentQuiz._id}`,
    {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({ action: "end" }),
    }
  );
  const data = await response.json();
  if (response.ok) {
    endTime = data.message;
    isFinished = true;
    saveState();
    setEndScreen();
  } else {
    authStatusCodesCheck(response);
    console.log(response);
    alert("Something went wrong");
  }
};

skipButton.addEventListener("click", () => {
  if (currentQuiz.questions.length === 0) {
    submitQuiz();
    return;
  }
  if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    currentQuestionIndex++;
    updateQuizPage();
  } else {
    currentQuestionIndex = 0;
    updateQuizPage();
  }
  if (isFinished === false) saveState(); // in the end screen I don't want to save the state cause currentQuiz will be changed
});

/* This function is called each time the page is loaded or refreshed
 */
async function beginQuiz() {
  if (currentState === null) {
    await sendStartQuizRequest();
    isFinished = false;
  } else {
    // if currentState is not null, it means the quiz is already started
    loadState();
    if (isFinished === true) {
      setEndScreen();
    }
  }
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

/* A request to start  the quiz is sent (to set startTime on the server)
 */
const sendStartQuizRequest = async () => {
  const response = await fetch(
    domain + `/users/quizzes?quizId=${currentQuiz._id}`,
    {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({ action: "start" }),
    }
  );
  const data = await response.json();
  console.log(data);
  if (response.ok) {
    startTime = data.message + 1000 * 60 * 30;
    console.log(startTime);
    saveState();
  } else {
    authStatusCodesCheck(response);
    console.log(response);
    alert("Something went wrong");
  }
};

/*Update the Remaining question, correct answer and wrong answer stats */
function updateStats() {
  unansweredQuestionsText.textContent =
    26 - correctAnswersCount - wrongAnswersCount;
  correctAnswersText.textContent = correctAnswersCount;
  wrongAnswersText.textContent = wrongAnswersCount;
}

/* Loads up the question  and resets buttons pressed earlier 
If the quiz ended the currentQuiz will be changed to the failedQuestions
so that we can display them.
*/
function updateQuizPage() {
  if (isFinished === true)
    currentQuiz = {
      _id: currentQuiz._id,
      questions: JSON.parse(localStorage.getItem("currentState"))
        .failedQuestions,
    };

  loadQuestion(currentQuestionIndex);
  updateStats();
  answers.forEach((answer) => {
    answer.classList.remove("quiz__answer-btn--chosen");
    answer.classList.add("quiz__answer-btn--not-chosen");
  });

  if (isFinished === true && wasSeeAnswersButtonClicked === true) {
    highlightUserSelectedAnswers();
    setCorrectIncorrectAnswers();
  }
}

/* This loads the question, image (if it exists), text, answers
 */
function loadQuestion(index) {
  submitButton.disabled = false;
  quizQuestion.textContent = currentQuiz.questions[index].question;

  if (currentQuiz.questions[index].image_url === "none") {
    image.style.display = "none";
  } else {
    image.style.display = "block";
    image.src = currentQuiz.questions[index].image_url;
  }
  if (isFinished === true && wasSeeAnswersButtonClicked === false) {
    if (correctAnswersCount >= 22)
      quizQuestion.textContent = "Ai promovat chestionarul!";
    else quizQuestion.textContent = "Nu ai promovat chestionarul!";
    image.style.display = "none";
  }
  quizAnswers.forEach((answer, i) => {
    answer.querySelector(".quiz__answer-text").textContent =
      currentQuiz.questions[index].answers[i];
    if (isFinished === true) {
      answer.disabled = true;
    }
  });
}

/* Does a patch request that checks the answer + updates the
total scores + total correct answers ...
If it receives the finished message from the svr, the quiz is then submitted
*/
async function sendCurrentQuestionAnswers(chosenAnswers) {
  submitButton.disabled = true;
  console.log(currentQuiz._id);
  console.log(currentQuiz.questions[currentQuestionIndex]._id);
  const response = await fetch(
    domain +
      `/users/quizzes/questions?quizId=${currentQuiz._id}&questionId=${currentQuiz.questions[currentQuestionIndex]._id}`,
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
      console.log("Quiz finished");
      await submitQuiz();
      return;
    }
    if (data.correct === true) {
      correctAnswersCount++;
    } else {
      addWrongAnswerQuestion(currentQuestionIndex, chosenAnswers);
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

// removes the question from the currentQuiz array so it wont be shown again
function removeQuestion(currentQuestionIndex) {
  currentQuiz.questions.splice(currentQuestionIndex, 1);

  if (currentQuiz.questions.length === 1) {
    skipButton.disabled = true;
    skipButton.style.display = "none";
  }
}

// We load the state so if we refresh the page we can continue the quiz
function loadState() {
  if (currentState !== null) {
    quizTitle.textContent = currentState.currentQuiz.quizTitle;
    startTime = currentState.startTime;
    currentQuestionIndex = currentState.currentQuestionIndex;
    correctAnswersCount = currentState.correctAnswersCount;
    wrongAnswersCount = currentState.wrongAnswersCount;
    currentQuiz = currentState.currentQuiz;
    failedQuestions = currentState.failedQuestions;
    isFinished = currentState.isFinished;
    endTime = currentState.endTime;
  }
}

function saveState() {
  //localStorage.removeItem("currentState");
  //console.log("SAVED");
  currentState = {
    startTime,
    currentQuestionIndex,
    correctAnswersCount,
    wrongAnswersCount,
    currentQuiz,
    failedQuestions,
    isFinished,
    endTime,
  };
  localStorage.setItem("currentState", JSON.stringify(currentState));
}

/* Whhen the quiz is over we show all the details and give the option to see the correct answers
 */
function setEndScreen() {
  //saveState();
  updateQuizPage();
  updateTimer();
  quizTitle.textContent = "Chestionar completat";
  quizAnswers.forEach((answer) => {
    answer.style.display = "none";
  });
  skipButton.style.display = "none";
  skipButton.disabled = true;
  submitButton.style.display = "none";
  submitButton.disabled = true;

  if (correctAnswersCount != 26) {
    seeCorrectAnswersButton.style.display = "block";
    seeCorrectAnswersButton.disabled = false;
  }
}

// When the user fails to guess the correct answer we add it to a list
// so that we can display the wrong answers in the end
function addWrongAnswerQuestion(questionIndex, chosenAnswers) {
  if (failedQuestions === undefined) failedQuestions = [];
  failedQuestions.push({
    _id: currentQuiz.questions[questionIndex]._id,
    question: currentQuiz.questions[questionIndex].question,
    image_url: currentQuiz.questions[questionIndex].image_url,
    chosenAnswers,
    answers: currentQuiz.questions[questionIndex].answers,
  });
}

function updateTimer() {
  let now, time;
  if (isFinished) now = endTime;
  else now = new Date().getTime();
  time = startTime - now;
  let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((time % (1000 * 60)) / 1000);
  timer.textContent = `${minutes}:${seconds > 9 ? seconds : "0" + seconds}`;

  if (time < 0) {
    timer.textContent = "0:00";
    if (!isFinished) submitQuiz();
  }
}

/*This tries to GET the quizz from the server with the correct/incorrect answers so they can be checked in the end */
seeCorrectAnswersButton.addEventListener("click", async () => {
  const response = await fetch(
    domain + `/quizzes?quizId=${currentQuiz._id}&answersFormat=separateLists`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  const data = await response.json();
  console.log(data);
  if (response.ok) {
    currentQuiz = data; // <- will be replaced with the correct/wrong answers quizz and saved in the local storage
    wasSeeAnswersButtonClicked = true;
    skipButton.style.display = "block";
    skipButton.disabled = false;
    seeCorrectAnswersButton.style.display = "none";
    seeCorrectAnswersButton.disabled = true;
    image.display = "block";
    saveState();
    quizAnswers.forEach((answer) => {
      answer.style.display = "block";
    });
    updateQuizPage();
  } else {
    authStatusCodesCheck(response);
    console.log(response);
    alert("Something went wrong");
  }
});

// Highlights the answers that user gave for the current question
function highlightUserSelectedAnswers() {
  const userAnswers = currentQuiz.questions[currentQuestionIndex].chosenAnswers;
  answers.forEach((answer) => {
    if (
      userAnswers.includes(
        answer.querySelector(".quiz__answer-text").textContent
      )
    ) {
      answer.classList.remove("quiz__answer-btn--not-chosen");
      answer.classList.add("quiz__answer-btn--chosen");
    }
  });
}
/* Adds the correct/incorrect answers to the quiz page when user clicks the see correct answers button
 */
function setCorrectIncorrectAnswers() {
  let questions = JSON.parse(localStorage.getItem("currentState")).currentQuiz
    .questions;
  let currentQuestionId = currentQuiz.questions[currentQuestionIndex]._id;
  let correctAnswers = questions.find((question) => {
    return question._id === currentQuestionId;
  }).correctQ;

  answers.forEach((answer) => {
    if (
      correctAnswers.includes(
        answer.querySelector(".quiz__answer-text").textContent
      )
    ) {
      answer.querySelector(".quiz__answer-corectness").textContent = "✔️";
    } else {
      answer.querySelector(".quiz__answer-corectness").textContent = "❌";
    }
  });
}
