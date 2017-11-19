const dotenv = require('dotenv');
const async = require('async');
const pg = require('pg');
const logger = require('tracer').colorConsole();
const modelsTests = require('./models');
const apiTests = require('./api');
const testInit = require('./test_init');
const init = require('../models/init');
dotenv.config();

before(function(done){
    async.series([
        function(callback){
            testInit.create_database(function(err) {
                callback(err);
            });
        },
        function(callback){
            init.create_tables(function(err) {
                callback(err);
            });
        }
    ], function(err){
        if(err)
            logger.error(err);
        done();
    });
});

modelsTests.test_models();
apiTests.test_api();

after(function(done){
    testInit.drop_database(done);
});

