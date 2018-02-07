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
/*
[
 {
    type: "matched",
    myBook: {Book Object},
    tradedBook: {Book Object}
 },
 {
    type: "declined",
    myBook: {Book Object},
    tradedBooks: [Book Objects]
 },
 {
    type: "pending",
    myBook: {Book Object},
    tradedBooks: [Book Objects]
 }
]
*/

/*
1 - No Match --> 1 to many
2 - Pending your Response --> 1 to 1
3
*/

// ACCEPTED --> Everyone => 1 to 1
// PENDING YOUR RESPONSE --> You need to respond => 1 to 1
// REJECTED --> You/someone else REJECTED => 1 to 1
// NO MATCH --> 1 to many
// WAITING FOR MATCHERS TO CONFIRM -->
