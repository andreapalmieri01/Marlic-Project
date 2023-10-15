const mongoose = require("mongoose");

const administratorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  salt: {
    type: String,
    required: true,
    min: 0,
    max: 200,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
});

module.exports = mongoose.model("Administrators", administratorSchema);