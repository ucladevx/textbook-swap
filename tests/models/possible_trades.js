const ec = require('../../error_codes');
const initModel = require('../../models/init');
const possibleTrades = require('../../models/possible_trades');

exports.test = function(){
    /*
     * Test usage of the interface
     * also shows how to use next callback
     */
    var relation_have_count = 0;
    var relation_want_count = 0;
    var relation_get_relations = 0;

    /*
        after this third add relation runs, there should be no relations
        with a book_have_id = 1
    */
    possibleTrades.add_relation('Jay', 1, 10, test_n_have);
    possibleTrades.add_relation('Jay', 1, 11, test_n_have);
    possibleTrades.add_relation('Jay', 1, 12, test_n_have); 

    /*
        after this sixth add relation runs, there should be no relations
        with a book_want_id = 15
    */
    possibleTrades.add_relation('Jay', 2, 15, test_n_want);
    possibleTrades.add_relation('Jay', 3, 15, test_n_want);
    possibleTrades.add_relation('Jay', 4, 15, test_n_want);
   
    /*
        after this ninth add relation runs, running get_book_wants
        should return 8, 9, and 10
    */
    possibleTrades.add_relation('Jay', 7, 8, test_n_get_relations);
    possibleTrades.add_relation('Jay', 7, 9, test_n_get_relations);
    possibleTrades.add_relation('Jay', 7, 10, test_n_get_relations);
      
    /*
        both of these relations should exist in the database
    */
    possibleTrades.add_relation('Jay', 20, 21, test_n);
    possibleTrades.add_relation('Jay', 25, 30, test_n);

    /*
        At the conclusion of this, the DB should contain
        'Jay', 7, 8
        'Jay', 7, 9
        'Jay', 7, 10
        'Jay', 20, 21
        'Jay', 25, 30

        console log should have printed
        [ { book_want: 8 }, { book_want: 9 }, { book_want: 10 } ]
    */
  
    function test_n(errorcode){
        if (errorcode == ec.possible_trades_errors.POSSIBLE_TRADE_ALREADY_EXISTS){
            console.log("relation is in the database");
        }
    }

    function test_n_have(errorcode){
        if (errorcode == ec.possible_trades_errors.POSSIBLE_TRADE_ALREADY_EXISTS){
            console.log("relation is in the database");
        }
        relation_have_count++;
        if(relation_have_count == 3) {
            possibleTrades.remove_relation_have('Jay', 1, test_n);
        }
    }

    function test_n_want(errorcode){
        if (errorcode == ec.possible_trades_errors.POSSIBLE_TRADE_ALREADY_EXISTS){
            console.log("relation is in the database");
        }
        relation_want_count++;
        if(relation_want_count == 3) {
            possibleTrades.remove_relation_want('Jay', 15, test_n);
        }
    }

    function test_n_get_relations(errorcode){
        if (errorcode == ec.possible_trades_errors.POSSIBLE_TRADE_ALREADY_EXISTS){
            console.log("relation is in the database");
        }
        relation_get_relations++;
        if(relation_get_relations == 3) {
            possibleTrades.get_book_wants('Jay', 7, test_next);
        }
    }


    function test_next(result_code, result){
        if (result_code == ec.possible_trades_errors.DB_SUCCESS){
            console.log("YAY");
        }
        if (result_code == ec.possible_trades_errors.DB_QUERY_ERROR){
            console.log("wtf");
        }
        console.log(result);
    }
};