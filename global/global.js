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
    logUserOut();
  } else {
    if (window.location.pathname.includes("login-page/login.html"))
      window.location.href = "../dashboard/dashboard.html";
  }
}

async function updateUserData(id) {
  if (id === undefined) logUserOut();
  const response = await fetch(`http://localhost:8081/user`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem("user", JSON.stringify(data));
  }
}

function logUserOut() {
  localStorage.removeItem("user");
  if (!window.location.pathname.includes("login-page/login.html"))
    window.location.href = "../login-page/login.html";
}
