(async () => {
  await checkIfUserAuthDidNotExpire();
  for (
    let i = 0;
    i < JSON.parse(localStorage.getItem("user")).quizList.length;
    i++
  ) {
    generateQuizCard(JSON.parse(localStorage.getItem("user")).quizList[i], i);
  }
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

const generateRandomQuizButton = document.querySelector(
  ".quizzes .quiz__button--generate"
);

generateRandomQuizButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const response = await fetch(
    `http://localhost:8081/quiz/create?id=${
      JSON.parse(localStorage.getItem("user")).id
    }`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  const data = await response.json();
  console.log(data);
  if (response.ok) {
    generateQuizCard(
      data,
      JSON.parse(localStorage.getItem("user")).quizList.length
    );
    let user = JSON.parse(localStorage.getItem("user"));
    user.quizList.push(data);
    localStorage.removeItem("user");
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    console.log(response);
    alert("Something went wrong");
  }
});

const quizzes = document.querySelector(".quizzes");
const lastQuizCard = document.querySelector(".quiz:last-child");

function generateQuizCard(userQuiz, index) {
  console.log(userQuiz);
  const quizCard = document.createElement("div");
  quizCard.classList.add("quiz");
  quizCard.setAttribute("data-quiz-id", userQuiz.quiz);

  const quizTitle = document.createElement("div");
  quizTitle.classList.add("quiz__title");
  quizTitle.textContent = "Testul " + (index + 1);

  const quizButtons = document.createElement("div");
  quizButtons.classList.add("quiz__buttons");

  const quizScore = document.createElement("div");
  if (userQuiz.score == 0) {
    quizScore.classList.add("quiz__score", "quiz__score--not-completed");
  } else if (userQuiz.score < 22) {
    quizScore.classList.add("quiz__score", "quiz__score--failed");
  } else {
    quizScore.classList.add("quiz__score", "quiz__score--passed");
  }
  quizScore.textContent = `Scorul tău: ${userQuiz.score}/26`;
  const quizStartButton = document.createElement("button");
  quizStartButton.classList.add("quiz__button--start");
  quizStartButton.textContent = "Începe testul";

  quizStartButton.addEventListener("click", beginQuiz);

  const quizDeleteButton = document.createElement("button");
  quizDeleteButton.classList.add("quiz__button--delete");
  quizDeleteButton.textContent = "Șterge testul";

  quizDeleteButton.addEventListener("click", removeQuiz);

  quizButtons.appendChild(quizStartButton);
  quizButtons.appendChild(quizDeleteButton);

  quizCard.appendChild(quizTitle);
  quizCard.appendChild(quizScore);
  quizCard.appendChild(quizButtons);

  quizzes.insertBefore(quizCard, lastQuizCard);
}

async function removeQuiz(e) {
  console.log(e.target.parentElement.parentElement);
  e.target.parentElement.parentElement.getAttribute("data-quiz-id");

  const response = await fetch(
    `http://localhost:8081/quiz?id=${
      JSON.parse(localStorage.getItem("user")).id
    }&quizId=${e.target.parentElement.parentElement.getAttribute(
      "data-quiz-id"
    )}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  const data = await response.json();
  if (response.ok) {
    e.target.parentElement.parentElement.remove();
    let user = JSON.parse(localStorage.getItem("user"));
    console.log(user.quizList);
    console.log(
      e.target.parentElement.parentElement.getAttribute("data-quiz-id")
    );
    // console.log(user.quizList);
    user.quizList = user.quizList.filter((quizEntry) => {
      return (
        quizEntry.quiz !==
        e.target.parentElement.parentElement.getAttribute("data-quiz-id")
      );
    });

    renameQuizzesAfterDelete();
    localStorage.removeItem("user");
    localStorage.setItem("user", JSON.stringify(user));
    console.log(data);
  } else {
    console.log(response);
  }
}

const renameQuizzesAfterDelete = () => {
  let quizList = document.querySelectorAll(".quiz");
  for (let i = 0; i < quizList.length - 1; i++) {
    quizList[i].querySelector(".quiz__title").textContent = `Testul ${i + 1}`;
  }
};

async function beginQuiz(e) {
  localStorage.removeItem("currentQuiz");
  const response = await fetch(
    `http://localhost:8081/quiz?quizId=${e.target.parentElement.parentElement.getAttribute(
      "data-quiz-id"
    )}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem("currentQuiz", JSON.stringify(data));
    window.location.href = "../quiz-test/quiz-test.html";
  } else {
    authStatusCodesCheck(response);
  }
}
