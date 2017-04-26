/*
    quick unit tests for the database
 */

'use strict';

const owned_books = require('../../models/owned_books');
const error_codes = require('../../error_codes');

function add_book_next(result){
    if (result == error_codes.owned_books_errors.DB_SUCCESS){
        owned_books.add_book('Adi', 5, function(result){
            if (result == error_codes.owned_books_errors.OWNED_BOOK_ALREADY_EXISTS){
                console.log("Add book was successful!")
            }
            else{
                throw new Error("Adding repeat book test failed!");
            }
        });
    }
    else{
        throw new Error("Add book test failed - adding first book failed");
    }
}

function test_add_book(){
    owned_books.add_book('Adi', 5, add_book_next);
}


function remove_book_next(result){
    if (result == error_codes.owned_books_errors.DB_SUCCESS || result == error_codes.owned_books_errors.OWNED_BOOK_ALREADY_EXISTS){
        owned_books.remove_book('Adi', 5, function(result){
           if (result == error_codes.owned_books_errors.DB_SUCCESS){
               console.log("remove book test is success");
           }
           else{
               throw new Error("Removing book test failed!");
           }
        });
    }
    else{
        throw new Error("Adding book during remove book test failed!");
    }
}

function test_remove_book(){
    owned_books.add_book('Adi', 5, remove_book_next);
}

