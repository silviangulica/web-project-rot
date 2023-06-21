function changeNavBarColor() {
  const navbar = document.querySelector(".nav");

  if (window.scrollY >= 25) {
    navbar.classList.add("nav--scrolled");
  } else {
    navbar.classList.remove("nav--scrolled");
  }
}

window.addEventListener("scroll", changeNavBarColor);
// -- End Pretty navbar

// // -- Start dom manipulation
// const lesson_title = document.querySelector(".lesson__title")
// const lesson_content = document.querySelector(".lesson__content-text")
// const lesson_image = document.querySelector(".lesson__image--visible")

// let lesson = {
//   title: "",
//   description: "",
//   image_url: ""
// }

// var lesson_id = 1
// let url = "http://127.0.0.1:8081"

// function getLesson(lesson_id) {
//   console.log(lesson_id)
//   fetch(url + `/lessons/${lesson_id}`)
//     .then(response => response.json())
//     .then(data => {
//       lesson = {
//         title: data.title,
//         description: data.description,
//         image_url: data.image_url
//       }

//       lesson_title.innerHTML = lesson.title
//       lesson_content.innerHTML = lesson.description
//       lesson_image.src = lesson.image_url

//       console.log(lesson)
//     }
//   )
// }

// getLesson(lesson_id)

// const next_button = document.querySelector(".lesson__panel-next-lesson")

// next_button.addEventListener("click", () => {
//   lesson_id += 1
//   getLesson(lesson_id)
// })

// const previous_button = document.querySelector(".lesson__panel-prev-lesson")

// previous_button.addEventListener("click", () => {
//   lesson_id -= 1
//   if (lesson_id < 1) {
//     lesson_id = 1
//   }
//   getLesson(lesson_id)
// })
// -- End dom manipulation