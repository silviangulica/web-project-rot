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

// Get all documents
const btn_user = document.querySelector(".buton__management-user");
const btn_resources = document.querySelector(".buton__management-resurse");
const btn_delete_users = document.querySelector(".buton__sterge-user");
const btn_change_user = document.querySelector(".buton__change-user");
const buton__go_back = document.querySelector(".buton__go-back");
const btn_delete_resource = document.querySelector(".buton__sterge-resursa");
const btn_add_resource = document.querySelector(".buton__add-resursa");
const lista__useri = document.querySelector(".lista__useri");

(() => {
  showButtons();
  hideUserSection();
  hideResourcesSection();
})();

// Event sections
btn_user.addEventListener("click", manageUserSection);
btn_resources.addEventListener("click", manageResourcesSection);
btn_delete_users.addEventListener("click", deleteSelectedUsers);
btn_change_user.addEventListener("click", changeSelectedUser);
buton__go_back.addEventListener("click", () => {
  window.location.href = "/admin/admin.html";
});
btn_add_resource.addEventListener("click", addNewLesson);
btn_delete_resource.addEventListener("click", deleteSelectedLesson);

// Event functions
function manageUserSection() {
  hideButtons();
  displayUserSection();
}

function manageResourcesSection() {
  hideButtons();
  displayResourcesSection();
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
    text: 'Alegeti un url de pe internet, sau incarcati prin imgur. Daca nu doriti o poza, scrieti simplu "none".',
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

async function deleteSelectedLesson() {
  let lessons_selected = document.querySelectorAll(
    ".lista__useri-item--selected"
  );

  if (lessons_selected.length > 1) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Poti sterge doar o lectie!",
    });
    return;
  }

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

  if (!decision) {
    return;
  }

  let id = lessons_selected[0].getAttribute("id");
  let response = await deleteLesson(id);
  if (response) {
    Swal.fire({
      icon: "success",
      title: "Succes!",
      text: "Lectia a fost stearsa!",
    });
    lessons_selected[0].remove();
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

async function displayResourcesSection() {
  lista__useri.classList.remove("hidden");
  btn_delete_resource.classList.remove("hidden");
  btn_add_resource.classList.remove("hidden");
  buton__go_back.classList.remove("hidden");
  let resources = await getResources();
  displayResources(resources);
}

function displayResources(resources) {
  resources.forEach((resource) => {
    let li = document.createElement("li");
    li.classList.add("lista__useri-item");
    li.textContent = resource.title + " - " + resource.type;
    li.setAttribute("id", resource._id);
    li.addEventListener("click", () => {
      makeItemSelected(li);
    });
    lista__useri.appendChild(li);
  });
}

function showButtons() {
  btn_user.classList.remove("hidden");
  btn_resources.classList.remove("hidden");
}

// Hide Section functions
function hideButtons() {
  btn_user.classList.add("hidden");
  btn_resources.classList.add("hidden");
}

function hideUserSection() {
  lista__useri.classList.add("hidden");
  btn_delete_users.classList.add("hidden");
  btn_change_user.classList.add("hidden");
  buton__go_back.classList.add("hidden");
}

function hideResourcesSection() {
  btn_delete_resource.classList.add("hidden");
  btn_add_resource.classList.add("hidden");
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

async function getResources() {
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

async function deleteLesson(id) {
  let response = await fetch(domain + "/lessons?id=" + id, {
    method: "DELETE",
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
