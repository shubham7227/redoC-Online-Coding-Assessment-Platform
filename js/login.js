var domain = ;
function login() {
  var data = {}
  var data.email = document.getElementById("email");
  var data.password = document.getElementById("password");
  let email_regex = new RegExp("^(.+)@(.+)[.com]$", "g");
  if (!email_regex.test(data.email))
    alert("Invalid E-mail!!/nPlease retry with another domain or E-mail");
  
}