/*
 * Interface to query and modify the table graph_edges.
 */

'use strict';
const pg = require('pg');
const error_codes = require('../error_codes');

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
            console.error("Error connection to client while querying graph_edges table: ", err);
            return next(error_codes.graph_edges_errors.DB_CONNECTION_ERROR);
        }

        //check if the relation exists already
        client.query("SELECT COUNT(user_id) FROM graph_edges WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER AND target_id=$3::VARCHAR AND book_want=$4::INTEGER ",
            [user, owned_book, target_user, wanted_book], function(err, result){
            if (err){
                console.error("Error querying table graph_edges", err);
                return next(error_codes.graph_edges_errors.DB_QUERY_ERROR);
            }

            //if relationship doesn't exist, it inserts it, if it does, it returns and error
            if(result.rows[0].count == 0){
                client.query("INSERT INTO graph_edges (user_id, book_have, target_id, book_want) VALUES ($1::VARCHAR, $2::INTEGER, $3::VARCHAR, $4::INTEGER)",
                    [user, owned_book, target_user, wanted_book], function(err, result){
                    if (err){
                        console.error("Error inserting into graph_edges table", err);
                        return next(error_codes.graph_edges_errors.DB_QUERY_ERROR);
                    }

                    return next(error_codes.graph_edges_errors.DB_SUCCESS);
                });
            }
            else{
                console.error("Edge already exists in graph_edges table");
                return next(error_codes.graph_edges_errors.GRAPH_EDGE_ALREADY_EXISTS);
            }
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
            console.error("Error connection to client while querying graph_edges table: ", err);
            return next(error_codes.graph_edges_errors.DB_CONNECTION_ERROR);
        }

        client.query("DELETE FROM graph_edges WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER AND target_id=$3::VARCHAR AND book_want=$4::INTEGER",
            [user, owned_book, target_user, wanted_book], function(err, result){
            if(err){
                console.error("Error querying database", err);
                return next(error_codes.graph_edges_errors.DB_QUERY_ERROR);
            }
            return next(error_codes.graph_edges_errors.DB_SUCCESS);
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
            console.error("Error connection to client while querying graph_edges table: ", err);
            return next(error_codes.graph_edges_errors.DB_CONNECTION_ERROR, []);
        }
        client.query("SELECT * FROM graph_edges", [], function(err, result){
            if(err){
                console.error("Error querying database", err);
                return next(error_codes.graph_edges_errors.DB_QUERY_ERROR, []);
            }
            return next(error_codes.graph_edges_errors.DB_SUCCESS, result.rows);
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
            console.error("Error connection to client while querying graph_edges table: ", err);
            return next(error_codes.owned_books_errors.DB_CONNECTION_ERROR);
        }

        client.query("DELETE FROM graph_edges WHERE (user_id=$1::VARCHAR AND book_have=$2::INTEGER) OR (target_id=$1::VARCHAR AND book_want=$2::INTEGER)",
            [user, owned_book], function(err, result){
            if(err){
                console.error("Error querying database", err);
                return next(error_codes.graph_edges_errors.DB_QUERY_ERROR);
            }
            return next(error_codes.graph_edges_errors.DB_SUCCESS);
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
            console.error("Error connection to client while querying graph_edges table: ", err);
            return next(error_codes.graph_edges_errors.DB_CONNECTION_ERROR);
        }

        client.query("DELETE FROM graph_edges WHERE user_id=$1::VARCHAR AND book_want=$2::INTEGER", [user, book_want], function(err, result){
            if(err){
                console.error("Error querying database", err);
                return next(error_codes.graph_edges_errors.DB_QUERY_ERROR);
            }
            return next(error_codes.graph_edges_errors.DB_SUCCESS);
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
            console.error("Error connection to client while querying graph_edges table: ", err);
            return next(error_codes.graph_edges_errors.DB_CONNECTION_ERROR);
        }

        client.query("DELETE FROM graph_edges WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER AND book_want=$3::INTEGER", [user, book_have, book_want],
            function(err, result){
                if(err){
                    console.error("Error querying database", err);
                    return next(error_codes.graph_edges_errors.DB_QUERY_ERROR);
                }
                return next(error_codes.graph_edges_errors.DB_SUCCESS);
        });
    });
};