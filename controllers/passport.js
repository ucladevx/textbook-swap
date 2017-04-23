/*
 * Routes for Facebook Authentication
 */

// output user profile info to console and redirect user to profile page
exports.loginReturn = function (req, res) {
    // output the user profile info to console to verify
    // req.user is the authenticated user
    // TODO: Store user information in database
    console.log(req.user.displayName);  // full name
    console.log(req.user.id);  // user ID
    console.log(req.user.emails[0].value);  // email address
    // successful authentication, redirect so user can see their profile
    res.redirect('/profile');
};

// logout user and redirect user to home page
exports.logout = function (req, res) {
  req.session.destroy(function (err) {
    res.clearCookie('connect.sid', {path: '/'});
    req.logOut();
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.redirect('/'); // redirect after we destroy session and log out
  });
};

// redirect user to profile page
exports.profile = function(req, res) {
    res.render('profile', {
        name: req.user.displayName,
        email: req.user.emails[0].value
    });
};