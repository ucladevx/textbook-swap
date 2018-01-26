/*
 * Interface to query and modify the table possible_trades.
 */
'use strict';
const pg = require('pg');
const utilities = require('../utilities');
const logger = require('tracer').colorConsole();

/*
 * Add a relation of {user_id:string , book_have_id:int , book_want_id:int} to the possible_trades table
 * Replies with an error_code (either success or the error code itself) value in the callback function correlating
 * to the success of the table addition
 */
exports.add_relation = function(user_id, book_have_id, book_want_id, next){
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
      done();
      if (err){
          logger.error("Error connection to client while querying possible_trades table: ", err);
          return next(utilities.possible_trades_errors.DB_CONNECTION_ERROR);
      }

      //check if the relation exists already
      client.query("SELECT COUNT(user_id) FROM possible_trades WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER AND book_want=$3::INTEGER", [user_id, book_have_id,book_want_id ], function(err, result){
          if (err){
              logger.error("Error querying table possible_trades", err);
              return next(utilities.possible_trades_errors.DB_QUERY_ERROR);
          }

          //if relationship doesn't exist, it inserts it, if it does, it returns and error
          if(result.rows[0].count == 0){
              client.query("INSERT INTO possible_trades (user_id, book_have, book_want, status) VALUES ($1::VARCHAR, $2::INTEGER, $3::INTEGER, $4::VARCHAR)", [user_id, book_have_id, book_want_id, 'V'], function(err, result){
                  if (err){
                      logger.error("Error inserting into possible_trades table", err);
                      return next(utilities.possible_trades_errors.DB_QUERY_ERROR);
                  }

                  return next(utilities.possible_trades_errors.DB_SUCCESS);
              });
          }
          else{
              logger.error("UserID, BookHaveID, BookWantID association already exists in possible_trades table");
              return next(utilities.possible_trades_errors.POSSIBLE_TRADE_ALREADY_EXISTS);
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
      	logger.error("Error connection to client while querying possible_trades table: ", err);
      	return next(utilities.possible_trades_errors.DB_CONNECTION_ERROR);
      }

      client.query("DELETE FROM possible_trades WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER AND book_want=$3::INTEGER", [user_id, book_have_id, book_want_id], function(err, result){
          if(err){
              logger.error("Error querying database", err);
              return next(utilities.possible_trades_errors.DB_QUERY_ERROR);
          }
          return next(utilities.possible_trades_errors.DB_SUCCESS);
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
      	logger.error("Error connection to client while querying possible_trades table: ", err);
      	return next(utilities.possible_trades_errors.DB_CONNECTION_ERROR);
      }

      client.query("DELETE FROM possible_trades WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER", [user_id, book_have_id], function(err, result){
          if(err){
              logger.error("Error querying database", err);
              return next(utilities.possible_trades_errors.DB_QUERY_ERROR);
          }
          return next(utilities.possible_trades_errors.DB_SUCCESS);
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
      	logger.error("Error connection to client while querying possible_trades table: ", err);
      	return next(utilities.possible_trades_errors.DB_CONNECTION_ERROR);
      }

      client.query("DELETE FROM possible_trades WHERE user_id=$1::VARCHAR AND book_want=$2::INTEGER", [user_id, book_want_id], function(err, result){
          if(err){
              logger.error("Error querying database", err);
              return next(utilities.possible_trades_errors.DB_QUERY_ERROR);
          }
          return next(utilities.possible_trades_errors.DB_SUCCESS);
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
    	logger.error("Error connection to client while querying possible_trades table: ", err);
    	return next(utilities.possible_trades_errors.DB_CONNECTION_ERROR);
    }

    client.query("SELECT book_want FROM possible_trades WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER", [user_id, book_have_id], function(err, result){
        if(err){
            logger.error("Error querying database", err);
            return next(utilities.possible_trades_errors.DB_QUERY_ERROR);
        }
        return next(utilities.possible_trades_errors.DB_SUCCESS, result.rows);
    });
};

/*
 *
 *
 */
exports.get_num_trades = function(user_id, next) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    done();
    if (err){
      logger.error("Error connection to client while querying possible_trades table: ", err);
      return next(utilities.possible_trades_errors.DB_CONNECTION_ERROR);
    }
    client.query("SELECT DISTINCT book_have FROM possible_trades WHERE user_id=$1::VARCHAR", [user_id], function(err, result) {
      if(err){
          logger.error("Error querying database", err);
          return next(utilities.possible_trades_errors.DB_QUERY_ERROR);
      }
      // key: book_have id
      // value: count of book_wants associated with each book_have 
      var book_to_count = {};
      var num_books = result.rows.length;
        logger.log(num_books);
      if(num_books == 0) return next(utilities.possible_trades_errors.DB_SUCCESS, null);
      (result.rows).forEach(function(row, i_index) {
        var book_have_id = result.rows[i_index].book_have;
        client.query("SELECT COUNT(book_want) FROM possible_trades WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER", [user_id, book_have_id], function(err, result){
          if(err){
              logger.error("Error querying database", err);
              return next(utilities.possible_trades_errors.DB_QUERY_ERROR);
          }
          book_to_count[book_have_id] = result.rows[0].count;
          if(Object.keys(book_to_count).length == num_books) {
            return next(utilities.possible_trades_errors.DB_SUCCESS, book_to_count);
          }
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
            logger.error("Error connection to client while querying possible_trades table: ", err);
            return next(utilities.possible_trades_errors.DB_CONNECTION_ERROR);
        }

        client.query("SELECT * FROM possible_trades WHERE book_want=$1::INTEGER", [book_want_id], function(err, result){
            if(err){
                logger.error("Error querying database", err);
                return next(utilities.possible_trades_errors.DB_QUERY_ERROR);
            }
            return next(utilities.possible_trades_errors.DB_SUCCESS, result.rows);
        });
    });
};


/*
 * updates status of possible trade {status_id:string length 1, user_id:string , book_have_id:int, book_want_id:int }
 * Replies with either an error_code
 */
exports.update_status = function(status_id, user_id, owned_book, book_want, next) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            logger.error("Error connection to client while querying possible_trades table: ", err);
            return next(utilities.possible_trades_errors.DB_CONNECTION_ERROR);
        }

        client.query("UPDATE possible_trades SET status=$1::VARCHAR WHERE user_id=$2::VARCHAR AND book_have=$3::INTEGER AND book_want=$4::INTEGER", [status_id, user_id, owned_book, book_want], function(err, result){
            if(err){
                logger.error("Error querying database", err);
                return next(utilities.possible_trades_errors.DB_QUERY_ERROR);
            }
            return next(utilities.possible_trades_errors.DB_SUCCESS);
        });
    });
};

/*
 * updates status of all possible trades where a user owns
 * a specific book {status_id:string length 1, user_id:string , book_have_id:int }
 * Replies with either an error_code
 */
exports.update_status_by_owned_book = function(status_id, user_id, owned_book, next) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            logger.error("Error connection to client while querying possible_trades table: ", err);
            return next(utilities.possible_trades_errors.DB_CONNECTION_ERROR);
        }

        client.query("UPDATE possible_trades SET status=$1::VARCHAR WHERE user_id=$2::VARCHAR AND book_have=$3::INTEGER", [status_id, user_id, owned_book], function(err, result){
            if(err){
                logger.error("Error querying database", err);
                return next(utilities.possible_trades_errors.DB_QUERY_ERROR);
            }
            return next(utilities.possible_trades_errors.DB_SUCCESS);
        });
    });
};


