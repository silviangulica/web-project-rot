let countDownDate = new Date().getTime() + 1000 * 60 * 30;

(async () => {
  await checkIfUserAuthDidNotExpire();
  // if (JSON.parse(localStorage.getItem("currentQuiz")) == null) {
  //   window.location.href = "../dashboard/dashboard.html";
  // }
  setInterval(() => {
    const timer = document.querySelector(".quiz__start-timer");
    let now = new Date().getTime();
    let time = countDownDate - now;
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((time % (1000 * 60)) / 1000);
    document.querySelector("#remaining-time").textContent = `${minutes}:${
      seconds > 9 ? seconds : "0" + seconds
    }`;
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

const answers = document.querySelectorAll(".quiz__answers .quiz__answer-btn");
answers.forEach((answer) => {
  answer.addEventListener("click", (btn) => {
    if (btn.target.classList.contains("quiz__answer-btn--not-chosen")) {
      btn.target.classList.remove("quiz__answer-btn--not-chosen");
      btn.target.classList.add("quiz__answer-btn--chosen");
    } else if (btn.target.classList.contains("quiz__answer-btn--chosen")) {
      btn.target.classList.remove("quiz__answer-btn--chosen");
      btn.target.classList.add("quiz__answer-btn--not-chosen");
    }
  });
});
