/*
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
    console.log(req);
    res.render('home', {
        sample_data: 4
    });
};