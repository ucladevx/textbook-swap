/*
 * Interface to query and modify the table books
 */

'use strict';
const pg = require('pg');
const utilities = require('../utilities');

var searchAndReplace = function(results, book_num, ranking){
    for (var k = 0; k < results.length; k++) {
        if (results[k].book_id === book_num) {
            results[k].rank = ranking;
            return;
        }
    }

};

var add_books_results = function(database_rows, results, keys_visited){
    for (var i = 0; i < database_rows.length; i++){
        if(!keys_visited.has(database_rows[i].book_id)){
            results.push({book_id: database_rows[i].book_id, rank: database_rows[i].rank});
            keys_visited.add(database_rows[i].book_id);
        }
        else {
            searchAndReplace(results, database_rows[i].book_id, database_rows[i].rank);
        }
    }
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
            console.error("Error connection to client while querying books table: ", err);
            return next(utilities.book_info_errors.DB_CONNECTION_ERROR);
        }

        // get the book info for all books
        client.query("SELECT book_id, title, author, isbn, img_url FROM book_info WHERE book_id = any ($1)", [book_ids], function(err, books_info_result) {
            if (err) {
                console.error("Error querying database", err);
                return next(utilities.book_info_errors.DB_QUERY_ERROR);
            }

            return next(utilities.book_info_errors.DB_SUCCESS, books_info_result.rows);
        });
    });
};


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
            return next(utilities.book_info_errors.DB_CONNECTION_ERROR);
        }

        client.query("SELECT book_id, professor_name, class_name, ts_rank_cd(tsv, query, 1) AS rank FROM book_to_class, plainto_tsquery($1::VARCHAR) query WHERE tsv @@ query ORDER BY rank DESC LIMIT 10", [search_input], function(err, books_result){
            if(err){
                console.error("Error querying database", err);
                return next(utilities.book_to_class_errors.DB_QUERY_ERROR);
            }

            client.query("SELECT book_id, title, author, isbn, ts_rank_cd(tsv, query, 1) AS rank FROM book_info, plainto_tsquery($1::VARCHAR) query WHERE tsv @@ query ORDER BY rank DESC LIMIT 10", [search_input], function(err, books_info_result){
                var books_result_rows = books_result.rows;
                var books_info_rows = books_info_result.rows;

                var results = new Array();
                var keys_visited = new Set();

                //logic to merge the results and the higher rank of duplicates
                add_books_results(books_result_rows, results, keys_visited);
                add_books_results(books_info_rows, results, keys_visited);


                results.sort(function(a,b) {
                    return b.rank - a.rank;
                });

                // returns a array of javascript objects EX. [{book_id: 1231, rank: 0.071}, ...]
                return next(utilities.book_info_errors.DB_SUCCESS, results);
            });
        });
    });
};
