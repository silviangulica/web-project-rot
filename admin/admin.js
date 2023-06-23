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

const lista__useri = document.querySelector(".lista__useri");

// Global variables
let domain = "http://127.0.0.1:8081";

(() => {
  showButtons();
  hideUserSection();
  hideResurseSection();
})();

// Event sections
btn_user.addEventListener("click", manageUserSection);
btn_resurse.addEventListener("click", manageResurseSection);
btn_delete_users.addEventListener("click", deleteSelectedUsers);

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
    await selectedUsers.forEach(async (user) => {
      let id = user.getAttribute("id");
      result = await deleteUser(id);
      if (result) {
        user.remove();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ceva nu a mers bine!",
        });
        return;
      }
    });
    console.log(result);
    if (result) {
      Swal.fire("Sterse!", "Utilizatorii au fost stersi.", "success");
    }
  }
}

// Display section functions
async function displayUserSection() {
  lista__useri.classList.remove("hidden");
  btn_delete_users.classList.remove("hidden");
  btn_change_user.classList.remove("hidden");
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

function displayResurseSection() {}

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
}

function hideResurseSection() {}

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
  if (response.ok) {
    return true;
  } else {
    authStatusCodesCheck(response);
  }
  return false;
}
