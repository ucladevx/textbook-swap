/*
 * API for searching for textbooks
 */

const request = require('request');
const ec = require('../../error_codes');

/*
 * GET http://localhost:3000/api/textbook_search/get_search_input
 * Get the input from the search box and output to console.
 */
exports.get_search_input = function(req, res) {
    var search_input = req.query.search_input;

    console.log(search_input);
};