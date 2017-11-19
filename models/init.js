/*
 * Database initialization
 */

'use strict';
const pg = require('pg');
const async = require('async');
const logger = require('tracer').colorConsole();
const found_trades_id = require('./found_trades_id');
const utilities = require('../utilities');

/*
 * Initializes the database by creating all the tables if they do not already exist.
 */
exports.create_tables = function(next){
    pg.connect(utilities.database_url, function (err, client, done) {
        if (err) {
            client.end();
            return logger.error('error fetching client from pool', err)
        }
        const book_to_class_data = (process.env.DATA_PATH || "'" + __dirname + "/data/") + "book_to_class_clean.csv'";
        const book_to_class_query = 
          'CREATE TEMP TABLE tmp_table AS SELECT * FROM book_to_class WITH NO DATA; COPY tmp_table FROM ' + book_to_class_data + ' DELIMITER \',\' CSV; INSERT INTO book_to_class SELECT DISTINCT ON (book_id, professor_name, class_name) * FROM tmp_table ON CONFLICT DO NOTHING; DROP TABLE tmp_table; UPDATE book_to_class SET tsv = to_tsvector(\'english\', professor_name) || to_tsvector(\'english\', class_name);';
        const book_info_data = (process.env.DATA_PATH || "'" + __dirname + "/data/") + "book_info_clean.csv'";
        const book_info_query = 
          'CREATE TEMP TABLE tmp_table_two AS SELECT * FROM book_info WITH NO DATA; COPY tmp_table_two FROM ' + book_info_data + ' DELIMITER \',\' CSV; INSERT INTO book_info SELECT DISTINCT ON (book_id) * FROM tmp_table_two ON CONFLICT DO NOTHING; DROP TABLE tmp_table_two; UPDATE book_info SET tsv = to_tsvector(\'english\', title) || to_tsvector(\'english\', author) || to_tsvector(\'english\', isbn);';
        
        var queries = ['CREATE TABLE IF NOT EXISTS owned_books(user_id VARCHAR, book_id INTEGER, PRIMARY KEY (user_id, book_id))',
                       'CREATE TABLE IF NOT EXISTS wish_list(user_id VARCHAR, book_id INTEGER, PRIMARY KEY (user_id, book_id))',
                       'CREATE TABLE IF NOT EXISTS possible_trades(user_id VARCHAR, book_have INTEGER, book_want INTEGER, status VARCHAR(1), PRIMARY KEY (user_id, book_have, book_want))',
                       'CREATE TABLE IF NOT EXISTS graph_edges(user_id VARCHAR, book_have INTEGER, target_id VARCHAR, book_want INTEGER, PRIMARY KEY (user_id, book_have, target_id, book_want))',
                       'CREATE TABLE IF NOT EXISTS book_to_class(book_id INTEGER, professor_name VARCHAR, class_name VARCHAR, tsv TSVECTOR, PRIMARY KEY(book_id, professor_name, class_name))',
                       'CREATE INDEX IF NOT EXISTS tsv_idx ON book_to_class USING gin(tsv)',
                       'CREATE TABLE IF NOT EXISTS book_info(book_id INTEGER, title VARCHAR, author VARCHAR, isbn VARCHAR, img_url VARCHAR, tsv TSVECTOR, PRIMARY KEY(book_id))',
                       'CREATE INDEX IF NOT EXISTS tsv_idx ON book_info USING gin(tsv)',
                       'CREATE TABLE IF NOT EXISTS users(user_id VARCHAR, user_name VARCHAR, user_email VARCHAR, PRIMARY KEY (user_id))',
                       'CREATE TABLE IF NOT EXISTS found_trades(trade_id INTEGER, user_id VARCHAR, book_have INTEGER, target_id VARCHAR, book_want INTEGER, status VARCHAR(1), PRIMARY KEY (trade_id, user_id, book_have, target_id, book_want))',
                       'CREATE TABLE IF NOT EXISTS found_trades_id(index INTEGER,trade_id INTEGER, PRIMARY KEY(index))'];

        async.map(queries, function(item, callback){
            client.query(item, function (err, result) {
                if (err) {
                    logger.error('error happened during query', err);
                    return callback(err, result);
                }
                callback(err, result);
            });
        }, function(err, results){
            async.parallel([
                function(parallel_callback) {
                    found_trades_id.insert_id(0, function(err){
                        parallel_callback(err);
                    });
                },
                function(parallel_callback) {
                    client.query(book_to_class_query, function (err, result) {
                        parallel_callback(err);
                    });
                },
                function(parallel_callback) {
                    client.query(book_info_query, function (err, result) {
                        parallel_callback(err);
                    });
                }
            ],
            function(parallel_err){
                client.end();
                next(parallel_err);
            });
        });
    });
};