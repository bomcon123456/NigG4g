const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nigg4gSite@gmail.com",
    pass: "D8VneixeshZD6df"
  }
});
gmailTransporter.use(
  "compile",
  hbs({
    viewPath: path.join(__dirname, "./templates"),
    extName: ".hbs",
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.join(__dirname, "./templates/partials"),
      defaultLayout: false
    }
  })
);

const emailServices = {
  gmail: gmailTransporter
};
const sendEmail = (service, options) => {
  let transporter = emailServices[service];
  return transporter.sendMail(options);
};

module.exports = {
  sendEmail
};
