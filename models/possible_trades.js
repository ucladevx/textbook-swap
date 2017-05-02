/*
 * Interface to query and modify the table possible_trades.
 */

'use strict';
const pg = require('pg');
const error_codes = require('../error_codes');

/*
 * Add a relation of {user_id:string , book_have_id:int , book_want_id:int} to the possible_trades table 
 * Replies with an error_code (either success or the error code itself) value in the callback function correlating
 * to the success of the table addition
 */
exports.add_relation = function(user_id, book_have_id, book_want_id, next){
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
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

/*
 * Remove a relation of {user_id:string , book_have_id:int , book_want_id:int} from the possible_trades table 
 * Replies with an error_code (either success or the error code itself) value in the callback function correlating
 * to the success of the table deletion
 */
exports.remove_relation = function(user_id, book_have_id, book_want_id, next){
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
      done();
      if (err){
      	console.error("Error connection to client while querying possible_trades table: ", err);
      	return next(error_codes.possible_trades_errors.DB_CONNECTION_ERROR);
      }

      client.query("DELETE FROM possible_trades WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER AND book_want=$3::INTEGER", [user_id, book_have_id, book_want_id], function(err, result){
          if(err){
              console.error("Error querying database", err);
              return next(error_codes.possible_trades_errors.DB_QUERY_ERROR);
          }
          return next(error_codes.possible_trades_errors.DB_SUCCESS);
      });
  });
};

/*
 * Remove all relations from possible_trades table containing {user_id:string , book_have_id:int}
 * Replies with an error_code (either success or the error code itself) value in the callback function correlating
 * to the success of the table deletion
 */
exports.remove_relation_have = function(user_id, book_have_id, next){
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
      done();
      if (err){
      	console.error("Error connection to client while querying possible_trades table: ", err);
      	return next(error_codes.possible_trades_errors.DB_CONNECTION_ERROR);
      }

      client.query("DELETE FROM possible_trades WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER", [user_id, book_have_id], function(err, result){
          if(err){
              console.error("Error querying database", err);
              return next(error_codes.possible_trades_errors.DB_QUERY_ERROR);
          }
          return next(error_codes.possible_trades_errors.DB_SUCCESS);
      });
  });
};

/*
 * Remove all relations from possible_trades table containing {user_id:string , book_want_id:int}
 * Replies with an error_code (either success or the error code itself) value in the callback function correlating
 * to the success of the database deletion
 */
exports.remove_relation_want = function(user_id, book_want_id, next){
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
      done();
      if (err){
      	console.error("Error connection to client while querying possible_trades table: ", err);
      	return next(error_codes.possible_trades_errors.DB_CONNECTION_ERROR);
      }

      client.query("DELETE FROM possible_trades WHERE user_id=$1::VARCHAR AND book_want=$2::INTEGER", [user_id, book_want_id], function(err, result){
          if(err){
              console.error("Error querying database", err);
              return next(error_codes.possible_trades_errors.DB_QUERY_ERROR);
          }
          return next(error_codes.possible_trades_errors.DB_SUCCESS);
      });
  });
};


/*
 * Get the list of all book_wants associated with the relation {user_id:string , book_have_id:int}
 * Replies with either an error_code or an Object of Javascript Objects (essentially an array)
 */
exports.get_book_wants = function(user_id, book_have_id, next) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    done();
    if (err){
    	console.error("Error connection to client while querying possible_trades table: ", err);
    	return next(error_codes.possible_trades_errors.DB_CONNECTION_ERROR);
    }

    client.query("SELECT book_want FROM possible_trades WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER", [user_id, book_have_id], function(err, result){
        if(err){
            console.error("Error querying database", err);
            return next(error_codes.possible_trades_errors.DB_QUERY_ERROR);
        }
        return next(error_codes.possible_trades_errors.DB_SUCCESS, result.rows);
    });
  });
};

/*
 * Get the list of all rows associated with the relation {book_want:book_want_id}
 * Replies with either an error_code or an Object of Javascript Objects (essentially an array)
 */
exports.get_rows_by_want = function(book_want_id, next) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying possible_trades table: ", err);
            return next(error_codes.possible_trades_errors.DB_CONNECTION_ERROR);
        }

        client.query("SELECT * FROM possible_trades WHERE book_want=$1::INTEGER", [book_want_id], function(err, result){
            if(err){
                console.error("Error querying database", err);
                return next(error_codes.possible_trades_errors.DB_QUERY_ERROR);
            }
            return next(error_codes.possible_trades_errors.DB_SUCCESS, result.rows);
        });
    });
};