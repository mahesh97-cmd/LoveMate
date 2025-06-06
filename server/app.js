const express=require("express")
const cors=require("cors")
const dotenv=require("dotenv")
const cookieParser=require("cookie-parser")
dotenv.config()
const bodyParser=require("body-parser")
const connectDB=require("../server/src/config/db")
const authRoute=require("../server/src/routes/authRoute")
const userRoute=require("../server/src/routes/userRoute")
const connectionRoute=require("../server/src/routes/connectionRoute")
const messageRoute=require("../server/src/routes/messageRoute")
const http=require("http")
const initializeSocket = require("./src/utils/socket")
const app = express()
app.use(cors({
    origin:"https://lovemate-client.onrender.com", 
    credentials: true, 
     methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'],             
  }))
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.send("HOME PAGE")
})

app.use("/api/auth",authRoute)
app.use("/api/user",userRoute)
app.use("/api",connectionRoute)
app.use("/api",messageRoute)

const server=http.createServer(app)
initializeSocket(server)

PORT=process.env.PORT || 3004
connectDB()
.then(()=>{
    server.listen(PORT,()=>{
        console.log(`app is running on ${PORT}`)
        console.log(process.env.NODE_ENV)

    })
})
.catch((error)=>{
    console.error(' Failed to connect to MongoDB:', error.message);
})