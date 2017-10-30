const assert = require('assert');
const dotenv = require('dotenv');
const bookInfo = require('../models/book_info');
dotenv.config();

describe('models.book_info', function(){
    describe('#get_book_info()', function() {
        it('should return the Algorithm Design textbook information', function(done) {
            bookInfo.get_book_info(253, function(err, result){
                assert.equal('Algorithm Design', result[0]['title']);
                if (err) done(err);
                else done();
            });
        });
    });

    describe('#get_books_info()', function() {
        it('should return the book information for all passed in book IDs', function(done) {
            bookInfo.get_books_info([253, 300], function(err, result){
                assert.equal('Algorithm Design', result[0]['title']);
                assert.equal('Kreps', result[1]['author']);
                if (err) done(err);
                else done();
            });
        });
    });
});