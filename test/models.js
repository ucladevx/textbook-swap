const bookInfo = require('../models/book_info');
const foundTrades = require('../models/found_trades');
const assert = require('assert');
const pg = require('pg');
const utilities = require('../utilities');

exports.test_models = function(){
    describe('models.book_info', function(){
        describe('#get_book_info()', function() {
            it('should return the Algorithm Design textbook information', function(done) {
                bookInfo.get_book_info(253, function(err, result){
                    assert.equal('Algorithm Design', result[0]['title']);
                    if (err) done(err);
                    else done();
                });
            });
        });

        describe('#get_books_info()', function() {
            it('should return the book information for all passed in book IDs', function(done) {
                bookInfo.get_books_info([253, 300], function(err, result){
                    assert.equal('Algorithm Design', result[0]['title']);
                    assert.equal('Kreps', result[1]['author']);
                    if (err) done(err);
                    else done();
                });
            });
        });
    });

    describe('models.found_trades', function(){
        // populate found_trades table before running each test
        beforeEach(function() {
            pg.connect(process.env.DATABASE_URL, function(err, client, done){
                done();
                if (err){
                    console.error("Error connection to client while testing found_trades table: ", err);
                    return next(utilities.found_trades_errors.DB_CONNECTION_ERROR);
                }

                // will have default timestamp of current time
                client.query("INSERT INTO found_trades VALUES (1, '111', 123, '222', 124,'P'); \
                    INSERT INTO found_trades VALUES (2, '333', 123, '444', 124,'P', '2017-09-27'); \
                    INSERT INTO found_trades VALUES (3, '555', 123, '666', 124,'P', '2005-09-28'); \
                    INSERT INTO found_trades VALUES (4, '888', 123, '999', 124,'P', '2017-11-27')",
                    [], function(err, result){
                        if(err){
                            console.error("Error inserting into test found_trades database", err);
                            return next(utilities.found_trades_errors.DB_QUERY_ERROR);
                        }
                        return next(utilities.found_trades_errors.DB_SUCCESS);
                    });
            });
        });

        // delete all rows in found_trades table after running each test
        afterEach(function() {
            pg.connect(process.env.DATABASE_URL, function(err, client, done){
                done();
                if (err){
                    console.error("Error connection to client while testing found_trades table: ", err);
                    return next(utilities.found_trades_errors.DB_CONNECTION_ERROR);
                }

                // will have default timestamp of current time
                client.query("TRUNCATE TABLE found_trades",
                    [], function(err, result){
                        if(err){
                            console.error("Error truncating test found_trades database", err);
                            return next(utilities.found_trades_errors.DB_QUERY_ERROR);
                        }
                        return next(utilities.found_trades_errors.DB_SUCCESS);
                    });
            });
        });

        describe('#automatic_reject_old_trades()', function() {
            it('should set all statuses to R except for trade_id=1', function(done) {
                foundTrades.automatic_reject_old_trades(function(err){
                    pg.connect(process.env.DATABASE_URL, function(err, client, done){
                        done();
                        if (err){
                            console.error("Error connection to client while querying test found_trades table: ", err);
                            return next(utilities.found_trades_errors.DB_CONNECTION_ERROR);
                        }

                        client.query("SELECT trade_id FROM found_trades",
                            [], function(err, result){
                                if(err){
                                    console.error("Error deleting two day old pending trades database", err);
                                    return next(utilities.found_trades_errors.DB_QUERY_ERROR);
                                }
                                //check that trade_id = 1
                                assert.equal(1, result[0]);
                                //check there's only one row
                                assert.equal(1, result.length);
                                return next(utilities.found_trades_errors.DB_SUCCESS);
                            });
                    });
                    if (err) done(err);
                    else done();
                });
            });
        });
    });
};

