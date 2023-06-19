const user = JSON.parse(localStorage.getItem("user"));
const username = document.querySelector(".profile__name");
let topButtons = document.querySelectorAll(".leaderboard__button");
let tableRows = document.querySelectorAll("tbody tr");

window.addEventListener("scroll", changeNavBarColor);
(async () => {
  let response = await checkIfUserAuthDidNotExpire();
  //await updateUserData(localStorage.getItem("user").id);
  topButtons[0].dispatchEvent(new Event("click"));
  username.textContent = user.username;
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
      `http://localhost:8081/users/${button.getAttribute("id")}`,
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
};

setStats();

// delete method , just gotta change the .card__link to an actual logout button
//
// const card_links = document.querySelector(".card__link");
// card_links.addEventListener("click", async (e) => {
//   e.preventDefault();
//   const response = await fetch("http://localhost:8081/logout", {
//     method: "POST",
//     credentials: "include",
//   });
//   const data = await response.json();
//   if (response.ok) {
//     localStorage.removeItem("user");
//     window.location.href = "../login-page/login.html";
//   }
// });
