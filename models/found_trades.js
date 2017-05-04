/*
 * Interface to query and modify the table found_trades.
 */

'use strict';
const pg = require('pg');
const error_codes = require('../error_codes');

/*
 *  Purpose: Add a loop graph edge into the database
 *  Inputs:loop_id: the id of the loop found user_id: user that owns a book, owned_book: book id of owned book, target_user: the user that owns a book the User wants, wanted_book: book id of the wanted book
 *  and a callback function
 *  Output: Returns the callback function that has an error code (or success) passed back as a parameter
 */
exports.add_loop_edge = function(loop_id, user_id, owned_book, target_user, wanted_book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying found_trades table: ", err);
            return next(error_codes.found_trades_errors.DB_CONNECTION_ERROR);
        }

        //check if the relation exists already
        client.query("SELECT COUNT(user_id) FROM found_trades WHERE trade_id=$5::INTEGER user_id=$1::VARCHAR AND book_have=$2::INTEGER AND target_id=$3::VARCHAR AND book_want=$4::INTEGER ",
            [user_id, owned_book, target_user, wanted_book, loop_id], function(err, result){
                if (err){
                    console.error("Error querying table found_trades", err);
                    return next(error_codes.found_trades_errors.DB_QUERY_ERROR);
                }

                //if relationship doesn't exist, it inserts it, if it does, it returns and error
                if(result.rows[0].count == 0){
                    client.query("INSERT INTO found_trades (trade_id, user_id, book_have, target_id, book_want) VALUES ($5::INTEGER, $1::VARCHAR, $2::INTEGER, $3::VARCHAR, $4::INTEGER)",
                        [user_id, owned_book, target_user, wanted_book, loop_id], function(err, result){
                            if (err){
                                console.error("Error inserting into found_trades table", err);
                                return next(error_codes.found_trades_errors.DB_QUERY_ERROR);
                            }

                            return next(error_codes.found_trades_errors.DB_SUCCESS);
                        });
                }
                else{
                    console.error("Edge already exists in found_edges table");
                    return next(error_codes.found_trades_errors.GRAPH_EDGE_ALREADY_EXISTS);
                }
            });
    });
};

/*
 * Purpose: Get all graph edges from the database associated with a trade_id
 * Inputs: trade_id: id of the loop, next: a callback function
 * Output: Returns the callback function that has an error code (or success) passed back as a parameter, and a list of edges
 */
exports.get_trade_by_id = function(trade_id, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying found_trades table: ", err);
            return next(error_codes.found_trades_errors.DB_CONNECTION_ERROR);
        }

        client.query("SELECT * FROM found_trades WHERE trade_id=$1::INTEGER", [trade_id], function(err, result){
            if(err){
                console.error("Error querying database", err);
                return next(error_codes.found_trades_errors.DB_QUERY_ERROR);
            }
            return next(error_codes.found_trades_errors.DB_SUCCESS, result.rows);
        });
    });
};

/*
 * Purpose: Get a trade with a specific user who wants a book
 * Inputs:  user_id: user that owns the book, wanted_book: book id that is wanted by the user, next:callback function
 * Output: Returns the callback function that has an error code (or success) passed back as a parameter, and a list of edges
 */
exports.get_trade_by_wanted_book = function(user_id, wanted_book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();

        if (err){
            console.error("Error connection to client while querying found_trades table: ", err);
            return next(error_codes.found_trades_errors.DB_CONNECTION_ERROR, []);
        }
        client.query("SELECT * FROM found_trades WHERE trade_id IN (SELECT trade_id FROM found_trades WHERE user_id=$1:VARCHAR AND book_want=$2::INTEGER)",
            [user_id, wanted_book], function(err, result){
                if(err){
                    console.error("Error querying database", err);
                    return next(error_codes.found_trades_errors.DB_QUERY_ERROR, []);
                }
                return next(error_codes.found_trades_errors.DB_SUCCESS, result.rows);
            });
    });
};

/*
 * Purpose: get a trade with a specific user who owns a book
 * Inputs:  user_id: user that owns the book, owned_book: book id that is owned by the user, next:callback function
 * Output: Returns the callback function that has an error code (or success) passed back as a parameter, and a list of edges
 */
