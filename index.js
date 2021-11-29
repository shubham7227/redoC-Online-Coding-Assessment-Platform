const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const app = express();
require('./models/db');

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



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

app.post('/signed', function (req, res) {
    var name = req.body.fname + " " + req.body.mname + " " + req.body.lname,
        email = req.body.email,
        password = req.body.password;
    
    
});

app.listen(5000,() => {
    console.log("Server started on port 5000");
});