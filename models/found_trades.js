 /*
 * Interface to query and modify the table found_trades.
 */

'use strict';
const pg = require('pg');
const utilities = require('../utilities');
const found_trades = require('./found_trades');
const logger = require('tracer').colorConsole();

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
            logger.error("Error connection to client while querying found_trades table: ", err);
            return next(utilities.found_trades_errors.DB_CONNECTION_ERROR);
        }

        //check if the relation exists already
        client.query("SELECT COUNT(user_id) FROM found_trades WHERE trade_id=$5::INTEGER AND user_id=$1::VARCHAR AND book_have=$2::INTEGER AND target_id=$3::VARCHAR AND book_want=$4::INTEGER",
            [user_id, owned_book, target_user, wanted_book, loop_id], function(err, result){
                if (err){
                    logger.error("Error querying table found_trades", err);
                    return next(utilities.found_trades_errors.DB_QUERY_ERROR);
                }

                //if relationship doesn't exist, it inserts it, if it does, it returns and error
                if(result.rows[0].count == 0){
                    client.query("INSERT INTO found_trades (trade_id, user_id, book_have, target_id, book_want, status) VALUES ($5::INTEGER, $1::VARCHAR, $2::INTEGER, $3::VARCHAR, $4::INTEGER, $6::VARCHAR)",
                        [user_id, owned_book, target_user, wanted_book, loop_id, 'P'], function(err, result){
                            if (err){
                                logger.error("Error inserting into found_trades table", err);
                                return next(utilities.found_trades_errors.DB_QUERY_ERROR);
                            }

                            return next(utilities.found_trades_errors.DB_SUCCESS);
                        });
                }
                else{
                    logger.error("Edge already exists in found_edges table");
                    return next(utilities.found_trades_errors.GRAPH_EDGE_ALREADY_EXISTS);
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
            logger.error("Error connection to client while querying found_trades table: ", err);
            return next(utilities.found_trades_errors.DB_CONNECTION_ERROR);
        }

        client.query("SELECT * FROM found_trades WHERE trade_id=$1::INTEGER", [trade_id], function(err, result){
            if(err){
                logger.error("Error querying database", err);
                return next(utilities.found_trades_errors.DB_QUERY_ERROR);
            }
            return next(utilities.found_trades_errors.DB_SUCCESS, result.rows);
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
            logger.error("Error connection to client while querying found_trades table: ", err);
            return next(utilities.found_trades_errors.DB_CONNECTION_ERROR, []);
        }
        client.query("SELECT * FROM found_trades WHERE user_id=$1::VARCHAR AND book_want=$2::INTEGER",
            [user_id, wanted_book], function(err, result){
                if(err){
                    logger.error("Error querying database", err);
                    return next(utilities.found_trades_errors.DB_QUERY_ERROR, []);
                }
                return next(utilities.found_trades_errors.DB_SUCCESS, result.rows);
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
            logger.error("Error connection to client while querying found_trades table: ", err);
            return next(utilities.found_trades_errors.DB_CONNECTION_ERROR, []);
        }
        client.query("SELECT * FROM found_trades WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER",
            [user_id, owned_book], function(err, result){
                if(err){
                    logger.error("Error querying database", err);
                    return next(utilities.found_trades_errors.DB_QUERY_ERROR, []);
                }
                return next(utilities.found_trades_errors.DB_SUCCESS, result.rows);
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
            logger.error("Error connection to client while querying found_trades table: ", err);
            return next(utilities.found_trades_errors.DB_CONNECTION_ERROR);
        }

        client.query("DELETE FROM found_trades WHERE trade_id=$1::INTEGER", [trade_id], function(err, result){
                if(err){
                    logger.error("Error querying database", err);
                    return next(utilities.found_trades_errors.DB_QUERY_ERROR);
                }
                return next(utilities.found_trades_errors.DB_SUCCESS);
            });
    });
};

/*
 * Purpose: dismiss a trade with a specific user who owns a book
 * Inputs:  user_id: user that owns the book, owned_book: book id that is owned by the user, next:callback function
 * Output: Returns the callback function that has an error code (or success) passed back as a parameter
 */
exports.remove_trade_by_book_owned = function(user_id, owned_book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();

        if (err){
            logger.error("Error connection to client while querying found_trades table: ", err);
            return next(utilities.found_trades_errors.DB_CONNECTION_ERROR, []);
        }
        client.query("DELETE FROM found_trades WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER",
            [user_id, owned_book], function(err, result){
                if(err){
                    logger.error("Error querying database", err);
                    return next(utilities.found_trades_errors.DB_QUERY_ERROR, []);
                }
                return next(utilities.found_trades_errors.DB_SUCCESS);
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
            logger.error("Error connection to client while querying found_trades table: ", err);
            return next(utilities.found_trades_errors.DB_CONNECTION_ERROR, []);
        }
        client.query("DELETE FROM found_trades WHERE trade_id IN (SELECT trade_id FROM found_trades WHERE user_id=$1::VARCHAR AND book_want=$2::INTEGER)",
            [user_id, wanted_book], function(err, result){
                if(err){
                    logger.error("Error querying database", err);
                    return next(utilities.found_trades_errors.DB_QUERY_ERROR, []);
                }
                return next(utilities.found_trades_errors.DB_SUCCESS);
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
            logger.error("Error connection to client while querying found_trades table: ", err);
            return next(utilities.found_trades_errors.DB_CONNECTION_ERROR, []);
        }
        client.query("SELECT COUNT(DISTINCT trade_id) FROM found_trades", [], function(err, result){
            if(err){
                logger.error("Error querying database", err);
                return next(utilities.found_trades_errors.DB_QUERY_ERROR, []);
            }
            return next(utilities.found_trades_errors.DB_SUCCESS, result.rows);
        });
    });
};



/*
 * Purpose: Update the status of a found trade to accepted or waiting (depending on if others have accepted)
 * 'A' = everyone in the loop has accepted
 * 'W' = you have accepted the trade, but others in the loop have not responded yet
 * Inputs: next:trade_id and its corresponding graph edge
 * Output: Returns the callback function that has an error code (or success) passed back as a parameter
*/

// TODO: update to accepted or waiting

exports.update_status_accepted = function(trade_id, user_id, owned_book, target_user, wanted_book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();

        if (err){
            logger.error("Error connection to client while querying found_trades table: ", err);
            return next(utilities.found_trades_errors.DB_CONNECTION_ERROR, []);
        }

        var matched = true;
        // TODO: check if this works
        // check if everyone else has accepted the trade or not
        found_trades.get_trade_by_id(trade_id, function(status, data){
            for (var i = 0; i < data.length; i++) {
                // someone else has not accepted the trade yet
                logger.log("trades", data);

                if(
                    (data[i]["status"] != 'W' && data[i]["status"] != 'A') &&
                    data[i]["user_id"] != user_id
                ){
                    matched = false;
                }
            }

            // everyone has accepted the trade, so set all trades to 'A'
            if (matched) {
                client.query("UPDATE found_trades SET status=$1::VARCHAR WHERE trade_id=$2::INTEGER",
                    ['A', trade_id], function(err, result){
                    if(err){
                        logger.error("Error querying database for all accepted trades", err);
                        return next(utilities.found_trades_errors.DB_QUERY_ERROR, []);
                    }

                    logger.log("set all edges to A");

                    return next(utilities.found_trades_errors.DB_SUCCESS, matched);
                });
            } 
            // not everyone has accepted the trade yet, so set the current trade edge(s) to 'W'
            // need to set all edges for a owned_book => wanted book
            else {

                logger.log(trade_id, user_id, owned_book, target_user, wanted_book);

                client.query("UPDATE found_trades SET status=$1::VARCHAR WHERE trade_id=$2::INTEGER AND user_id=$3::VARCHAR AND book_have=$4::INTEGER",
                    ['W', trade_id, user_id, owned_book], function(err, result){
                    if(err){
                        logger.error("Error querying database for waiting trades", err);
                        return next(utilities.found_trades_errors.DB_QUERY_ERROR, []);
                    }
                    return next(utilities.found_trades_errors.DB_SUCCESS, matched);
                });
            }
        });
    });
};

