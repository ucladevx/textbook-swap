/*
 * API for getting book info.
 */

const request = require('request');
const error_codes = require('../../error_codes');
const books = require('../../models/book_info');

/*
 * GET http://localhost:3000/api/book_info/get_book_info
 * Gets book info from database for a given book id
 * Replies with a json object containing status and book title, author, isbn, etc.
 */
exports.get_book_info = function(req, res) {
	var book_id = req.query.id;

	books.get_book_info(book_id, function(status, data){
		if(status == error_codes.book_info_errors.DB_SUCCESS)
			console.log("Successfully got book info from database!");

		res.json({status: status, data: data});
	});
};

/*
 * GET http://localhost:3000/api/book_info/get_pair_book_info
 * Gets book info from database for a pair of book ids
 * Replies with a json object containing status and book title, author, isbn, etc. for both books.
 */
exports.get_pair_book_info = function(req, res) {
	var book_id1 = req.query.id1;
	var book_id2 = req.query.id2;

	var book1_data;
	var book2_data;

	books.get_book_info(book_id1, function(status, data){
		if(status == error_codes.book_info_errors.DB_SUCCESS)
			console.log("Successfully got book info from database!");
		
		book1_data = data;
	});
	books.get_book_info(book_id2, function(status, data){
		if(status == error_codes.book_info_errors.DB_SUCCESS)
			console.log("Successfully got book info from database!");
		
		book2_data = data;
		res.json({status: status, book1: book1_data, book2: book2_data});
	});
};