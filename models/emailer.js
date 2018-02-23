const dotenv = require('dotenv'); // loads environment variables
const users = require('./users');
const books = require('./book_info');
const foundTrades = require('./found_trades');
const fs = require('fs');
const matched_email_html = fs.readFileSync(__dirname + '/../public/assets/potential_trade_email_notif.html', 'UTF-8');
const rejected_email_html = fs.readFileSync(__dirname + '/../public/assets/rejected_trade_email.html', 'UTF-8');
const accepted_email_html = fs.readFileSync(__dirname + '/../public/assets/accepted_trade_email.html', 'UTF-8');

const sgMail = require('@sendgrid/mail');
const logger = require('tracer').colorConsole();
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


exports.send_rejected_trade_email = function (trade_id, next) {
    foundTrades.get_trade_by_id(trade_id, function(err, result) {
        if (err) next(err);
        for (var i = 0; i < result.length; i++) {
            module.exports.setup_potential_trade_email(result[i].user_id, result[i].book_have, result[i].target_id, result[i].book_want, function(err, email_data) {
                var name, email, wanted_book_name, wanted_book_author, have_book_name, have_book_author, target_name;
                var replacements = {
                    owner_user_name: email_data.user_name,
                    target_user_name: email_data.target_name,
                    target_book_name: email_data.wanted_book_name,
                    target_book_author: email_data.wanted_book_author,
                    owned_book_name: email_data.have_book_name,
                    owned_book_author: email_data.have_book_author
                }
                var template = handlebars.compile(rejected_email_html);
                var custom_html = template(replacements);

                sgMail.setApiKey(process.env.EMAIL_KEY);
                const msg = {
                    to: email_data.user_email,
                    from: process.env.EMAIL_ID,
                    subject: 'Your Loop Textbook Trade Has Been Rejected',
                    html: custom_html,
                };
                sgMail.send(msg);
            });
        }
    });

    next(true);
};

exports.send_accepted_trade_email = function (trade_id, next) {
    foundTrades.get_trade_by_id(trade_id, function(err, result) {
        if (err) next(err);
        var emails = [];
        var replacements = [];
        logger.log(result);
        var counter = 0;
        for (var i = 0; i < result.length; i++) {
            module.exports.setup_potential_trade_email(result[i].user_id, result[i].book_have, result[i].target_id, result[i].book_want, function (err, email_data) {
                var name, email, wanted_book_name, wanted_book_author, have_book_name, have_book_author, target_name;
                logger.log(email_data);
                var replacement = {
                    owner_user_name: email_data.user_name,
                    target_user_name: email_data.target_name,
                    target_book_name: email_data.wanted_book_name,
                    target_book_author: email_data.wanted_book_author,
                    owned_book_name: email_data.have_book_name,
                    owned_book_author: email_data.have_book_author
                };
                logger.log(replacement);
                replacements.push(replacement);
                logger.log(emails);
                emails.push(email_data.user_email);
                // if (emails.length == 0)
                //     emails += email_data.user_email;
                // else
                //     emails += "," + email_data.user_email;

                if (counter == result.length - 1) {
                    module.exports.create_text_and_send_accepted_email(emails, replacements);
                }
                counter++;
            });
        }
    });

    next(true);
};

exports.create_text_and_send_accepted_email = function(emails, replacements) {
    var trade_info = "The trade information is as follows:\n";
    for (var i = 0; i < replacements.length; i++) {
        trade_info += replacements[i].owner_user_name + "\n\xA0Owned book: " + replacements[i].owned_book_name + "\n\xA0Desired book: "
            + replacements[i].target_book_name + "\n\xA0";
    }
    logger.log(trade_info);
    var replacement_text = {trade_info_text : trade_info};
    var template = handlebars.compile(accepted_email_html);
    var custom_html = template(replacement_text);
    logger.log(emails);
    sgMail.setApiKey(process.env.EMAIL_KEY);
    const msg = {
        to: emails,
        from: process.env.EMAIL_ID,
        subject: 'Congratulations! Loop has found you a complete textbook trade',
        html: custom_html,
    };
    sgMail.send(msg);
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

    sgMail.setApiKey(process.env.EMAIL_KEY);
    const msg = {
        to: email_data.user_email,
        from: process.env.EMAIL_ID,
        subject: 'Loop has found a potential textbook trade',
        html: custom_html,
    };
    sgMail.send(msg);
};