/*
 * Purpose: Update the status of a found trade to rejected
 * Inputs: trade_id and a graph edge
 * Output: Returns the callback function that has an error code (or success) passed back as a parameter
 */
exports.update_status_rejected = function(trade_id, user_id, owned_book, target_user, wanted_book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();

        if (err){
            logger.error("Error connection to client while querying found_trades table: ", err);
            return next(utilities.found_trades_errors.DB_CONNECTION_ERROR, []);
        }
        client.query("UPDATE found_trades SET status=$1::VARCHAR WHERE trade_id=$2::INTEGER AND user_id=$3::VARCHAR AND book_have=$4::INTEGER AND target_id=$5::VARCHAR AND book_want=$6::INTEGER",
            ['R', trade_id, user_id, owned_book, target_user, wanted_book], function(err, result){
            if(err){
                logger.error("Error querying database", err);
                return next(utilities.found_trades_errors.DB_QUERY_ERROR, []);
            }
            return next(utilities.found_trades_errors.DB_SUCCESS);
        });
    });
};

/*
 * Purpose: Update the status of all trades with trade_id to rejected
 * Inputs: trade_id and a callback function
 * Output: Returns the callback function that has an error code (or success) passed back as a parameter
 */
exports.update_status_rejected_by_id = function(trade_id, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();

        if (err){
            logger.error("Error connection to client while querying found_trades table: ", err);
            return next(utilities.found_trades_errors.DB_CONNECTION_ERROR, []);
        }
        client.query("UPDATE found_trades SET status=$1::VARCHAR WHERE trade_id=$2::INTEGER",
            ['R', trade_id], function(err, result){
            if(err){
                logger.error("Error querying database", err);
                return next(utilities.found_trades_errors.DB_QUERY_ERROR, []);
            }
            return next(utilities.found_trades_errors.DB_SUCCESS);
        });
    });
};


