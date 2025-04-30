const socket=require("socket.io")
const dotenv=require("dotenv")
const Message=require("../models/messageModel")
dotenv.config()
const crypto=require("crypto")

const hashedRoomId=(userId,targetId)=>{
   return crypto.createHash("sha256").update([userId,targetId].sort().join("_")).digest("hex")
}

const initializeSocket=(server)=>{
    console.log("working")
    const io=socket(server,{
        cors:{
            origin:"http://localhost:5173",
            methods: ["GET", "POST"],
      credentials: true,
        }
    });
    io.on("connection",(socket)=>{
        socket.on("joinChat",({name,userId,targetId})=>{
            // console.log(userId,targetId)
            const roomId=hashedRoomId(userId,targetId)
            console.log(name+ "joined" +roomId);
            socket.join(roomId)

        });
        socket.on("sendMessage",async({name,userId,targetId,text})=>{
            const roomId=hashedRoomId(userId,targetId)

            try {
                let message=await Message.findOne({
                    participants:{$all:[userId,targetId]},
                })

                if(!message){
                    message=new Message({
                        participants:[userId,targetId],
                        chats:[]
                    })
                }
                message.chats.push({
                    senderId:userId,
                    text
                })
                await message.save()
                console.log(message,"fromsocket")
            } catch (error) {
                console.error(error)
            }

            io.to(roomId).emit("messageReceived",{name,text})
            console.log(roomId,"room id")
        });

        socket.on("typing", ({ userId, targetId }) => {
            const roomId = hashedRoomId(userId, targetId);
            socket.to(roomId).emit("showTyping", { userId });
          });
          
          socket.on("stopTyping", ({ userId, targetId }) => {
            const roomId = hashedRoomId(userId, targetId);
            socket.to(roomId).emit("hideTyping", { userId });
          });

        socket.on("disconnect",()=>{})
    })
}

module.exports=initializeSocket