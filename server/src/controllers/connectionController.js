const User=require("../models/userModel")

exports.sendRequest=async(req,res)=>{
    try {
        const senderId=req.user
        const receiverId=req.params.id
    
        if(senderId===receiverId){
            return res.status(400).json({msg:"you can not send request to yourself"})
        }
    
        const sender=await User.findById(senderId)
        const receiver=await User.findById(receiverId)
        if(!receiver){
            return res.status(400).json({msg:"user not found"})
        }
       if(sender.sentInterests.includes(receiverId)){
        return res.status(400).json({msg:"Request already sent"})
       }
       sender.sentInterests.push(receiverId)
       receiver.receivedInterests.push(senderId)
    
       await sender.save()
       await receiver.save()
       res.status(200).json({msg:"Request send Successfully!"})
    } catch (error) {
        console.error(error)
    }
    }
    
    exports.requestResponse=async(req,res)=>{
        try {
            const receiverId=req.user;
            const senderId=req.params.id
            const {action}=req.body
    
            const sender=await User.findById(senderId)
            const receiver=await User.findById(receiverId)
    
            if(!sender || !receiver){
                return res.status(404).json({msg:"user not found"})
            }
            if(receiver.matchedUsers.includes(senderId)){
              return res.status(404).json({msg:"already matched user"})

            }
            
            if(!receiver.receivedInterests.includes(senderId)){
                return res.status(404).json({msg:"No request found from this user"})
            }
            
            receiver.receivedInterests=receiver.receivedInterests.filter(id=>id.toString() !== senderId)
            sender.sentInterests=sender.sentInterests.filter(id=>id.toString() !==receiverId)
    
            if(action==="accept"){
                receiver.matchedUsers.push(senderId);
                sender.matchedUsers.push(receiverId);
            }else if(action==="reject"){
              if(receiver.potentialMatches.includes(senderId)){
                receiver.potentialMatches.push(senderId)
              }
            }
    
            await receiver.save();
            await sender.save();
        
            res.status(200).json({
              msg: action === "accept" ? "Interest accepted. Matched!" : "Interest rejected. User sent back to feed.",
              matchedUser: action === "accept" ? sender : null
            });
    
        } catch (error) {
            console.error(error)
        }
    }


exports.getMatches = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId).populate("matchedUsers", "username age gender profilePic")

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "Matched users fetched successfully",
      matches: user.matchedUsers,
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ msg: "Server error while fetching matches" });
  }
};


exports.getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user; 

    
    const user = await User.findById(userId).populate("receivedInterests", "username age gender profilePic");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "Received requests fetched successfully",
      requests: user.receivedInterests, 
    });
  } catch (error) {
    console.error("Error fetching received requests:", error);
    res.status(500).json({ msg: "Server error while fetching received requests" });
  }
};
