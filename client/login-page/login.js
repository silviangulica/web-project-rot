// If user is already logged in, redirect to dashboard
(async () => {
  await checkIfUserAuthDidNotExpire();
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
/* Used to check the user's credentials and log them in
or display the input form errors if pass doesn't exist /email is invalid 
 */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.querySelector('.login-panel__input[name="username"]');
  const password = document.querySelector(
    '.login-panel__input[name="password"]'
  );
  email.style.borderColor = "transparent";
  password.style.borderColor = "transparent";
  const response = await fetch(domain + "/login", {
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

/* Used to register a new user and display the appropriate input form errors
if something is wrong with the input data
 */
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
  const response = await fetch(domain + "/register", {
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

const recoveryButton = document.querySelector(".login-panel__forgor-password");

/*Implements a recovery system for password by using SweetAlert2
1) When the button is pressed, a popup appears asking for the user's email
2) If the email is found in the database, a code is sent to the user's email
3) The user is asked to input the code received in the email ( the code expires in a while)
4) If the code is correct, the user is asked to input a new password
 */
recoveryButton.addEventListener("click", async (e) => {
  Swal.fire({
    title: "Recuperare parola",
    text: "Introduceti o adresa de email",
    input: "text",
    showCancelButton: true,
    confirmButtonText: "Submit",
    cancelButtonText: "Cancel",
    showLoaderOnConfirm: true,
    preConfirm: async (inputValue) => {
      let response = await fetch(domain + "/recovery", {
        method: "POST",
        body: JSON.stringify({
          email: inputValue,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await response.json();
      if (response.ok) {
        return data;
      } else if (response.status === 404) {
        return Swal.showValidationMessage(`Emailul nu a fost gasit!`);
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Succes!",
        text: "Un email a fost trimis! Verificati-va emailul! Introducti codul primit pentru a va reseta parola!",
        icon: "success",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        showLoaderOnConfirm: true,
        preConfirm: async (inputValue) => {
          let response = await fetch(domain + "/checkCode", {
            method: "POST",
            body: JSON.stringify({
              code: inputValue,
              email: result.value.email,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          let data = await response.json();
          console.log(response);
          if (response.ok) {
            return data;
          } else if (response.status === 404) {
            return Swal.showValidationMessage(
              `Codul este invalid sau a expirat!`
            );
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Succes!",
            text: "Introduceti noua parola!",
            icon: "success",
            input: "password",
            showCancelButton: true,
            confirmButtonText: "Submit",
            cancelButtonText: "Cancel",
            showLoaderOnConfirm: true,
            preConfirm: async (inputValue) => {
              let response = await fetch(domain + "/changePassword", {
                method: "POST",
                body: JSON.stringify({
                  password: inputValue,
                  email: result.value.email,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              });

              let data = await response.json();
              if (response.ok) {
                return data;
              } else {
                return Swal.showValidationMessage(
                  `Parola nu a putut fi schimbata!`
                );
              }
            },
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Succes!",
                text: "Parola a fost schimbata cu succes!",
                icon: "success",
                showCancelButton: false,
                confirmButtonText: "Ok",
                cancelButtonText: "Cancel",
              });
            }
          });
        }
      });
    }
  });
});
