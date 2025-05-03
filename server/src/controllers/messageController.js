const Message = require("../models/messageModel");

exports.message = async (req,res) => {
  const  userId  = req?.user;
  console.log(userId,"controller userId")

  const { targetId } = req.params;
  console.log(targetId,"controller targetId")

try {
    let message = await Message.findOne({
      participants: { $all: [userId, targetId] },
    }).populate("chats.senderId", "username profilePic");
  
    console.log("Message found: ", message); 
  
    if (!message) {
     
      console.log("No message found, creating a new one...");
  
      message = new Message({
        participants: [userId, targetId],
        chats: [],
      });
  
      
      await message.save();
  
      
      console.log("Message created and saved:", message);  
  
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

