/*
 * FOR DEVELOPMENT ONLY: API for running the algorithm.
 */

const utilities = require('../../utilities');
const algorithm = require('../../models/algorithm');
const logger = require('tracer').colorConsole();

/*
 * GET http://localhost:3000/api/algorithm/run
 * Runs the algorithm. Only for development/demo/testing use.
 * Replies with a json object containing status of the database query.
 */
exports.run_algorithm = function(req, res) {
    algorithm.run_algorithm();
    res.redirect('/bookshelf');
};
