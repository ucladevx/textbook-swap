const assert = require('assert');
const request = require('request');
const bookInfo = require('../models/book_info');

exports.test_api = function() {
    describe ('api.book_info', function(){
        describe('GET /api/book_info/get_book_info', function() {
            it('should return the Algorithm Design textbook information', function(done) {
                request.get('http://localhost:3000/api/book_info/get_book_info?id=253', function(err, res, body){
                    assert.equal(200, res.statusCode);
                    body_status = JSON.parse(body)['status'];
                    body_data = JSON.parse(body)['data'][0];
                    assert.equal(0, body_status);
                    expected_body_data = { book_id: 253,
                                           title: 'Algorithm Design',
                                           author: 'Kleinberg',
                                           isbn: '9780321295354',
                                           img_url: 'https://coverimages.verbacompete.com/0a393b60-28b2-5649-81d9-60eb956cb2cf.jpg',
                                           tsv: '\'9780321295354\':4 \'algorithm\':1 \'design\':2 \'kleinberg\':3' }
                    for (key in body_data){
                        assert.equal(body_data[key], expected_body_data[key])
                    }
                    done();
                });
            });
        });
    });
}