/*
interface to query and modify the table owned_books
 */

'use strict';
const pg = require('pg');

exports.add_book = function(user, book){
    /*
    TODO: change this whenever you pull - We should think about changing the architecture so that
    this is set when reading the config somehow
    */
    const conString = 'postgres://adityaraju:@localhost/loopsDB';

    pg.connect(conString, function(err, client, done){
        done();
        if (err){
            console.error("Error connection to client while querying owned_books table: ", err);
            //TODO: define some sort of error code structure?
            return false;
        }
        client.query("SELECT COUNT(user_id) FROM owned_books WHERE user_id=$1::VARCHAR AND book_id=$2::INTEGER", [user, book], function(err, result){
            if (err){
                console.error("Error querying table owned_books", err);
                return false;
            }

            if(result.rows[0].count == 0){
                client.query("INSERT INTO owned_books (user_id, book_id) VALUES ($1::VARCHAR, $2::INTEGER)", [user, book], function(err, result){
                    if (err){
                        console.error("Error inserting into owned_books table", err);
                        return false;
                    }
                    return true;
                });
            }
            else{
                console.error("UserID, BookID association already exists in owned_books table");
                return false;
            }
        });
    });

};