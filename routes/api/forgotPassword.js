import User from "../sequelize";
import crypto from "crypto";

require("dotenv").config();

const nodemailer = require("nodemailer");

// https://itnext.io/password-reset-emails-in-your-react-app-made-easy-with-nodemailer-bb27968310d7

module.exports = app => {
  app.post("/forgotPassword", (req, res, next) => {
    if (req.body.email === "") {
      res.json("email required");
    }
    console.log(req.body.email);
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user === null) {
        console.log("email not in database");
        res.json("email not in db");
      } else {
        // STEP 1. Generate a Token
        // 20자까지 해쉬 토큰 생성
        const token = crypto.randomBytes(20).toString("hex");
        console.log(token);
        user.update({
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 360000
        });

        // Step 2: Create Nodemailer Transport
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: `${process.env.EMAIL_ADDRESS}`,
            pass: `${process.env.EMAIL_PASSWORD}`
          }
        });

        // Step 3: Create Mail Options
        const mailOptions = {
          from: `lets.styel@gmail.com`,
          to: `${user.email}`,
          subject: `Link To Reset Password`,
          text:
            `You ar receiving this because you (or someone else) have requested the reset of the password for your account. \n\n` +
            `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it: \n\n` +
            `http://localhost:3000/reset/${token}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged. \n`
        };

        console.log("sending email");

        // Step 4: Send Mail
        transporter.sendMail(mailOptions, function(err, response) {
          if (err) {
            console.error("there was an error: ", err);
          } else {
            console.log("here is the res: ", response);
            res.status(200).json("recovery email sent");
          }
        });
      }
    });
  });
};
