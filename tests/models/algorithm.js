/*
 * Basic testing of the algorithm.
 */

const ec = require('../../error_codes');
const graph_edges = require('../../models/graph_edges');
const algorithm = require('../../models/algorithm');

exports.test_algorithm = function(){
    // graph_edges.add_edge('A', 1, 'B', 2, test_add_next);
    // graph_edges.add_edge('B', 2, 'C', 3, test_add_next);
    // graph_edges.add_edge('A', 1, 'C', 2, test_add_next);
    // graph_edges.add_edge('C', 3, 'A', 1, test_add_next);
    algorithm.run_algorithm();


    function test_add_next(err_code){
        if (err_code == ec.graph_edges_errors.DB_SUCCESS)
            console.log("TEST PASSED");
        else{
            console.log("TEST FAILED");
        }
    }
};