/*
    Purpose: Get the statuses of a found trade by id
    Input: trade_id: id of a trade, next: a callback function
    Output: the result code and the statuses of the edges in the found trade
 */

exports.get_statuses_by_id = function (trade_id, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();

        if (err){
            logger.error("Error connection to client while querying found_trades table: ", err);
            return next(utilities.found_trades_errors.DB_CONNECTION_ERROR, []);
        }
        client.query("SELECT status FROM found_trades WHERE trade_id=$1::INTEGER",
            [trade_id], function(err, result){
                if(err){
                    logger.error("Error querying database", err);
                    return next(utilities.found_trades_errors.DB_QUERY_ERROR, []);
                }
                return next(utilities.found_trades_errors.DB_SUCCESS, result.rows);
            });
    });
};

/**
 * Get all matched trades for a specific user
 *
 * @param user_id  user id for the current user
 * @return error code for the database query
 */
exports.get_matched_trades = function (user_id, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();

        if (err){
            logger.error("Error connection to client while querying found_trades table: ", err);
            return next(utilities.found_trades_errors.DB_CONNECTION_ERROR, []);
        }
        client.query("SELECT trade_id, book_have, book_want FROM found_trades WHERE user_id=$1::VARCHAR",
            [user_id], function(err, result){
                if(err){
                    logger.error("Error querying database", err);
                    return next(utilities.found_trades_errors.DB_QUERY_ERROR, []);
                }

                return next(utilities.found_trades_errors.DB_SUCCESS, result.rows);
            });
    });
};

/**
 * Get trade status for a specific edge of a matched trade
 *
 * @param user_id  user id for the current user
 * @param book_have  the owned book that we want to get the status of
 * @param next  callback function
 * @return error code for the database query
 * @return trade status ('W', 'A', 'R', 'P')
 */
exports.get_trade_status = function (user_id, book_have, next) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();

        if (err){
            logger.error("Error connection to client while querying found_trades table: ", err);
            return next(utilities.found_trades_errors.DB_CONNECTION_ERROR, []);
        }
        client.query("SELECT status FROM found_trades WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER",
            [user_id, book_have], function(err, result){
                if(err){
                    logger.error("Error querying database", err);
                    return next(utilities.found_trades_errors.DB_QUERY_ERROR, []);
                }
                logger.log(result.rows);
                return next(utilities.found_trades_errors.DB_SUCCESS, result.rows[0].status);
            });
    });
};

/**
 * Automatically reject all trades in the database that have been pending for more than two days
 *
 * @return error code for the database query
 */
exports.automatically_reject_old_trades = function (next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();

        if (err){
            logger.error("Error connection to client while querying found_trades table: ", err);
            return next(utilities.found_trades_errors.DB_CONNECTION_ERROR, []);
        }
        client.query("SELECT trade_id, book_have, book_want FROM found_trades WHERE user_id=$1::VARCHAR",
            [user_id], function(err, result){
                if(err){
                    logger.error("Error querying database", err);
                    return next(utilities.found_trades_errors.DB_QUERY_ERROR, []);
                }

                return next(utilities.found_trades_errors.DB_SUCCESS, result.rows);
            });
    });
};