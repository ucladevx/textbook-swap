const request = require('request');
const ec = require('../../utilities');

exports.get_user_info = function(req, res){
    var user = req.user;
    if (!req.user){
        res.json({
            status: 200,
            data: null
        })
        return
    }
    res.json({
        status: 200,
        data: {
            name: user.displayName,
            emails: user.emails,
            id: user.id
        }}
    );
}
