/*
 * Front-end code to implement text search for the textbooks
 */

// DOESN'T WORK RIGHT NOW

$("#textbookSearchInput").keyup(function() {
	var textbookSearchInput = $("#textbookSearchInput").val();
	$.ajax({url: "/api/textbook_search/get_search_input", data: { search_input: textbookSearchInput }});
})

//  $('#textbookSearchInput').on('input', function() {
// 	var textbookSearchInput = $(this).val();
// 	if (textbookSearchInput.length() >= 3) {
//  		$.post("/api/textbook_search/get_search_input", { search_input: textbookSearchInput });
//  	}
//  //...
// });

//  $("#searchTextbook").click(function() {
// 	var textbookSearchInput = $("#textbookSearchInput").val();
// 	$.post("/api/textbook_search/get_search_input", { search_input: textbookSearchInput });
// })