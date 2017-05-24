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

    // start carousel
    $('.carousel').carousel()

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

//jQuery time
var current_fs, next_fs, previous_fs; // fieldsets (.page in our newtradeform.pug)
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$(".nextButton").click(function(){

	console.log("click next");

	if(animating) {
		console.log("return from click next");
		return false;
	}
	animating = true;
	
	current_fs = $(this).parent().parent().parent();
	next_fs = current_fs.next();
	
	// //activate next step on progressbar using the index of next_fs
	// $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({
        'transform': 'scale('+scale+')',
        'position': 'absolute'
      });
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

$(".prevButton").click(function(){

	console.log("click previous");

	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent().parent().parent();
	previous_fs = current_fs.prev();

	// //de-activate current step on progressbar
	// $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	
	//show the previous fieldset
	previous_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

$('.right').click(function(){
	$('.carousel').carousel('next');
});