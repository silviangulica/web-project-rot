const loginPanelFooterAnchor = document.querySelector(
  ".login-panel__footer-anchor"
);
const signupPanelFooterAnchor = document.querySelector(
  ".sign-up-panel__footer-anchor"
);
const panel = document.querySelector(".panel");
const logInPanel = document.querySelector(".login-panel");
loginPanelFooterAnchor.addEventListener("click", () => {
  panel.classList.toggle("panel--flip");
});
signupPanelFooterAnchor.addEventListener("click", () => {
  panel.classList.toggle("panel--flip");
});

const loginForm = document.querySelector(".login-panel__form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.querySelector(
    '.login-panel__input[name="username"]'
  ).value;
  console.log(username);
  const password = document.querySelector(
    '.login-panel__input[name="password"]'
  ).value;
  const response = await fetch("http://localhost:8081/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (response.ok) {
    // document.cookie = `token=${data.token}`;
    localStorage.setItem("user", JSON.stringify(data.user));
    console.log(document.cookie);
    window.location.href = "../dashboard/dashboard.html";
  } else {
    alert(data.message);
  }
});
