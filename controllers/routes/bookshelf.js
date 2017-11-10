/*
 * GET /bookshelf
 * Bookshelf.
 */

const async = require("async");
const users = require('../../models/users');
const owned_books = require('../../models/owned_books');
const book_info = require('../../models/book_info');
const utilities = require('../../utilities');
const found_trades = require('../../models/found_trades');
const possible_trades = require('../../models/possible_trades');

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

                    async.map(owned_books_info, function(item, map_callback){
                        possible_trades.get_book_wants(user_id, item['book_id'], function(pt_status, pt_ids){
                            var book_want_ids = [];
                            for (var j = 0; j < pt_ids.length; j++) {
                                book_want_ids.push(pt_ids[j]["book_want"]);
                            }
                            book_info.get_books_info(book_want_ids, function(book_want_error, book_want_info) {
                               map_callback(null, book_want_info);
                            });
                        });
                    }, function(err, results){
                        for (var k = 0; k < results.length; k++) {
                            owned_books_info[k]['wanted_books_info'] = results[k];
                        }
                        callback(null, owned_books_info);
                    });
                });
            });
        },
        possible_trades_info: function(callback){
            possible_trades.get_num_trades(user_id, function(error_status, num_books) {
                if (error_status) {
                    console.error("Error querying database", error_status);
                }
                callback(null, num_books);
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
                                cb(null, book_have_info[0]);
                            });
                        },
                        book_want: function(cb){
                            book_info.get_book_info(item["book_want"], function(error, book_want_info){
                                cb(null, book_want_info[0]);
                            });
                        },
                        status: function(cb){
                            found_trades.get_trades_status(item["trade_id"], function(error, trades_status){
                                cb(null, trades_status);
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
        console.log(results['owned_books_info']);
        res.render('bookshelf', {
            status: err,
            books: [].concat(results['matched_trades_info'], results['owned_books_info']),
            username: results['user_name'],
            book_nums: results['possible_trades_info']
        });
    });
};