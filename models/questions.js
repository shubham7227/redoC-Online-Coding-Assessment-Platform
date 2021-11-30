const mongoose = require('mongoose');

const questions = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    qid: {
        type: Number,
        required: true
    },
    testcase: [String]
})

module.exports = mongoose.model("questions", questions);