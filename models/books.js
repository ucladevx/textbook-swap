/*
 * Interface to query and modify the table books
 */

'use strict';
const pg = require('pg');
const error_codes = require('../error_codes');

/*
    Purpose: Query the database and return top 10 relevant results based on search box input
    Inputs: Search box input typed by user
    Output: Returns a callback function that has an success or error code passed as a parameter and the resulting list of [book_name, class_name, rank] as another parameter
 */
exports.get_search_results = function(search_input, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying books table: ", err);
            return next(error_codes.books_errors.DB_CONNECTION_ERROR);
        }

        client.query("SELECT book_name, class_name, ts_rank_cd(tsv, query, 1) AS rank FROM books, plainto_tsquery($1::VARCHAR) query WHERE tsv @@ query ORDER BY rank DESC LIMIT 10", [search_input], function(err, result){
            if(err){
                console.error("Error querying database", err);
                return next(error_codes.books_errors.DB_QUERY_ERROR);
            }
            return next(error_codes.books_errors.DB_SUCCESS, result.rows);
        });
    });
};
