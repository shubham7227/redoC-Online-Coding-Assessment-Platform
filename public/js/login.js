var domain = "//localhost:5000"

const form = document.getElementById("login-form")
form.addEventListener("submit", login)

//adding jQuery for AJAX
var script = document.createElement("script")
script.src = "//code.jquery.com/jquery-3.4.1.min.js"
script.type = "text/javascript"
document.getElementsByTagName("head")[0].appendChild(script)

function login(e) {
  e.preventDefault()
  var data = {}
  data.email = document.getElementById("email").value
  data.password = document.getElementById("password").value

  fetch(domain + "/individual_login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.error) {
        alert("Account Not Found!!")
        $.ajax({
          type: "POST",
          url: domain + "/individual_signup",
          error: function (xhr, status, err) {
            console.log(err)
          },
        })
      } else {
        localStorage.setItem("token", result.token)
        $.ajax({
          type: "GET",
          url: domain + "/home",
          error: function (xhr, status, err) {
            console.log(err)
          },
        })
      }
    })
    .catch((e) => console.log(e))
}

function showpassword() {
  var pass = document.getElementById("password")
  var checkbox = document.getElementById("password-checkbox").checked
  if (pass.type == "password" && checkbox) {
    pass.type = "text"
  } else {
    pass.type = "password"
  }
}
