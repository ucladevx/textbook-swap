/*
 * Functions to run the loop-finding algorithms.
 */
const utilities = require('../utilities');
const graph_edges = require('./graph_edges');
const owned_books = require('./owned_books');
const possible_trades = require('./possible_trades');
const found_trades = require('./found_trades');
const found_trades_id = require('./found_trades_id');
const emailer = require('./emailer.js');
const logger = require('tracer').colorConsole();

var tradeID = 0; // current trade ID
var edges;
var matched;

exports.run_algorithm = function(){
    logger.log("running algorithm");
    edges = {}; // adjacency list of all nodes
    matched = {}; // already matched nodes
    logger.log(edges);
    logger.log(matched);
    load_data(function(){
        logger.log(edges);
        logger.log(matched);
        for(var i = 2; i <= 4; i++){
            var keys = Object.keys(edges);
            for(var j = 0; j < keys.length; j++){
                var key = keys[j].split(',');
                key[1] = parseInt(key[1]);
                var found = dfs(key, i, []);
            }
        }

        found_trades_id.update_id(tradeID, function(status){
            if(status == utilities.found_trades_id_errors.DB_SUCCESS)
                logger.log("Successfully updated trade ID to " + tradeID);
            else
                logger.log("Failed to update trade ID.")
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

    logger.log(visited);
    visited.push(visited[0]);

    for(var i = 0; i < visited.length - 1; i++){
        matched[visited[i]] = 1;

        found_trades.add_loop_edge(tradeID, visited[i][0], visited[i][1], visited[i + 1][0], visited[i + 1][1], function(status){
            if(status == utilities.found_trades_errors.DB_SUCCESS)
                logger.log("Successfully added edge to the found_trades table!");
            else
                logger.log("Error adding edge to the found_trades table: " + status);
        });

        owned_books.remove_book(visited[i][0], visited[i][1], function(status){
            if(status == utilities.owned_books_errors.DB_SUCCESS)
                logger.log("Successfully removed book from owned_books table!");
            else
                logger.log("Error removing book from the owned_books table: " + status);
        });
        
        graph_edges.remove_owned_book(visited[i][0], visited[i][1], function(status){
            if(status == utilities.graph_edges_errors.DB_SUCCESS)
                logger.log("Successfully removed edges!");
            else
                logger.log("Error removing edges from the graph_edges table: " + status);
        });

        graph_edges.remove_wanted_book(visited[i][0], visited[i + 1][1], function(status){
            if(status == utilities.graph_edges_errors.DB_SUCCESS)
                logger.log("Successfully removed edges!");
            else
                logger.log("Error removing edges from the graph_edges table: " + status);
        });

        possible_trades.remove_relation_have(visited[i][0], visited[i][1], function(status){
            if(status == utilities.possible_trades_errors.DB_SUCCESS)
                logger.log("Successfully removed possible trades by owned book!");
            else
                logger.log("Error removing possible trades by owned book: " + status);
        });

        possible_trades.remove_relation_want(visited[i][0], visited[i + 1][1], function(status){
            if(status == utilities.possible_trades_errors.DB_SUCCESS)
                logger.log("Successfully removed possible trades by wanted book!");
            else
                logger.log("Error removing possible trades by wanted book: " + status);
        });
        emailer.setup_potential_trade_email(visited[i][0], visited[i][1], visited[i + 1][0], visited[i + 1][1], function(err, email_data){
            if(err) {
                logger.log(err);
            }
            else {
                logger.log(email_data);
                emailer.send_potential_trade_email(email_data);
            }
        });
    }

    tradeID++;
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