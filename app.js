/*
 * Module dependencies.
 */
const express = require('express'); // express framework for node.js
const dotenv = require('dotenv'); // loads environment variables
const path = require('path'); // utilities for working with file and directory paths
const chalk = require('chalk'); // pretty command line colors
const bodyParser = require('body-parser'); // parse body of POST requests

/*
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config();

/*
 * Controllers (route handlers).
 */
const homeController = require('./controllers/routes/home');

/*
 * Controllers (API)
 */
const ownedBooksController = require('./controllers/api/owned_books');

/*
 * API keys and Passport configuration.
 */
//const passportConfig = require('./config/passport');

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

app.use(express.static(path.join(__dirname, 'public'))); // public directory
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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
 * Start Express server.
 */
app.listen(app.get('port'), function(){
    console.log('%s Express server listening on port %d.', chalk.green('✓'), app.get('port'));
});