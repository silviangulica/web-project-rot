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

const lesson_panel = document.querySelector(".lesson");
lesson_panel.style.display = "none";

const cards = document.querySelectorAll(".card");
let lessons = [];

cards.forEach((card) => {
  lessons = [];
  let categorie = card.dataset.categorie;
  card.addEventListener("click", () => {
    fetch(`http://127.0.0.1:8081/lessons?type=${categorie}`)
      .then((response) => response.json())
      .then((data) => {
        lessons = data;
        if (lessons.length > 0) {
          handleLessons(lessons);
        }
      });
  });
});

let currentLesson = null;

function revertToCategories() {
  // toata clasa lessons__categories trebuie sa reapara, display block
  let lessons_categories = document.querySelectorAll(".card");
  lessons_categories.forEach((categorie) => {
    categorie.style.display = "block";
  });

  lesson_panel.style.display = "none";

  let lessons_back = document.querySelector(".lessons__back");
  lessons_back.style.display = "none";

  let card_lessons = document.querySelectorAll(".card-lesson");
  card_lessons.forEach((card_lesson) => {
    card_lesson.remove();
  });
}

function handleLessons(lessons) {
  // toata clasa lessons__categories trebuie sa dispara, display none
  let lessons_categories = document.querySelectorAll(".card");
  lessons_categories.forEach((categorie) => {
    categorie.style.display = "none";
  });

  let lessons_back = document.querySelector(".lessons__back");
  lessons_back.style.display = "block";

  // lessons_back este buton, ii adaugam functie
  lessons_back.addEventListener("click", revertToCategories);

  lessons.forEach((lesson) => {
    // Create lesson card si il adaugam la clasa lessons
    let lesson_card = document.createElement("div");
    lesson_card.classList.add("card-lesson");

    // Create lesson image
    let lesson_image = document.createElement("img");
    lesson_image.classList.add("card-lesson__img");
    lesson_image.src = lesson.image_url;

    // Create lesson title
    let lesson_title = document.createElement("div");
    lesson_title.classList.add("card-lesson__title");
    lesson_title.innerHTML = lesson.title;

    // Adaugam img si title la card
    lesson_card.appendChild(lesson_image);
    lesson_card.appendChild(lesson_title);

    // Adaugam card la lessons
    let lessons = document.querySelector(".lessons");
    lessons.appendChild(lesson_card);

    // Funciton to handle the click of the lesson card
    lesson_card.addEventListener("click", () => {
      createLessonFrom(lesson);
      currentLesson = lesson;
      // Hide all the cards
      let card_lessons = document.querySelectorAll(".card-lesson");
      card_lessons.forEach((card_lesson) => {
        card_lesson.style.display = "none";
      });

      // Show the lesson
      let realLesson = document.querySelector(".lesson");
      realLesson.style.display = "flex";
    });
  });
}

let prev_button = document.querySelector(".lesson__panel-prev-lesson");
let next_button = document.querySelector(".lesson__panel-next-lesson");

prev_button.addEventListener("click", () => {
  // cauta indexul lectiei curente in lessons
  let lesson_index = lessons.findIndex(
    (lesson) => lesson._id === currentLesson._id
  );
  if (lesson_index > 0) {
    let prev_lesson = lessons[lesson_index - 1];
    createLessonFrom(prev_lesson);
    currentLesson = prev_lesson;
  } else {
    revertToCategories();
    fancyAlert("Ai terminat acest capitol!");
  }
});

next_button.addEventListener("click", () => {
  let lesson_index = lessons.findIndex(
    (lesson) => lesson._id === currentLesson._id
  );
  if (lesson_index < lessons.length - 1) {
    let next_lesson = lessons[lesson_index + 1];
    createLessonFrom(next_lesson);
    currentLesson = next_lesson;
  } else {
    revertToCategories();
    fancyAlert("Ai terminat acest capitol!");
  }
});

const createLessonFrom = (lesson) => {
  // Get the title of the lesson
  let lesson_title = document.querySelector(".lesson__title");
  lesson_title.innerHTML = lesson.title;

  // Get the description of the lesson
  let lesson_description = document.querySelector(".lesson__content-text");
  lesson_description.innerHTML = lesson.description;

  // Get the image of the lesson
  let lesson_image = document.querySelector(".lesson__image--visible");
  lesson_image.src = lesson.image_url;
};
