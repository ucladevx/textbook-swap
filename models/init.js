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
        const book_to_class_data = "'" + __dirname + "/book_to_class.csv'";
        const book_to_class_query = 
          'CREATE TEMP TABLE tmp_table AS SELECT * FROM book_to_class WITH NO DATA; COPY tmp_table FROM ' + book_to_class_data + ' DELIMITER \',\' CSV; INSERT INTO book_to_class SELECT DISTINCT ON (book_id, professor_name, class_name) * FROM tmp_table ON CONFLICT DO NOTHING; DROP TABLE tmp_table;';
        const book_info_data = "'" + __dirname + "/book_info.csv'";
        const book_info_query = 
          'CREATE TEMP TABLE tmp_table AS SELECT * FROM book_info WITH NO DATA; COPY tmp_table FROM ' + book_info_data + ' DELIMITER \',\' CSV; INSERT INTO book_info SELECT DISTINCT ON (book_id) * FROM tmp_table ON CONFLICT DO NOTHING; DROP TABLE tmp_table; UPDATE book_info SET tsv = to_tsvector(\'english\', title) || to_tsvector(\'english\', author) WHERE tsv IS NULL;';
        
        var queries = ['CREATE TABLE IF NOT EXISTS owned_books(user_id VARCHAR, book_id INTEGER, PRIMARY KEY (user_id, book_id))',
                       'CREATE TABLE IF NOT EXISTS wish_list(user_id VARCHAR, book_id INTEGER, PRIMARY KEY (user_id, book_id))',
                       'CREATE TABLE IF NOT EXISTS possible_trades(user_id VARCHAR, book_have INTEGER, book_want INTEGER, PRIMARY KEY (user_id, book_have, book_want))',
                       'CREATE TABLE IF NOT EXISTS graph_edges(user_id VARCHAR, book_have INTEGER, target_id VARCHAR, book_want INTEGER, PRIMARY KEY (user_id, book_have, target_id, book_want))',
                       'CREATE TABLE IF NOT EXISTS book_to_class(book_id INTEGER, professor_name VARCHAR, class_name VARCHAR, tsv TSVECTOR, PRIMARY KEY(book_id, professor_name, class_name))',
                       'CREATE INDEX IF NOT EXISTS tsv_idx ON book_info USING gin(tsv)',
                       book_to_class_query,
                       'CREATE TABLE IF NOT EXISTS book_info(book_id INTEGER, title VARCHAR, author VARCHAR, isbn VARCHAR, img_url VARCHAR, tsv TSVECTOR, PRIMARY KEY(book_id))',
                       'CREATE INDEX IF NOT EXISTS tsv_idx ON book_info USING gin(tsv)',
                       book_info_query,
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


      