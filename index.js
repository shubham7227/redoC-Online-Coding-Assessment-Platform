require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const user = require("./models/users")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const app = express()
const cors = require("cors")

app.set("view engine", "ejs")
app.use(express.static("public"))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

function errmsg(msg) {
  return { error: msg || "Something went wrong!" }
}

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })

const db = mongoose.connection
db.on("error", (error) => console.log(error))
db.once("open", () => console.log("Connected to database"))

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.token
    const authUser = jwt.verify(token, process.env.JWT_SECRET)
    var query = { email: authUser.email }
    await user.findOne(query, function (err, result) {
      if (err) throw err
      if (result != null) req.authUser = { email: result._id }
      next()
    })
  } catch (e) {
    return res.redirect("/individual_login")
  }
}

app.post("/individual_login", async (req, res) => {
  try {
    const { email, password } = req.body
    var query = {
      _id: email,
      password,
    }
    await user
      .findOne(query, function (err, result) {
        if (result != null) {
          const token = jwt.sign(
            {
              email: result._id,
            },
            process.env.JWT_SECRET
          )
          res.status(200).send({ token })
        } else {
          res.render("individual_login", {
            failure: true,
            message: "Incorrect Email or Password!!",
          })
        }
      })
      .clone()
      .catch(function (err) {
        console.log(err)
      })
  } catch (e) {
    console.log(e)
  }
})

app.post("/individual_signup", async (req, res) => {
  const userAdd = new user({
    _id: req.body.email,
    fname: req.body.fname,
    mname: req.body.mname,
    lname: req.body.lname,
    password: req.body.password,
  })
  try {
    await userAdd.save()
    return res.redirect("individual_login")
  } catch (error) {
    res.render("individual_signup", {
      failure: true,
      message: "Account already exists",
    })
  }
})

app.get("/home", authenticate, async (req, res) => {
  try {
    var { email } = req.authUser
    var query = { email }
    await user.findOne(query, function (err, result) {
      if (err) throw err
      res.status(200).send(result)
    })
  } catch (e) {
    res.status(500).send(errmsg(e))
  }
})

app.get("/contact", authenticate, async (req, res) => {
  try {
    var { email } = req.authUser
    var query = { email }
    await user.findOne(query, function (err, result) {
      if (err) throw err
      res.status(200).send(result)
    })
  } catch (e) {
    res.status(500).send(errmsg(e))
  }
})

app.get("/problems", async (req, res) => {
  try {
    var { email } = req.authUser
    var query = { email }
    await user.findOne(query, function (err, result) {
      if (err) throw err
      res.status(200).send(result)
    })
  } catch (e) {
    res.status(500).send(errmsg(e))
  }
})

app.get("/question", async (req, res) => {
  try {
    var { email } = req.authUser
    var query = { email }
    await user.findOne(query, function (err, result) {
      if (err) throw err
      res.status(200).send(result)
    })
  } catch (e) {
    res.status(500).send(errmsg(e))
  }
})

app.get("/", (req, res) => {
  res.render("login")
})

app.get("/login", (req, res) => {
  res.render("login")
})

app.get("/", (req, res) => {
  res.render("home")
})

app.get("/admin_login", (req, res) => {
  res.render("admin_login")
})

app.get("/individual_login", (req, res) => {
  res.render("individual_login", { failure: false, message: "" })
})

app.get("/individual_signup", (req, res) => {
  res.render("individual_signup", { failure: false, message: "" })
})

app.listen(5000, () => {
  console.log("Server started on port 5000")
})
