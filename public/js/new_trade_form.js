/*
 *  Helper functions
 */

/* Helper function to reset pop-up form input */
var resetFormInput = function() {
	document.getElementById("ownedInput").value = "";
	$("#ownedSearchResultsList").empty();
}

/*
 * Functions needed for pop-up form input
 */

// open the popup 
$('[data-popup-open]').on('click', function(e)  {
	// new pop-up, so reset form input from previous instance of the pop-up
	resetFormInput();

    var targeted_popup_class = jQuery(this).attr('data-popup-open');
    $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);

    e.preventDefault();

    // center the popup
    var w = $(window).width();
	var h = $(window).height();
	var d = $('.popup-inner');
	var divW = $(d).width();
	var divH = $(d).height();

	d.css({ 'position': "absolute",
		'top': (h/2)-(divH/2)+"px",
		'left': (w/2)-(divW/2)+"px"
	});

    // start carousel
    $('.carousel').carousel({
    	pause: true,
    	interval: false
	});

});

// close the pop-up using the button on the top right corner
$('[data-popup-close]').on('click', function(e)  {
    var targeted_popup_class = jQuery(this).attr('data-popup-close');
    $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);

    e.preventDefault();
});

// close the popup if you are clicking outside of it
$(".popup").click(function(e){
    console.log($(this).attr('class'))
	var targeted_popup_class = jQuery(this).attr('data-popup');
	$('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
});

// do not close the pop-up if you are clicking inside of it
$(".popup-inner").click(function(e){
    console.log($(this).attr('class'))
	e.stopPropagation();
});

// move the popup to the middle when resizing
$(window).bind('resize', function() {
	// center the popup
    var w = $(window).width();
	var h = $(window).height();
	var d = $('.popup-inner');
	var divW = $(d).width();
	var divH = $(d).height();

	d.css({ 'position': "absolute",
		'top': (h/2)-(divH/2)+"px",
		'left': (w/2)-(divW/2)+"px"
	});
});

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

// after selecting item from the search results, keep it highlighted
$("#ownedSearchResultsList").on("click", ".list-group-item", function(){
        // highlight the selected results list entry
        $('.highlight').removeClass('highlight');
        $(this).addClass('highlight');
        console.log("selected element");

        // get the book_id from tags and corresponding info on the book

});

/*
 * Multistep form with progress bar
 */

$(".nextButton").click(function(){
	$('.carousel').carousel('next');
});

$(".prevButton").click(function(){
	$('.carousel').carousel('prev');
});

$('.carousel-indicators li').click(function(){
    var number = Number($(this).attr('data-slide-to'));
    console.log(number);
    $('.carousel').carousel(number);
});