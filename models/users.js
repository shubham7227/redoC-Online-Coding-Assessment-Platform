const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname:{
        type: String,
        required: true
    },
    mname: {
        type: String
    },
    lname: {
        type: String,
        required: true
    },
    _id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("user", userSchema);