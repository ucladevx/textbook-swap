/*
 * Interface to query and modify the table owned_books
 */

'use strict';
const pg = require('pg');
const utilities = require('../utilities');
const logger = require('tracer').colorConsole();

/*
Purpose: This function is used to add a user_id, book_id relation to the owned_book database
Inputs: User_id, book_id to be added, and callback function
Output: Returns the callback function with a success or error code passed as a parameter
 */
exports.add_book = function(user, book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            logger.error("Error connection to client while querying owned_books table: ", err);
            return next(utilities.owned_books_errors.DB_CONNECTION_ERROR);
        }

        //check if the relation exists already
        client.query("SELECT COUNT(user_id) FROM owned_books WHERE user_id=$1::VARCHAR AND book_id=$2::INTEGER", [user, book], function(err, result){
            if (err){
                logger.error("Error querying table owned_books", err);
                return next(utilities.owned_books_errors.DB_QUERY_ERROR);
            }

            //if relationship doesn't exist, it inserts it, if it does, it returns and error
            if(result.rows[0].count == 0){
                client.query("INSERT INTO owned_books (user_id, book_id) VALUES ($1::VARCHAR, $2::INTEGER)", [user, book], function(err, result){
                    client.end();
                    if (err){
                        logger.error("Error inserting into owned_books table", err);
                        return next(utilities.owned_books_errors.DB_QUERY_ERROR);
                    }

                    return next(utilities.owned_books_errors.DB_SUCCESS);
                });
            }
            else{
                logger.error("UserID, BookID association already exists in owned_books table");
                return next(utilities.owned_books_errors.OWNED_BOOK_ALREADY_EXISTS);
            }
        });
    });
};

/*
 Purpose: This function is used to remove a user_id, book_id relation from the owned_book database
 Inputs: User_id, book_id to be removed, and callback function
 Output: Returns the callback function with a success or error code passed as a parameter
 */
exports.remove_book = function(user, book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            logger.error("Error connection to client while querying owned_books table: ", err);
            return next(utilities.owned_books_errors.DB_CONNECTION_ERROR);
        }

        client.query("DELETE FROM owned_books WHERE user_id=$1::VARCHAR AND book_id=$2::INTEGER", [user, book], function(err, result){
            client.end();
            if(err){
                logger.error("Error querying database", err);
                return next(utilities.owned_books_errors.DB_QUERY_ERROR);
            }
            return next(utilities.owned_books_errors.DB_SUCCESS);
        });
    });
};

/*
 Purpose: This function is used to get all the book_id's that a user_id is related to in the owned_book database
 Inputs: User_id that you want to know what books he or she owns and callback function
 Output: Returns the callback function with a success or error code passed as a parameter and a list of the book_ids related to the user
 */
exports.get_owned_books = function(user, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            logger.error("Error connection to client while querying owned_books table: ", err);
            return next(utilities.owned_books_errors.DB_CONNECTION_ERROR, []);
        }

        client.query("SELECT book_id FROM owned_books WHERE user_id=$1::VARCHAR", [user], function(err, result){
            client.end();
            if(err){
                logger.error("Error querying database", err);
                return next(utilities.owned_books_errors.DB_QUERY_ERROR, []);
            }
            return next(utilities.owned_books_errors.DB_SUCCESS, result.rows);
        });
    });
};

/*
 Purpose: This function is used to get all the book info for the books that a user owns
 Inputs: User_id that you want to know what books he or she owns and callback function
 Output: Returns the callback function with a success or error code passed as a parameter and a list of the book_ids related to the user
 */
exports.get_owned_books_info = function(user, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            logger.error("Error connection to client while querying owned_books table: ", err);
            return next(utilities.owned_books_errors.DB_CONNECTION_ERROR, []);
        }

        client.query("SELECT book_id, title, author, isbn, img_url FROM book_info WHERE book_id in (SELECT book_id FROM owned_books WHERE user_id=$1::VARCHAR)", [user], function(err, result){
            client.end();
            if(err){
                logger.error("Error querying database", err);
                return next(utilities.owned_books_errors.DB_QUERY_ERROR, []);
            }
            return next(utilities.owned_books_errors.DB_SUCCESS, result.rows);
        });
    });
};

/*
    Purpose: The users that own a specific book in the database
    Inputs: The book_id that you want to get all the users that own it, and callback function
    Output: Returns a callback function that has an success or error code passed as a parameter and the resulting list of user_ids as another parameter
 */
exports.get_users = function(book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            logger.error("Error connection to client while querying owned_books table: ", err);
            return next(utilities.owned_books_errors.DB_CONNECTION_ERROR);
        }

        client.query("SELECT user_id FROM owned_books WHERE book_id=$1::INTEGER", [book], function(err, result){
            client.end();
            if(err){
                logger.error("Error querying database", err);
                return next(utilities.owned_books_errors.DB_QUERY_ERROR);
            }
            return next(utilities.owned_books_errors.DB_SUCCESS, result.rows);
        });
    });
};