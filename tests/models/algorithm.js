/*
 * Basic testing of the algorithm.
 */

const ec = require('../../utilities');
const ob = require('../../models/owned_books');
const pt = require('../../models/possible_trades');
const ge = require('../../models/graph_edges');
const algorithm = require('../../models/algorithm');
const logger = require('tracer').colorConsole();

exports.test_algorithm = function(){
    ob.add_book('A', 1, a);
    ob.add_book('B', 2, a);
    ob.add_book('B', 5, a);
    ob.add_book('C', 3, a);
    ob.add_book('C', 4, a);
    ob.add_book('D', 2, a);
    ob.add_book('E', 6, a);

    wl.add_book('A', 2, a);
    wl.add_book('A', 6, a);
    wl.add_book('B', 3, a);
    wl.add_book('B', 4, a);
    wl.add_book('C', 1, a);
    wl.add_book('C', 2, a);
    wl.add_book('D', 5, a);
    wl.add_book('E', 3, a);

    pt.add_relation('A', 1, 2, a);
    pt.add_relation('A', 1, 6, a);
    pt.add_relation('B', 2, 3, a);
    pt.add_relation('B', 5, 4, a);
    pt.add_relation('C', 4, 1, a);
    pt.add_relation('C', 3, 1, a);
    pt.add_relation('C', 3, 2, a);
    pt.add_relation('D', 2, 5, a);
    pt.add_relation('E', 6, 3, a);

    ge.add_edge('A', 1, 'E', 6, a);
    ge.add_edge('A', 1, 'B', 2, a);
    ge.add_edge('A', 1, 'D', 2, a);
    ge.add_edge('B', 2, 'C', 3, a);
    ge.add_edge('B', 5, 'C', 4, a);
    ge.add_edge('C', 3, 'B', 2, a);
    ge.add_edge('C', 3, 'A', 1, a);
    ge.add_edge('C', 3, 'D', 2, a);
    ge.add_edge('C', 4, 'D', 2, a);
    ge.add_edge('C', 4, 'A', 1, a);
    ge.add_edge('D', 2, 'B', 5, a);
    ge.add_edge('E', 6, 'C', 3, a);

    algorithm.run_algorithm();

    function test_add_next(err_code){
        if (err_code == ec.graph_edges_errors.DB_SUCCESS)
            logger.log("Edge added to database.");
    }

    function a(err){

    }
};
