function login() {
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  let email_regex = new RegExp("^(.+)@(.+)[.com]$", "g");
  if (!email_regex.test(email))
    alert("Invalid E-mail!!/nPlease retry with another domain or E-mail");
}