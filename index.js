require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const user = require("./models/users")
const bcrypt = require("bcrypt")
const axios = require("axios")
const { findOne } = require("./models/users")
const app = express()

app.set("view engine", "ejs")
app.use(express.static("public"))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })

const db = mongoose.connection
db.on("error", (error) => console.log(error))
db.once("open", () => console.log("Connected to database"))

var loggedIn = false
app.get("/", (req, res) => {
  res.redirect("login")
})

app.get("/login", (req, res) => {
  if (!loggedIn) {
    res.render("login")
  } else {
    res.redirect("home")
  }
})

app.get("/admin_login", (req, res) => {
  if (!loggedIn) {
    res.render("admin_login")
  } else {
    res.redirect("home")
  }
})

app.get("/individual_login", (req, res) => {
  if (!loggedIn) {
    res.render("individual_login", { failure: false, message: "" })
  } else {
    res.redirect("home")
  }
})

var email = ""
app.post("/individual_login", async (req, res) => {
  try {
    const UserLogin = await user.findById(req.body.email)
    if (UserLogin == null) {
      res.render("individual_login", {
        failure: true,
        message: "Email not found",
      })
    } else {
      if (await bcrypt.compare(req.body.password, UserLogin.password)) {
        loggedIn = true
        email = req.body.email
        res.redirect("home")
      } else {
        res.render("individual_login", {
          failure: true,
          message: "Incorrect email or password",
        })
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get("/home", async (req, res) => {
  if (loggedIn) {
    const result = await user.findById(email, {
      _id: 0,
      mname: 0,
      lname: 0,
      password: 0,
    })
    res.render("home", { name: result.fname })
  } else {
    res.render("individual_login", {
      failure: true,
      message: "Please, login to continue",
    })
  }
})

app.get("/individual_signup", (req, res) => {
  if (!loggedIn) {
    res.render("individual_signup", { failure: false, message: "" })
  } else {
    res.redirect("home")
  }
})
app.post("/individual_signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const userAdd = new user({
      fname: req.body.fname,
      mname: req.body.mname,
      lname: req.body.lname,
      _id: req.body.email,
      password: hashedPassword,
    })
    await userAdd.save()
    res.redirect("individual_login")
  } catch (error) {
    res.render("individual_signup", {
      failure: true,
      message: "Account already exists",
    })
  }
})

app.get("/home", (req, res) => {
  if (loggedIn) {
    res.render("home")
  } else {
    res.render("individual_login", {
      failure: true,
      message: "Please, login to continue",
    })
  }
})

app.get("/question", (req, res) => {
  if (loggedIn) {
    res.render("question")
  } else {
    res.render("individual_login", {
      failure: true,
      message: "Please, login to continue",
    })
  }
})

app.get("/question.json", (req, res) => {
  try {
    const title = "Reverse a String"
    const description = "Write a program to reverse the given input string"
    const difficulty = "Easy"
    res.json({ title, description, difficulty })
  } catch (e) {
    res.status(500)
  }
})

app.get("/contact", (req, res) => {
  if (loggedIn) {
    res.render("contact")
  } else {
    res.render("individual_login", {
      failure: true,
      message: "Please, login to continue",
    })
  }
})

app.get("/problems", (req, res) => {
  if (loggedIn) {
    res.render("problems")
  } else {
    res.render("individual_login", {
      failure: true,
      message: "Please, login to continue",
    })
  }
})

app.get("/logout", (req, res) => {
  loggedIn = false
  res.render("login")
})

app.post("/run", async (req, res) => {
  try {
    var { code, language, input } = req.body
    var apiOutput = await axios({
      method: "POST",
      url: "https://codexweb.netlify.app/.netlify/functions/enforceCode",
      data: {
        code,
        language,
        input,
      },
    })
    if (apiOutput.data.output.indexOf("Execution Timed Out!") !== -1) {
      res.send({
        status: 0,
        output: "Time Limit Exceeded!!",
      })
    } else {
      res.send({
        status: 1,
        output: apiOutput.data.output,
      })
    }
  } catch (e) {
    res.status(500).send(errmsg(e))
  }
})

app.post("/submit", async (req, res) => {
  try {
    var { question_id, code, language } = req.body
    var query = { _id: question_id }
    await Question.findOne(query, async (err, result) => {
      var { question, testcase, output, _id } = result

      var apiOutput = await axios({
        method: "POST",
        url: "https://codexweb.netlify.app/.netlify/functions/enforceCode",
        data: {
          code,
          language,
          input: testcase,
        },
      })
      if (apiOutput.data.output.indexOf("Execution Timed Out!") !== -1) {
        res.send({
          status: 0,
          message: "Time Limit Exceeded",
        })
      } else if (apiOutput.data.output.trim() == output) {
        var query = { _id: email, question_id } // todo : get email id
        await solved.findOne(query, function (err, result) {
          if (!solved.completed) {
            var score = Math.floor(points / 10)
            //to do update rating
          }
          res.send({
            status: 1,
            message: "Success! Testcases Passed",
          })
        })
      } else {
        res.send({
          status: 0,
          message: "Wrong Answer!!",
        })
      }
    })
  } catch (e) {
    res.status(500).send(errmsg(e))
  }
})

app.get("/profile", async (req, res) => {
  if (loggedIn) {
    const result = await user.findById(email, { password: 0 })
    res.render("profile", { user: result })
  } else {
    res.render("individual_login", {
      failure: true,
      message: "Please, login to continue",
    })
  }
})

app.get("/update_profile", async (req, res) => {
  if (loggedIn) {
    const result = await user.findById(email, { password: 0 })
    res.render("update_profile", { user: result })
  } else {
    res.render("individual_login", {
      failure: true,
      message: "Please, login to continue",
    })
  }
})

app.post("/update_profile", async (req, res) => {
  try {
    const UserLogin = await user.findById(email)
    if (await bcrypt.compare(req.body.password, UserLogin.password)) {
      await user.updateOne(
        { _id: email },
        { fname: req.body.fname, mname: req.body.mname, lname: req.body.lname }
      )
      res.redirect("profile")
    } else {
      res.redirect("update_profile")
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
app.listen(5000, () => {
  console.log("Server started on port 5000")
})
