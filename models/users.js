'use strict';
const pg = require('pg');
const error_codes = require('../error_codes');

exports.add_new_user = function(user_id, user_name, user_email, next) {
	  pg.connect(process.env.DATABASE_URL, function(err, client, done){
      done();
      if (err){
          console.error("Error connection to client while querying users table: ", err);
          return next(error_codes.users_errors.DB_CONNECTION_ERROR);
      }

      //check if the relation exists already
      client.query("SELECT COUNT(user_id) FROM users WHERE user_id=$1::VARCHAR", [user_id], function(err, result){
          if (err){
              console.error("Error querying table users", err);
              return next(error_codes.users_errors.DB_QUERY_ERROR);
          }

          //if relationship doesn't exist, it inserts it, if it does, it returns and error
          if(result.rows[0].count == 0){
              client.query("INSERT INTO users (user_id, user_name, user_email) VALUES ($1::VARCHAR, $2::VARCHAR, $3::VARCHAR)", [user_id, user_name, user_email], function(err, result){
                  if (err){
                      console.error("Error inserting into users table", err);
                      return next(error_codes(error_codes.users_errors.DB_QUERY_ERROR));
                  }
                  return next(error_codes.users_errors.DB_SUCCESS);
              });
          }
          else{
              console.error("User already exists in users table");
              return next(error_codes.users_errors.USERS_ALREADY_EXISTS);
          }
      });
  });
};

//delete user
exports.remove_user = function(user_id, next){
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
      done();
      if (err){
      	console.error("Error connection to client while querying users table: ", err);
      	return next(error_codes.users_errors.DB_CONNECTION_ERROR);
      }

      client.query("DELETE FROM users WHERE user_id=$1::VARCHAR", [user_id], function(err, result){
          if(err){
              console.error("Error querying database", err);
              return next(error_codes.users_errors.DB_QUERY_ERROR);
          }
          return next(error_codes.users_errors.DB_SUCCESS);
      });
  });
};

//get user_email
exports.get_user_email = function(user_id, next) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    done();
    if (err){
    	console.error("Error connection to client while querying users table: ", err);
    	return next(error_codes.users_errors.DB_CONNECTION_ERROR);
    }

    client.query("SELECT user_email FROM users WHERE user_id=$1::VARCHAR", [user_id], function(err, result){
        if(err){
            console.error("Error querying database", err);
            return next(error_codes.users_errors.DB_QUERY_ERROR);
        }
        return next(error_codes.users_errors.DB_SUCCESS, result.rows);
    });
  });
};

//get user_name
exports.get_user_name = function(user_id, next) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    done();
    if (err){
    	console.error("Error connection to client while querying users table: ", err);
    	return next(error_codes.users_errors.DB_CONNECTION_ERROR);
    }

    client.query("SELECT user_name FROM users WHERE user_id=$1::VARCHAR", [user_id], function(err, result){
        if(err){
            console.error("Error querying database", err);
            return next(error_codes.users_errors.DB_QUERY_ERROR);
        }
        return next(error_codes.users_errors.DB_SUCCESS, result.rows);
    });
  });
};