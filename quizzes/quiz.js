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
  ".quizzes .quiz:last-child .quiz__button"
);

generateRandomQuizButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const response = await fetch("http://localhost:8081/quiz", {
    method: "POST",
    credentials: "include",
    body: localStorage.getItem("user"),
  });
  const data = await response.json();
  if (response.ok) {
    console.log(data);
  } else {
    alert("Something went wrong");
  }
});
