const nodemailer = require("nodemailer");

const MailHelper = async (options) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASS, // generated ethereal password
    },
  });
  const message = {
    from: "apurvgupta.124@gmail.com", // sender address
    to: options.email, // list of receivers
    subject: options.message, // Subject line
    text: options.text, // plain text body
    // html: "<b>Hello world?</b>", // html body
  };
  // send mail with defined transport object
  await transporter.sendMail(message);
};

module.exports = MailHelper;
