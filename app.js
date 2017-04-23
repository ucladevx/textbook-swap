/*
 * Module dependencies.
 */
const express = require('express'); // express framework for node.js
const dotenv = require('dotenv'); // loads environment variables
const path = require('path'); // utilities for working with file and directory paths
const chalk = require('chalk'); // pretty command line colors
const bodyParser = require('body-parser'); // parse body of POST requests
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const morgan = require('morgan');
const cookie = require('cookie-parser');
const session = require('express-session');

/*
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config();

/*
 * Controllers (route handlers).
 */
const homeController = require('./controllers/routes/home');
const homeController = require('./controllers/home');
const passportController = require('./controllers/passport');

/*
 * Controllers (API)
 */
const ownedBooksController = require('./controllers/api/owned_books');

/*
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport')(passport, FacebookStrategy);

/*
 * Create Express server.
 */
const app = express();

/*
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/*
 * Use application-level middleware for common functionality, including logging, parsing, and session handling.
 */
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(morgan('combined'));
app.use(cookie());
app.use(session({ secret: 'keyboard', resave: false, saveUninitialized: false }));

/*
 * Initialize Passport and restore authentication state, if any, from the session.
 */
app.use(passport.initialize());
app.use(passport.session());

/*
 * Primary app routes.
 */
app.get('/', homeController.index);

/*
 * API routes.
 */

// Owned books
app.post('/api/owned_books/add', ownedBooksController.add_book);
app.post('/api/owned_books/remove', ownedBooksController.remove_book);
app.get('/api/owned_books/get_books', ownedBooksController.get_books);
app.get('/api/owned_books/get_owners', ownedBooksController.get_owners);

/*
 * Tests
 */
const ownedBooksTest = require('./tests/models/owned_books').test();

/*
 * Authentication routes.
 */
// Define routes for Facebook authentication
// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at '/login/facebook/return'
app.get('/login/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email']}));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/login/facebook/return', passport.authenticate('facebook', {
    failureRedirect: '/login',
    scope: ['public_profile', 'email']
}), passportController.loginReturn);

// Log out the user
app.get('/logout/facebook', passportController.logout);

// Implement "profile" view
app.get('/profile', require('connect-ensure-login').ensureLoggedIn(), passportController.profile);

/*
 * Start Express server.
 */
app.listen(app.get('port'), function(){
    console.log('%s Express server listening on port %d.', chalk.green('✓'), app.get('port'));
});