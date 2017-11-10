const ec = require('../../utilities');
const initModel = require('../../models/init');
const users = require('../../models/users');

exports.test = function() {
    /*
     * Test usage of the interface
     * also shows how to use next callback
     */
    var user_count = 0;
    users.add_new_user('Jay', 'Jayendra Jog', 'jay08jog@gmail.com', test_n);
    users.add_new_user('Jay2', 'Jay Jog', 'jayendra@ucla.edu', test_n);
    users.add_new_user('Jay3', 'Hayendra Hog', 'idontevenknow@gmail.com', test_n);

    /*
     At the conclusion of this, the DB should contain
     'Jay', 'Jayendra Jog', 'jay08jog@gmail.com'
     'Jay2', 'Jay Jog', 'jayendra@ucla.edu'

     console log should have printed
     [ { user_email: 'jay08jog@gmail.com' } ]
     [ { user_name: 'Jay Jog' } ]
     */

    function test_n(errorcode) {
        if (errorcode == ec.users_errors.USER_ALREADY_EXISTS) {
            console.log("relation is in the database");
        }
        user_count++;
        if (user_count == 3) {
            users.get_user_email('Jay', test_print);
            users.get_user_name('Jay2', test_print);
            users.remove_user('Jay3', test);
        }
    }

    function test_print(errorcode, result) {
        if (errorcode == ec.users_errors.USER_ALREADY_EXISTS) {
            console.log("relation is in the database");
        }
        console.log("gets to result");
        console.log(result);
    }

    function test(errorcode) {
        if (errorcode == ec.users_errors.USER_ALREADY_EXISTS) {
            console.log("relation is in the database");
        }
    }
};