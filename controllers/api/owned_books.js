/*
 * API for adding, deleting, and querying owned books.
 */

const request = require('request');
const ec = require('../../error_codes');
const db = require('../../models/owned_books');

/*
 * Add an owned book of an user to the database.
 * POST http://localhost:3000/api/owned_books/add
 */
exports.add_book = function(req, res) {
    var user_id = req.user.username;
    var user_id = req.body.user_id;
    var book_id = req.body.book_id;

    db.add_book(user_id, book_id, function(status){
        if (status == ec.owned_books_errors.DB_SUCCESS)
            console.log("Successfully added book to the database!");
        else if (status == ec.owned_books_errors.OWNED_BOOK_ALREADY_EXISTS)
            console.log("Book is already in the database.");

        res.json({status: status});
    });
};

/*
 * Remove an owned book of an user from the database.
 * POST http://localhost:3000/api/owned_books/remove
 */
exports.remove_book = function(req, res) {
    var user_id = req.user.username;
    var user_id = req.body.user_id;
    var book_id = req.body.book_id;

    db.remove_book(user_id, book_id, function(status){
        if (status == ec.owned_books_errors.DB_SUCCESS)
            console.log("Successfully removed book from the database!");

        res.json({status: status});
    });
};

/*
 * Gets a list of owned books of an user from the database.
 * GET http://localhost:3000/api/owned_books/get_books
 */
exports.get_books = function(req, res) {
    var user_id = req.user.username;
    var user_id = req.query.user_id;

    db.get_owned_books(user_id, function(status, data){
        if (status == ec.owned_books_errors.DB_SUCCESS)
            console.log("Successfully found books from the database!");

        res.json({status: status, data: data});
    });
};

/*
 * Gets a list of owners that own a particular book.
 * GET http://localhost:3000/api/owned_books/get_owners
 */
exports.get_owners = function(req, res) {
    var book_id = req.query.book_id;

    db.get_owners(book_id, function(status, data){
        if (status == ec.owned_books_errors.DB_SUCCESS)
            console.log("Successfully found owners from the database!");

        res.json({status: status, data: data});
    });
};

