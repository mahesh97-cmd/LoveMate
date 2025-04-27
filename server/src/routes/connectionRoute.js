const express=require("express")
const router=express.Router()
const userAuth=require("../middlewares/userAuth")
const connectionController=require("../controllers/connectionController")

router.post("/send/request/:id",userAuth,connectionController.sendRequest)
router.post("/request/:id/response",userAuth,connectionController.requestResponse)
router.get("/getAllMatches",userAuth,connectionController.getMatches)
router.get("/getReceivedRequests", userAuth, connectionController.getReceivedRequests)

module.exports=router