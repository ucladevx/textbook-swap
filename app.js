/*
 * Module dependencies.
 */
const express = require('express'); // express framework for node.js
const dotenv = require('dotenv'); // loads environment variables
const path = require('path'); // utilities for working with file and directory paths
const chalk = require('chalk'); // pretty command line colors

/*
 * TODO: Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/*
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const db = require('./models/init.js');

/*
 * Models (database)
 */
const initModel = require('./models/init');
//used to do a quick dirty test of the owned_books interface
const ownedBooks = require('./models/owned_books');
/*
 * API keys and Passport configuration.
 */
//const passportConfig = require('./config/passport');

/*
 * Create Express server.
 */
const app = express();

/*
 * Database initialization
 */

initModel.create_tables();

/*
    test usage of the interface
   also shows how to use next callback
 */

ownedBooks.add_book('Adi', 2, test_n);
ownedBooks.add_book('Adi', 3, test_n);
ownedBooks.get_owners(2, test_next);

const ec = require('./error_codes.js');

function test_n(errorcode){
    if (errorcode == ec.owned_books_errors.OWNED_BOOK_ALREADY_EXISTS){
        console.log("book is in the database");
    }
}

function test_next(result_code, result){
    if (result_code == ec.owned_books_errors.DB_SUCCESS){
        console.log("YAY");
    }
    if (result_code == ec.owned_books_errors.DB_QUERY_ERROR){
        console.log("wtf");
    }
}

/*
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));


/*
 * Primary app routes.
 */
app.get('/', homeController.index);


/*
 * API routes.
 */
// Nothing here for now!

/**
 * Start Express server.
 */
app.listen(app.get('port'), function(){
    console.log('%s Express server listening on port %d.', chalk.green('✓'), app.get('port'));
});