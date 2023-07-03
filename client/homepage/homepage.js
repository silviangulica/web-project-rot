function changeNavBarColor() {
  const navbar = document.querySelector(".menu__nav");

  if (window.scrollY >= 25) {
    navbar.classList.add("menu__nav--scrolled");
  } else {
    navbar.classList.remove("menu__nav--scrolled");
  }
}

window.addEventListener("scroll", changeNavBarColor);

// show description when click on info__content
const infoContents = document.querySelectorAll(".info__content");
const infoDescription = document.querySelectorAll(".description__item");

infoContents.forEach((infoContent, index) => {
  infoContent.addEventListener("click", () => {
    infoContents.forEach((content) => {
      content.classList.remove("info__content--selected");
    });

    infoContent.classList.add("info__content--selected");

    infoDescription.forEach((description) => {
      description.classList.remove("description__item--show");
    });

    infoDescription[index].classList.add("description__item--show");
  });
});

const hiddenElements = document.querySelectorAll(".hidable");
hiddenElements.forEach((element) => {
  element.style.opacity = 0;
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
});

const scrollAnimation = document.querySelectorAll(".hidable");

scrollAnimation.forEach((element) => observer.observe(element));
