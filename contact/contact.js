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
  })
  .then(async response => {
    window.location.reload();

    if (response.ok) {
      alert("Cererea a fost realizată cu succes.");
    } else {
      alert("Cererea nu a putut fi realizată.");
    }


  })
  .catch(error => {
    window.location.reload();
    alert("Cererea nu a putut fi realizată.");

  });

});

const checkInputs = () => {
  const nameInputValue = nameInput.value.trim();
  const emailValue = email.value.trim();
  const messageValue = message.value.trim();
  const phoneValue = phone.value.trim();
  const subjectValue = subject.value.trim();

  if (nameInputValue === "") {
    setErrorFor(nameInput, "Name cannot be blank");
    return true;
  } else {
    setSuccessFor(nameInput);
  }

  if (emailValue === "") {
    setErrorFor(email, "Email cannot be blank");
    return true;
  } else if (!isEmail(emailValue)) {
    setErrorFor(email, "Email is not valid");
    return true;
  } else {
    setSuccessFor(email);
  }

  if (messageValue === "") {
    setErrorFor(message, "Message cannot be blank");
    return true;
  } else {
    setSuccessFor(message);
  }

  if (phoneValue === "") {
    setErrorFor(phone, "Phone cannot be blank");
    return true;
  } else {
    setSuccessFor(phone);
  }

  if (subjectValue === "") {
    setErrorFor(subject, "Subject cannot be blank");
    return true;
  } else {
    setSuccessFor(subject);
  }

  return false;
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
