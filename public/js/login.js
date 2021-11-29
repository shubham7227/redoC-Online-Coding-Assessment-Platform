localStorage.setItem("user", JSON.stringify(user))
document.getElementById("login").addEventListener("click", getMe)
function getMe(e) {
  e.preventDefault()
  var token = JSON.parse(localStorage.getItem("token"))
  console.log("Authorization=Bearer ${token}")
  fetch("./views/home", {
    method: "GET",
    headers: {
      Authorization: "Bearer" + token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      location.href = "http://localhost:5000/home"
    })
    .catch((err) => {
      location.href = "http:localhost:5000/login"
    })
}
function showpassword() {
  var pass = document.getElementById("password")
  if (pass.type == "password") {
    pass.type = "text"
  } else {
    pass.type = "password"
  }
}
