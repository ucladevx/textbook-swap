/*
 * GET /dashboard
 * Dashboard.
 */

exports.index = function(req, res) {
    res.render('dashboard', {
        title: "Loops - Dashboard"
    });
};