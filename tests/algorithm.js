/*
 * Functions to run the loop-finding algorithms.
 */
const ge = require('../models/graph_edges');

exports.run_algorithm = function(){
    exports.load_data();
};


/*
 * Loads data from the database, and stores it as adjacency lists in a map.
 * @return A map associating each user/book pair with a list of its neighbors.
 */
exports.load_data = function(){
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

        return edges;
    });
};