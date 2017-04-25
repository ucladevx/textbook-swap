/*
 * API for adding, deleting, and querying books in the user's wish list.
 */

const request = require('request');
const ec = require('../../error_codes');
const db = require('../../models/wish_list');

/*
 * Add a wanted book of an user to the database.
 * POST http://localhost:3000/api/wish_list/add
 */
exports.add_book = function(req, res) {
    var user_id = req.user.username;
    var user_id = req.body.user_id;
    var book_id = req.body.book_id;

    db.add_book(user_id, book_id, function(status){
        if (status == ec.wish_list_errors.DB_SUCCESS)
            console.log("Successfully added book to the database!");
        else if (status == ec.wish_list_errors.OWNED_BOOK_ALREADY_EXISTS)
            console.log("Book is already in the database.");

        res.json({status: status});
    });
};

/*
 * Remove an wanted book of an user from the database.
 * POST http://localhost:3000/api/wish_list/remove
 */
exports.remove_book = function(req, res) {
    var user_id = req.user.username;
    var user_id = req.body.user_id;
    var book_id = req.body.book_id;

    db.remove_book(user_id, book_id, function(status){
        if (status == ec.wish_list_errors.DB_SUCCESS)
            console.log("Successfully removed book from the database!");

        res.json({status: status});
    });
};

/*
 * Gets a list of wanted books of an user from the database.
 * GET http://localhost:3000/api/wish_list/get_books
 */
exports.get_books = function(req, res) {
    var user_id = req.user.username;
    var user_id = req.query.user_id;

    db.get_wish_list(user_id, function(status, data){
        if (status == ec.wish_list_errors.DB_SUCCESS)
            console.log("Successfully found books from the database!");

        res.json({status: status, data: data});
    });
};

/*
 * Gets a list of owners that want a particular book.
 * GET http://localhost:3000/api/wish_list/get_owners
 */
exports.get_owners = function(req, res) {
    var book_id = req.query.book_id;

    db.get_owners(book_id, function(status, data){
        if (status == ec.wish_list_errors.DB_SUCCESS)
            console.log("Successfully found owners from the database!");

        res.json({status: status, data: data});
    });
};