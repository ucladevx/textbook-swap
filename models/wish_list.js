/*
 * Interface to query and modify the table wish_list
 */

'use strict';
const pg = require('pg');
const error_codes = require('../error_codes');

exports.add_book = function(user, book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying wish_list table: ", err);
            return next(error_codes.wish_list_errors.DB_CONNECTION_ERROR);
        }

        //check if the relation exists already
        client.query("SELECT COUNT(user_id) FROM wish_list WHERE user_id=$1::VARCHAR AND book_id=$2::INTEGER", [user, book], function(err, result){
            if (err){
                console.error("Error querying table wish_list", err);
                return next(error_codes.wish_list_errors.DB_QUERY_ERROR);
            }

            //if relationship doesn't exist, it inserts it, if it does, it returns and error
            if(result.rows[0].count == 0){
                client.query("INSERT INTO wish_list (user_id, book_id) VALUES ($1::VARCHAR, $2::INTEGER)", [user, book], function(err, result){
                    if (err){
                        console.error("Error inserting into wish_list table", err);
                        return next(error_codes.wish_list_errors.DB_QUERY_ERROR);
                    }

                    return next(error_codes.wish_list_errors.DB_SUCCESS);
                });
            }
            else{
                console.error("UserID, BookID association already exists in wish_list table");
                return next(error_codes.wish_list_errors.OWNED_BOOK_ALREADY_EXISTS);
            }
        });
    });
};

exports.remove_book = function(user, book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying wish_list table: ", err);
            return next(error_codes.wish_list_errors.DB_CONNECTION_ERROR);
        }

        client.query("DELETE FROM wish_list WHERE user_id=$1::VARCHAR AND book_id=$2::INTEGER", [user, book], function(err, result){
            if(err){
                console.error("Error querying database", err);
                return next(error_codes.wish_list_errors.DB_QUERY_ERROR);
            }
            return next(error_codes.wish_list_errors.DB_SUCCESS);
        });
    });
};

exports.get_wanted_books = function(user, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying wish_list table: ", err);
            return next(error_codes.wish_list_errors.DB_CONNECTION_ERROR, []);
        }

        client.query("SELECT book_id FROM wish_list WHERE user_id=$1::VARCHAR", [user], function(err, result){
            if(err){
                console.error("Error querying database", err);
                return next(error_codes.wish_list_errors.DB_QUERY_ERROR, []);
            }
            return next(error_codes.wish_list_errors.DB_SUCCESS, result.rows);
        });
    });
};

exports.get_users = function(book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying wish_list table: ", err);
            return next(error_codes.wish_list_errors.DB_CONNECTION_ERROR);
        }

        client.query("SELECT user_id FROM wish_list WHERE book_id=$1::INTEGER", [book], function(err, result){
            if(err){
                console.error("Error querying database", err);
                return next(error_codes.wish_list_errors.DB_QUERY_ERROR);
            }
            return next(error_codes.wish_list_errors.DB_SUCCESS, result.rows);
        });
    });
};