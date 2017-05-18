$(document).ready(function(){
    $.ajax({url: "/api/owned_books/get_owned_cards",
        data: { user_id: "user" },
        success: function(response){
            if(response.status === 0){
                var booklist = response.data;
                console.log(booklist);
                for (i=0; i<booklist.length; i++){
                    var title = booklist[i]["title"];
                    var author = booklist[i]["author"];
                    var isbn = booklist[i]["isbn"];
                    var book_id = booklist[i]["book_id"];
                    // display each line of the search result
                    $("#ownedList").append('<li class="list-group-item" id="' + book_id + '" data-title="' + title + '" data-author="' + author + '" data-isbn="' + isbn +'">' + title + ', ' + author +'</li>');
                }
            }
            else if(response.status === 1)
                console.log('owned_books connection error');
            else if(response.status === 2)
                console.log('owned_books query error');
        }
    });


});