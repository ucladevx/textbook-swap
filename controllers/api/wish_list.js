/*
 * API for adding, deleting, and querying books in the user's wish list.
 */

const request = require('request');
const ec = require('../../error_codes');
const db = require('../../models/wish_list');
const bt = require('../../models/books');
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
            console.log("Successfully removed wanted book from the database!");
        else if (status == ec.wish_list_errors.WISH_LIST_BOOK_DOES_NOT_EXIST) 
            console.log("Wanted book cannot be removed since it is not in the database!");

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
 * Gets a list of owned books of an user from the database, where each entry has [book_id, title, author, isbn]
 * Replies with a json object containing the status of the database operation and the list of books.
 */
exports.get_books = function(req, res) {
    var user_id = req.user.id;

    db.get_wanted_books(user_id, function(status, data){
        if (status == ec.wish_list_errors.DB_SUCCESS)
            console.log("Successfully found books from the database!");

        // convert from array of Javascript objects to just array of book_ids
        var book_ids = new Array();
        for (var i = 0; i < data.length; i++) {
            book_ids.push(data[i]["book_id"]);
        }

        // get the book info corresponding to each book_id 
        bt.get_books_info(book_ids, function(error_status, books_data) {
            if (error_status) {
                console.error("Error querying database", error_status);
            }
            // return the info for all the books
            res.json({status: error_status, data: books_data});
        });
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