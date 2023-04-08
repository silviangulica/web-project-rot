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
