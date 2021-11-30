function showpassword() {
  var pass = document.getElementById("password")
  var checkbox = document.getElementById("password-checkbox").checked
  if (pass.type == "password" && checkbox) {
    pass.type = "text"
  } else {
    pass.type = "password"
  }
}
