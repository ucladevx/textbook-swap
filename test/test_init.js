/*
 * Testing Database initialization
 */

const pg = require('pg');
const utilities = require('../utilities');

exports.create_database = function(next){
    pg.connect(utilities.database_url, function (err, client, done) {
        client.query('CREATE DATABASE "loopsDBtest"', function (err, result) {
            if (err) {
                console.error('error happened during query', err);
            }
            return next();
        });
    });
};

exports.drop_database = function(next){
    pg.connect(utilities.database_url, function (err, client, done) {
        client.query('DROP DATABASE "loopsDBtest"', function (err, result) {
            if (err) {
                console.error('error happened during query', err);
            }
            return next();
        });
    });
};