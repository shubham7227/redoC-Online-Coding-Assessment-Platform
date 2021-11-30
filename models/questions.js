const mongoose = require("mongoose")
var autoIncrement = require('mongoose-auto-increment')

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
  testcase: {
    type: String,
  },
  output: {
    type: String,
  },
})

autoIncrement.initialize(mongoose.connection);
questions.plugin(autoIncrement.plugin, 'questions');
module.exports = mongoose.model("questions", questions);
