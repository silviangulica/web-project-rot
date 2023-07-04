const form = document.querySelector(".form");
const nameInput = document.getElementById("name");
const email = document.getElementById("email");
const message = document.getElementById("message");
const phone = document.getElementById("phone");
const subject = document.getElementById("subject");

const btn = document.querySelector(".form__button--submit");

btn.addEventListener("click", (e) => {
  e.preventDefault();

  if (checkInputs()) {
    return;
  }

  msg =
    `Nume: ${nameInput.value}<br>Problema raportata: <br>` +
    message.value +
    `<br>Numar de telefon: ${phone.value}` +
    `<br>Email: ${email.value}`;
  fetch(domain + "/support", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "",
      message: msg,
      subject: subject.value,
    }),
  })
    .then(async (response) => {
      window.location.reload();

      if (response.ok) {
        alert("Cererea a fost realizată cu succes.");
      } else {
        alert("Cererea nu a putut fi realizată.");
      }
    })
    .catch((error) => {
      window.location.reload();
      alert("Cererea nu a putut fi realizată.");
    });
});

const checkIfEmailisEmpty = () => {
  if (email.value === "") {
    return true;
  }
  return false;
};

const checkIfNameisEmpty = () => {
  if (nameInput.value === "") {
    return true;
  }
  return false;
};

const checkIfMessageisEmpty = () => {
  if (message.value === "") {
    return true;
  }
  return false;
};

const checkInputs = () => {
  let isEmpty = false;
  if (checkIfEmailisEmpty()) {
    email.style.borderColor = "red";
    email.value = "";
    email.placeholder = "Email can't be empty";
    isEmpty = true;
  }
  if (checkIfNameisEmpty()) {
    nameInput.style.borderColor = "red";
    nameInput.value = "";
    nameInput.placeholder = "Name can't be empty";
    isEmpty = true;
  }
  if (checkIfMessageisEmpty()) {
    message.style.borderColor = "red";
    message.value = "";
    message.placeholder = "Message can't be empty";
    isEmpty = true;
  }
  return isEmpty;
};
