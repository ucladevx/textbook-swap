/*
 * Functions to run the loop-finding algorithms.
 */
const error_codes = require('../error_codes');
const graph_edges = require('./graph_edges');
const owned_books = require('./owned_books');
const wish_list = require('./wish_list');
const possible_trades = require('./possible_trades');
const found_trades = require('./found_trades');
const found_trades_id = require('./found_trades_id');
const users = require('./users');
const books = require('./book_info');

var edges = {}; // adjacency list of all nodes
var matched = {}; // already matched nodes
var tradeID = 0; // current trade ID

exports.run_algorithm = function(){
    console.log("running algorithm");
    load_data(function(){
        for(var i = 2; i <= 4; i++){
            var keys = Object.keys(edges);
            for(var j = 0; j < keys.length; j++){
                var key = keys[j].split(',');
                key[1] = parseInt(key[1]);
                var found = dfs(key, i, []);
            }
        }

        found_trades_id.update_id(tradeID, function(status){
            if(status == error_codes.found_trades_id_errors.DB_SUCCESS)
                console.log("Successfully updated trade ID to " + tradeID);
            else
                console.log("Failed to update trade ID.")
        });
    });
};

/*
 * Runs the DFS algorithm to the given max depth.
 * @param curr: current node we're visiting
 * @param maxDepth: maximum depth to search to
 * @param visited: an array containing the already visited nodes
 */
function dfs(curr, maxDepth, visited){
    if(matched[curr])
        return false;

    var found = false;
    if(visited.length == maxDepth){
        if(visited[0].toString() == curr.toString()){
            process(visited);
            return true;
        }
        else
            return false;
    }

    if(!edges[curr])
        return false;

    visited.push(curr);

    for(var i = 0; i < edges[curr].length; i++){
        if(dfs(edges[curr][i], maxDepth, visited)){
            found = true;
            break;
        }
    }

    visited.pop();

    return found;
}

/*
 * Process the found loop. Will add all visited nodes to the matched object and add the trade to the found_trades table.
 * @param visited: An array of the visited nodes in the loop.
 */
function process(visited){
    for(var i = 0; i < visited.length; i++){
        for(var j = i + 1; j < visited.length; j++){
            if(visited[i][0] == visited[j][0])
                return;
        }
    }

    console.log(visited);
    visited.push(visited[0]);

    for(var i = 0; i < visited.length - 1; i++){
        matched[visited[i]] = 1;

        found_trades.add_loop_edge(tradeID, visited[i][0], visited[i][1], visited[i + 1][0], visited[i + 1][1], function(status){
            if(status == error_codes.found_trades_errors.DB_SUCCESS)
                console.log("Successfully added edge to the found_trades table!");
            else
                console.log("Error adding edge to the found_trades table: " + status);
        });

        owned_books.remove_book(visited[i][0], visited[i][1], function(status){
            if(status == error_codes.owned_books_errors.DB_SUCCESS)
                console.log("Successfully removed book from owned_books table!");
            else
                console.log("Error removing book from the owned_books table: " + status);
        });

        wish_list.remove_book(visited[i][0], visited[i + 1][1], function(status){
            if(status == error_codes.wish_list_errors.DB_SUCCESS)
                console.log("Successfully removed book from wish_list table!");
            else
                console.log("Error removing book from the wish_list table: " + status);
        });

        graph_edges.remove_owned_book(visited[i][0], visited[i][1], function(status){
            if(status == error_codes.graph_edges_errors.DB_SUCCESS)
                console.log("Successfully removed edges!");
            else
                console.log("Error removing edges from the graph_edges table: " + status);
        });

        graph_edges.remove_wanted_book(visited[i][0], visited[i + 1][1], function(status){
            if(status == error_codes.graph_edges_errors.DB_SUCCESS)
                console.log("Successfully removed edges!");
            else
                console.log("Error removing edges from the graph_edges table: " + status);
        });

        possible_trades.update_status_by_owned_book('I', visited[i][0], visited[i][1], function(status){
            if(status == error_codes.possible_trades_errors.DB_SUCCESS)
                console.log("Successfully updated statuses!");
            else
                console.log("Error updating statuses: " + status);
        });

        possible_trades.update_status_by_wanted_book('I', visited[i][0], visited[i + 1][1], function(status){
            if(status == error_codes.possible_trades_errors.DB_SUCCESS)
                console.log("Successfully updated statuses!");
            else
                console.log("Error updating statuses: " + status);
        });
        var name, email, wanted_book_name, wanted_book_author, have_book_name, have_book_author, target_name;
        get_email_data(visited[i][0], visited[i][1], visited[i + 1][0], visited[i + 1][1], function(err, email_data){
            if(err) console.log(err);
            console.log(email_data);
            send_email(email_data);
        });
    }

    tradeID++;
}

//gets all relevant data from database queries
//TODO: fix callback hell!!!
function get_email_data(user_id, owned_book, target_user, wanted_book, next) {
    var data = {};
    users.get_user_name(user_id, function(err, user_name) {
        if (err) next(err);
        else data.user_name = user_name[0].user_name;
        users.get_user_email(user_id, function(err, user_email) {
            if (err) next(err);
            else data.user_email = user_email[0].user_email;
            users.get_user_name(target_user, function(err, user_name) {
                if (err) next(err);
                else data.target_name = user_name[0].user_name;
                books.get_book_info(owned_book, function(err, book_info) {
                    if (err) next(err);
                    else{
                        data.have_book_name = book_info[0].title;
                        data.have_book_author = book_info[0].author;
                    } 
                    books.get_book_info(wanted_book, function(err, book_info) {
                        if (err) next(err);
                        else{
                            data.wanted_book_name = book_info[0].title;
                            data.wanted_book_author = book_info[0].author;
                            next(null, data);
                        } 
                    });
                });
            });
        });
    });
}

function send_email(email_data){
    const nodemailer = require('nodemailer');
    const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'LoopDevX@gmail.com',
            pass: 'loopDevX2017!',
        },
    });
    const mailOptions = {
        from: 'LoopDevX@gmail.com',
        to: email_data.user_email,
        subject: 'Loop: You Got A Book Match!',
        html: 'hello world!',
    };
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        console.log(`Message sent: ${info.response}`);
    });
}


/*
 * Loads data from the database, and stores it as an adjacency list in the global object edges. Also will load the current trade ID.
 * @param next: callback to run the algorithm
 */
function load_data(next){
    graph_edges.get_graph(function(status, rows){
        for(var i = 0; i < rows.length; i++){
            var from = [rows[i]['user_id'], rows[i]['book_have']];
            var to = [rows[i]['target_id'], rows[i]['book_want']];
            if(edges[from])
                edges[from].push(to);
            else
                edges[from] = [to];
        }

        found_trades_id.get_id(function(status, rows){
            tradeID = rows[0].trade_id;
            next();
        });
    });
}