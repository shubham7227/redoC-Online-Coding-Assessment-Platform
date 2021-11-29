var domain = "https://localhost:5000"

//jQuery for AJAX
var script = document.createElement("script")
srcipt.src = "./jQuery.js"
script.type = "text/javascript"
document.getElementsByTagName("head")[0].appendChild(script)

//Change profile tag to name
function profiler(result) {
  document.getElementById("profile").innerHTML = result.fname
}

windows.onload = function () {
  var token = localStorage.getItem("token")
  if (!token) {
    $.ajax({
      type: "POST",
      url: domain + "/individual_login",
      error: function (xhr, status, err) {
        console.log(err)
      },
    })
    return
  }
  fetch(domain + "/home", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      token: token,
    },
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.error) {
        showError(result.error)
      } else {
        profiler(result)
      }
    })
    .catch((e) => {
      console.log(e)
      showError(e)
    })
}

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("token")
  $.ajax({
    type: "POST",
    url: domain + "/individual_login",
    error: function (xhr, status, err) {
      console.log(err)
    },
  })
})
