const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: true,
    minlength: [2, "password cannot be less than two characters"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [6, "password cannot be less than six characters"],
  },
  idOrCreatedAt: { type: String },
});

module.exports = mongoose.model("User", userSchema);
