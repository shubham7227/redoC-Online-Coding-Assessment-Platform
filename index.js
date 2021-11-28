const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient

const app = express();


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var url = "mongodb+srv://redocadmin:redocadmin@cluster0.ebyoh.mongodb.net/REDOC?retryWrites=true&w=majority";


MongoClient.connect(url, (err, db) => {
    if (err) return console.error(err)
  console.log('Connected to Database')
  var myobj = { name: "Hello", address: "HKSJHJIKS"};
  db.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});

app.get("/", (req,res) => {
    res.render("login");
});

app.get("/login", (req,res) => {
    res.render("login");
});

app.get("/", (req,res) => {
    res.render("home");
});

app.get("/admin_login", (req,res) => {
    res.render("admin_login");
});

app.get("/individual_login", (req,res) => {
    res.render("individual_login");
});

app.get("/individual_signup", (req,res) => {
    res.render("individual_signup");
});

app.get("/home", (req,res) => {
    res.render("home");
});

app.get("/question", (req,res) => {
    res.render("question");
});

app.get("/contact", (req,res) => {
    res.render("contact");
});

app.get("/problems", (req,res) => {
    res.render("problems");
});

app.listen(5000,() => {
    console.log("Server started on port 5000");
});