exports.get_trade_by_book_owned = function(user_id, owned_book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();

        if (err){
            console.error("Error connection to client while querying found_trades table: ", err);
            return next(error_codes.found_trades_errors.DB_CONNECTION_ERROR, []);
        }
        client.query("SELECT * FROM found_trades WHERE trade_id IN (SELECT trade_id FROM found_trades WHERE user_id=$1:VARCHAR AND book_have=$2::INTEGER)",
            [user_id, owned_book], function(err, result){
                if(err){
                    console.error("Error querying database", err);
                    return next(error_codes.found_trades_errors.DB_QUERY_ERROR, []);
                }
                return next(error_codes.found_trades_errors.DB_SUCCESS, result.rows);
            });
    });
};



/*
 * Purpose: Remove all graph edges from the database associated with a trade_id
 * Inputs: trade_id: id of the loop, next: a callback function
 * Output: Returns the callback function that has an error code (or success) passed back as a parameter
 */
exports.remove_trade_by_id = function(trade_id, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying found_trades table: ", err);
            return next(error_codes.found_trades_errors.DB_CONNECTION_ERROR);
        }

        client.query("DELETE FROM found_trades WHERE trade_id=$1::INTEGER", [trade_id], function(err, result){
                if(err){
                    console.error("Error querying database", err);
                    return next(error_codes.found_trades_errors.DB_QUERY_ERROR);
                }
                return next(error_codes.found_trades_errors.DB_SUCCESS);
            });
    });
};

/*
 * Purpose: remove a trade with a specific user who owns a book
 * Inputs:  user_id: user that owns the book, owned_book: book id that is owned by the user, next:callback function
 * Output: Returns the callback function that has an error code (or success) passed back as a parameter
 */
exports.remove_trade_by_book_owned = function(user_id, owned_book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();

        if (err){
            console.error("Error connection to client while querying found_trades table: ", err);
            return next(error_codes.found_trades_errors.DB_CONNECTION_ERROR, []);
        }
        client.query("DELETE FROM found_trades WHERE trade_id IN (SELECT trade_id FROM found_trades WHERE user_id=$1:VARCHAR AND book_have=$2::INTEGER)",
            [user_id, owned_book], function(err, result){
                if(err){
                    console.error("Error querying database", err);
                    return next(error_codes.found_trades_errors.DB_QUERY_ERROR, []);
                }
                return next(error_codes.found_trades_errors.DB_SUCCESS);
        });
    });
};

/*
 * Purpose: remove a trade with a specific user who wants a book
 * Inputs:  user_id: user that owns the book, wanted_book: book id that is wanted by the user, next:callback function
 * Output: Returns the callback function that has an error code (or success) passed back as a parameter
 */
exports.remove_trade_by_wanted_book = function(user_id, wanted_book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();

        if (err){
            console.error("Error connection to client while querying found_trades table: ", err);
            return next(error_codes.found_trades_errors.DB_CONNECTION_ERROR, []);
        }
        client.query("DELETE FROM found_trades WHERE trade_id IN (SELECT trade_id FROM found_trades WHERE user_id=$1:VARCHAR AND book_want=$2::INTEGER)",
            [user_id, wanted_book], function(err, result){
                if(err){
                    console.error("Error querying database", err);
                    return next(error_codes.found_trades_errors.DB_QUERY_ERROR, []);
                }
                return next(error_codes.found_trades_errors.DB_SUCCESS);
        });
    });
};

/*
 * Purpose: Get the count of loops that exist in the table
 * Inputs: next:callback function
 * Output: Returns the callback function that has an error code (or success) passed back as a parameter,
 * and count of loops in the table
 */

exports.get_number_of_loops = function(next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();

        if (err){
            console.error("Error connection to client while querying found_trades table: ", err);
            return next(error_codes.found_trades_errors.DB_CONNECTION_ERROR, []);
        }
        client.query("SELECT COUNT(DISTINCT trade_id) FROM found_trades)", [], function(err, result){
            if(err){
                console.error("Error querying database", err);
                return next(error_codes.found_trades_errors.DB_QUERY_ERROR, []);
            }
            return next(error_codes.found_trades_errors.DB_SUCCESS, result.rows);
        });
    });
};

