/*
 * API for adding, deleting, and querying books in the user's wish list.
 */

const request = require('request');
const ec = require('../../error_codes');
const db = require('../../models/wish_list');
const pt = require('../../models/possible_trades');
const ge = require('../../models/graph_edges');

/*
 * POST http://localhost:3000/api/wish_list/add
 * Add a wanted book of an user to the wish_list table.
 */
exports.add_book = function(req, res) {
    var user_id = req.user.id;
    var book_id = req.body.book_id;

    db.add_book(user_id, book_id, function(status){
        if (status == ec.wish_list_errors.DB_SUCCESS)
            console.log("Successfully added book to the database!");
        else if (status == ec.wish_list_errors.WISH_LIST_BOOK_ALREADY_EXISTS)
            console.log("Book is already in the database.");

        res.json({status: status});
    });

    // TODO: should also add entry into possible_trades and graph_edges?
};

/*
 * POST http://localhost:3000/api/wish_list/remove
 * Remove an wanted book of an user from the wish_list table.
 * Also should delete all (A,B,C) in possible_trades where A=user_id AND C=book_id.
 * Also should delete all (A,B,C,D) in graph_edges where A=user_id AND D=book_id
 */
exports.remove_book = function(req, res) {
    var user_id = req.user.id;
    var book_id = req.body.book_id;

    db.remove_book(user_id, book_id, function(status){
        if (status == ec.wish_list_errors.DB_SUCCESS)
            console.log("Successfully removed book from the database!");

        res.json({status: status});
    });

    // delete all (A,B,C) in possible_trades where A=user_id AND C=book_id
    pt.remove_relation_want(user_id, book_id, function(status) {
        if (status == ec.possible_trades_errors.DB_SUCCESS)
            console.log("Successfully removed relation_want from the database!");

        // res.json({status: status});
    });

    // delete all (A,B,C,D) in graph_edges where (A=user_id AND B=book_id) OR (C=user_id AND D=book_id)
    ge.remove_wanted_book(user_id, book_id, function(status) {
        if (status == ec.graph_edges_errors.DB_SUCCESS)
            console.log("Successfully removed wanted book for all graph edges from the database!");

        // res.json({status: status});
    });
};

/*
 * GET http://localhost:3000/api/wish_list/get_books
 * Gets a list of wanted books of an user from the database.
 */
exports.get_books = function(req, res) {
    var user_id = req.user.id;

    db.get_wanted_books(user_id, function(status, data){
        if (status == ec.wish_list_errors.DB_SUCCESS)
            console.log("Successfully found books from the database!");

        res.json({status: status, data: data});
    });
};

/*
 * GET http://localhost:3000/api/wish_list/get_users
 * Gets a list of owners that want a particular book.
 */
exports.get_users = function(req, res) {
    var book_id = req.query.book_id;

    db.get_users(book_id, function(status, data){
        if (status == ec.wish_list_errors.DB_SUCCESS)
            console.log("Successfully found owners from the database!");

        res.json({status: status, data: data});
    });
};