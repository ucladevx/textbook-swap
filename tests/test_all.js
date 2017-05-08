exports.test = function(){
    const initTest = require('../models/init').create_tables(function(){
        // const ownedBooksTest = require('./models/owned_books').test();
        // const possibleTradesTest = require('./models/possible_trades').test();
        // const usersTest = require('./models/users').test();
        const algorithmTest = require('./models/algorithm').test_algorithm();
    });
};