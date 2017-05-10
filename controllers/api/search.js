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
            //console.log(data);
    	}
        else if (status == ec.books_errors.DB_QUERY_ERROR)
        	console.log("Error querying database for textbook search results!");

    	res.json({status: status, data: data});
    });
};