const mongoose = require('mongoose');

const url = "mongodb+srv://redocadmin:redocadmin@cluster0.ebyoh.mongodb.net/REDOC?retryWrites=true&w=majority";

//Mongo DB connection using Mongoose
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err)
    console.log("MongoDB Connection Error!!");
}
);

require('./sign_up.model');
require('./')