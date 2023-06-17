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

const user = JSON.parse(localStorage.getItem("user"));

let username = document.querySelector(".profile__name");

username.textContent = user.username;

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
