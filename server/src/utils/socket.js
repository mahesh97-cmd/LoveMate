const socket=require("socket.io")
const dotenv=require("dotenv")
dotenv.config()

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
            const roomId=[userId,targetId].sort().join("_")
            console.log(name+ "joined" +roomId);
            socket.join(roomId)

        });
        socket.on("sendMessage",({name,userId,targetId,text})=>{
            const roomId=[userId,targetId].sort().join("_")
            io.to(roomId).emit("messageReceived",{name,text})
            console.log(name,text)
        });
        socket.on("disconnect",()=>{})
    })
}

module.exports=initializeSocket