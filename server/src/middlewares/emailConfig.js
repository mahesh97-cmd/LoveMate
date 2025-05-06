const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});


transporter.verify((error, success) => {
  if (error) {
    console.error("Email Transport Error:", error);
  } else {
    console.log("Server is ready to send emails");
  }
});

module.exports = transporter;
