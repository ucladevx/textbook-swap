/*
 * API for adding, deleting, and querying possible trade relations
 */

const request = require('request');
const ec = require('../../error_codes');
const db = require('../../models/possible_trades.js');

/*
 * POST http://localhost:3000/api/possible_trades/add
 * Add a trade relation for a user, owned book, and wanted book.
 * Replies with a json object containing the status of the database operation.
 */
exports.add_relation = function(req, res) {
    var user_id = req.user.id;
    var owned_book_id = req.body.owned_book_id;
    var wanted_book_id = req.body.wanted_book_id;

    db.add_relation(user_id, owned_book_id, wanted_book_id, function(status){
        if (status == ec.possible_trades_errors.DB_SUCCESS)
            console.log("Successfully added relation to the database!");
        else if (status == ec.possible_trades_errors.POSSIBLE_TRADE_ALREADY_EXISTS)
            console.log("Relation is already in the database.");

        res.json({status: status});
    });
};

/*
 * POST http://localhost:3000/api/possible_trades/remove
 * Remove a trade relation for a user, owned book, and wanted book.
 * Replies with a json object containing the status of the database operation.
 */
exports.remove_relation = function(req, res) {
    var user_id = req.user.id;
    var owned_book_id = req.body.owned_book_id;
    var wanted_book_id = req.body.wanted_book_id;

    db.remove_relation(user_id, owned_book_id, wanted_book_id, function(status){
        if (status == ec.possible_trades_errors.DB_SUCCESS)
            console.log("Successfully removed relation from the database!");

        res.json({status: status});
    });
};

/*
 * POST http://localhost:3000/api/possible_trades/remove_have
 * Remove all trade relations for a specific user and owned book.
 * Replies with a json object containing the status of the database operation.
 */
exports.remove_relation_have = function(req, res) {
    var user_id = req.user.id;
    var owned_book_id = req.body.owned_book_id;

    db.remove_relation_have(user_id, owned_book_id, function(status){
        if (status == ec.possible_trades_errors.DB_SUCCESS)
            console.log("Successfully removed relation-have from the database!");

        res.json({status: status});
    });
};

/*
 * POST http://localhost:3000/api/possible_trades/remove_want
 * Remove all trade relations for a specific user and wanted book.
 * Replies with a json object containing the status of the database operation.
 */
exports.remove_relation_want = function(req, res) {
    var user_id = req.user.id;
    var wanted_book_id = req.body.wanted_book_id;

    db.remove_relation_want(user_id, wanted_book_id, function(status){
        if (status == ec.possible_trades_errors.DB_SUCCESS)
            console.log("Successfully removed relation-want from the database!");

        res.json({status: status});
    });
};

/*
 * GET http://localhost:3000/api/wish_list/get_book_wants
 * Gets a list of wanted books associated with a specific user and owned book.
 */
exports.get_book_wants = function(req, res) {
    var user_id = req.user.id;
    var owned_book_id = req.body.owned_book_id;

    db.get_book_wants(user_id, owned_book_id, function(status, data){
        if (status == ec.possible_trades_errors.DB_SUCCESS)
            console.log("Successfully found wanted books from the database!");

        res.json({status: status, data: data});
    });
};