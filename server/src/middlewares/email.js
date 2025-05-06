const transporter= require("../middlewares/emailConfig");
const  getVerificationEmailTemplate=require("../utils/emailTemplate");
const dotenv=require("dotenv")
dotenv.config()


const sendVerificationEmail = async (username,email,verificationCode) => {
  try {
    const emailTemplate=getVerificationEmailTemplate(username,verificationCode)
    const res = await transporter.sendMail({
      from: `"LoveMate" <${process.env.EMAIL_USER}>`,
      to: email, 
      subject:"Verify your Email" , 
      text: `"Hello" ${username}`, 
      html: emailTemplate, 
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports=sendVerificationEmail