require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const user = require("./models/users")
const bcrypt = require("bcrypt")
const axios = require("axios")
const questions = require("./models/questions")
const admins = require("./models/admin")
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

app.get("/question/:qid", (req, res) => {
  const { qid } = req.params
  res.render("question")
  // if (loggedIn) {
  //   res.render("question")
  // } else {
  //   res.render("individual_login", {
  //     failure: true,
  //     message: "Please, login to continue",
  //   })
  // }
})

app.get("/question.json/:qid", async (req, res) => {
  try {
    const { qid } = req.params
    const question = await questions.findById(qid)
    if (question != null) {
      var title = question.title,
        description = question.description,
        difficulty = question.difficulty
      res.json({ title, description, difficulty })
    }
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
    res.status(500)
  }
})

app.post("/submit", async (req, res) => {
  try {
    var { question_id, code, language } = req.body
    const result = await questions.findById(question_id)
    if (result != null) {
      var testcase = result.testcase
      var output = result.output
      var apiOutput = await axios({
        method: "POST",
        url: "https://codexweb.netlify.app/.netlify/functions/enforceCode",
        data: {
          code,
          language,
          input: testcase,
        },
      })
      if (apiOutput.data.output.trim().indexOf("Execution Timed Out") !== -1) {
        res.send({
          status: 0,
          message: "Time Limit Exceeded",
        })
      } else if (apiOutput.data.output.trim() === output) {
        const data = await user.findById(email)
        var solved = data.solved
        solved.push(question_id)
        await user.updateOne({ _id: email }, { solved })
        res.send({
          status: 1,
          message: "Success! All Testcases Passed",
        })
      } else {
        res.send({
          status: 2,
          message: "Oops, Some Testcases Didnot Pass!!",
        })
      }
    }
  } catch (e) {
    res.status(500)
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

var adminloggedIn = false
var username

app.get("/admin_login", (req, res) => {
  if (!adminloggedIn) {
    res.render("admin_login")
  } else {
    res.redirect("admin_home")
  }
})

app.post("/admin_login", async (req, res) => {
  try {
    const AdminLogin = await admins.findOne({
      username: req.body.uname,
      password: req.body.password,
    })

    if (AdminLogin != null) {
      adminloggedIn = true
      username = req.body.uname
      res.redirect("admin_home")
    } else {
      res.redirect("admin_login")
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get("/admin_home", (req, res) => {
  if (!adminloggedIn) {
    res.render("admin_login")
  } else {
    res.render("admin_home")
  }
})

app.listen(5000, () => {
  console.log("Server started on port 5000")
})
