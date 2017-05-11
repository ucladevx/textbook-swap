/*
 * API for searching for textbooks
 */

const request = require('request');
const ec = require('../../error_codes');
const bt = require('../../models/books');

/*
 * GET http://localhost:3000/api/search/search_textbooks
 * Current: Get the input from the search box. Output to console and pass to function that will query the database.
 */
exports.search_textbooks = function(req, res) {
    var search_input = req.query.search_input;
    // log user input from search box
    console.log(search_input);

    // search the books database based on user input
    bt.get_search_results(search_input, function(status, data) {
    	if (status == ec.books_errors.DB_SUCCESS) {
            console.log("Successfully found textbook search results in the database!");
            // print out data, which is an array of Javascript objects of the form (book_id, rank)
            console.log(data);

            // convert from array of Javascript objects to just array of book_ids
            var book_ids = new Array();
            for (var i = 0; i < data.length; i++) {
            	book_ids.push(data[i]["book_id"]);
            }

            // get the book info corresponding to each book_id 
            bt.get_books_info(book_ids, function(error_status, books_data) {
            	if (error_status) {
	                console.error("Error querying database", error_status);
	            }

	            console.log("books data:");
	            console.log(books_data);

	            // return the info for all the books
	            res.json({status: error_status, data: books_data});
            });

    	}
        else if (status == ec.books_errors.DB_QUERY_ERROR)
        	console.log("Error querying database for textbook search results!");
    });
};