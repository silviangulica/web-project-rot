(async () => {
  await checkIfUserAuthDidNotExpire();
})();

// Nav section
function changeNavBarColor() {
  const navbar = document.querySelector(".nav");

  if (window.scrollY >= 25) {
    navbar.classList.add("nav--scrolled");
  } else {
    navbar.classList.remove("nav--scrolled");
  }
}

window.addEventListener("scroll", changeNavBarColor);
// ---

// Get all documents
const btn_user = document.querySelector(".buton__management-user");
const btn_resurse = document.querySelector(".buton__management-resurse");
const btn_delete_users = document.querySelector(".buton__sterge-user");
const btn_change_user = document.querySelector(".buton__change-user");
const buton__go_back = document.querySelector(".buton__go-back");
const btn_delete_resursa = document.querySelector(".buton__sterge-resursa");
const btn_add_resursa = document.querySelector(".buton__add-resursa");

// !: Lista useri v-a fi trata ca si lista de resurse
const lista__useri = document.querySelector(".lista__useri");

// Global variables
let domain = "http://127.0.0.1:8081";

// MAIN
(() => {
  showButtons();
  hideUserSection();
  hideResurseSection();
})();

// Event sections
btn_user.addEventListener("click", manageUserSection);
btn_resurse.addEventListener("click", manageResurseSection);
btn_delete_users.addEventListener("click", deleteSelectedUsers);
btn_change_user.addEventListener("click", changeSelectedUser);
buton__go_back.addEventListener("click", () => {
  window.location.href = "/admin/admin.html";
});
btn_add_resursa.addEventListener("click", addNewLesson);

// Event functions
function manageUserSection() {
  hideButtons();
  displayUserSection();
}

function manageResurseSection() {
  hideButtons();
  displayResurseSection();
}

function makeItemSelected(element) {
  if (element.classList.contains("lista__useri-item--selected")) {
    element.classList.remove("lista__useri-item--selected");
  } else {
    element.classList.add("lista__useri-item--selected");
  }
}

async function deleteSelectedUsers() {
  let decision = false;

  await Swal.fire({
    title: "Esti sigur?",
    text: "Nu vei putea repara ce ai stricat!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sterge!",
  }).then((result) => {
    if (result.isConfirmed) {
      decision = true;
    }
  });

  // Take a result that will represent if the users were deleted or not
  // If the last user was deleted successfully, then the result will be true
  let result = false;
  if (decision) {
    let selectedUsers = document.querySelectorAll(
      ".lista__useri-item--selected"
    );

    for (let user of selectedUsers) {
      let id = user.getAttribute("id");
      let deletionResult = await deleteUser(id);
      if (deletionResult) {
        user.remove();
        result = true;
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ceva nu a mers bine!",
        });
        return;
      }
    }
    console.log(result);
    if (result) {
      Swal.fire("Sterse!", "Utilizatorii au fost stersi.", "success");
    }
  }
}

async function changeSelectedUser() {
  let selectedUsers = document.querySelectorAll(".lista__useri-item--selected");

  if (selectedUsers.length > 1) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Poti sterge doar un utilizator!",
    });
    return;
  }

  // Daca este doar un user selectat, atunci il stergem
  let response = false;
  Swal.fire({
    title: "Introdu un nou email",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Modifica",
    showLoaderOnConfirm: true,
    preConfirm: async (login) => {
      let id = selectedUsers[0].getAttribute("id");
      response = await modifyUser(id, login);
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      if (response) {
        Swal.fire({
          icon: "success",
          title: "Succes!",
          text: "Utilizatorul a fost modificat!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ceva nu a mers bine!",
        });
      }
    }
  });
}

