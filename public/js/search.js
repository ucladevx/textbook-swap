/*
 * Front-end code to implement text search for the textbooks
 */

// get input from search box as user types, character by character
$("#textbookSearchInput").keyup(function() {
	var textbookSearchInput = $("#textbookSearchInput").val();
	// only query for results if the input is at least three characters long
	if (textbookSearchInput.length >= 3) {
		$.get("/api/search/search_textbooks", { search_input: textbookSearchInput }, function(object) {
			// get the search results
			var searchResults = object.data;

			// successful query
			if (object.status == 0) {
				// new search results found, so display them
				if (searchResults.length > 0) {
					$("#searchResultsList").empty();
					// display all of the search results on the screen
					for (var i = 0; i < searchResults.length; i++) {
						$("#searchResultsList").append('<li class="list-group-item">'+ searchResults[i]["book_name"] + ', ' + searchResults[i]["class_name"] +'</li>')
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
		$("#searchResultsList").empty();
	}
})