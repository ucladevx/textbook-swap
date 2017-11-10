/*
 * Interface to query and modify the table users.
 */

'use strict';
const pg = require('pg');
const utilities = require('../utilities');

/*
 * Add a relation of {user_id:string, user_name:string, user_email:string} to the users table
 * Replies with an error_code (either success or the error code itself) value in the callback function correlating
 * to the success of the table addition 
 */
exports.add_new_user = function(user_id, user_name, user_email, next) {
	  pg.connect(utilities.database_url, function(err, client, done){
      done();
      if (err){
          console.error("Error connection to client while querying users table: ", err);
          return next(utilities.users_errors.DB_CONNECTION_ERROR);
      }

      //check if the relation exists already
      client.query("SELECT COUNT(user_id) FROM users WHERE user_id=$1::VARCHAR", [user_id], function(err, result){
          if (err){
              console.error("Error querying table users", err);
              return next(utilities.users_errors.DB_QUERY_ERROR);
          }

          //if relationship doesn't exist, it inserts it, if it does, it returns and error
          if(result.rows[0].count == 0){
              client.query("INSERT INTO users (user_id, user_name, user_email) VALUES ($1::VARCHAR, $2::VARCHAR, $3::VARCHAR)", [user_id, user_name, user_email], function(err, result){
                  if (err){
                      console.error("Error inserting into users table", err);
                      return next(utilities(utilities.users_errors.DB_QUERY_ERROR));
                  }
                  return next(utilities.users_errors.DB_SUCCESS);
              });
          }
          else{
              console.error("User already exists in users table");
              return next(utilities.users_errors.USERS_ALREADY_EXISTS);
          }
      });
  });
};

/*
 * Remove a relation of {user_id:string} from the users table
 * Replies with an error_code (either success or the error code itself) value in the callback function correlating
 * to the success of the table deletion
 */
exports.remove_user = function(user_id, next){
  pg.connect(utilities.database_url, function(err, client, done){
      done();
      if (err){
      	console.error("Error connection to client while querying users table: ", err);
      	return next(utilities.users_errors.DB_CONNECTION_ERROR);
      }

      client.query("DELETE FROM users WHERE user_id=$1::VARCHAR", [user_id], function(err, result){
          if(err){
              console.error("Error querying database", err);
              return next(utilities.users_errors.DB_QUERY_ERROR);
          }
          return next(utilities.users_errors.DB_SUCCESS);
      });
  });
};

/*
 * Get the user_email associated with the input user_id
 * Replies with either an error_code or a Javascript Object
 */ 
exports.get_user_email = function(user_id, next) {
  pg.connect(utilities.database_url, function(err, client, done){
    done();
    if (err){
    	console.error("Error connection to client while querying users table: ", err);
    	return next(utilities.users_errors.DB_CONNECTION_ERROR);
    }

    client.query("SELECT user_email FROM users WHERE user_id=$1::VARCHAR", [user_id], function(err, result){
        if(err){
            console.error("Error querying database", err);
            return next(utilities.users_errors.DB_QUERY_ERROR);
        }
        return next(utilities.users_errors.DB_SUCCESS, result.rows);
    });
  });
};

/*
 * Get the user_name associated with the input user_id
 * Replies with either an error_code or a Javascript Object
 */ 
exports.get_user_name = function(user_id, next) {
  pg.connect(utilities.database_url, function(err, client, done){
    done();
    if (err){
    	console.error("Error connection to client while querying users table: ", err);
    	return next(utilities.users_errors.DB_CONNECTION_ERROR);
    }

    client.query("SELECT user_name FROM users WHERE user_id=$1::VARCHAR", [user_id], function(err, result){
        if(err){
            console.error("Error querying database", err);
            return next(utilities.users_errors.DB_QUERY_ERROR);
        }
        return next(utilities.users_errors.DB_SUCCESS, result.rows);
    });
  });
};