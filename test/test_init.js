/*
 * Testing Database initialization
 */

const pg = require('pg');
const utilities = require('../utilities');
const async = require('async');
const logger = require('tracer').colorConsole();

exports.create_database = function(next){
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
        client.query('CREATE DATABASE "loopsDBtest"', function (err, result) {
            if (err) {
                logger.error('error happened during query', err);
            }
            client.end();
            return next();
        });
    });
};

exports.drop_database = function(next){
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
        client.query('DROP DATABASE "loopsDBtest"', function (err, result) {
            if (err) {
                logger.error('Error when dropping database: %s', err);
            }
            client.end();
            return next();
        });
    });
};