/*
 * GET /bookshelf
 * Bookshelf.
 */

const users = require('../../models/users');
const owned_books = require('../../models/owned_books');
const book_info = require('../../models/book_info');
const error_codes = require('../../error_codes');

exports.index = function(req, res) {
    var user_id = req.user.id;

    owned_books.get_owned_books(user_id, function(status, data){
        if (status == error_codes.owned_books_errors.DB_SUCCESS)
            console.log("Successfully found books from the database!");

        // convert from array of Javascript objects to just array of book_ids
        var book_ids = [];
        for (var i = 0; i < data.length; i++) {
            book_ids.push(data[i]["book_id"]);
        }

        // get the book info corresponding to each book_id
        book_info.get_books_info(book_ids, function(error_status, books_data) {
            if (error_status) {
                console.error("Error querying database", error_status);
            }
            // return the info for all the books
            users.get_user_name(user_id, function(error_status, user_name) {
                if (error_status) {
                    console.error("Error querying database", error_status);
                }
                res.render('bookshelf', {status: error_status, books: books_data, username: user_name});
            });
            
        });
    });
};