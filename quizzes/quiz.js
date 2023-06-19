(async () => {
  const response = await checkIfUserAuthDidNotExpire();

  console.log(response);
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
    `http://localhost:8081/quiz?id=${
      JSON.parse(localStorage.getItem("user")).id
    }`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  const data = await response.json();
  if (response.ok) {
    generateQuizCard(data);
    let user = JSON.parse(localStorage.getItem("user"));
    user.quizList.push({
      quiz: data,
      score: 0,
    });
    localStorage.removeItem("user");
    localStorage.setItem("user", JSON.stringify(user));
    console.log(data);
  } else {
    console.log(data);
    alert("Something went wrong");
  }
});

const quizzes = document.querySelector(".quizzes");
const lastQuizCard = document.querySelector(".quiz:last-child");
function generateQuizCard(quiz) {
  const quizCard = document.createElement("div");
  quizCard.classList.add("quiz");

  const quizTitle = document.createElement("div");
  quizTitle.classList.add("quiz__title");
  quizTitle.textContent =
    "Testul " + (JSON.parse(localStorage.getItem("user")).quizList.length + 1);

  const quizButtons = document.createElement("div");
  quizButtons.classList.add("quiz__buttons");

  const quizScore = document.createElement("div");
  quizScore.classList.add("quiz__score", "quiz__score--not-completed");
  quizScore.textContent = "Scorul tău: 0/26";
  const quizStartButton = document.createElement("button");
  quizStartButton.classList.add("quiz__button--start");
  quizStartButton.textContent = "Începe testul";

  const quizDeleteButton = document.createElement("button");
  quizDeleteButton.classList.add("quiz__button--delete");
  quizDeleteButton.textContent = "Șterge testul";

  quizButtons.appendChild(quizStartButton);
  quizButtons.appendChild(quizDeleteButton);

  quizCard.appendChild(quizTitle);
  quizCard.appendChild(quizScore);
  quizCard.appendChild(quizButtons);

  quizzes.insertBefore(quizCard, lastQuizCard);
}
