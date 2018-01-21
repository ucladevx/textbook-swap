/*
 * Interface to query and modify the table book_info
 */

'use strict';
const pg = require('pg');
const utilities = require('../utilities');
const logger = require('tracer').colorConsole();

/*
 * Purpose: This function is used to get all the information associated with a particular book_id's in the book_info database
 * Inputs: book_id correlating to the information that you want, and a callback function
 * Output: Returns the callback function with a success or error code passed as a parameter and a row related to the book_id
 */
exports.get_book_info = function(book_id, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            logger.error("Error connection to client while querying book_info table: ", err);
            return next(utilities.book_info_errors.DB_CONNECTION_ERROR, []);
        }

        client.query("SELECT * FROM book_info WHERE book_id=$1::INTEGER", [book_id], function(err, result){
            if(err){
                logger.error("Error querying database", err);
                return next(utilities.book_info_errors.DB_QUERY_ERROR, []);
            }
            return next(utilities.book_info_errors.DB_SUCCESS, result.rows);
        });
    });
};

/*
 Purpose: Query the database for all the book_info associated with a given book_id
 Inputs: Array of book_id's
 Output: Returns a callback function that has an success or error code passed as a parameter and the resulting list of [book_id, title, author, isbn] as another parameter
 */
exports.get_books_info = function(book_ids, next) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err) {
            logger.error("Error connection to client while querying books table: ", err);
            return next(utilities.book_info_errors.DB_CONNECTION_ERROR);
        }

        // get the book info for all books
        client.query("SELECT book_id, title, author, isbn, img_url FROM book_info WHERE book_id = any ($1)", [book_ids], function(err, books_info_result) {
            if (err) {
                logger.error("Error querying database", err);
                return next(utilities.book_info_errors.DB_QUERY_ERROR);
            }

            return next(utilities.book_info_errors.DB_SUCCESS, books_info_result.rows);
        });
    });
};