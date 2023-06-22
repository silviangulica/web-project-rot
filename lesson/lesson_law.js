// Removes "currentState" from localStorage if it exists
removeCurrentState();

const fancyAlert = (msg) => {
  let alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = msg;
  document.body.appendChild(alert);

  alert.style.position = "fixed";
  alert.style.top = "10px";
  alert.style.left = "50%";
  alert.style.transform = "translateX(-50%)";
  alert.style.padding = "10px 20px";
  alert.style.borderRadius = "5px";
  alert.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  alert.style.color = "white";
  alert.style.fontFamily = "sans-serif";
  alert.style.fontSize = "20px";
  alert.style.fontWeight = "bold";
  alert.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  alert.style.zIndex = "1000";

  // Remove alert after 3 seconds
  setTimeout(() => {
    document.body.removeChild(alert);
  }, 3000);
};

function changeNavBarColor() {
  const navbar = document.querySelector(".nav");

  if (window.scrollY >= 25) {
    navbar.classList.add("nav--scrolled");
  } else {
    navbar.classList.remove("nav--scrolled");
  }
}

window.addEventListener("scroll", changeNavBarColor);

// Login to the program
const cards = document.querySelectorAll(".card");

// Make the lesson invisible
const lesson_container = document.querySelector(".lesson");
lesson_container.style.display = "none";

// Make a global variable for currentLesson
let currentLesson = {};

// Itter through all cards and add event listeners
cards.forEach((card) => {
  // Get the data-categorie attribute from the card
  const categorie = card.dataset.categorie;

  // Add event listener to the card
  card.addEventListener("click", () => {
    getNewLesson(categorie);
  });
});

function getNewLesson(id) {
  // Make a fetch request to the server
  fetch(`http://localhost:8081/law-lessons/?id=${id}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data) {
        handleLesson(data, id);
        currentLesson = data;
      }
    });
}

// Handle the lesson
function handleLesson(lesson) {
  // Get the title of the lesson
  let lesson_title = document.querySelector(".lesson__title");
  lesson_title.innerHTML = findLessonTitle(lesson.id);

  // Get the description of the lesson
  let lesson_description = document.querySelector(".lesson__content-text");
  lesson_description.innerHTML = lesson.text;

  // Make the lesson visible
  let lesson_container = document.querySelector(".lesson");
  lesson_container.style.display = "flex";

  // Make the cards invisible, that have class card
  let cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.style.display = "none";
  });

  // Make the come back button visible
  let come_back_button = document.querySelector(".lessons__back");
  come_back_button.style.display = "block";

  // Add event listener to the come back button
  come_back_button.addEventListener("click", () => {
    revertToCategories();
  });
}

revertToCategories = () => {
  // Make the lesson invisible
  let lesson_container = document.querySelector(".lesson");
  lesson_container.style.display = "none";

  // Make the cards visible, that have class card
  let cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.style.display = "block";
  });

  // Make the come back button invisible
  let come_back_button = document.querySelector(".lessons__back");
  come_back_button.style.display = "none";
};

// Add panel buttons

let prev_button = document.querySelector(".lesson__panel-prev-lesson");
let next_button = document.querySelector(".lesson__panel-next-lesson");

prev_button.addEventListener("click", () => {
  let lesson_id = parseInt(currentLesson.id) - 1;
  if (lesson_id > 0) {
    getNewLesson(lesson_id);
  } else {
    revertToCategories();
    fancyAlert("Nu există lecție anterioară!");
  }
});

next_button.addEventListener("click", () => {
  let lesson_id = parseInt(currentLesson.id) + 1;
  if (lesson_id <= 10) {
    getNewLesson(lesson_id);
  } else {
    revertToCategories();
    fancyAlert("Ai terminat lecțiile!");
  }
});

// Find the title of the lesson
function findLessonTitle(id) {
  let title = "";
  switch (id) {
    case "1":
      title = "Dispoziții generale";
      break;
    case "2":
      title = "Vehicule";
      break;
    case "3":
      title = "Conducători de vehicule";
      break;
    case "4":
      title = "Semnalizarea rutieră";
      break;
    case "5":
      title = "Reguli de circulație";
      break;
    case "6":
      title = "Infrațiuni și pedepse";
      break;
    case "7":
      title = "Răspunderea contravențională";
      break;
    case "8":
      title =
        "Căi de atac împotriva procesului-verbal de constatare a contravenție";
      break;
    case "9":
      title =
        "Atribuții ale unor ministere și autorități ale administrației publice";
      break;
    case "10":
      title = "Dispoziții finale";
      break;
    default:
      title = "Alpaca Legionara";
      break;
  }
  return title;
}
