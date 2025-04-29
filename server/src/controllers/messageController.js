const Message = require("../models/messageModel");

exports.message = async (req,res) => {
  const  userId  = req?.user;
  console.log(userId,"controller userId")
//   console.log(req,"request from be")
//   console.log(userId,"backend main user")
  const { targetId } = req.params;
  console.log(targetId,"controller targetId")
//   const userId = req.user ? mongoose.Types.ObjectId(req.user._id) : null;
//   const targetId = req.params.targetId ? mongoose.Types.ObjectId(req.params.targetId) : null;
try {
    let message = await Message.findOne({
      participants: { $all: [userId, targetId] },
    }).populate("chats.senderId", "username profilePic");
  
    console.log("Message found: ", message); // Check if the message is found
  
    if (!message) {
      // No message found, create new message
      console.log("No message found, creating a new one...");
  
      message = new Message({
        participants: [userId, targetId],
        chats: [],
      });
  
      // Saving the new message
      await message.save();
  
      // Log after saving
      console.log("Message created and saved:", message);  // Now message should contain the saved data
  
      return res.status(200).json({
        message: "Message thread found or created",
        message,
      });
    } 
      res.status(200).json({
        message: "Message thread found",
         message,
      });
    
  } catch (err) {
    console.error("Error during operation:", err);
    res.status(500).json({ message: "Error handling message", error: err });
  }
};

