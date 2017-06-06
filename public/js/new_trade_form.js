/*
 *  Helper functions
 */

$(document).ready(function(){
	/* Helper function to reset pop-up form input */
	var resetFormInput = function() {
		// clear input and search results for owned books (slide 1)
		document.getElementById("ownedInput").value = "";
		$("#ownedSearchResultsList").empty();
		// clear input and search results for owned books (slide 3)
		document.getElementById("wantedInput").value = "";
		$("#wantedSearchResultsList").empty();
		$(".wantedBooksList").empty();

		$('#wanted_list_next').prop('disabled', true);
	};

	/*
	 * Functions needed for pop-up form input
	 */

// open the popup
	$('.new-trade-card').on('click', function(e)  {
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
		console.log($(this).attr('class'));
		var targeted_popup_class = jQuery(this).attr('data-popup');
		$('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
	});

// do not close the pop-up if you are clicking inside of it
	$(".popup-inner").click(function(e){
		console.log($(this).attr('class'));
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
				// set of book id's for books that user owns
				var ownedBooksSet = new Set();

				// successful query
				if (object.status == 0) {
					// new search results found, so display them
					if (searchResults.length > 0) {
						$("#ownedSearchResultsList").empty();

						// don't display books inside user's owned books list
						$.get("/api/owned_books/get_owned_cards", { user_id: "user" }, function(userData) {
							var userBooksInfo = userData.data;
							for (var j = 0; j < userBooksInfo.length; j++) {
								ownedBooksSet.add(userBooksInfo[j]["book_id"]);

								console.log(userBooksInfo[j]["book_id"]);
							}

							// display all of the search results on the screen
							for (var i = 0; i < searchResults.length; i++) {
								// console.log(book_id);
								var book_id = searchResults[i]["book_id"];
								if (!ownedBooksSet.has(book_id)) {
									var title = searchResults[i]["title"];
									var author = searchResults[i]["author"];
									var isbn = searchResults[i]["isbn"];
									var img_url = searchResults[i]["img_url"];
									// display each line of the search result
									$("#ownedSearchResultsList").append('<li class="list-group-item" id="' + book_id + '" data-title="' + title + '" data-author="' + author + '" data-isbn="' + isbn + '" data-img_url="' + img_url +'">' + title + ', ' + author + '</li>');
								}
							}
						});
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

// after selecting item from the search results, keep it highlighted, move to next slide
	$("#ownedSearchResultsList").on("click", ".list-group-item", function(){
		// highlight the selected results list entry
		$('.highlight-owned').removeClass('highlight-owned');
		$(this).addClass('highlight-owned');
		$('.carousel').carousel('next');
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
				// get the title of the book (use as unique key)
				var selectedOwnedBook = $("li.highlight-owned.list-group-item");
				var owned_book_id = selectedOwnedBook.attr("id");

				// set of book id's for books that user owns
				var ownedBooksSet = new Set();

				// successful query
				if (object.status == 0) {
					// new search results found, so display them
					if (searchResults.length > 0) {
						$("#wantedSearchResultsList").empty();
						// display all of the search results on the screen

						// don't display books inside user's owned books list
						$.get("/api/owned_books/get_owned_cards", { user_id: "user" }, function(userData) {
							var userBooksInfo = userData.data;
							for (var j = 0; j < userBooksInfo.length; j++) {
								ownedBooksSet.add(userBooksInfo[j]["book_id"]);

								console.log(userBooksInfo[j]["book_id"]);
							}

							// display all of the search results on the screen
							for (var i = 0; i < searchResults.length; i++) {
								// console.log(book_id);
								var book_id = searchResults[i]["book_id"];
								if (!ownedBooksSet.has(book_id)) {
									// display each line of the search result
									if (owned_book_id != book_id) {
										// display each line of the search result
										var title = searchResults[i]["title"];
										var author = searchResults[i]["author"];
										var isbn = searchResults[i]["isbn"];
										var img_url = searchResults[i]["img_url"];
										$("#wantedSearchResultsList").append('<li class="list-group-item" id="' + book_id + '" data-title="' + title + '" data-author="' + author + '" data-isbn="' + isbn + '" data-img_url="' + img_url +'">' + title + ', ' + author + '</li>');
									}
								}
							}
						});

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
		var selector = "#item" + book_id
		var selectorID = "item" + book_id

		if($(".wantedBooksList").find(selector).length) {
			document.getElementById(selectorID).scrollIntoView({behavior: 'smooth'});
		} else {
			$(".wantedBooksList").prepend('<li class="list-group-item" id="item' + book_id + '" data-title="' + title + '" data-author="' + author + '" data-isbn="' + isbn + '" data-img_url="' + img_url + '">' + "<a class=\"closeButton\" href=\"#\">x</a>" + "<img src=" + img_url + "> " + '</li>');
			$('.wantedBooksList').animate({
				scrollTop: "0px"
			}, 350);
		}
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

	$("#confirmButton").click(function(){
		console.log("confirm button click");
		// add owned book
		var selectedOwnedBook = $("li.highlight-owned.list-group-item");
		var owned_book_id = selectedOwnedBook.attr("id");
		$.post("/api/owned_books/add", { user_id: "user", book_id: owned_book_id },
			function(data){
				if(data.status === 0){
					console.log('successfully added wanted book to owned_books');
				}
				else if(data.status === 1)
					console.log('db connection error for owned_books');
				else if(data.status === 2)
					console.log('db query error for owned_books');
				else if(data.status === 3){
					console.log('owned book already exists');
				}
			},
			"json"
		);

		// add confirmed wanted books
		$('.confirmBooksList li').each(function() {
			var confirmedBook = $(this);

			console.log(confirmedBook);

			var wanted_book_id = confirmedBook.attr("id");
			var relationStatus = 'V';  // V = verified

			// add wanted book to wish list
			$.post("/api/wish_list/add", { user_id: "user", book_id: wanted_book_id },
				function(data){
					if(data.status === 0){
						console.log('successfully added wanted book to wish_list');
					}
					else if(data.status === 1)
						console.log('db connection error for wish_list');
					else if(data.status === 2)
						console.log('db query error for wish_list');
					else if(data.status === 3){
						console.log('wanted book already exists');
					}
				},
				"json"
			);

			// add trade relation between owned book and wanted book
			$.post("/api/possible_trades/add", { user_id: "user", owned_book_id: owned_book_id, wanted_book_id: wanted_book_id, status: relationStatus },
				function(data){
					if(data.status === 0){
						console.log('successfully added trade relation to possible_trades');
					}
					else if(data.status === 1)
						console.log('db connection error for possible_trades');
					else if(data.status === 2)
						console.log('db query error for possible_trades');
					else if(data.status === 3){
						console.log('trade relation already exists');
					}
				},
				"json"
			);
		});

		// close the popup
		$('[data-popup="popup-1"]').fadeOut(350);

		// refresh the window (display newly added book trade)
		location.reload();
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
					// set of professors
					var profSet = new Set();
					// set of classes
					var classSet = new Set();
					// successful query
					if (object.status == 0) {
						// create strings of professors and classes
						for (var i = 0; i < profClassInfo.length; i++) {
							// professor name already seen
							if (!profSet.has(profClassInfo[i]["professor_name"])) {
								profs = profs + profClassInfo[i]["professor_name"] + ", ";;
								profSet.add(profClassInfo[i]["professor_name"]);
							}

							// professor name already seen
							if (!classSet.has(profClassInfo[i]["class_name"])) {
								classes = classes + profClassInfo[i]["class_name"] + ", ";;
								classSet.add(profClassInfo[i]["class_name"]);
							}
						}
						// get rid of extraneous ", " at the end
						profs = profs.substring(0, profs.length - 2);
						classes = classes.substring(0, classes.length - 2);

						// send profs and classes info to front-end
						document.getElementById("ownedBookClasses").innerHTML = "Class: " + "<span style='color: #3AC1D7'>" + classes + "</span>";
						document.getElementById("ownedBookProfs").innerHTML = "Professor: " + "<span style='color: #3AC1D7'>" + profs + "</span>";
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

					var book_id = wantedBook.attr("id").substr(4);
					var title = wantedBook.attr("data-title");
					var author = wantedBook.attr("data-author");
					var isbn = wantedBook.attr("data-isbn");
					var img_url = wantedBook.attr("data-img_url");

					// and the rest of your code
					$(".confirmBooksList").append('<li class="list-group-item" id="' + book_id + '" data-title="' + title + '" data-author="' + author + '" data-isbn="' + isbn + '" data-img_url="' + img_url + '">' + '<div class="row"> <div class="col-md-3">' + '<img src="' + img_url + '"> ' + '</div>' + '<div class="col-md-9">' + '<p>' + title + '</p> <p>' + author + '</p>' + '</div> </div>' + '</li>');
				});
			}

		}

	});
});

