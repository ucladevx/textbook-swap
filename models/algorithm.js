/*
 * Functions to run the loop-finding algorithms.
 */
const ge = require('./graph_edges');

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
 * Process the found loop
 */
function process(visited){
    console.log(visited);
    for(var i = 0; i < visited.length; i++)
        matched[visited[i]] = 1;

}


/*
 * Loads data from the database, and stores it as adjacency lists in an object (map). Also will load the current trade ID.
 * @param next: callback to run the algorithm with the data and trade ID.
 */
function load_data(next){
    ge.get_graph(function(status, rows){
        var edges = {};
        for(var i = 0; i < rows.length; i++){
            var from = [rows[i]['user_id'], rows[i]['book_have']];
            var to = [rows[i]['target_id'], rows[i]['book_want']];
            if(edges[from])
                edges[from].push(to);
            else
                edges[from] = [to];
        }

        next(edges);
    });
}