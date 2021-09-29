const nodemailer = require("nodemailer");
const fast2sms = require('fast-two-sms');
const { ErrorResponse } = require("./error");

exports.SendEmail = async (to, subject, text,attachments) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: subject,
    html: text,
    attachments:attachments,
  };
  
  return await transporter.sendMail(mailOptions);

};

exports.SendSMS = async (message, number) => {
  var options = { authorization: process.env.SMS_KEY, message: message, numbers: [number] }
  return await fast2sms.sendMessage(options);
}
