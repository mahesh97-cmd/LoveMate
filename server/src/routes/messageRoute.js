const express=require("express")
const userAuth = require("../middlewares/userAuth")
const messageController = require("../controllers/messageController")
const router=express.Router()


router.get("/message/:targetId",userAuth,messageController.message)


module.exports=router