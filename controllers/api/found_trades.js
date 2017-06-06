/*
 * API for getting trade status and updating trade status
 */

const request = require('request');
const error_codes = require('../../error_codes');
const found_trades = require('../../models/found_trades');

/*
 * POST http://localhost:3000/api/found_trades/update_status_accepted
 * Update a trade to accepted & check if all trades with same trade_id are accepted
 * Replies with a json object containing the status of the database operation and a boolean telling whether entire trade has been accepted.
 */
exports.update_status_accepted = function(req, res) {
    var user_id = req.user.id;
    var trade_id = req.body.trade_id;
    var owned_book = req.body.owned_book;
    var target_user = req.body.target_user;
    var wanted_book = req.body.wanted_book;

    found_trades.update_status_accepted(trade_id, user_id, owned_book, target_user, wanted_book, function(status){
        if (status == error_codes.found_trades_errors.DB_SUCCESS)
            console.log("Successfully updated trade status to accepted!");
        else{
            console.log("DB error")
        }

        found_trades.get_statuses_by_id(trade_id, function(status, data){
            var matched = true;
            for (var i = 0; i < data.length; i++) {
                if(data[i]["status"] != 'A'){
                    matched = false;
                }
            }
            res.json({status: status, matched: matched});
        });
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
    var owned_book = req.body.owned_book;
    var target_user = req.body.target_user;
    var wanted_book = req.body.wanted_book;

    found_trades.update_status_rejected(trade_id, user_id, owned_book, target_user, wanted_book, function(status){
        if (status == error_codes.found_trades_errors.DB_SUCCESS)
            console.log("Successfully updated trade status to rejected!");
        else{
            console.log("DB error")
        }

        found_trades.get_trade_by_id(trade_id, function(status, data){
            for (var i = 0; i < data.length; i++) {
                found_trades.update_status_rejected(data[i]["trade_id"], data[i]["user_id"], data[i]["book_have"], data[i]["target_id"], data[i]["book_want"], function(status){
                    if (status == error_codes.found_trades_errors.DB_SUCCESS)
                        console.log("Successfully updated trade status to rejected!");
                    else{
                        console.log("DB error")
                    }
                });
            }
            res.json({status: status});
        });
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
        if (status == error_codes.found_trades_errors.DB_SUCCESS)
            console.log("Successfully got trade!");
        else{
            console.log("DB error")
        }

        res.json({status: status, data: data})
    });
};