async function addNewLesson() {
  let canContinue = false;
  let newLesson = {};

  // Introduce the title
  await Swal.fire({
    title: "Introduceti titlul lectiei",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Continua",
    showLoaderOnConfirm: true,
    preConfirm: (inputValue) => {
      newLesson.title = inputValue;
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      canContinue = true;
    }
  });

  if (!canContinue) {
    return;
  }
  canContinue = false;

  // Introduce tipul lectiei
  await Swal.fire({
    title: "Introduceti tipul lectiei",
    text: "Ex: avertizare, obligare etc. [! Este important sa fie una din cele deja prestabilite !]",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Continua",
    showLoaderOnConfirm: true,
    preConfirm: (inputValue) => {
      newLesson.type = inputValue;
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      canContinue = true;
    }
  });

  if (!canContinue) {
    return;
  }
  canContinue = false;

  // Introduce textul lectiei
  await Swal.fire({
    title: "Introduceti textul lectiei",
    text: "A se prefara cod HTML",
    input: "textarea",
    inputLabel: "Textul lectiei",
    inputPlaceholder: "Textul lectiei ...",
    inputAttributes: {
      "aria-label": "Introduce textul lectiei",
    },
    showCancelButton: true,
    confirmButtonText: "Continua",
    showLoaderOnConfirm: true,
    preConfirm: (inputValue) => {
      newLesson.description = inputValue;
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      canContinue = true;
    }
  });

  if (!canContinue) {
    return;
  }
  canContinue = false;

  // Introduce url-imagine lectiei
  await Swal.fire({
    title: "Introduceti url-ul imaginii lectiei",
    text: "Alegeti un url de pe internet, sau incarcati prin imgur. Daca nu doriti o poza, scrieti simplu \"none\".",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Continua",
    showLoaderOnConfirm: true,
    preConfirm: (inputValue) => {
      newLesson.image_url = inputValue;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      canContinue = true;
    }
  });

  response = await sendLesson(newLesson);
  if (response) {
    Swal.fire({
      icon: "success",
      title: "Succes!",
      text: "Lectia a fost adaugata!",
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ceva nu a mers bine!",
    });
  }
}

// Display section functions
async function displayUserSection() {
  lista__useri.classList.remove("hidden");
  btn_delete_users.classList.remove("hidden");
  btn_change_user.classList.remove("hidden");
  buton__go_back.classList.remove("hidden");
  let users = await getUsers();
  displayUsers(users);
}

function displayUsers(users) {
  users.forEach((user) => {
    // Create a new list item
    let li = document.createElement("li");
    li.classList.add("lista__useri-item");
    li.textContent = user.username;
    li.setAttribute("id", user._id);
    li.addEventListener("click", () => {
      makeItemSelected(li);
    });
    lista__useri.appendChild(li);
  });
}

async function displayResurseSection() {
  lista__useri.classList.remove("hidden");
  btn_delete_resursa.classList.remove("hidden");
  btn_add_resursa.classList.remove("hidden");
  buton__go_back.classList.remove("hidden");
  let resurse = await getResurse();
  displayResurse(resurse);
}

function displayResurse(resurse) {
  resurse.forEach((resursa) => {
    // Create a new list item
    let li = document.createElement("li");
    li.classList.add("lista__useri-item");
    li.textContent = resursa.title + " - " + resursa.type;
    li.setAttribute("id", resursa._id);
    li.addEventListener("click", () => {
      makeItemSelected(li);
    });
    lista__useri.appendChild(li);
  });
}

function showButtons() {
  btn_user.classList.remove("hidden");
  btn_resurse.classList.remove("hidden");
}

// Hide Section functions
function hideButtons() {
  btn_user.classList.add("hidden");
  btn_resurse.classList.add("hidden");
}

function hideUserSection() {
  lista__useri.classList.add("hidden");
  btn_delete_users.classList.add("hidden");
  btn_change_user.classList.add("hidden");
  buton__go_back.classList.add("hidden");
}

function hideResurseSection() {
  btn_delete_resursa.classList.add("hidden");
  btn_add_resursa.classList.add("hidden");
}

// Fetch functions
async function getUsers() {
  let response = await fetch(domain + "/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  let data = await response.json();

  if (response.ok) {
    return data;
  } else {
    authStatusCodesCheck(response);
  }
}

async function deleteUser(id) {
  let response = await fetch(domain + "/users?id=" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  let data = await response.json();
  if (response.ok) {
    return true;
  } else if (response.status == 400) {
    if (data.code == "user_is_admin") {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Adminii nu pot fi stersi!",
      });
      return false;
    }
  } else {
    authStatusCodesCheck(response);
  }
  return false;
}

async function modifyUser(id, newEmail) {
  let response = await fetch(domain + "/users/email", {
    method: "PUT",
    body: JSON.stringify({
      userId: id,
      email: newEmail,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  let data = await response.json();
  if (response.ok) {
    return true;
  } else if (response.status == 400) {
    if (data.code == "email_duplicate") {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Email-ul este deja folosit!",
      });
      return false;
    }
  } else {
    authStatusCodesCheck(response);
  }
  return false;
}

async function getResurse() {
  let response = await fetch(domain + "/lessons", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  let data = await response.json();
  console.log(data);
  if (response.ok) {
    return data;
  } else {
    authStatusCodesCheck(response);
  }
}

async function sendLesson(lesson) {
  let response = await fetch(domain + "/lessons", {
    method: "POST",
    body: JSON.stringify({ lesson: lesson }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  let data = await response.json();
  if (response.ok) {
    return true;
  } else {
    authStatusCodesCheck(response);
  }
  return false;
}