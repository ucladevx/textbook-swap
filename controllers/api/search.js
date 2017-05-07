/*
 * API for searching for textbooks
 */

const request = require('request');
const ec = require('../../error_codes');

/*
 * GET http://localhost:3000/api/search/search_textbooks
 * Current: Get the input from the search box. Output to console and pass to function that will query the database.
 */
exports.search_textbooks = function(req, res) {
    var search_input = req.query.search_input;
    // TODO: remove testing (print the search input)
    console.log(search_input);

    // search the books database for the specified input

};
