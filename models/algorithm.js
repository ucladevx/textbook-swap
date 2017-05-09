/*
 * Functions to run the loop-finding algorithms.
 */
const ec = require('../error_codes');
const ge = require('./graph_edges');
const ft = require('./found_trades');
const ftID = require('./found_trades_id');

var edges = {}; // adjacency list of all nodes
var matched = {}; // already matched nodes
var tradeID = 0; // current trade ID

exports.run_algorithm = function(){
    load_data(function(){
        for(var i = 2; i <= 4; i++){
            var keys = Object.keys(edges);
            for(var j = 0; j < keys.length; j++){
                var key = keys[j].split(',');
                key[1] = parseInt(key[1]);
                var found = dfs(key, i, []);
            }
        }

        ftID.update_id(tradeID, function(status){
            if(status == ec.found_trades_id_errors.DB_SUCCESS)
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
    console.log(visited);
    for(var i = 0; i < visited.length; i++){
        matched[visited[i]] = 1;

        if(i == 0) {
            var last = visited[visited.length - 1];
            ft.add_loop_edge(tradeID, last[0], last[1], visited[0][0], visited[0][1], function(status){
                if(status == ec.found_trades_errors.DB_SUCCESS)
                    console.log("Successfully added edge to the found_trades table!");
                else
                    console.log("Error adding edge to the found_trades table: " + status);
            });
        }
        else {
            ft.add_loop_edge(tradeID, visited[i - 1][0], visited[i - 1][1], visited[i][0], visited[i][1], function(status){
                if(status == ec.found_trades_errors.DB_SUCCESS)
                    console.log("Successfully added edge to the found_trades table!");
                else
                    console.log("Error adding edge to the found_trades table: " + status);
            });
        }
    }

    tradeID++;
}


/*
 * Loads data from the database, and stores it as an adjacency list in the global object edges. Also will load the current trade ID.
 * @param next: callback to run the algorithm
 */
function load_data(next){
    ge.get_graph(function(status, rows){
        for(var i = 0; i < rows.length; i++){
            var from = [rows[i]['user_id'], rows[i]['book_have']];
            var to = [rows[i]['target_id'], rows[i]['book_want']];
            if(edges[from])
                edges[from].push(to);
            else
                edges[from] = [to];
        }

        ftID.get_id(function(status, rows){
            tradeID = rows[0].trade_id;
            next();
        });
    });
}