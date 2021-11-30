function checkinfo(){
    let name = new RegExp("[^a-zA-Z]");
    var fname = document.getElementById("fname").value;
    var mname = document.getElementById("mname").value;
    var lname = document.getElementById("lname").value;
    var done_fname = true;
    var done_mname = true;
    var done_lname = true;
    if (name.test(fname)) {
        document.getElementById("fname_error").innerHTML = "Invalid first name provided!!";
        done_fname = false;
    }
    if (name.test(mname)) {
        document.getElementById("mname_error").innerHTML = "Invalid middle name provided!!";
        done_fname = false;
    }
    if (name.test(lname)) {
        document.getElementById("lname_error").innerHTML = "Invalid last name provided!!";
        done_lname = false;
    }
    console.log(fname);
    console.log(lname);
    if(done_fname && done_mname && done_lname && lname != "" && fname != ""){
        return true;
    }
    return false;
}