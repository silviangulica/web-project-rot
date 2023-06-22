const form = document.querySelector(".form");
const nameInput = document.getElementById("name");
const email = document.getElementById("email");
const message = document.getElementById("message");
const phone = document.getElementById("phone");
const subject = document.getElementById("subject");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  checkInputs();

  msg =
    `Nume: ${nameInput.value}<br>Problema raportata: <br>` +
    message.value +
    `<br>Numar de telefon: ${phone.value}` +
    `<br>Email: ${email.value}`;

  fetch("http://localhost:8081/support", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "",
      message: msg,
      subject: subject.value,
    }),
  });
});

function checkInputs() {
  const nameInputValue = nameInput.value.trim();
  const emailValue = email.value.trim();
  const messageValue = message.value.trim();
  const phoneValue = phone.value.trim();
  const subjectValue = subject.value.trim();

  if (nameInputValue === "") {
    setErrorFor(nameInput, "Name cannot be blank");
  } else {
    setSuccessFor(nameInput);
  }

  if (emailValue === "") {
    setErrorFor(email, "Email cannot be blank");
  } else if (!isEmail(emailValue)) {
    setErrorFor(email, "Email is not valid");
  } else {
    setSuccessFor(email);
  }

  if (messageValue === "") {
    setErrorFor(message, "Message cannot be blank");
  } else {
    setSuccessFor(message);
  }

  if (phoneValue === "") {
    setErrorFor(phone, "Phone cannot be blank");
  } else {
    setSuccessFor(phone);
  }

  if (subjectValue === "") {
    setErrorFor(subject, "Subject cannot be blank");
  } else {
    setSuccessFor(subject);
  }
}

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");

  small.innerText = message;

  formControl.className = "form-control error";
}

function setSuccessFor(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}

function isEmail(email) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}
