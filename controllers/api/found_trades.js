/*
 * API for getting trade status and updating trade status
 */

const request = require('request');
const utilities = require('../../utilities');
const found_trades = require('../../models/found_trades');
const logger = require('tracer').colorConsole();
const emailer = require('../../models/emailer');

/*
 * POST http://localhost:3000/api/found_trades/update_status_accepted
 * Update a trade to accepted & check if all trades with same trade_id are accepted
 * Replies with a json object containing the status of the database operation and a boolean telling whether entire trade has been accepted.
 */

// TODO: modify yes

exports.update_status_accepted = function(req, res) {
    var user_id = req.user.id;
    var trade_id = req.body.trade_id;
    var owned_book = req.body.owned_book;
    var target_user = req.body.target_user;
    var wanted_book = req.body.wanted_book;

    found_trades.update_status_accepted(trade_id, user_id, owned_book, target_user, wanted_book, function(status, matched){
        if (status == utilities.found_trades_errors.DB_SUCCESS)
            logger.log("Successfully updated trade status to accepted!");
        else{
            logger.log("DB error")
        }
        res.json({status: status, matched: matched});
    });
};

/*
 * POST http://localhost:3000/api/found_trades/update_status_rejected
 * Update a trade to rejected & set all other rows with same trade_id to reject
 * Replies with a json object containing the status of the database operation
 */
exports.update_status_rejected = function(req, res) {
    var user_id = req.user.id;
    var trade_id = req.body.trade_id;

    found_trades.update_status_rejected_by_id(trade_id, function(status){
        if (status == utilities.found_trades_errors.DB_SUCCESS) {
            emailer.send_rejected_trade_email(trade_id, function (status) {
                if (status == true) {
                    logger.log("email sent properly");
                }
                else {
                    logger.log("email error");
                }
            });
            logger.log("Successfully updated trade status to rejected!");
        }
        else{
            logger.log("DB error")
        }
        res.json({status: status});
    });
};

/*
 * GET http://localhost:3000/api/found_trades/get_trade_by_wanted_book
 * Get a trade by the user_id and wanted_book
 * Replies with a json object containing the status of the database operation and the row for the trade
 */
exports.get_trade_by_wanted_book = function(req, res) {
    var user_id = req.user.id;
    var wanted_book = req.query.wanted_book;

    found_trades.get_trade_by_wanted_book(user_id, wanted_book, function(status, data){
        if (status == utilities.found_trades_errors.DB_SUCCESS)
            logger.log("Successfully got trade!");
        else{
            logger.log("DB error")
        }

        res.json({status: status, data: data})
    });
};

/*
 * GET http://localhost:3000/api/found_trades/get_trade_by_book_owned
 * Get a trade by the user_id and book_owned
 * Replies with a json object containing the status of the database operation and the row for the trade
 */
exports.get_trade_by_book_owned = function(req, res) {
    var user_id = req.user.id;
    var owned_book = req.query.owned_book;

    found_trades.get_trade_by_book_owned(user_id, owned_book, function(status, data){
        if (status == utilities.found_trades_errors.DB_SUCCESS)
            logger.log("Successfully got trade by owned book!");
        else{
            logger.log("DB error")
        }

        res.json({status: status, data: data})
    });
};

/*
 * POST /api/found_trades/dismiss_rejected_trade
 * Removes a found trade by user_id and book_have
 */
exports.dismiss_rejected_trade = function(req, res) {
    var user_id = req.user.id;
    var owned_book = req.body.owned_book;
    logger.log(user_id, owned_book);

    found_trades.remove_trade_by_book_owned(user_id, owned_book, function(status){
        if (status == utilities.found_trades_errors.DB_SUCCESS)
            logger.log("Successfully dismissed trade!");
        else{
            logger.log("DB error")
        }

        res.json({status: status});
    });
};