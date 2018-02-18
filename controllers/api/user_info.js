const async = require("async");
const users = require('../../models/users');
const owned_books = require('../../models/owned_books');
const book_info = require('../../models/book_info');
const utilities = require('../../utilities');
const found_trades = require('../../models/found_trades');
const possible_trades = require('../../models/possible_trades');
const logger = require('tracer').colorConsole();

exports.get_user_info = function(req, res){
    var user = req.user;
    var user_id = user.id;
    if (!user){
        res.json({
            status: 401,
            data: null
        });
        return
    }
    async.parallel({
        owned_books_info: function(callback){
            owned_books.get_owned_books_info(user_id, function(status, owned_books_info){
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
                        var owned_books_obj = {
                            book_have: owned_books_info[k],
                            book_want: results[k],
                            status: 'N'
                        };
                        owned_books_info[k] = owned_books_obj;
                    }
                    callback(null, owned_books_info);
                });
            });
        },
        matched_trades_info: function(callback){
            found_trades.get_matched_trades(user_id, function(error_status, matched_trades_data){
                if(error_status){
                    logger.error("Error querying database", error_status);
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
                                cb(null, book_want_info);
                            });
                        },
                        status: function(cb){
                            found_trades.get_trade_status(user_id, item["book_have"], function(error, trades_status){
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
        if(err){
            res.json({
                status: 401,
                data: null
            });
        }

        res.json({
            status: 200,
            data: {
                name: user.displayName,
                emails: user.emails,
                id: user.id,
                trades: [].concat(results['matched_trades_info'], results['owned_books_info'])
            }
        });
    });
};
/*
trades schema:
all book_want properties is a list of book objects. There will only be one object for 'W', 'A', 'R', 'P' statuses, but
can be multiple for 'N' status (no match yet, contains all possible books they are willing to receive)
[
 {
    status: "A",
    book_have: {Book Object},
    book_want: [{Book Object}]
 },
 {
    status: "N",
    book_have: {Book Object},
    book_want: [{Book Objects}]
 },
 ...
]
*/

// ACCEPTED --> Everyone => 1 to 1
// PENDING YOUR RESPONSE --> You need to respond => 1 to 1
// REJECTED --> You/someone else REJECTED => 1 to 1
// NO MATCH --> 1 to many
// WAITING FOR MATCHERS TO CONFIRM --> 1 to 1
