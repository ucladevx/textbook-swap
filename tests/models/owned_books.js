const ec = require('../../error_codes');
const initModel = require('../../models/init');
const ownedBooks = require('../../models/owned_books');

exports.test = function(){
    /*
     * Database initialization
     */
    initModel.create_tables();

    /*
     * Test usage of the interface
     * also shows how to use next callback
     */
    ownedBooks.add_book('Adi', 2, test_n);
    ownedBooks.add_book('Adi', 3, test_n);
    ownedBooks.get_users(2, test_next);

    function test_n(errorcode){
        if (errorcode == ec.owned_books_errors.OWNED_BOOK_ALREADY_EXISTS){
            console.log("book is in the database");
        }
    }

    function test_next(result_code, result){
        if (result_code == ec.owned_books_errors.DB_SUCCESS){
            console.log("YAY");
        }
        if (result_code == ec.owned_books_errors.DB_QUERY_ERROR){
            console.log("wtf");
        }
    }
};