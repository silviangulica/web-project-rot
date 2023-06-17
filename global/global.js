async function checkIfUserAuthDidNotExpire(
  redirectTo = "../login-page/login.html"
) {
  const response = await fetch("http://localhost:8081/verifyToken", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    localStorage.removeItem("user");
  }
  window.location.href = redirectTo;
}
