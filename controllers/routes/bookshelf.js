/*
 * GET /bookshelf
 * Bookshelf.
 */

const async = require("async");
const users = require('../../models/users');
const owned_books = require('../../models/owned_books');
const book_info = require('../../models/book_info');
const error_codes = require('../../error_codes');
const found_trades = require('../../models/found_trades');

exports.index = function(req, res) {
    var user_id = req.user.id;

    async.parallel({
        owned_books_info: function(callback){
            owned_books.get_owned_books(user_id, function(status, owned_books_data){
                // convert from array of Javascript objects to just array of book_ids
                var book_ids = [];
                for (var i = 0; i < owned_books_data.length; i++) {
                    book_ids.push(owned_books_data[i]["book_id"]);
                }

                book_info.get_books_info(book_ids, function(error_status, owned_books_info) {
                    if (error_status) {
                        console.error("Error querying database", error_status);
                    }

                    callback(null, owned_books_info);
                });
            });
        },
        user_name: function(callback){
            users.get_user_name(user_id, function(error_status, user_name) {
                if (error_status) {
                    console.error("Error querying database", error_status);
                }

                callback(null, user_name);
            });
        },
        matched_trades_info: function(callback){
            found_trades.get_matched_trades(user_id, function(error_status, matched_trades_data){
                if(error_status){
                    console.error("Error querying database", error_status);
                }

                async.map(matched_trades_data, function(item, map_callback){
                    async.series({
                        book_have: function(cb){
                            book_info.get_book_info(item["book_have"], function(error, book_have_info){
                                cb(null, book_have_info);
                            });
                        },
                        book_want: function(cb){
                            book_info.get_book_info(item["book_want"], function(error, book_want_info){
                                cb(null, book_want_info);
                            });
                        }
                    }, function(err, matched_trade){
                        map_callback(null, matched_trade)
                    });
                }, function(err, results){
                    callback(null, results);
                });
            });
        }
    }, function(err, results){
        console.log(results);
    });

    // owned_books.get_owned_books(user_id, function(status, data){
    //     if (status == error_codes.owned_books_errors.DB_SUCCESS)
    //         console.log("Successfully found books from the database!");
    //
    //     // convert from array of Javascript objects to just array of book_ids
    //     var book_ids = [];
    //     for (var i = 0; i < data.length; i++) {
    //         book_ids.push(data[i]["book_id"]);
    //     }
    //
    //     // get the book info corresponding to each book_id
    //     book_info.get_books_info(book_ids, function(error_status, books_data) {
    //         if (error_status) {
    //             console.error("Error querying database", error_status);
    //         }
    //         // return the info for all the books
    //         users.get_user_name(user_id, function(error_status, user_name) {
    //             if (error_status) {
    //                 console.error("Error querying database", error_status);
    //             }
    //
    //             found_trades.get_matched_trades(user_id, function(error_status, matched_books_data){
    //                 if(error_status){
    //                     console.error("Error querying database", error_status);
    //                 }
    //
    //                 var matched_books_info = [];
    //                 console.log(matched_books_data);
    //                 for(var i = 0; i < matched_books_data.length; i++){
    //                     var curr = i;
    //                     book_info.get_book_info(matched_books_data[curr]['book_have'], function(error_status, book_have_data){
    //                         book_info.get_book_info(matched_books_data[curr]['book_want'], function(error_status, book_want_data){
    //                             matched_books_info.push([book_have_data[0], book_want_data[0]]);
    //
    //                             if(matched_books_info.length == matched_books_data.length){
    //                                 console.log(matched_books_info);
    //                                 console.log(books_data);
    //                                 res.render('bookshelf', {status: error_status, books: books_data, username: user_name, matched_books: matched_books_info});
    //                             }
    //                         });
    //                     });
    //                 }
    //
    //                 if(matched_books_data.length == 0)
    //                     res.render('bookshelf', {status: error_status, books: books_data, username: user_name, matched_books: matched_books_info});
    //             });
    //         });
    //
    //     });
    // });

};