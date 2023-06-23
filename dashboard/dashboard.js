let user;
const username = document.querySelector(".profile__name");
let topButtons = document.querySelectorAll(".leaderboard__button");
let tableRows = document.querySelectorAll("tbody tr");
const card = document.querySelector(".card");
window.addEventListener("scroll", changeNavBarColor);

(async () => {
  removeCurrentState();
  await updateUserData(JSON.parse(localStorage.getItem("user")));
  user = JSON.parse(localStorage.getItem("user"));
  topButtons[0].dispatchEvent(new Event("click"));
  username.textContent = user.username;
  setStats();
})();

function changeNavBarColor() {
  const navbar = document.querySelector(".nav");

  if (window.scrollY >= 25) {
    navbar.classList.add("nav--scrolled");
  } else {
    navbar.classList.remove("nav--scrolled");
  }
}

topButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    if (button.classList.contains("leaderboard__button--selected")) {
      return;
    }
    topButtons.forEach((button) => {
      button.classList.remove("leaderboard__button--selected");
    });
    button.classList.add("leaderboard__button--selected");
    const response = await fetch(
      `http://127.0.0.1:8081/users/${button.getAttribute("id")}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();

    if (response.ok) {
      for (let i = 0; i < tableRows.length; i++) {
        tableRows[i].children[1].textContent = data[i].username;
        tableRows[i].children[2].textContent =
          data[i][button.getAttribute("data-score-type")];
      }
    } else {
      authStatusCodesCheck(response);
    }
  });
});

const setStats = async () => {
  const correctAnswers = document.querySelector(
    ".stats__box-answers .number__text"
  );
  correctAnswers.textContent = user.correctAnswers;

  const wrongAnswers = document.querySelector(
    ".stats__box-wrongs .number__text"
  );
  wrongAnswers.textContent = user.wrongAnswers;

  const totalScore = document.querySelector(".stats__box-points .number__text");
  totalScore.textContent = user.totalScore;

  const quizzesPassed = document.querySelector(
    ".stats__box-quizzes .number__text"
  );
  quizzesPassed.textContent = user.quizzesPassed;

  setLastCompletedQuizScore();
};

// delete method , just gotta change the .card__link to an actual logout button
//
// const card_links = document.querySelector(".card__link");
// card_links.addEventListener("click", async (e) => {
//   e.preventDefault();
//   const response = await fetch("http://127.0.0.1:8081/logout", {
//     method: "GET",
//     credentials: "include",
//   });
//   const data = await response.json();
//   if (response.ok) {
//     localStorage.removeItem("user");
//     window.location.href = "../login-page/login.html";
//   }
// });

function setLastCompletedQuizScore() {
  const lastCompletedQuizCard = document.querySelector(".card");
  console.log(lastCompletedQuizCard);
  let title = "Nu se pot gasi chestionare completate recent";
  let score = "0/26";
  if (JSON.parse(localStorage.getItem("user")).quizList.length > 0) {
    let quizList = JSON.parse(localStorage.getItem("user")).quizList;
    let lastQuizCompleted = null;

    for (let i = 0; i < quizList.length; i++) {
      if (quizList[i].endTime !== undefined) {
        if (lastQuizCompleted === null) {
          lastQuizCompleted = quizList[i];
          title = "Testul " + (i + 1);
          score = `${lastQuizCompleted.score}/26`;
        } else if (
          new Date(quizList[i].endTime).getTime() >
          new Date(lastQuizCompleted.endTime).getTime()
        ) {
          lastQuizCompleted = quizList[i];
          title = "Testul " + (i + 1);
          score = `${lastQuizCompleted.score}/26`;
        }
      }
    }
  }

  lastCompletedQuizCard.querySelector(".card__title").textContent = title;
  lastCompletedQuizCard.querySelector(".card__score").textContent = score;
}

card.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "../quizzes/quiz.html";
});

// Take the settings
const settings = document.querySelector(".settings__btn");

settings.addEventListener("click", async (e) => {
  e.preventDefault();
  window.location.href = "../settings/settings.html";
});
