const mongoose = require('mongoose');
var sign_up_schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  password: { type: String, required: true}
});

mongoose.model('User', sign_up_schema);