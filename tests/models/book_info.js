const ec = require('../../error_codes');
const initModel = require('../../models/init');
const bookInfo = require('../../models/book_info');

exports.test = function(){
  /*
   * Test usage of the interface
   * also shows how to use next callback
   */

  /*
  * Test basic usage of get professor class id
  * console should print
    [ { book_id: 9042,
    title: 'Algorithm Design',
    author: 'Kleinberg',
    isbn: '9780321295354',
    img_url: 'https://coverimages.verbacompete.com/0a393b60-28b2-5649-81d9-60eb956cb2cf.jpg',
    tsv: '\'algorithm\':1 \'design\':2' } ]

    [ { book_id: 1067,
    title: 'Learn To Read Latin',
    author: 'Keller',
    isbn: '9780300194951',
    img_url: 'https://coverimages.verbacompete.com/3fa643ae-25b8-5ecd-9271-2315496ddc2d.jpg',
    tsv: '\'latin\':4 \'learn\':1 \'read\':3' } ]

  */
  bookInfo.get_book_info(1067, test_next);
  bookInfo.get_book_info(9042, test_next);


 function test_next(result_code, result){
        if (result_code == ec.book_info_errors.DB_SUCCESS){
            console.log("YAY");
        }
        if (result_code == ec.book_info_errors.DB_QUERY_ERROR){
            console.log("wtf");
        }
        console.log(result);
    }


};