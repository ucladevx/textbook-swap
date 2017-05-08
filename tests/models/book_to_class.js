const ec = require('../../error_codes');
const initModel = require('../../models/init');
const bookToClass = require('../../models/book_to_class');

exports.test = function(){
  /*
   * Database initialization
   */
  initModel.create_tables();

  /*
   * Test usage of the interface
   * also shows how to use next callback
   */


   bookToClass.get_book_id();
   bookToClass.get_professor_class_id();

  function test_n(errorcode){
      if (errorcode == ec.book_to_class_errors.POSSIBLE_TRADE_ALREADY_EXISTS){
          console.log("relation is in the database");
      }
  }


};