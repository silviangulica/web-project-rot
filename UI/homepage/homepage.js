function changeNavBarColor() {
  const navbar = document.querySelector(".menu__nav");

  if (window.scrollY >= 25) {
    navbar.classList.add("menu__nav--scrolled");
  } else {
    navbar.classList.remove("menu__nav--scrolled");
  }
}

window.addEventListener("scroll", changeNavBarColor);
