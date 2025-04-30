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
  delivered: {
    type: Boolean,
    default: false,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  seenAt: {
    type: Date,
    default: null,
  }
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
