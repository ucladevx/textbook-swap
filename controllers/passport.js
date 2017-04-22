/*
 * API keys and Passport configuration.
 */
const passportConfig = require('../config/auth');

/* 
 * Facebook Authentication
 */

 // Routes

// output user profile info to console and redirect user to profile page
exports.loginReturn = function(req, res) {
    // output the user profile info to console to verify
    // req.user is the authenticated user
    console.log(req.user.displayName);  // full name
    console.log(req.user.username);  // username (undefined?)
    console.log(req.user.id);  // user ID
    // successful authentication, redirect so user can see their profile
    res.redirect('/profile');
};

// logout user and redirect user to home page
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

 // Strategy
module.exports = function(passport, Strategy) {
  // Configure the Facebook strategy for use by Passport.
  //
  // OAuth 2.0-based strategies require a `verify` function which receives the
  // credential (`accessToken`) for accessing the Facebook API on the user's
  // behalf, along with the user's profile.  The function must invoke `cb`
  // with a user object, which will be set at `req.user` in route handlers after
  // authentication.
  passport.use(new Strategy({
      clientID: passportConfig.facebookAuth.clientID,
  	  clientSecret: passportConfig.facebookAuth.clientSecret,
  	  callbackURL: passportConfig.facebookAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, cb) {
      // In this example, the user's Facebook profile is supplied as the user
      // record.  In a production-quality application, the Facebook profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.
      return cb(null, profile);
    }));


  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  In a
  // production-quality application, this would typically be as simple as
  // supplying the user ID when serializing, and querying the user record by ID
  // from the database when deserializing.  However, due to the fact that this
  // example does not have a database, the complete Facebook profile is serialized
  // and deserialized.
  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

};