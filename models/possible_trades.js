'use strict';
const pg = require('pg');
const error_codes = require('../error_codes');
const conString = 'postgres://Jayendra:@localhost/loopsDB';

exports.add_relation = function(user_id, book_have_id, book_want_id, next){
    pg.connect(conString, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying possible_trades table: ", err);
            return next(error_codes.possible_trades_errors.DB_CONNECTION_ERROR);
        }

        //check if the relation exists already
        client.query("SELECT COUNT(user_id) FROM possible_trades WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER AND book_want=$3::INTEGER", [user_id, book_have_id,book_want_id ], function(err, result){
            if (err){
                console.error("Error querying table possible_trades", err);
                return next(error_codes.possible_trades_errors.DB_QUERY_ERROR);
            }

            //if relationship doesn't exist, it inserts it, if it does, it returns and error
            if(result.rows[0].count == 0){
                client.query("INSERT INTO possible_trades (user_id, book_have, book_want) VALUES ($1::VARCHAR, $2::INTEGER, $3::INTEGER)", [user_id, book_have_id, book_want_id], function(err, result){
                    if (err){
                        console.error("Error inserting into possible_trades table", err);
                        return next(error_codes(error_codes.possible_trades_errors.DB_QUERY_ERROR));
                    }

                    return next(error_codes.possible_trades_errors.DB_SUCCESS);
                });
            }
            else{
                console.error("UserID, BookHaveID, BookWantID association already exists in possible_trades table");
                return next(error_codes.possible_trades_errors.POSSIBLE_TRADE_ALREADY_EXISTS);
            }
        });
    });
};

exports.remove_relation = function(user_id, book_have_id, book_want_id, next){
    /*
     TODO: change this whenever you pull - We should think about changing the architecture so that
     this is set when reading the config somehow
     */
   

    pg.connect(conString, function(err, client, done){
        done();
        if (err){
             console.error("Error connection to client while querying possible_trades table: ", err);
            return next(error_codes.possible_trades_errors.DB_CONNECTION_ERROR);
        }

          client.query("SELECT COUNT(user_id) FROM possible_trades WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER AND book_want=$3::INTEGER", [user_id, book_have_id,book_want_id ], function(err, result){
            if (err){
                console.error("Error querying table possible_trades", err);
                return next(error_codes.possible_trades_errors.DB_QUERY_ERROR);
            }

            //if relationship doesn't exist, it inserts it, if it does, it returns and error
            if(result.rows[0].count != 0){
              client.query("DELETE FROM possible_trades WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER AND book_want=$3::INTEGER", [user_id, book_have_id, book_want_id], function(err, result){
    			        if(err){
			              console.error("Error querying database", err);
			              return next(error_codes.possible_trades_errors.DB_QUERY_ERROR);
			            }
			            return next(error_codes.possible_trades_errors.DB_SUCCESS);
			        });
            }
            else{
                console.error("UserID, BookHaveID, BookWantID association already exists in possible_trades table");
                return next(error_codes.possible_trades_errors.POSSIBLE_TRADE_ALREADY_EXISTS);
            }
        });
    });
};
