/*
 * API for adding, deleting, and querying possible trade relations
 */

const request = require('request');
const ec = require('../../utilities');
const db = require('../../models/possible_trades');
const ob = require('../../models/owned_books');
const ge = require('../../models/graph_edges');
const logger = require('tracer').colorConsole();


/*
 * POST http://localhost:3000/api/possible_trades/add
 * Add a trade relation for a user, owned book, and wanted book to the possible_trades table.
 * Also should find all (A,B) in the owned_book table where B=wanted_book_id and insert (user_id, owned_book_id, A, wanted_book_id) into the graph_edges table.
 * Replies with a json object containing the status of the database operation.
 */
exports.add_relation = function(req, res) {
    var user_id = req.user.id;
    var owned_book_id = req.body.owned_book_id;
    var wanted_book_id = req.body.wanted_book_id;

    db.add_relation(user_id, owned_book_id, wanted_book_id, function(status){
        if (status == ec.possible_trades_errors.DB_SUCCESS)
            logger.log("Successfully added relation to the database!");
        else if (status == ec.possible_trades_errors.POSSIBLE_TRADE_ALREADY_EXISTS)
            logger.log("Relation is already in the database.");

        res.json({status: status});
    });

    //find all (A,B) in the owned_book table where B=wanted_book_id and insert (user_id, owned_book_id, A, wanted_book_id) into the graph
    //someone owns the book you want
    ge.add_trade_relation_edges(user_id, owned_book_id, wanted_book_id, function(status, rows) {
        if (status == ec.graph_edges_errors.DB_SUCCESS)
            logger.log("Successfully inserted graph edges for trade relation in the database!");
        else if (status == ec.possible_trades_errors.DB_QUERY_ERROR) 
            logger.log("Error inserting trade relation graph edges for owned book in database!");
    });
};

/*
 * POST http://localhost:3000/api/possible_trades/remove
 * Remove a trade relation for a user, owned book, and wanted book from the possible_trades table.
 * Also should delete all (A,B,C,D) in graph_edges where A=user_id AND B=owned_book_id AND D=wanted_book_id
 * Replies with a json object containing the status of the database operation.
 */
exports.remove_relation = function(req, res) {
    var user_id = req.user.id;
    var owned_book_id = req.body.owned_book_id;
    var wanted_book_id = req.body.wanted_book_id;

    db.remove_relation(user_id, owned_book_id, wanted_book_id, function(status){
        if (status == ec.possible_trades_errors.DB_SUCCESS)
            logger.log("Successfully removed relation from the database!");
        else
            logger.log("Error trying to remove relation from database.");

        res.json({status: status});
    });

    ge.remove_user_owned_want(user_id, owned_book_id, wanted_book_id, function(status){
        if (status == ec.possible_trades_errors.DB_SUCCESS)
            logger.log("Successfully removed edges from the database!");
        else
            logger.log("Error trying to remove relation from database.");
    });
};

// /*
//  * POST http://localhost:3000/api/possible_trades/remove_have
//  * Remove all trade relations for a specific user and owned book.
//  * Replies with a json object containing the status of the database operation.
//  */
// exports.remove_relation_have = function(req, res) {
//     var user_id = req.user.id;
//     var owned_book_id = req.body.owned_book_id;
//
//     owned_books.remove_relation_have(user_id, owned_book_id, function(status){
//         if (status == utilities.possible_trades_errors.DB_SUCCESS)
//             logger.log("Successfully removed relation-have from the database!");
//
//         res.json({status: status});
//     });
// };
//
// /*
//  * POST http://localhost:3000/api/possible_trades/remove_want
//  * Remove all trade relations for a specific user and wanted book.
//  * Replies with a json object containing the status of the database operation.
//  */
// exports.remove_relation_want = function(req, res) {
//     var user_id = req.user.id;
//     var wanted_book_id = req.body.wanted_book_id;
//
//     owned_books.remove_relation_want(user_id, wanted_book_id, function(status){
//         if (status == utilities.possible_trades_errors.DB_SUCCESS)
//             logger.log("Successfully removed relation-want from the database!");
//
//         res.json({status: status});
//     });
// };

/*
 * GET http://localhost:3000/api/possible_trades/get_book_wants
 * Gets a list of wanted books associated with a specific user and owned book.
 */
exports.get_book_wants = function(req, res) {
    var user_id = req.user.id;
    var owned_book_id = req.body.owned_book_id;

    db.get_book_wants(user_id, owned_book_id, function(status, data){
        if (status == ec.possible_trades_errors.DB_SUCCESS)
            logger.log("Successfully found wanted books from the database!");

        res.json({status: status, data: data});
    });
};