const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //create a transporter
  //const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });
    
  const transporter = nodemailer.createTransport({
    // Configure your email provider settings
    service: 'gmail',
    secure: false, // Set to true if using SSL/TLS
    auth: {
      user: 'collinsolayemi@gmail.com',
      pass: 'aavcvxnuwubdpqlm',
    },
  });

  //define the email options
  const mailOptions = {
    from: 'natours <natours@io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
