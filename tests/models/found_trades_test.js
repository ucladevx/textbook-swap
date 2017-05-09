/*
     Tests for found_trades.js and found_trades_id.js
     Run these tests in this order!
 */


const ec = require('../../error_codes');
const found_trades = require('../../models/found_trades');
const found_trades_id = require('../../models/found_trades_id');

exports.test_add_edges = function(){
    found_trades.add_loop_edge(1,'Adi', 2, 'Jay', 1, test_add_next);
    found_trades.add_loop_edge(1,'Jay', 1, 'Adi', 2, test_add_next);
    found_trades.add_loop_edge(2,'Jerry', 12, 'Karen', 15, test_add_next);
    found_trades.add_loop_edge(2, 'Karen', 15, 'Jerry', 12, test_add_next);
    function test_add_next(err_code){
        if (err_code == ec.graph_edges_errors.DB_SUCCESS)
            console.log("TEST PASSED");
        else{
            console.log("TEST FAILED");
        }
    }
};

//to be run right after test_add_edges
exports.test_num_trades = function(){
    found_trades.get_number_of_loops(test_next);
    function test_next(err_code, result){
        if (err_code == ec.found_trades_errors.DB_SUCCESS){
            if (result[0].count == 2){
                console.log("TEST PASSED");
            }
            else{
                console.log("TEST FAILED - wrong count returned");
            }
        }
        else{
            console.log("TEST FAILED - database err");
        }
    }
};

//to be run after test_add_edges
exports.test_get_edges_by_id = function() {
  found_trades.get_trade_by_id(1, test_next);
  function test_next(err_code, result){
      if (err_code == ec.found_trades_errors.DB_SUCCESS){
          console.log("TEST PASSED: results below");
          console.log(result)

      }
      else{
          console.log("TEST FAILED");
      }
  }
};

exports.test_get_edges_by_book = function() {
    found_trades.get_trade_by_book_owned('Adi', 2, test_next);
    found_trades.get_trade_by_wanted_book('Adi', 1, test_next);

    function test_next(err_code, result){
        if (err_code == ec.found_trades_errors.DB_SUCCESS){
            console.log("TEST PASSED: results below");
            console.log(result)

        }
        else{
            console.log("TEST FAILED");
        }
    }

};

exports.test_remove_loop_by_id = function(){
    found_trades.remove_trade_by_id(1, test_next);

    function test_next(err_code){
        if (err_code == ec.found_trades_errors.DB_SUCCESS){
            console.log("TEST PASSED");
        }
        else{
            console.log("TEST FAILED");
        }
    }
};

exports.test_remove_loop_by_book = function(){
    found_trades.remove_trade_by_book_owned('Jerry', 12, test_next);

    function test_next(err_code){
        if (err_code == ec.found_trades_errors.DB_SUCCESS){
            console.log("TEST PASSED");
        }
        else{
            console.log("TEST FAILED");
        }
    }
};

exports.test_update_id_fail = function(){
    found_trades_id.update_id(1, next);

    function next(err){
        if (err == ec.found_trades_id_errors.ID_DNE){
            console.log("TEST SUCCESS");
        }
        else{
            console.log("TEST FAILED");
        }
    }
};

exports.test_add_id = function(){
    found_trades_id.insert_id(1, next);

    function next(err){
        if (err == ec.found_trades_id_errors.DB_SUCCESS){
            console.log("TEST SUCCESS");
        }
        else{
            console.log("TEST FAILED");
        }
    }
};

exports.test_update_id = function(){
    found_trades_id.update_id(2, next);
    function next(err){
        if (err == ec.found_trades_id_errors.DB_SUCCESS){
            console.log("TEST SUCCESS");
        }
        else {
            console.log("TEST FAIL");
        }
    }
};

exports.test_get_id = function(){
    found_trades_id.get_id(next);
    function next(err, result){
        if (err == ec.found_trades_id_errors.DB_SUCCESS){
            console.log("TEST SUCCESS: result below");
            console.log(result);
        }
        else {
            console.log("TEST FAIL");
        }
    }
};