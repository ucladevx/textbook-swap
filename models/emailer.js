const dotenv = require('dotenv'); // loads environment variables
const users = require('./users');
const books = require('./book_info');
const fs = require('fs');
const matched_email_html = fs.readFileSync(__dirname + '/../public/assets/potential_trade_email_notif.html', 'UTF-8');
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: dotenv.EMAIL_ID,
            pass: dotenv.EMAIL_PASSWORD,
        },
});
const handlebars = require('handlebars');

//TODO: Refactor to make this much less ugly
//This function gets relevant information to send the email when trades are found
exports.setup_potential_trade_email = function(user_id, owned_book, target_user, wanted_book, next) {
    var data = {};
    users.get_user_name(user_id, function(err, user_name) {
        if (err) next(err);
        else data.user_name = user_name[0].user_name;
        users.get_user_email(user_id, function(err, user_email) {
            if (err) next(err);
            else data.user_email = user_email[0].user_email;
            users.get_user_name(target_user, function(err, user_name) {
                if (err) next(err);
                else data.target_name = user_name[0].user_name;
                books.get_book_info(owned_book, function(err, book_info) {
                    if (err) next(err);
                    else{
                        data.have_book_name = book_info[0].title;
                        data.have_book_author = book_info[0].author;
                    }
                    books.get_book_info(wanted_book, function(err, book_info) {
                        if (err) next(err);
                        else{
                            data.wanted_book_name = book_info[0].title;
                            data.wanted_book_author = book_info[0].author;
                            next(null, data);
                        }
                    });
                });
            });
        });
    });
};


//TODO: Fix HTML of email to make it much much better
//Populates HTML of potential trade email message and sends it
exports.send_potential_trade_email = function(email_data){
    var name, email, wanted_book_name, wanted_book_author, have_book_name, have_book_author, target_name;
    var replacements = {
        owner_user_name: email_data.user_name,
        target_user_name: email_data.target_name,
        target_book_name: email_data.wanted_book_name,
        target_book_author: email_data.wanted_book_author,
        owned_book_name: email_data.have_book_name,
        owned_book_author: email_data.have_book_author
    }
    var template = handlebars.compile(matched_email_html);
    var custom_html = template(replacements);
    const mailOptions = {
        from: 'LoopDevX@gmail.com',
        to: email_data.user_email,
        subject: 'You Got A Book Trading Match on Loop!',
        html: custom_html,
    };
    transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            console.log(`Message sent: ${info.response}`);
    });
};

