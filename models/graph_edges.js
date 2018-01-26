/*
 * Interface to query and modify the table graph_edges.
 */

'use strict';
const pg = require('pg');
const utilities = require('../utilities');
const logger = require('tracer').colorConsole();

/*
 *  Purpose: Add a graph edge into the database
 *  Inputs: User: user that owns a book, owned_book: book id of owned book, target_user: the user that owns a book the User wants, wanted_book: book id of the wanted book
 *  and a callback function
 *  Output: Returns the callback function that has an error code (or success) passed back as a parameter
 */
exports.add_edge = function(user, owned_book, target_user, wanted_book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            logger.error("Error connection to client while querying graph_edges table: ", err);
            return next(utilities.graph_edges_errors.DB_CONNECTION_ERROR);
        }

        //check if the relation exists already
        client.query("SELECT COUNT(user_id) FROM graph_edges WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER AND target_id=$3::VARCHAR AND book_want=$4::INTEGER ",
            [user, owned_book, target_user, wanted_book], function(err, result){
            if (err){
                logger.error("Error querying table graph_edges", err);
                return next(utilities.graph_edges_errors.DB_QUERY_ERROR);
            }

            //if relationship doesn't exist, it inserts it, if it does, it returns and error
            if(result.rows[0].count == 0){
                client.query("INSERT INTO graph_edges (user_id, book_have, target_id, book_want) VALUES ($1::VARCHAR, $2::INTEGER, $3::VARCHAR, $4::INTEGER)",
                    [user, owned_book, target_user, wanted_book], function(err, result){
                    client.end();
                    if (err){
                        logger.error("Error inserting into graph_edges table", err);
                        return next(utilities.graph_edges_errors.DB_QUERY_ERROR);
                    }

                    return next(utilities.graph_edges_errors.DB_SUCCESS);
                });
            }
            else{
                logger.error("Edge already exists in graph_edges table");
                return next(utilities.graph_edges_errors.GRAPH_EDGE_ALREADY_EXISTS);
            }
        });
    });
};

/*
Purpose: This function is used to add the graph edges needed for this owned book
         Find all (A,B,C) in possible_trades where C=book_id and add (A,B,user_id,C) to the graph_edges table
Inputs: User_id, book_id to be added, and callback function
Output: Returns the callback function with a success or error code passed as a parameter
 */
exports.add_owned_book_edges = function(user, book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            logger.error("Error connection to client while querying graph_edges table: ", err);
            return next(utilities.graph_edges_errors.DB_CONNECTION_ERROR);
        }

        // insert owned_book edges
        client.query("INSERT INTO graph_edges (user_id, book_have, target_id, book_want) SELECT user_id, book_have, $1::VARCHAR, book_want FROM possible_trades WHERE book_want=$2::INTEGER", [user, book], function(err, result){
            if (err){
                logger.error("Error inserting into graph_edges table", err);
                return next(utilities.graph_edges_errors.DB_QUERY_ERROR);
            }
            return next(utilities.graph_edges_errors.DB_SUCCESS);
        });
    });
};

/*
Purpose: This function is used to add the graph edges needed for this trade relation
         Find all (A,B) in the owned_book table where B=wanted_book_id and insert 
         (user_id, owned_book_id, A, wanted_book_id) into the graph
Inputs: User_id, owned_book_id, wanted_book_id to be added, and callback function
Output: Returns the callback function with a success or error code passed as a parameter
 */
exports.add_trade_relation_edges = function(user, owned_book, wanted_book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            logger.error("Error connection to client while querying graph_edges table: ", err);
            return next(utilities.graph_edges_errors.DB_CONNECTION_ERROR);
        }

        // insert owned_book edges
        client.query("INSERT INTO graph_edges (user_id, book_have, target_id, book_want) SELECT $1::VARCHAR, $2::INTEGER, user_id, $3::INTEGER FROM owned_books WHERE book_id=$3::INTEGER", [user, owned_book, wanted_book], function(err, result){
            if (err){
                logger.error("Error inserting into graph_edges table", err);
                return next(utilities.graph_edges_errors.DB_QUERY_ERROR);
            }
            return next(utilities.graph_edges_errors.DB_SUCCESS);
        });
    });
};

