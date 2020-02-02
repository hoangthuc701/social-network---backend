const nodeMailer = require('nodemailer');
const defaultEmailData = {from:"hoangthuc701@gmail.com"};

exports.sendEmail = emailData=>{
  console.log("Run into");
    const transpoter = nodeMailer.createTransport({
      host:'smtp.gmail.com',
      port:587,
      secure:false,
      requireTLS: true,
      auth:
      {
          type: 'OAuth2',
          user: 'hoangthuc2106@gmail.com',
          clientId:"715369446807-2lc5bh182bnanhen8ujk3br8l4m0jk3p.apps.googleusercontent.com",
          clientSecret:"pHqr5fl5ohdCkt426t4fuGyo",
          refreshToken:"1/FvDfZEBMGx_yxHYmN-BUmTjs0XniGWNNAdeAmwmW8S4"
      }
    });
    return transpoter.sendMail(emailData)
           .then(info=>console.log(`Message sent to: ${info.response}`))
           .catch(err=>console.log(`Prolem sending email: ${err}`));
}


