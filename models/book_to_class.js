/*
 * Interface to query and modify the table book_to_class
 */

'use strict';
const pg = require('pg');
const utilities = require('../utilities');

/*
 * Purpose: This function is used to get all the book_id's that a class_name and professor_id is related to in the book_to_class database
 * Inputs: class_id and the professor_id correlating to the book_id that you want, and a callback function
 * Output: Returns the callback function with a success or error code passed as a parameter and book_id related to the class_id and professor_id
 */
exports.get_book_id = function(class_id, professor_id, next){
    pg.connect(utilities.database_url, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying book_to_class table: ", err);
            return next(utilities.book_to_class_errors.DB_CONNECTION_ERROR, []);
        }

        client.query("SELECT book_id FROM book_to_class WHERE professor_name=$1::VARCHAR AND class_name=$2::VARCHAR", [professor_id, class_id], function(err, result){
            if(err){
                console.error("Error querying database", err);
                return next(utilities.book_to_class_errors.DB_QUERY_ERROR, []);
            }
            return next(utilities.book_to_class_errors.DB_SUCCESS, result.rows);
        });
    });
};


/*
 * Purpose: This function is used to get all the professor_id's and class_id's associated with a particular book_id's in the book_to_class database
 * Inputs: book_id correlating to the professor_id and class_id that you want, and a callback function
 * Output: Returns the callback function with a success or error code passed as a parameter and a professor_id and class_id related to the book_id
 */
exports.get_professor_class_id = function(book_id, next){
    pg.connect(utilities.database_url, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying book_to_class table: ", err);
            return next(utilities.book_to_class_errors.DB_CONNECTION_ERROR, []);
        }

        client.query("SELECT professor_name, class_name FROM book_to_class WHERE book_id=$1::INTEGER", [book_id], function(err, result){
            if(err){
                console.error("Error querying database", err);
                return next(utilities.book_to_class_errors.DB_QUERY_ERROR, []);
            }
            return next(utilities.book_to_class_errors.DB_SUCCESS, result.rows);
        });
    });
};
