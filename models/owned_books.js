/*
interface to query and modify the table owned_books
 */

'use strict';
const pg = require('pg');
const error_codes = require('../error_codes');
 const conString = 'postgres://Jayendra:@localhost/loopsDB';

exports.add_book = function(user, book, next){
    /*
    TODO: change this whenever you pull - We should think about changing the architecture so that
    this is set when reading the config somehow
    */
   

    pg.connect(conString, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying owned_books table: ", err);
            return next(error_codes.owned_books_errors.DB_CONNECTION_ERROR);
        }

        //check if the relation exists already
        client.query("SELECT COUNT(user_id) FROM owned_books WHERE user_id=$1::VARCHAR AND book_id=$2::INTEGER", [user, book], function(err, result){
            if (err){
                console.error("Error querying table owned_books", err);
                return next(error_codes.owned_books_errors.DB_QUERY_ERROR);
            }

            //if relationship doesn't exist, it inserts it, if it does, it returns and error
            if(result.rows[0].count == 0){
                client.query("INSERT INTO owned_books (user_id, book_id) VALUES ($1::VARCHAR, $2::INTEGER)", [user, book], function(err, result){
                    if (err){
                        console.error("Error inserting into owned_books table", err);
                        return next(error_codes(error_codes.owned_books_errors.DB_QUERY_ERROR));
                    }

                    return next(error_codes.owned_books_errors.DB_SUCCESS);
                });
            }
            else{
                console.error("UserID, BookID association already exists in owned_books table");
                return next(error_codes.owned_books_errors.OWNED_BOOK_ALREADY_EXISTS);
            }
        });
    });
};


exports.remove_book = function(user, book, next){
    /*
     TODO: change this whenever you pull - We should think about changing the architecture so that
     this is set when reading the config somehow
     */
   

    pg.connect(conString, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying owned_books table: ", err);
            return next(error_codes.owned_books_errors.DB_CONNECTION_ERROR);
        }

        client.query("DELETE FROM owned_books WHERE user_id=$1::VARCHAR AND book_id=$2::INTEGER", [user, book], function(err, result){
            if(err){
                console.error("Error querying database", err);
                return next(error_codes.owned_books_errors.DB_QUERY_ERROR);
            }
            return next(error_codes.owned_books_errors.DB_SUCCESS);
        });
    });
};

exports.get_owned_books = function(user, next){
    /*
     TODO: change this whenever you pull - We should think about changing the architecture so that
     this is set when reading the config somehow
     */

    pg.connect(conString, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying owned_books table: ", err);
            return next(error_codes.owned_books_errors.DB_CONNECTION_ERROR);
        }

        client.query("SELECT book_id FROM owned_books WHERE user_id=$1::VARCHAR", [user], function(err, result){
            if(err){
                console.error("Error querying database", err);
                return next(error_codes.owned_books_errors.DB_QUERY_ERROR);
            }
            return next(error_codes.owned_books_errors.DB_SUCCESS, result.rows);
        });
    });
};

exports.get_owners = function(book, next){
    /*
     TODO: change this whenever you pull - We should think about changing the architecture so that
     this is set when reading the config somehow
     */

    pg.connect(conString, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying owned_books table: ", err);
            return next(error_codes.owned_books_errors.DB_CONNECTION_ERROR);
        }

        client.query("SELECT user_id FROM owned_books WHERE book_id=$1::INTEGER", [book], function(err, result){
            if(err){
                console.error("Error querying database", err);
                return next(error_codes.owned_books_errors.DB_QUERY_ERROR);
            }
            return next(error_codes.owned_books_errors.DB_SUCCESS, result.rows);
        });
    });
};