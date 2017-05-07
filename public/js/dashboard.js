$(document).ready(function(){
	$.ajax({url: "/api/owned_books/get_books",
		data: { user_id: "user" },
		success: function(response){
	 		if(response.status === 0){
				var booklist = response.data
				for (i=0; i<booklist.length; i++){
					$("#ownedList").append('<li class="list-group-item" id="'+booklist[i].book_id+'">'+booklist[i].book_id+'</li>')
				}
			}
			else if(response.status === 1)
				console.log('db connection error')
			else if(response.status === 2)
				console.log('db query error')
		}
	})
})

$("#addOwned").click(function() {
	var bookid = $("#ownedID").val()
	$("#ownedID").val('')
	$.post("/api/owned_books/add", 
		{ user_id: "user", book_id: bookid },
		function(data){
			if(data.status === 0){
				$("#ownedList").append('<li class="list-group-item" id="'+bookid+'"">'+bookid+'</li>')
			}
			else if(data.status === 1)
				console.log('db connection error')
			else if(data.status === 2)
				console.log('db query error')
			else if(data.status === 3){
				console.log('book already exists')
			}
		},
		"json" 
	)
})

$("body").on("click", ".list-group-item", function(){
	var element = this
	var bookid = this.id
	$.post("/api/owned_books/remove",
		{ user_id: "user", book_id: bookid },
		function(data){
			if(data.status === 0){
				element.remove()
			}
			else if(data.status === 1)
				console.log('db connection error')
			else if(data.status === 2)
				console.log('db query error')
			else if(data.status === 4){
				console.log('book does not exist')
			}
		},
		"json"
	)
})

// functions needed for searching for textbooks

// get input from search box as user types, character by character
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
						$("#ownedSearchResultsList").append('<li class="list-group-item">'+ searchResults[i]["book_name"] + ', ' + searchResults[i]["class_name"] +'</li>')
					}
				}
			}
			// error when querying
			else if (object.status === 2)
				console.log('db query error')
		});
	}
	else {
		// input too small to query so clear the search results list
		$("#ownedSearchResultsList").empty();
	}
})

// get input from search box as user types, character by character
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
						$("#wantedSearchResultsList").append('<li class="list-group-item">'+ searchResults[i]["book_name"] + ', ' + searchResults[i]["class_name"] +'</li>')
					}
				}
			}
			// error when querying
			else if (object.status === 2)
				console.log('db query error')
		});
	}
	else {
		// input too small to query so clear the search results list
		$("#wantedSearchResultsList").empty();
	}
})