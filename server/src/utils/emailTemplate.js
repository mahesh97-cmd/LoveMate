const getVerificationEmailTemplate = (username, verificationCode) => {
    return `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2>Welcome, ${username}!</h2>
        <p>Use the following verification code to activate your account:</p>
        <h1 style="color: #007bff;">${verificationCode}</h1>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>LoveMate</p>
      </div>
    `;
  };

  module.exports=getVerificationEmailTemplate