/*
 * Purpose: Remove a graph edge into the database
 * Inputs: User: user that owns a book, owned_book: book id of owned book, target_user: the user that owns a book the
 * User wants, wanted_book: book id of the wanted book, next: a callback function
 * Output: Returns the callback function that has an error code (or success) passed back as a parameter
 */
exports.remove_edge = function(user, owned_book, target_user, wanted_book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            logger.error("Error connection to client while querying graph_edges table: ", err);
            return next(utilities.graph_edges_errors.DB_CONNECTION_ERROR);
        }

        client.query("DELETE FROM graph_edges WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER AND target_id=$3::VARCHAR AND book_want=$4::INTEGER",
            [user, owned_book, target_user, wanted_book], function(err, result){
            client.end();
            if(err){
                logger.error("Error querying database", err);
                return next(utilities.graph_edges_errors.DB_QUERY_ERROR);
            }
            return next(utilities.graph_edges_errors.DB_SUCCESS);
        });
    });
};

/*
 * Purpose: Get all the graph edges from the database
 * Inputs: callback function
 * Output: Returns the callback function that has an error code (or success) passed back as a parameter,
 * and a list of the edges that were in the database as another parameter
 */
exports.get_graph = function(next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();

        if (err){
            logger.error("Error connection to client while querying graph_edges table: ", err);
            return next(utilities.graph_edges_errors.DB_CONNECTION_ERROR, []);
        }
        client.query("SELECT * FROM graph_edges", [], function(err, result){
            client.end();
            if(err){
                logger.error("Error querying database", err);
                return next(utilities.graph_edges_errors.DB_QUERY_ERROR, []);
            }
            return next(utilities.graph_edges_errors.DB_SUCCESS, result.rows);
        });
    });
};

/*
 * Purpose: Remove edges from the graph where the owned_book is a node of an incoming or outgoing edge
 * Inputs: user: user_id of the node book_id: book that the user owns, and a callback function
 * Outputs: returns a callback function with error code (or success) as a parameter
 */
exports.remove_owned_book = function(user, owned_book, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            logger.error("Error connection to client while querying graph_edges table: ", err);
            return next(utilities.owned_books_errors.DB_CONNECTION_ERROR);
        }

        client.query("DELETE FROM graph_edges WHERE (user_id=$1::VARCHAR AND book_have=$2::INTEGER) OR (target_id=$1::VARCHAR AND book_want=$2::INTEGER)",
            [user, owned_book], function(err, result){
            client.end();
            if(err){
                logger.error("Error querying database", err);
                return next(utilities.graph_edges_errors.DB_QUERY_ERROR);
            }
            return next(utilities.graph_edges_errors.DB_SUCCESS);
        });
    });
};

/*
 * Purpose: Remove edges from the graph where the user wants a specific book
 * Inputs: user: user_id who wants a book wanted_book: that book id of the book the user wants, and a callback function
 * Outputs: returns a callback function with error code (or success) as parameter
 */
exports.remove_wanted_book = function(user, book_want, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            logger.error("Error connection to client while querying graph_edges table: ", err);
            return next(utilities.graph_edges_errors.DB_CONNECTION_ERROR);
        }
        client.query("DELETE FROM graph_edges WHERE user_id=$1::VARCHAR AND book_want=$2::INTEGER", [user, book_want], function(err, result){
            client.end();
            if(err){
                logger.error("Error querying database", err);
                return next(utilities.graph_edges_errors.DB_QUERY_ERROR);
            }
            return next(utilities.graph_edges_errors.DB_SUCCESS);
        });
    });
};

/*
 * Purpose: Remove edges from the graph where the user wants a specific book and has a specific book
 * Inputs: user: user_id who wants a book wanted_book: that book id of the book the user wants, owned_book: book id of the book the user has ,
 * and a callback function
 * Outputs: returns a callback function with error code (or success) as parameter
 */
exports.remove_user_owned_want = function(user, book_have, book_want, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            logger.error("Error connection to client while querying graph_edges table: ", err);
            return next(utilities.graph_edges_errors.DB_CONNECTION_ERROR);
        }

        client.query("DELETE FROM graph_edges WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER AND book_want=$3::INTEGER", [user, book_have, book_want],
            function(err, result){
                if(err){
                    logger.error("Error querying database", err);
                    return next(utilities.graph_edges_errors.DB_QUERY_ERROR);
                }
                return next(utilities.graph_edges_errors.DB_SUCCESS);
        });
    });
};