/*
 * API for getting book info.
 */

const request = require('request');
const error_codes = require('../../error_codes');
const books = require('../../models/book_info');

/*
 * GET http://localhost:3000/api/book_info/get_book_info
 * Gets 
 * Replies with 
 */
exports.get_book_info = function(req, res) {
	var book_id = req.query.id;

	books.get_book_info(book_id, function(status, data){
		if(status == error_codes.book_info_errors.DB_SUCCESS)
			console.log("Successfully got book info from database!");

		res.json({status: status, data: data});
	});
};