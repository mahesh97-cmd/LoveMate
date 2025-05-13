const User=require("../models/userModel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
const TempUser=require("../models/tempUserModel")
const sendVerificationEmail = require("../middlewares/email")
dotenv.config()

exports.signup=async(req,res)=>{
    try {
        const { username, email, password, age, gender } = req.body;
        let user=await User.findOne({email})
        if(user){
            return res.status(400).json("user is already exist")
        }

        let tempUserExist=await TempUser.findOne({email})
        if (tempUserExist) {
            return res.status(400).json({ message: "Verification code already sent. Check your email." });
          }


        const hashPassword=await bcrypt.hash(password,10)
        const verificationCode=Math.floor(100000 + Math.random() * 900000).toString();
        let tempUser=new TempUser({
           username,
           email,
           password:hashPassword,
           age,
           gender,
           verificationCode,
           isVerified:false,
        })
        await tempUser.save()
        console.log(tempUser.username,tempUser.email,tempUser.verificationCode)
        await sendVerificationEmail(tempUser.username,tempUser.email,tempUser.verificationCode)
        res.status(200).json({ msg: 'Verification code send successfully'});

    } catch (error) {
        console.log(error)
    }
}

// exports.verifyEmail=async(req,res)=>{
// try {
//     const {email,verificationCode}=req.body;
// console.log(verificationCode,"type")
// console.log(email,"email")

//     const tempUser = await TempUser.findOne({ email,verificationCode });
//     if (tempUser.verificationCode.toString() !== verificationCode.toString()) {
//         return res.status(400).json({ message: "Incorrect verification code" });
//       }
//     if (!tempUser) {
//       return res.status(400).json({ message: "Invalid or expired verification code" });
//     }

//     if (tempUser.verificationCode !== verificationCode) {
//       return res.status(400).json({ message: "Incorrect verification code" });
//     }
//     console.log(typeof(tempUser.verificationCode),"verification")
//     let newUser=new User({
//         username:tempUser.username,
//            email:tempUser.email,
//            password:tempUser.password,
//            age:tempUser.age,
//            gender:tempUser.gender,
//            isVerified:true
//     })
//     console.log(newUser,"newuser")
//     await newUser.save();
//     // console.log(user,"user")
//     await tempUser.deleteOne({ email });
//     console.log(email)
//     res.json({ message: "Email verified successfully. You can now log in.", },newUser)
// } catch (error) {
//     res.status(500).json({ message: "Server error" });
// }
// }




exports.verifyEmail = async (req, res) => {
    try {
      const { email, verificationCode } = req.body;
  
      console.log("Received:", { email, verificationCode });
  
      const tempUser = await TempUser.findOne({ email });
  
      if (!tempUser) {
        return res.status(400).json({ message: "User not found or expired code." });
      }
  
      console.log("Stored OTP:", tempUser.verificationCode, typeof tempUser.verificationCode);
      console.log("Received OTP:", verificationCode, typeof verificationCode);
  
      if (tempUser.verificationCode.toString() !== verificationCode.toString()) {
        return res.status(400).json({ message: "Incorrect verification code" });
      }
  
      const newUser = new User({
        username: tempUser.username,
        email: tempUser.email,
        password: tempUser.password,
        age: tempUser.age,
        gender: tempUser.gender,
        isVerified: true
      });
  
      await newUser.save();
      await TempUser.deleteOne({ email });
  
      return res.status(200).json({
        message: "Email verified successfully. You can now log in.",
        user: newUser
      });
    } catch (error) {
      console.error("Server Error in verifyEmail:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

exports.logout=async(req,res)=>{
try {
      res.clearCookie("token")  
      res.status(200).json({ message: 'Logged out successfully' });

} catch (error) {
    console.log(error)
}
}

exports.login=async(req,res)=>{
try {
    const {email,password}=req.body;
    const user=await User.findOne({email})
    if(!user){
        return res.status(400).json({ msg: 'Invalid email or password' })
    }
    // if (!user.isVerified) {
    //     return res.status(400).json({ message: "Please verify your email first" });
    //   }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({ msg: 'Invalid email or password' })
    }
    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"})

    res.cookie("token",token,{
        httpOnly:true,
        secure:true,
        sameSite:none,
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