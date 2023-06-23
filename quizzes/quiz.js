const quizzes = document.querySelector(".quizzes");
const lastQuizCard = document.querySelector(".quiz:last-child");
const generateRandomQuizButton = document.querySelector(
  ".quizzes .quiz__button--generate"
);

// Remove current state from local storage if it exists
removeCurrentState();

/* On page load, check if user JWT token is still valid and if it is,
    generate quiz cards for each quiz in the user's quiz list, otherwise log user out
*/
(async () => {
  await updateUserData();
  for (
    let i = 0;
    i < JSON.parse(localStorage.getItem("user")).quizList.length;
    i++
  ) {
    generateQuizCard(JSON.parse(localStorage.getItem("user")).quizList[i], i);
  }
})();

// Used to change the navbar style when user scrolls down
function changeNavBarColor() {
  const navbar = document.querySelector(".nav");

  if (window.scrollY >= 25) {
    navbar.classList.add("nav--scrolled");
  } else {
    navbar.classList.remove("nav--scrolled");
  }
}

window.addEventListener("scroll", changeNavBarColor);

/**  On btn click, a post request is sent to the server
to generate a random Quiz for this particular user. 
The response is the UserQuiz obj which is added to the user's quiz list in local storage
*/
generateRandomQuizButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const response = await fetch(`http://127.0.0.1:8081/quizzes`, {
    method: "POST",
    credentials: "include",
  });
  const data = await response.json();
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
    authStatusCodesCheck(response);
    console.log(response);
    alert("Something went wrong");
  }
});

/* Generates a quiz card for an user quiz and appends it to the DOM
 */
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

/* Sends a delete request to the server to delete the quiz from the user's quiz list
  and removes the quiz card from the DOM and localStorage.
 */
async function removeQuiz(e) {
  e.target.parentElement.parentElement.getAttribute("data-quiz-id");

  const response = await fetch(
    `http://127.0.0.1:8081/quizzes?quizId=${e.target.parentElement.parentElement.getAttribute(
      "data-quiz-id"
    )}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  const data = await response.json();
  if (response.ok) {
    let user = JSON.parse(localStorage.getItem("user"));
    user.quizList = user.quizList.filter((quizEntry) => {
      return (
        quizEntry.quiz !==
        e.target.parentElement.parentElement.getAttribute("data-quiz-id")
      );
    });
    e.target.parentElement.parentElement.remove();
    renameQuizzesAfterDelete();
    localStorage.removeItem("user");
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    authStatusCodesCheck(response);
    console.log(response);
  }
}

const renameQuizzesAfterDelete = () => {
  let quizList = document.querySelectorAll(".quiz");
  for (let i = 0; i < quizList.length - 1; i++) {
    quizList[i].querySelector(".quiz__title").textContent = `Testul ${i + 1}`;
  }
};

/* Sends a get request to the server to get the quiz data and stores it in local storage.
 User is redirected to the quiz test page.
 */
async function beginQuiz(e) {
  localStorage.removeItem("currentQuiz");
  const response = await fetch(
    `http://127.0.0.1:8081/quizzes?quizId=${e.target.parentElement.parentElement.getAttribute(
      "data-quiz-id"
    )}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  let data = await response.json();
  if (response.ok) {
    data.quizTitle =
      e.target.parentElement.parentElement.querySelector(
        ".quiz__title"
      ).textContent;
    localStorage.setItem("currentQuiz", JSON.stringify(data));
    window.location.href = "../quiz-test/quiz-test.html";
  } else {
    authStatusCodesCheck(response);
  }
}
