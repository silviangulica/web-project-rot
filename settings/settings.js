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
  description.textContent = "Username trebuie sa fie intre 3 si 20 de caractere";
});

passwordInput.addEventListener("focus", () => {
  description.textContent = "Parola trebuie sa fie intre 6 si 20 de caractere";
});

emailInput.addEventListener("focus", () => {
  description.textContent = "Email-ul trebuie sa fie valid";
});

pictureInput.addEventListener("focus", () => {
  description.textContent = "Poza de profil trebuie sa fie de tip jpg, jpeg sau png. Foloseste un link de la o poza de profil pe care ai introdus-o pe imgur";
});

// Get the button
const saveButton = document.querySelector(".change__button");

// Add action to 
saveButton.addEventListener("click", function () {
  console.log("hello");
});