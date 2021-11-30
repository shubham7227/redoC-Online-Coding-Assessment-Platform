let name = new RegExp("[^a-zA-Z]")
let letter = new RegExp("[a-zA-Z]")
let special = new RegExp("[!@#$%^&*(),.?:{}|<>]")
let numbers = new RegExp("[0-9]")
var form = document.getElementsByClassName("login-form")
var fname = document.getElementById("fname")
var mname = document.getElementById("mname")
var lname = document.getElementById("lname")
var pass = document.getElementById("password")
var cpass = document.getElementById("cpassword")
var done_fname = true
var done_mname = true
var done_lname = true
var done_pass = true
var done_cpass = true

fname.onkeyup = function () {
  if (name.test(fname.value)) {
    document.getElementById("fname_error").innerHTML =
      "Invalid first name provided!!"
    done_fname = false
    return false
  }
  document.getElementById("fname_error").innerHTML = ""
  done_fname = true
  return true
}

mname.onkeyup = function () {
  if (name.test(mname.value)) {
    document.getElementById("mname_error").innerHTML =
      "Invalid middle name provided!!"
    done_fname = false
    return false
  }
  document.getElementById("mname_error").innerHTML = ""
  done_fname = true
  return true
}

lname.onkeyup = function () {
  if (name.test(lname.value)) {
    document.getElementById("lname_error").innerHTML =
      "Invalid last name provided!!"
    done_lname = false
    return false
  }
  document.getElementById("lname_error").innerHTML = ""
  done_lname = true
  return true
}

pass.onkeyup = function () {
  if (pass.value != "") {
    if (pass.value.length < 8) {
      document.getElementById("pass_error").innerHTML =
        "Password should be 8 character long with atleast one number and special character!"
      done_pass = false
      return false
    } else if (
      !(
        letter.test(pass.value) &&
        special.test(pass.value) &&
        numbers.test(pass.value)
      )
    ) {
      document.getElementById("pass_error").innerHTML =
        "Password should be 8 character long with atleast one number and special character"
      done_pass = false
      return false
    }
  }
  document.getElementById("pass_error").innerHTML = ""
  done_pass = true
  return true
}

cpass.onkeyup = function () {
  if (pass.value == "" && cpass.value != "") {
    document.getElementById("pass_error").innerHTML =
      "Need to type the password first!!"
    done_cpass = false
    return false
  } else if (pass.value != cpass.value && cpass.value != "") {
    document.getElementById("cpass_error").innerHTML = "Passwords donot match!!"
    done_cpass = false
    return false
  }
  if (cpass.value == "" && pass.value == "")
    document.getElementById("pass_error").innerHTML = ""

  document.getElementById("cpass_error").innerHTML = ""
  done_cpass = true
  return true
}

function checkinfo() {
  if (done_fname && done_mname && done_lname && done_pass && done_cpass) {
    return true
  }
  return false
}

function showpassword() {
  var pass = document.getElementById("password")
  var cpass = document.getElementById("cpassword")
  var checkbox = document.getElementById("password-checkbox").checked
  if (pass.type == "password" && checkbox) {
    pass.type = "text"
    cpass.type = "text"
  } else {
    pass.type = "password"
    cpass.type = "password"
  }
}
