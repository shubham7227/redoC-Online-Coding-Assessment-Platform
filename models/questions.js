const mongoose = require("mongoose")

const questions = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  _id: {
    type: Number,
    required: true,
  },
  testcase: {
    type: String,
    default: [],
  },
  output: {
    type: String,
    default: [],
  },
})

module.exports = mongoose.model("questions", questions)
