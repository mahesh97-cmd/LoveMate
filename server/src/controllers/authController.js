const User=require("../models/userModel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config()

exports.signup=async(req,res)=>{
    try {
        const { username, email, password, age, gender } = req.body;
        let user=await User.findOne({email})
        if(user){
            return res.status(400).json("user is already exist")
        }
        const hashPassword=await bcrypt.hash(password,10)
        user=new User({
           username,
           email,
           password:hashPassword,
           age,
           gender 
        })
        await user.save()
        res.status(201).json({ msg: 'User registered successfully' ,user});

    } catch (error) {
        console.log(error)
    }
}

exports.logout=async(req,res)=>{
try {
      res.clearCookie("token")  
      res.status(200).json({ message: 'Logged out successfully' });

} catch (error) {
    console.error(error)
}
}

exports.login=async(req,res)=>{
try {
    const {email,password}=req.body;
    const user=await User.findOne({email})
    if(!user){
        return res.status(400).json({ msg: 'Invalid email or password' })
    }

    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({ msg: 'Invalid email or password' })
    }
    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"})

    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        maxAge:24 * 60 * 60 * 1000
    })
    res.status(200).json({
        msg: 'Login successful',
        data:user
      })
} catch (error) {
    console.log(error)
}
}