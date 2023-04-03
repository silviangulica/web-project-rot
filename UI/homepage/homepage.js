function changeNavBarColor() {
  const navbar = document.querySelector(".menu__nav");

  if (window.scrollY >= 25) {
    navbar.classList.add("menu__nav--scrolled");
  } else {
    navbar.classList.remove("menu__nav--scrolled");
  }
}

window.addEventListener("scroll", changeNavBarColor);

const infoContents = document.querySelectorAll(".info__content");

infoContents.forEach((infoContent) => {
  infoContent.addEventListener("click", () => {
    infoContents.forEach((content) => {
      content.classList.remove("info__content--selected");
    });
    infoContent.classList.add("info__content--selected");
  });
});
