const nodemailer = require('nodemailer');
const fs = require('fs');
const matched_email_html = fs.readFileSync(__dirname + '/../public/assets/potential_trade_email_notif.html', 'UTF-8');
const handlebars = require('handlebars');
require('dotenv').config();

/*
 const transport = nodemailer.createTransport({
 service: 'Gmail',
 auth: {
 user: process.env.EMAIL_ID,
 pass: process.env.EMAIL_PASSWORD,
 },
 });
 */
var replacements = {
    owner_user_name: "test_name",
    target_user_name: "test_name",
    target_book_name: "test_book_name_1",
    target_book_author: "test_author_name_1",
    owned_book_name: "test_book_name_1",
    owned_book_author: "test_author_name_2"
}

var custom_html = handlebars.compile(matched_email_html);
var n_custom_html = custom_html(replacements);
/*
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
 */

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_KEY);
const msg = {
    to: process.env.EMAIL_ID,
    from: process.env.EMAIL_ID,
    subject: 'Test email',
    html: n_custom_html,
};
sgMail.send(msg);