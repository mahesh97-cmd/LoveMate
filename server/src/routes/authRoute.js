const express=require("express")
const router=express.Router()
const authController=require("../controllers/authController")
const { 
    userValidation,
    loginValidation,
    verifyEmailValidation
  } = require('../middlewares/userValidation')
  const validate =require("../middlewares/validate")

router.post("/signup",validate(userValidation),authController.signup)

router.post("/login",authController.login)
router.post("/logout",authController.logout)
router.post("/verifyemail",authController.verifyEmail)

module.exports=router