const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  age: Number,
  gender: String,
  verificationCode: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // 10 minutes
  },
});


module.exports = mongoose.model("TempUser", tempUserSchema);
