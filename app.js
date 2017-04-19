/*
 * Module dependencies.
 */
const express = require('express'); // express framework for node.js
const dotenv = require('dotenv'); // loads environment variables
const path = require('path'); // utilities for working with file and directory paths
const chalk = require('chalk'); // pretty command line colors
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

/*
 * TODO: Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/*
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');

/*
 * API keys and Passport configuration.
 */

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

app.use(express.static(path.join(__dirname, 'public')));
// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

/*
 * Primary app routes.
 */
app.get('/', homeController.index);


/*
 * API routes.
 */
// Define routes for Facebook authentication
app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/login/facebook/return', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

// TODO: implement "profile" view
app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

/* 
 * Facebook Authentication
 */
require('./controllers/passport')(passport, Strategy);

/**
 * Start Express server.
 */
app.listen(app.get('port'), function(){
    console.log('%s Express server listening on port %d.', chalk.green('✓'), app.get('port'));
});