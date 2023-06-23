(async () => {
  await checkIfUserAuthDidNotExpire();
})();

// Get inputs
const usernameInput = document.querySelector(".main__username-input");
const passwordInput = document.querySelector(".main__password-input");
const emailInput = document.querySelector(".main__email-input");
const pictureInput = document.querySelector(".main__picture-input");

const description = document.querySelector(".main__input-description");

// Add focus to input
usernameInput.addEventListener("focus", () => {
  description.textContent =
    "Username trebuie sa fie intre 3 si 20 de caractere";
});

passwordInput.addEventListener("focus", () => {
  description.textContent = "Parola trebuie sa fie intre 6 si 20 de caractere";
});

emailInput.addEventListener("focus", () => {
  description.textContent = "Email-ul trebuie sa fie valid";
});

pictureInput.addEventListener("focus", () => {
  description.textContent =
    "Poza de profil trebuie sa fie de tip jpg, jpeg sau png. Foloseste un link de la o poza de profil pe care ai introdus-o pe imgur";
});

// Get the button
const saveButton = document.querySelector(".change__button");

// Add action to
saveButton.addEventListener("click", async function () {
  // Take all the input for inputs
  if (
    checkUsernameInput() &&
    checkPasswordInput() &&
    checkEmailInput() &&
    checkPictureInput()
  ) {
    alert("Una dintre conditii nu este respectata");
    return;
  }

  let userObj = {};
  if (!checkUsernameInput()) {
    userObj.username = usernameInput.value;
  }
  if (!checkPasswordInput()) {
    userObj.password = passwordInput.value;
  }
  if (!checkEmailInput()) {
    userObj.email = emailInput.value;
  }
  if (!checkPictureInput()) {
    userObj.picture = pictureInput.value;
  }

  //saveChanges(userObj);

  Swal.fire({
    title: "Esti sigur?",
    text: "Nu vei putea readuce la loc schimbarile facute!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Salveaza modificarile",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await saveChanges(userObj);
    }
  });
});

const saveChanges = async (userObj) => {
  let response = await fetch("http://127.0.0.1:8081/users", {
    method: "PUT",
    body: JSON.stringify({ userObj }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  let data = await response.json();

  if (response.ok) {
    Swal.fire("Succes!", "Modificarile au fost salvate!", "success");
  } else if (response.status === 400) {
    if (data.code === "username_duplicate") {
      usernameInput.value = "";
      usernameInput.placeholder = "Username already taken";
      usernameInput.style.borderColor = "red";
    } else if (data.code === "email_duplicate") {
      emailInput.value = "";
      emailInput.placeholder = "Email already taken";
      emailInput.style.borderColor = "red";
    }
  } else {
    alert("Something went wrong");
  }
};

// Check if the username is valid
const checkUsernameInput = () => {
  if (usernameInput.value.length < 3) return true;
  if (usernameInput.value.length > 20) return true;
  return false;
};

// Check if the password is valid
const checkPasswordInput = () => {
  if (passwordInput.value.length < 6) return true;
  if (passwordInput.value.length > 20) return true;
  return false;
};

// Check if the email is valid
const checkEmailInput = () => {
  if (emailInput.value.length < 3) return true;
  if (emailInput.value.length > 20) return true;
  return false;
};

// Check if the picture is valid
const checkPictureInput = () => {
  if (pictureInput.value.length < 3) return true;
  if (pictureInput.value.length > 100) return true;
  return false;
};

// Take send button for file uploader
const sendButton = document.querySelector(".uploader");
const fileToUpload = document.querySelector(".fileToUpload");

// Add action to send button
sendButton.addEventListener("click", async function () {
  if (fileToUpload.files.length === 0) {
    alert("No file selected");
    return;
  }

  let formData = new FormData();
  formData.append("fileToUpload", fileToUpload.files[0]);

  let response = await fetch("http://127.0.0.1:8081/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  let data = await response.json();

  if (response.ok) {
    pictureInput.value = data.link;
    pictureInput.placeholder = data.link;
    Swal.fire("Succes!", "Poza de profil a fost schimbata!", "success");
  } else {
    Swal.fire("Error!", "Poza de profil nu a fost schimbata!", "error");
  }
});

