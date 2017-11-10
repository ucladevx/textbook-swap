const dotenv = require('dotenv');
const modelsTests = require('./models');
const apiTests = require('./api');
const testInit = require('./test_init');
dotenv.config();

before(function(done){
    testInit.create_database(done);
});

modelsTests.test_models();
apiTests.test_api();

after(function(done){
    testInit.drop_database(done);
});

