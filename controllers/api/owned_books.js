/*
 * API for adding, deleting, and querying owned books.
 */

const request = require('request');
const error_codes = require('../../error_codes');
const owned_books = require('../../models/owned_books');
const possible_trades = require('../../models/possible_trades');
const graph_edges = require('../../models/graph_edges');
const book_info = require('../../models/book_info');

/*
 * POST http://localhost:3000/api/owned_books/add
 * Add an owned book of an user to the owned_books table.
 * Also should find all (A,B,C) in possible_trades where C=book_id and add (A,B,user_id,C) to the graph_edges table
 * Replies with a json object containing the status of the database operation.
 */
exports.add_book = function(req, res) {
    var user_id = req.user.id;
    var book_id = req.body.book_id;

    owned_books.add_book(user_id, book_id, function(status){
        if (status == error_codes.owned_books_errors.DB_SUCCESS)
            console.log("Successfully added book to the database!");
        else if (status == error_codes.owned_books_errors.OWNED_BOOK_ALREADY_EXISTS)
            console.log("Book is already in the database.");

        res.json({status: status});
    });

    // find all (A,B,C) in possible_trades where C=book_id and add (A,B,user_id,C) to the graph_edges table
    graph_edges.add_owned_book_edges(user_id, book_id, function(status, rows) {
        if (status == error_codes.graph_edges_errors.DB_SUCCESS)
            console.log("Successfully inserted graph edges for owned book in the database!");
        else if (status == error_codes.possible_trades_errors.DB_QUERY_ERROR) 
            console.log("Error inserting graph edges for owned book in database!");
    });
};

/*
 * POST http://localhost:3000/api/owned_books/remove
 * Remove an owned book of an user from the owned_books table.
 * Also should delete all (A,B,C) in possible_trades where A=user_id AND B=book_id.
 * Also should delete all (A,B,C,D) in graph_edges where (A=user_id AND B=book_id) OR (C=user_id AND D=book_id)
 * Replies with a json object containing the status of the database operation.
 */
exports.remove_book = function(req, res) {
    var user_id = req.user.id;
    var book_id = req.body.book_id;

    owned_books.remove_book(user_id, book_id, function(status){
        if (status == error_codes.owned_books_errors.DB_SUCCESS)
            console.log("Successfully removed book from the database!");
        else if (status == error_codes.owned_books_errors.OWNED_BOOK_DOES_NOT_EXIST)
            console.log("Owned book cannot be removed since it is not in the database!");

        res.json({status: status});
    });

    // delete all (A,B,C) in possible_trades where A=user_id AND B=book_id
    possible_trades.remove_relation_have(user_id, book_id, function(status) {
        if (status == error_codes.possible_trades_errors.DB_SUCCESS)
            console.log("Successfully removed relation_have from the database!");

        // res.json({status: status});
    });

    // delete all (A,B,C,D) in graph_edges where (A=user_id AND B=book_id) OR (C=user_id AND D=book_id)
    graph_edges.remove_owned_book(user_id, book_id, function(status) {
        if (status == error_codes.graph_edges_errors.DB_SUCCESS)
            console.log("Successfully removed owned book for all graph edges from the database!");

        // res.json({status: status});
    });
};

/*
 * GET http://localhost:3000/api/owned_books/get_books
 * Gets a list of owned books of an user from the database, where each entry has [book_id, title, author, isbn]
 * Replies with a json object containing the status of the database operation and the list of books.
 */
exports.get_owned_cards = function(req, res) {
    var user_id = req.user.id;
    owned_books.get_owned_books_info(user_id, function(status, data){
        if (status == error_codes.owned_books_errors.DB_SUCCESS)
            console.log("Successfully found books from the database!");

        // return the info for all the books
        res.json({status: error_status, data: books_data});

    });
};

/*
 * GET http://localhost:3000/api/owned_books/get_users
 * Gets a list of owners that own a particular book.
 * Replies with a json object containing the status of the database operation and the list of users.
 */
exports.get_users = function(req, res) {
    var book_id = req.query.book_id;

    owned_books.get_users(book_id, function(status, data){
        if (status == error_codes.owned_books_errors.DB_SUCCESS)
            console.log("Successfully found owners from the database!");

        res.json({status: status, data: data});
    });
};
