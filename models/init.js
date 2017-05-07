/*
 * Database initialization
 */

'use strict';
const pg = require('pg');

/*
 * Initializes the database by creating all the tables if they do not already exist.
 */
exports.create_tables = function(next){
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err)
        }
        var queries = ['CREATE TABLE IF NOT EXISTS owned_books(user_id VARCHAR, book_id INTEGER, PRIMARY KEY (user_id, book_id))',
                       'CREATE TABLE IF NOT EXISTS wish_list(user_id VARCHAR, book_id INTEGER, PRIMARY KEY (user_id, book_id))',
                       'CREATE TABLE IF NOT EXISTS possible_trades(user_id VARCHAR, book_have INTEGER, book_want INTEGER, PRIMARY KEY (user_id, book_have, book_want))',
                       'CREATE TABLE IF NOT EXISTS graph_edges(user_id VARCHAR, book_have INTEGER, target_id VARCHAR, book_want INTEGER, PRIMARY KEY (user_id, book_have, target_id, book_want))',
                       'CREATE TABLE IF NOT EXISTS books(book_id INTEGER, book_name VARCHAR, class_name VARCHAR, tsv TSVECTOR, PRIMARY KEY (book_id))',
                       'CREATE INDEX IF NOT EXISTS tsv_idx ON books USING gin(tsv)',
                       'CREATE TABLE IF NOT EXISTS users(user_id VARCHAR, user_name VARCHAR, user_email VARCHAR, PRIMARY KEY (user_id))'];

        for(var i = 0; i < queries.length; i++){
            client.query(queries[i], function (err, result) {
                if (err) {
                    console.error('error happened during query', err);
                    return next();
                }
            });
        }
        done();
        return next();
    });
};