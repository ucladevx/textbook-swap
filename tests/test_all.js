exports.test = function(){
    const initTest = require('../models/init').create_tables(function(){
        const found_trades = require('../models/found_trades');
        found_trades.get_matched_trades('B', function(error, data){console.log(data);});
        // const ownedBooksTest = require('./models/owned_books').test();
        // const possibleTradesTest = require('./models/possible_trades').test();
        // const usersTest = require('./models/users').test();
        // const bookToClassTest = require('./models/book_to_class').test();
        // const bookInfoTest = require('./models/book_info').test();
    });
};