/*
 * updates status of all possible trades where a user wants
 * a specific book {status_id:string length 1, user_id:string , book_want_id:int }
 * Replies with either an error_code
 */
exports.update_status_by_wanted_book = function(status_id, user_id, book_want_id, next) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            logger.error("Error connection to client while querying possible_trades table: ", err);
            return next(utilities.possible_trades_errors.DB_CONNECTION_ERROR);
        }

        client.query("UPDATE possible_trades SET status=$1::VARCHAR WHERE user_id=$2::VARCHAR AND book_want=$3::INTEGER", [status_id, user_id, book_want_id], function(err, result){
            if(err){
                logger.error("Error querying database", err);
                return next(utilities.possible_trades_errors.DB_QUERY_ERROR);
            }
            return next(utilities.possible_trades_errors.DB_SUCCESS);
        });
    });
};

/*
 * gets status of possible trade { user_id:string , book_have_id:int, book_want_id:int }
 * Replies with either an error_code or the status of the possible_trade (valid, invalid, etc.)
 */
exports.get_status = function(user_id, owned_book, book_want, next){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        done();
        if (err){
            logger.error("Error connection to client while querying possible_trades table: ", err);
            return next(utilities.possible_trades_errors.DB_CONNECTION_ERROR);
        }

        client.query("SELECT status FROM possible_trades WHERE user_id=$1::VARCHAR AND book_have=$2::INTEGER AND book_want=$3::INTEGER", [ user_id, owned_book, book_want], function(err, result){
            if(err){
                logger.error("Error querying database", err);
                return next(utilities.possible_trades_errors.DB_QUERY_ERROR);
            }
            return next(utilities.possible_trades_errors.DB_SUCCESS, result.rows);
        });
    });
};