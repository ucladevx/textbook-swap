/*
 * API for adding, deleting, and querying owned books.
 */

const request = require('request');
const ec = require('../../utilities');
const btc = require('../../models/book_to_class');
const logger = require('tracer').colorConsole();


/*
 * GET http://localhost:3000/api/book_to_class/get_prof_class_info
 * Gets all the professor_name's and class_name's associated with a particular book_id's in the book_to_class database
 * Replies with a json object containing the status of the database operation and the list of [professor_name, class_name] associated with the book_id
 */
exports.get_prof_class_info = function(req, res) {
    var user_id = req.user.id;
    var book_id = req.query.book_id;

    btc.get_professor_class_id(book_id, function(status, data){
        if (status == ec.book_to_class_errors.DB_SUCCESS)
            logger.log("Successfully found books from the database!");

        res.json({status: status, data: data});
    });
};