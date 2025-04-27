const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  bio: { type: String, default: "This is a bio" },
  caption:{type: String, default: "Be My LoveMate" },
  profilePic: { type: String, default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" },
  sentInterests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  receivedInterests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  matchedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
module.exports = mongoose.model("User", userSchema);
