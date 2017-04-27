/*
 * API for adding, deleting, and querying books in the user's wish list.
 */

const request = require('request');
const ec = require('../../error_codes');
const db = require('../../models/wish_list');

/*
 * POST http://localhost:3000/api/wish_list/add
 * Add a wanted book of an user to the database.
 */
exports.add_book = function(req, res) {
    // var user_id = req.user.username;
    var user_id = req.body.user_id;
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
 * Remove an wanted book of an user from the database.
 */
exports.remove_book = function(req, res) {
    // var user_id = req.user.username;
    var user_id = req.body.user_id;
    var book_id = req.body.book_id;

    db.remove_book(user_id, book_id, function(status){
        if (status == ec.wish_list_errors.DB_SUCCESS)
            console.log("Successfully removed book from the database!");

        res.json({status: status});
    });
};

/*
 * GET http://localhost:3000/api/wish_list/get_books
 * Gets a list of wanted books of an user from the database.
 */
exports.get_books = function(req, res) {
    // var user_id = req.user.username;
    var user_id = req.query.user_id;

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