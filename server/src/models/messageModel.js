const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const messageSchema = new mongoose.Schema({
  participants: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
}],
  chats: [chatSchema],
});

module.exports = mongoose.model("Message", messageSchema);
