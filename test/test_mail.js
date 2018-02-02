const nodemailer = require('nodemailer');
const fs = require('fs');
const matched_email_html = fs.readFileSync(__dirname + '/../public/assets/potential_trade_email_notif.html', 'UTF-8');
const handlebars = require('handlebars');
require('dotenv').config();

const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
    },
});

var custom_html = handlebars.compile(matched_email_html);
var n_custom_html = custom_html();

const mailOptions = {
    from: process.env.EMAIL_ID,
    to: process.env.EMAIL_ID,
    subject: 'hello world!',
    html: n_custom_html,
};
transport.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
    }
    console.log(`Message sent: ${info.response}`);
});