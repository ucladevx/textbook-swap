//NOTE these tests suck. you need to have very strict control of the database and what is in it for these tests to work.
// I just used them for quick validation

const ec = require('../../error_codes');
const graph_edges = require('../../models/graph_edges');

exports.test_add_edges = function(){
    graph_edges.add_edge('Adi', 2, 'Jay', 1, test_add_next);
    graph_edges.add_edge('Jay', 3, 'Adi', 2, test_add_next);
    graph_edges.add_edge('Jerry', 12, 'Karen', 15, test_add_next);
    graph_edges.add_edge('Adi', 12, 'Lawrence', 15, test_add_next);
    function test_add_next(err_code){
        if (err_code == ec.graph_edges_errors.DB_SUCCESS)
            console.log("TEST PASSED");
        else{
            console.log("TEST FAILED");
        }
    }
};

//to be run after test_add_edge
exports.test_add_repeat = function(){
    graph_edges.add_edge('Jerry', 12, 'Karen', 15, test_add_next);

    function test_add_next(err_code){
        if (err_code == ec.graph_edges_errors.GRAPH_EDGE_ALREADY_EXISTS)
            console.log("TEST PASSED");
        else{
            console.log("TEST FAILED");
        }
    }
};

//to be run after add_edge
exports.test_remove_edge = function(){
    graph_edges.remove_edge('Jerry', 12, 'Karen', 15, test_remove_next);

    function test_remove_next(err_code){
        if (err_code == ec.graph_edges_errors.DB_SUCCESS){
            console.log("TEST PASSED");
        }
        else{
            console.log("TEST FAILED");
        }
    }
};

exports.test_get_graph = function(){
  graph_edges.get_graph(next);

  function next(err_code, result){
      if (err_code == ec.graph_edges_errors.DB_SUCCESS){
          console.log(result);
          console.log("TEST SUCCESS");
      }
      else{
          console.log("TEST FAILED");
      }
  }
};

exports.test_remove_owned_book = function(){
    graph_edges.remove_owned_book('Adi', 2, test_remove_owned_next);

    function test_remove_owned_next(err_code){
        if(err_code == ec.graph_edges_errors.DB_SUCCESS){
            console.log("TEST SUCCCESS");
        }
        else{
            console.log("TEST FAIL");
        }
    }
};

exports.test_remove_wanted_book = function(){
    graph_edges.remove_wanted_book('Adi', 15, next);

    function next(err_code){
        if(err_code == ec.graph_edges_errors.DB_SUCCESS){
            console.log("TEST SUCCESS");
        }
        else{
            console.log("TEST FAILURE");
        }
    }
};

exports.cleanup = function(){
    graph_edges.remove_edge('Adi', 2, 'Jay', 1, next);
    graph_edges.remove_edge('Jay', 3, 'Adi', 2, next);
    graph_edges.remove_edge('Jerry', 12, 'Karen', 15, next);
    graph_edges.remove_edge('Adi', 12, 'Lawrence', 15, next);

    function next(){
        console.log("cleanup");
    }

};