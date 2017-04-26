/*
error codes for the database queries - could expand to more later
 */

exports.owned_books_errors = Object.freeze({
    DB_SUCCESS : 0,
    DB_CONNECTION_ERROR : 1,
    DB_QUERY_ERROR : 2,
    OWNED_BOOK_ALREADY_EXISTS : 3,
    OWNED_BOOK_DOES_NOT_EXIST : 4
});

exports.possible_trades_errors = Object.freeze({
    DB_SUCCESS : 0,
    DB_CONNECTION_ERROR : 1,
    DB_QUERY_ERROR : 2,
    POSSIBLE_TRADE_ALREADY_EXISTS : 3,
});