/*
 * Front-end code to implement text search for the textbooks
 */

// get input from search box as user types, character by character
// TODO: fix bug where AJAX request only sends first 6 results to backend
$("#textbookSearchInput").keyup(function() {
	var textbookSearchInput = $("#textbookSearchInput").val();
	// only query for results if the input is at least three characters long
	if (textbookSearchInput.length >= 3) {
		$.ajax({url: "/api/search/search_textbooks", data: { search_input: textbookSearchInput }});
	}
})