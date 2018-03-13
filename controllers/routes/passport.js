/*
 * Routes for Facebook Authentication
 */

const initModel = require('../../models/init');
const users = require('../../models/users');
const utilities = require('../../utilities');
const STATUS_CODE_CREATED = 201;
const STATUS_CODE_NORMAL = 200;
// output user profile info to console and redirect user to profile page
exports.loginReturn = function (req, res) {
    users.add_new_user(req.user.id, req.user.displayName, req.user.emails[0].value, function(status){
        // res.redirect('/bookshelf');
        if (status == utilities.users_errors.DB_SUCCESS) {
            console.log("going to bookshelf new")
            res.redirect(STATUS_CODE_CREATED, 'http://localhost:5000/bookshelf_new');
            return;
        }
        console.log("going to bookshelf normal")
        res.redirect(STATUS_CODE_NORMAL, 'http://localhost:5000/bookshelf')
    });
};

// logout user and redirect user to home page
exports.logout = function (req, res) {
    req.session.destroy(function (err) {res.clearCookie('connect.sid', {path: '/'});
        req.logOut();
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        // res.redirect('/'); // redirect after we destroy session and log out
        res.redirect('http://localhost:5000/')
    });
};

// redirect user to profile page
exports.profile = function(req, res) {
    res.render('profile', {
        name: req.user.displayName,
        email: req.user.emails[0].value
    });
};
