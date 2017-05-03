/*
 * API for adding, deleting, and querying owned books.
 */

const request = require('request');
const ec = require('../../error_codes');
const db = require('../../models/owned_books');
const pt = require('../../models/possible_trades');
const ge = require('../../models/graph_edges');

/*
 * POST http://localhost:3000/api/owned_books/add
 * Add an owned book of an user to the owned_books table.
 * Also should find all (A,B,C) in possible_trades where C=book_id and add (A,B,user_id,C) to the graph_edges table
 * Replies with a json object containing the status of the database operation.
 */
exports.add_book = function(req, res) {
    var user_id = req.user.id;
    var book_id = req.body.book_id;

    db.add_book(user_id, book_id, function(status){
        if (status == ec.owned_books_errors.DB_SUCCESS)
            console.log("Successfully added book to the database!");
        else if (status == ec.owned_books_errors.OWNED_BOOK_ALREADY_EXISTS)
            console.log("Book is already in the database.");

        res.json({status: status});
    });

    // find all (A,B,C) in possible_trades where C=book_id and add (A,B,user_id,C) to the graph_edges table
    pt.get_rows_by_want(book_id, function(status, rows) {
        if (status == ec.possible_trades_errors.DB_SUCCESS)
            console.log("Successfully found possible trades by wanted book in the database!");

        // go through each of the returned rows and add (A, B, user_id, C) to graph_edges 
        for (var i = 0; i < rows.length; i++) {
            ge.add_edge(rows[i]["user_id"], rows[i]["book_have"], user_id, book_id, function(status) {
                
                if (status == ec.graph_edges_errors.DB_SUCCESS)
                    console.log("Edge added successfully to the database!");
                else if (status == ec.graph_edges_errors.GRAPH_EDGE_ALREADY_EXISTS)
                    console.log("Edge already exists in the database!");
                else
                    console.log("Error trying to add edge to database!");
            });
        }
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

    db.remove_book(user_id, book_id, function(status){
        if (status == ec.owned_books_errors.DB_SUCCESS)
            console.log("Successfully removed book from the database!");

        res.json({status: status});
    });

    // delete all (A,B,C) in possible_trades where A=user_id AND B=book_id
    pt.remove_relation_have(user_id, book_id, function(status) {
        if (status == ec.possible_trades_errors.DB_SUCCESS)
            console.log("Successfully removed relation_have from the database!");

        // res.json({status: status});
    });

    // delete all (A,B,C,D) in graph_edges where (A=user_id AND B=book_id) OR (C=user_id AND D=book_id)
    ge.remove_owned_book(user_id, book_id, function(status) {
        if (status == ec.graph_edges_errors.DB_SUCCESS)
            console.log("Successfully removed owned book for all graph edges from the database!");

        // res.json({status: status});
    });
};

/*
 * GET http://localhost:3000/api/owned_books/get_books
 * Gets a list of owned books of an user from the database.
 * Replies with a json object containing the status of the database operation and the list of books.
 */
exports.get_books = function(req, res) {
    var user_id = req.user.id;

    db.get_owned_books(user_id, function(status, data){
        if (status == ec.owned_books_errors.DB_SUCCESS)
            console.log("Successfully found books from the database!");

        res.json({status: status, data: data});
    });
};

/*
 * GET http://localhost:3000/api/owned_books/get_users
 * Gets a list of owners that own a particular book.
 * Replies with a json object containing the status of the database operation and the list of users.
 */
exports.get_users = function(req, res) {
    var book_id = req.query.book_id;

    db.get_users(book_id, function(status, data){
        if (status == ec.owned_books_errors.DB_SUCCESS)
            console.log("Successfully found owners from the database!");

        res.json({status: status, data: data});
    });
};
