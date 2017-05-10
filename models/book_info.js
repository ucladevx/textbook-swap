/*
 * Interface to query and modify the table book_info
 */

'use strict';
const pg = require('pg');
const error_codes = require('../error_codes');

/*
 * Purpose: This function is used to get all the information associated with a particular book_id's in the book_info database
 * Inputs: book_id correlating to the information that you want, and a callback function
 * Output: Returns the callback function with a success or error code passed as a parameter and a row related to the book_id
 */
exports.get_book_info = function(book_id, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying book_info table: ", err);
            return next(error_codes.book_info_errors.DB_CONNECTION_ERROR, []);
        }

        client.query("SELECT * FROM book_info WHERE book_id=$1::INTEGER", [book_id], function(err, result){
            if(err){
                console.error("Error querying database", err);
                return next(error_codes.book_info_errors.DB_QUERY_ERROR, []);
            }
            return next(error_codes.book_info_errors.DB_SUCCESS, result.rows);
        });
    });
};