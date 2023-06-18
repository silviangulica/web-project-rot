(async () => {
  const response = await checkIfUserAuthDidNotExpire();
  console.log(response);
})();

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
  const email = document.querySelector('.login-panel__input[name="username"]');
  const password = document.querySelector(
    '.login-panel__input[name="password"]'
  );
  email.style.borderColor = "transparent";
  password.style.borderColor = "transparent";
  const response = await fetch("http://localhost:8081/login", {
    method: "POST",
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "../dashboard/dashboard.html";
  } else if (response.status === 401) {
    password.style.borderColor = "red";
    password.value = "";
    password.placeholder = "Invalid password";
  } else if (response.status === 404) {
    email.style.borderColor = "red";
    email.value = "";
    email.placeholder = "Email not found";
  } else {
    alert("Something went wrong");
  }
});

const signupForm = document.querySelector(".sign-up-panel__form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.querySelector(
    `.sign-up-panel__input[name="username"]`
  );
  const email = document.querySelector(`.sign-up-panel__input[name="email"]`);
  const password = document.querySelector(
    `.sign-up-panel__input[name="password"]`
  );
  const passwordConfirmation = document.querySelector(
    `.sign-up-panel__input[name="password confirmation"]`
  );
  username.style.borderColor = "transparent";
  email.style.borderColor = "transparent";
  password.style.borderColor = "transparent";
  passwordConfirmation.style.borderColor = "transparent";
  if (password.value !== passwordConfirmation.value) {
    passwordConfirmation.style.borderColor = "red";
    passwordConfirmation.value = "";
    passwordConfirmation.placeholder = "Passwords do not match";
    return;
  }
  passwordConfirmation.style.borderColor = "transparent";
  const response = await fetch("http://localhost:8081/register", {
    method: "POST",
    body: JSON.stringify({
      username: username.value,
      email: email.value,
      password: password.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (response.ok) {
    window.location.href = "../login-page/login.html";
  } else if (response.status === 400) {
    if (data.code == "username_duplicate") {
      username.style.borderColor = "red";
      username.value = "";
      username.placeholder = "Username already taken";
    } else if (data.code == "email_duplicate") {
      email.style.borderColor = "red";
      email.value = "";
      email.placeholder = "Email already taken";
    } else {
      alert("Something went wrong");
    }
  }
});
