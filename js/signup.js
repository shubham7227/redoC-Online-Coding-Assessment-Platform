let name = new RegExp("[^a-zA-Z]");
let letter = new RegExp("[a-zA-Z]");
let special = new RegExp("[!@#$%^&*(),.?:{}|<>]");
let numbers = new RegExp("[0-9]");
var form = document.getElementsByClassName("login-form");
var fname = document.getElementById("fname");
var mname = document.getElementById("mname");
var lname = document.getElementById("lname");
var pass = document.getElementById("password");
var cpass = document.getElementById("cpassword");

fname.onkeyup = function () {
  if (name.test(fname.value)) {
    document.getElementById("fname_error").innerHTML = "Invalid first name provided!!";
    return false;
  }
  document.getElementById("fname_error").innerHTML = "";
  return true;
}

mname.onkeyup = function () {
  if (name.test(mname.value)) {
    document.getElementById("mname_error").innerHTML = "Invalid middle name provided!!";
    return false;
  }
  document.getElementById("mname_error").innerHTML = "";
  return true;
}

lname.onkeyup = function () {
  if (name.test(lname.value)) {
    document.getElementById("lname_error").innerHTML = "Invalid last name provided!!";
    return false;
  }
  document.getElementById("lname_error").innerHTML = "";
  return true;
}

pass.onkeyup = function () {
  if (pass.value != ""){
    if (pass.value.length < 8){
      document.getElementById("pass_error").innerHTML = "Password too short!!";
      return false;
    }
    else if (!(letter.test(pass.value) && special.test(pass.value) && numbers.test(pass.value))) {
      document.getElementById("pass_error").innerHTML = "Password too weak!!";
      return false;
    }
  }
  document.getElementById("pass_error").innerHTML = "";
  return true;
}

cpass.onkeyup = function (){
  if (pass.value == "" && cpass.value != "") {
    document.getElementById("pass_error").innerHTML = "Need to type the password first!!";
    return false;
  }
  else if (pass.value != cpass.value && cpass.value != "") {
    document.getElementById("cpass_error").innerHTML = "Passwords donot match!!";
    return false;
  }
  if (cpass.value == "" && pass.value == "")
    document.getElementById("pass_error").innerHTML = "";
  
  document.getElementById("cpass_error").innerHTML = "";
  return true;
}