/*
 *  Helper functions
 */

/* Helper function to reset pop-up form input */
var resetFormInput = function() {
	// clear input and search results for owned books (slide 1)
	document.getElementById("ownedInput").value = "";
	$("#ownedSearchResultsList").empty();
	// clear input and search results for owned books (slide 3)
	document.getElementById("wantedInput").value = "";
	$("#wantedSearchResultsList").empty();
	$(".wantedBooksList").empty();

    $('#pick_book_next').prop('disabled', true);
    $('#wanted_list_next').prop('disabled', true);
}

/*
 * Functions needed for pop-up form input
 */

// open the popup 
$('[data-popup-open]').on('click', function(e)  {
	// new pop-up, so reset form input from previous instance of the pop-up
	resetFormInput();

	// start at the first popup screen
	$('.carousel').carousel(0);

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
						var img_url = searchResults[i]["img_url"];

						// display each line of the search result
						$("#ownedSearchResultsList").append('<li class="list-group-item" id="' + book_id + '" data-title="' + title + '" data-author="' + author + '" data-isbn="' + isbn + '" data-img_url="' + img_url +'">' + title + ', ' + author + '</li>');
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
});

// after selecting item from the search results, keep it highlighted
$("#ownedSearchResultsList").on("click", ".list-group-item", function(){
        // highlight the selected results list entry
        $('.highlight-owned').removeClass('highlight-owned');
        $(this).addClass('highlight-owned');

    	$('#pick_book_next').prop('disabled', false);
});

$("#wantedSearchResultsList").on("click", ".list-group-item", function(){
    // highlight the selected results list entry
    $('.highlight-wanted').removeClass('highlight-wanted');
    $(this).addClass('highlight-wanted');

    $('#wanted_list_next').prop('disabled', false);
});

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
						var img_url = searchResults[i]["img_url"];

						// display each line of the search result
						$("#wantedSearchResultsList").append('<li class="list-group-item" id="' + book_id + '" data-title="' + title + '" data-author="' + author + '" data-isbn="' + isbn + '" data-img_url="' + img_url +'">' + title + ', ' + author + '</li>');
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
});

// add search result to wanted books list that use has selected
$("#wantedSearchResultsList").on("click", ".list-group-item", function(){
	// get data from list element tags
	var searchResult = this;
	var book_id = searchResult.id;
	var title = searchResult.dataset.title;  
	var author = searchResult.dataset.author;
	var isbn = searchResult.dataset.isbn;
	var img_url = searchResult.dataset.img_url;

	// add new selected item to wanted list
	$(".wantedBooksList").prepend('<li class="list-group-item" id="' + book_id + '" data-title="' + title + '" data-author="' + author + '" data-isbn="' + isbn + '" data-img_url="' + img_url + '">' + "<a class=\"closeButton\" href=\"#\">x</a>" + "<img src=" + img_url + "> " + '</li>');
    $('.wantedBooksList').animate({
        scrollTop: "0px"
    }, 200);
});

// remove the book from the wanted list
$(".wantedBooksList").on("click", ".closeButton", function(){
	var wantedBook = $(this).parent();
	wantedBook.remove();
    if ($('.wantedBooksList li').length == 0)
        $('#wanted_list_next').prop('disabled', true);
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


/*
 * Code needed for carousel transitions
 */

 $("#myCarousel").on('slide.bs.carousel',function(e){
 	// figure out when slides we are transitioning between
    var slideFrom = $(this).find('.active').index();
    var slideTo = $(e.relatedTarget).index();
    console.log(slideFrom+' => '+slideTo);

    // distinguish what to do in each case
    // user selected which book they want to offer
    if ((slideFrom == 0 && slideTo == 1) || (slideFrom == 2 && slideTo == 3)) {
    	// get the book that the user previously selected
    	var selectedOwnedBook = $("li.highlight-owned.list-group-item");
    	// get all info needed for the book
    	if (selectedOwnedBook.length) {
    		// info from the tags
    		var book_id = selectedOwnedBook.attr("id");
			var title = selectedOwnedBook.attr("data-title");  
			var author = selectedOwnedBook.attr("data-author");
			var isbn = selectedOwnedBook.attr("data-isbn");
			var img_url = selectedOwnedBook.attr("data-img_url");
			// get these values by querying database
			var profs = "";
			var classes = "";

			// get the classes and professors associated with the book
			$.get("/api/book_to_class/get_prof_class_info", { book_id: book_id }, function(object) {
				// get professor and class info for the owned book
				var profClassInfo = object.data;
				// successful query
				if (object.status == 0) {
					// create strings of professors and classes 
					for (var i = 0; i < profClassInfo.length; i++) {
						profs = profs + profClassInfo[i]["professor_name"] + ", ";
						classes = classes + profClassInfo[i]["class_name"] + ", ";
					}
					// get rid of extraneous ", " at the end
					profs = profs.substring(0, profs.length - 2);
					classes = classes.substring(0, classes.length - 2);

					// send profs and classes info to front-end
					document.getElementById("ownedBookClasses").innerHTML = "Class: " + classes;
					document.getElementById("ownedBookProfs").innerHTML = "Professor: " + profs;
				}
				// error when querying
				else if (object.status === 2)
					console.log('db query error');
			});
			// send the book info values to the front-end (html)
			document.getElementById("ownedBookImg").src = img_url;
			document.getElementById("confirmOwnedBookImg").src = img_url;

			document.getElementById("ownedBookTitle").innerHTML = "Title: " + title;
			document.getElementById("confirmOwnedBookTitle").innerHTML = "Title: " + title;

			document.getElementById("ownedBookAuthor").innerHTML = "Author: " + author;
			document.getElementById("confirmOwnedBookAuthor").innerHTML = "Author: " + author;

			document.getElementById("ownedBookIsbn").innerHTML = "ISBN: " + isbn;
			document.getElementById("confirmOwnedBookIsbn").innerHTML = "ISBN: " + isbn;
    	}

    	// confirm the trade
   		if (slideFrom == 2 && slideTo == 3) {
   			// display the wanted books list
   			// clear the list before adding entries (in case user modifies then comes back, don't want duplicates)
			$(".confirmBooksList").empty();
			$('.wantedBooksList li').each(function() {
			    // var wantedBook = $(li);
			    var wantedBook = $(this);

			    console.log(wantedBook);

			    var book_id = wantedBook.attr("id");
				var title = wantedBook.attr("data-title");  
				var author = wantedBook.attr("data-author");
				var isbn = wantedBook.attr("data-isbn");
				var img_url = wantedBook.attr("data-img_url");

			    // and the rest of your code
			    $(".confirmBooksList").append('<li class="list-group-item" id="' + book_id + '" data-title="' + title + '" data-author="' + author + '" data-isbn="' + isbn + '" data-img_url="' + img_url + '">' + "<img src=" + img_url + "> " + '<p>' + title + '<br>' + author + '</p>' + '</li>');
			});
   		}

    }

});
