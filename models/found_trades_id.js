/*
 * Interface to query and modify the table found_trades_id.
 */

'use strict';
const pg = require('pg');
const error_codes = require('../error_codes');


/*
 *  Purpose: update the next trade_id that can be used
 *  Inputs:loop_id: the id of the loop, and a callback function
 *  Output: Returns the callback function that has an error code (or success) passed back as a parameter
 */
exports.update_id = function(loop_id, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying found_trades_id table: ", err);
            return next(error_codes.found_trades_id_errors.DB_CONNECTION_ERROR);
        }

        //check if the relation exists already
        client.query("SELECT COUNT(index) FROM found_trades_id",
            [], function(err, result){
                if (err){
                    console.error("Error querying table found_trades_id", err);
                    return next(error_codes.found_trades_id_errors.DB_QUERY_ERROR);
                }

                //if relationship exists, it update it, if it doesn't, return error
                if(result.rows[0].count == 1){
                    client.query("UPDATE found_trades_id SET trade_id=$1::INTEGER WHERE index=0", [loop_id], function(err, result){
                            if (err){
                                console.error("Error updating found_trades_id table", err);
                                return next(error_codes.found_trades_id_errors.DB_QUERY_ERROR);
                            }

                            return next(error_codes.found_trades_id_errors.DB_SUCCESS);
                        });
                }
                else if (result.rows[0].count == 0){
                    console.error("ID does not exist in table. Please add original ID by getting the original ID from the get_number_of_loops function in the found_trades model, and inserting it into this table using the insert_original_id function");
                    return next(error_codes.found_trades_id_errors.ID_DNE);
                }
                else{
                    console.error("REALLY BAD ERROR: there are more than 1 ID in the table. Need to clean this problem up by deleting the table and figure out how this happened");
                    return next(error_codes.found_trades_id_errors.MULTIPLE_ID_EXISTS);
                }
            });
    });
};

/*
 *  Purpose: insert the next trade_id that can be used (should only be used once, when this table is empty)
 *  Inputs:loop_id: the id of the loop, and a callback function
 *  Output: Returns the callback function that has an error code (or success) passed back as a parameter
 */
exports.insert_id = function(loop_id, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying found_trades_id table: ", err);
            return next(error_codes.found_trades_id_errors.DB_CONNECTION_ERROR);
        }

        //check if the relation exists already
        client.query("SELECT COUNT(index) FROM found_trades_id",
            [], function(err, result){
                if (err){
                    console.error("Error querying table found_trades_id", err);
                    return next(error_codes.found_trades_id_errors.DB_QUERY_ERROR);
                }

                //if relationship exists, it update it, if it doesn't, return error
                if(result.rows[0].count == 0){
                    client.query("INSERT INTO found_trades_id (index, trade_id) VALUES (0, $1::INTEGER)", [loop_id], function(err, result){
                        if (err){
                            console.error("Error inserting into found_trades_id table", err);
                            return next(error_codes.found_trades_id_errors.DB_QUERY_ERROR);
                        }

                        return next(error_codes.found_trades_id_errors.DB_SUCCESS);
                    });
                }
                else{
                    return next(error_codes.found_trades_id_errors.ID_ALREADY_EXISTS);
                }
            });
    });
};


/*
 *  Purpose: get the next trade_id that can be used
 *  Inputs: a callback function
 *  Output: Returns the callback function that has an error code (or success) passed back as a parameter, and the next trade id
 */
exports.get_id = function(next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying found_trades_id table: ", err);
            return next(error_codes.found_trades_id_errors.DB_CONNECTION_ERROR);
        }
        //check if the relation exists already
        client.query("SELECT COUNT(index) FROM found_trades_id",
            [], function(err, result) {
                if (err) {
                    console.error("Error querying table found_trades_id", err);
                    return next(error_codes.found_trades_id_errors.DB_QUERY_ERROR);
                }

                if (result.rows[0].count != 0) {
                    client.query("SELECT trade_id FROM found_trades_id WHERE index=0", []
                        , function (err, result) {
                            if (err) {
                                console.error("Error querying table found_trades_id", err);
                                return next(error_codes.found_trades_id_errors.DB_QUERY_ERROR);
                            }
                            return next(error_codes.found_trades_id_errors.DB_SUCCESS, result.rows)
                        });
                }
                else {
                    console.error("ID does not exist in table. Please add original ID by getting the original ID from the get_number_of_loops function in the found_trades model, and inserting it into this table using the insert_original_id function");
                    return next(error_codes.found_trades_id_errors.ID_DNE);
                }
            });
    });
};