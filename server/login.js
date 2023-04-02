const loginPanelFooterAnchor = document.querySelector(
  ".login-panel__footer-anchor"
);
const signupPanelFooterAnchor = document.querySelector(
  ".sign-up-panel__footer-anchor"
);
const panel = document.querySelector(".panel");
const logInPanel = document.querySelector(".login-panel");
loginPanelFooterAnchor.addEventListener("click", () => {
  panel.classList.toggle("panel--flip");
});
signupPanelFooterAnchor.addEventListener("click", () => {
  panel.classList.toggle("panel--flip");
});
//work in progress
