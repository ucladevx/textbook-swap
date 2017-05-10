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

exports.wish_list_errors = Object.freeze({
    DB_SUCCESS : 0,
    DB_CONNECTION_ERROR : 1,
    DB_QUERY_ERROR : 2,
    WISH_LIST_BOOK_ALREADY_EXISTS : 3,
    WISH_LIST_BOOK_DOES_NOT_EXIST : 4
});

exports.possible_trades_errors = Object.freeze({
    DB_SUCCESS : 0,
    DB_CONNECTION_ERROR : 1,
    DB_QUERY_ERROR : 2,
    POSSIBLE_TRADE_ALREADY_EXISTS : 3
});

exports.users_errors = Object.freeze({
    DB_SUCCESS : 0,
    DB_CONNECTION_ERROR : 1,
    DB_QUERY_ERROR : 2,
    USER_ALREADY_EXISTS : 3
});

exports.graph_edges_errors = Object.freeze({
    DB_SUCCESS : 0,
    DB_CONNECTION_ERROR : 1,
    DB_QUERY_ERROR : 2,
    GRAPH_EDGE_ALREADY_EXISTS : 3
});

exports.found_trades_errors = Object.freeze({
    DB_SUCCESS : 0,
    DB_CONNECTION_ERROR : 1,
    DB_QUERY_ERROR : 2,
    GRAPH_EDGE_ALREADY_EXISTS : 3
});

exports.found_trades_id_errors = Object.freeze({
    DB_SUCCESS : 0,
    DB_CONNECTION_ERROR : 1,
    DB_QUERY_ERROR : 2,
    ID_ALREADY_EXISTS : 3,
    ID_DNE : 4,
    MULTIPLE_ID_EXISTS : 5
});