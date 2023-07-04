let domain = "http://api.romaniantraffictutor.tech";

async function checkIfUserAuthDidNotExpire() {
  const response = await fetch(domain + "/verifyToken", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    authStatusCodesCheck(response);
  } else {
    if (window.location.pathname.includes("login-page/login.html"))
      window.location.href = "../dashboard/dashboard.html";
  }
}

async function updateUserData(user) {
  const response = await fetch(domain + `/users/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  if (response.ok) {
    localStorage.removeItem("user");
    localStorage.setItem("user", JSON.stringify(data));
  } else {
    authStatusCodesCheck(response);
  }
}

function logUserOut() {
  localStorage.removeItem("user");
  if (!window.location.pathname.includes("login-page/login.html"))
    window.location.href = "../login-page/login.html";
}

function authStatusCodesCheck(response) {
  if (response.status == 401) logUserOut();
  else if (response.status == 403) {
    alert("You are not authorized to perform this action");
    window.location.href = "../dashboard/dashboard.html";
  }
}

function removeCurrentState() {
  localStorage.removeItem("currentState");
}
