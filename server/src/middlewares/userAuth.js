
const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config()
const userAuth=(req,res,next)=>{
try {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({msg:"No token, authorization denied"})
    }

    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    req.user=decoded.userId;
    next()
} catch (error) {
   console.log(error) 
}
}

module.exports=userAuth