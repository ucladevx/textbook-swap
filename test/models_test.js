const assert = require('assert');
const bookInfo = require('../models/book_info');

describe('bookInfo', function(){
   describe('#get_book_info()', function() {
      it('should return the Algorithm Design textbook information', function(done) {
         bookInfo.get_book_info(1067, function(err, result){
            assert.equal('Algorithm Design', result[0]['title']);
            if (err)
               done(err);
            else
               done();
         });
      });
   });
});