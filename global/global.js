async function checkIfUserAuthDidNotExpire() {
  const response = await fetch("http://localhost:8081/verifyToken", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    localStorage.removeItem("user");
    if (!window.location.pathname.includes("login-page/login.html"))
      window.location.href = "../login-page/login.html";
  } else {
    if (window.location.pathname.includes("login-page/login.html"))
      window.location.href = "../dashboard/dashboard.html";
  }
}
