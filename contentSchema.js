
const mongoose = require("mongoose");
const contentSchema = new mongoose.Schema({
 fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select:false 
  }
});

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;