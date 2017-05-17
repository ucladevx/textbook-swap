/*
 * Initializing the owned books and wanted books lists
 */

$(document).ready(function(){

    $(function() {
        //----- OPEN
        $('[data-popup-open]').on('click', function(e)  {
            var targeted_popup_class = jQuery(this).attr('data-popup-open');
            $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);

            e.preventDefault();
        });

        //----- CLOSE
        $('[data-popup-close]').on('click', function(e)  {
            var targeted_popup_class = jQuery(this).attr('data-popup-close');
            $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);

            e.preventDefault();
        });
    });

	$.ajax({url: "/api/owned_books/get_books",
		data: { user_id: "user" },
		success: function(response){
	 		if(response.status === 0){
				var booklist = response.data;
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
				console.log('db connection error');
			else if(response.status === 2)
				console.log('db query error');
		}
	});

	$.ajax({url: "/api/wish_list/get_books",
		data: { user_id: "user" },
		success: function(response){
	 		if(response.status === 0){
				var booklist = response.data;
				for (i=0; i<booklist.length; i++){
					var title = booklist[i]["title"];
					var author = booklist[i]["author"];
					var isbn = booklist[i]["isbn"];
					var book_id = booklist[i]["book_id"];
					// display each line of the search result
					$("#wantedList").append('<li class="list-group-item" id="' + book_id + '" data-title="' + title + '" data-author="' + author + '" data-isbn="' + isbn +'">' + title + ', ' + author +'</li>');
				}
			}
			else if(response.status === 1)
				console.log('db connection error');
			else if(response.status === 2)
				console.log('db query error');
		}
	});

})

/* 
 * Searching and adding entries to the owned books list
 */ 

// get input from search box as user types, character by character and query the database for textbooks
$("#ownedInput").keyup(function() {
	var ownedInput = $("#ownedInput").val();
	// only query for results if the input is at least three characters long
	if (ownedInput.length >= 3) {
		$.get("/api/search/search_textbooks", { search_input: ownedInput }, function(object) {
			// get the search results
			var searchResults = object.data;

			// successful query
			if (object.status == 0) {
				// new search results found, so display them
				if (searchResults.length > 0) {
					$("#ownedSearchResultsList").empty();
					// display all of the search results on the screen
					for (var i = 0; i < searchResults.length; i++) {
						var title = searchResults[i]["title"];
						var author = searchResults[i]["author"];
						var isbn = searchResults[i]["isbn"];
						var book_id = searchResults[i]["book_id"];
						// display each line of the search result
						$("#ownedSearchResultsList").append('<li class="list-group-item" id="' + book_id + '" data-title="' + title + '" data-author="' + author + '" data-isbn="' + isbn +'">' + title + ', ' + author +'</li>');
					}
				}
			}
			// error when querying
			else if (object.status === 2)
				console.log('db query error');
		});
	}
	else {
		// input too small to query so clear the search results list
		$("#ownedSearchResultsList").empty();
	}
})

// add search result to owned books list
$("#ownedSearchResultsList").on("click", ".list-group-item", function(){
	// get data from list element tags
	var searchResult = this;
	var book_id = searchResult.id;
	var title = searchResult.dataset.title;  
	var author = searchResult.dataset.author;
	var isbn = searchResult.dataset.isbn;

	$.post("/api/owned_books/add",
		{ user_id: "user", book_id: book_id },
		function(data){
			if(data.status === 0){
				$("#ownedList").append('<li class="list-group-item" id="' + book_id + '" data-title="' + title + '" data-author="' + author + '" data-isbn="' + isbn +'">' + title + ', ' + author +'</li>');
			}
			else if(data.status === 1)
				console.log('db connection error');
			else if(data.status === 2)
				console.log('db query error');
			else if(data.status === 3){
				console.log('book already exists');
			}
		},
		"json"
	)
})

/* 
 * Searching and adding entries to the wanted books list
 */ 

// get input from search box as user types, character by character and query the database for textbooks
$("#wantedInput").keyup(function() {
	var wantedInput = $("#wantedInput").val();
	// only query for results if the input is at least three characters long
	if (wantedInput.length >= 3) {
		$.get("/api/search/search_textbooks", { search_input: wantedInput }, function(object) {
			// get the search results
			var searchResults = object.data;

			// successful query
			if (object.status == 0) {
				// new search results found, so display them
				if (searchResults.length > 0) {
					$("#wantedSearchResultsList").empty();
					// display all of the search results on the screen
					for (var i = 0; i < searchResults.length; i++) {
						var title = searchResults[i]["title"];
						var author = searchResults[i]["author"];
						var isbn = searchResults[i]["isbn"];
						var book_id = searchResults[i]["book_id"];
						// display each line of the search result
						$("#wantedSearchResultsList").append('<li class="list-group-item" id="' + book_id + '" data-title="' + title + '" data-author="' + author + '" data-isbn="' + isbn +'">' + title + ', ' + author +'</li>');
					}
				}
			}
			// error when querying
			else if (object.status === 2)
				console.log('db query error');
		});
	}
	else {
		// input too small to query so clear the search results list
		$("#wantedSearchResultsList").empty();
	}
})

// add search result to wanted books list
$("#wantedSearchResultsList").on("click", ".list-group-item", function(){
	// get data from list element tags
	var searchResult = this;
	var book_id = searchResult.id;
	var title = searchResult.dataset.title;  
	var author = searchResult.dataset.author;
	var isbn = searchResult.dataset.isbn;

	$.post("/api/wish_list/add",
		{ user_id: "user", book_id: book_id },
		function(data){
			if(data.status === 0){
				$("#wantedList").append('<li class="list-group-item" id="' + book_id + '" data-title="' + title + '" data-author="' + author + '" data-isbn="' + isbn +'">' + title + ', ' + author +'</li>');
			}
			else if(data.status === 1)
				console.log('db connection error');
			else if(data.status === 2)
				console.log('db query error');
			else if(data.status === 3){
				console.log('book already exists');
			}
		},
		"json"
	)
})

/*
 * Deleting entries from the owned books list
 */

$("#ownedList").on("click", ".list-group-item", function(){
	// get data from list element tags
	var listedBook = this;
	var book_id = listedBook.id;

	$.post("/api/owned_books/remove",
		{ user_id: "user", book_id: book_id },
		function(data){
			if(data.status === 0){
				listedBook.remove();
			}
			else if(data.status === 1)
				console.log('db connection error');
			else if(data.status === 2)
				console.log('db query error');
			else if(data.status === 4){
				console.log('book does not exist');
			}
		},
		"json"
	);
})

/*
 * Deleting entries from the wanted books list
 */

$("#wantedList").on("click", ".list-group-item", function(){
	// get data from list element tags
	var listedBook = this;
	var book_id = listedBook.id;

	$.post("/api/wish_list/remove",
		{ user_id: "user", book_id: book_id },
		function(data){
			if(data.status === 0){
				listedBook.remove();
			}
			else if(data.status === 1)
				console.log('db connection error');
			else if(data.status === 2)
				console.log('db query error');
			else if(data.status === 4){
				console.log('book does not exist');
			}
		},
		"json"
	);
})