const ec = require('../../utilities');
const initModel = require('../../models/init');
const bookToClass = require('../../models/book_to_class');

exports.test = function() {
    /*
     * Test usage of the interface
     * also shows how to use next callback
     */

    /*
     * Test basic usage of get book id
     * console should print [ { professor_name: 'HAYNES', class_name: 'LATIN 1' } ]
     */
    bookToClass.get_book_id("COMSCI 180", "OSTROVSKY", test_next);
    /*
     * Test basic usage of get professor class id
     * console should print [ { book_id: 9042 } ]
     */
    bookToClass.get_professor_class_id(1067, test_next);

    function test_next(result_code, result) {
        if (result_code == ec.book_to_class_errors.DB_SUCCESS) {
            console.log("YAY");
        }
        if (result_code == ec.book_to_class_errors.DB_QUERY_ERROR) {
            console.log("wtf");
        }
        console.log(result);
    }
};