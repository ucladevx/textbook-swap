/*
 * Database initialization
 */

'use strict';
const pg = require('pg');

exports.create_tables = function(){
    //TODO: Change username whenever you pull
    const conString = 'postgres://Jayendra:@localhost/loopsDB';

    pg.connect(conString, function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err)
        }
        var queries = ['CREATE TABLE IF NOT EXISTS owned_books(user_id VARCHAR, book_id INTEGER, PRIMARY KEY (user_id, book_id))',
                       'CREATE TABLE IF NOT EXISTS wish_list(user_id VARCHAR, book_id INTEGER, PRIMARY KEY (user_id, book_id))',
                       'CREATE TABLE IF NOT EXISTS possible_trades(user_id VARCHAR, book_have INTEGER, book_want INTEGER, PRIMARY KEY (user_id, book_have, book_want))',
                       'CREATE TABLE IF NOT EXISTS graph_edges(user_id VARCHAR, book_have INTEGER, target_id VARCHAR, book_want INTEGER, PRIMARY KEY (user_id, book_have, target_id, book_want))',
                       'CREATE TABLE IF NOT EXISTS books(book_id INTEGER, book_name VARCHAR, class_name VARCHAR, PRIMARY KEY (book_id))'];

        for(var i = 0; i < queries.length; i++){
            client.query(queries[i], function (err, result) {
                done();
                if (err) {
                    return console.error('error happened during query', err)
                }
                //TODO: talk about error occurring here that all the tables might not be created here and it can go on to the next instruction (probably not a huge deal, because it will only happen once on startup)
            });
        }
    });
};