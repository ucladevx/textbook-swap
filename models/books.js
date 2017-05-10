/*
 * Interface to query and modify the table books
 */

'use strict';
const pg = require('pg');
const error_codes = require('../error_codes');

/*
    Purpose: Query the database and return top 10 relevant results based on search box input
    Inputs: Search box input typed by user
    Output: Returns a callback function that has an success or error code passed as a parameter and the resulting list of [book_id, book_name, class_name, rank] as another parameter
 */
exports.get_search_results = function(search_input, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying books table: ", err);
            return next(error_codes.books_errors.DB_CONNECTION_ERROR);
        }

        client.query("SELECT book_id, professor_name, class_name, ts_rank_cd(tsv, query, 1) AS rank FROM book_to_class, plainto_tsquery($1::VARCHAR) query WHERE tsv @@ query ORDER BY rank DESC LIMIT 10", [search_input], function(err, books_result){
            if(err){
                console.error("Error querying database", err);
                return next(error_codes.books_errors.DB_QUERY_ERROR);
            }

            client.query("SELECT book_id, title, author, isbn, ts_rank_cd(tsv, query, 1) AS rank FROM book_info, plainto_tsquery($1::VARCHAR) query WHERE tsv @@ query ORDER BY rank DESC LIMIT 10", [search_input], function(err, books_info_result){
                console.log(books_result);
                console.log(book_info_result);
                return next(error_codes.books_errors.DB_SUCCESS, books_result);
            });
        });
    });
};
