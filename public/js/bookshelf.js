$(document).ready(function(){
	var $grid = $('.grid').isotope({
        itemSelector: '.grid-item',
	});

	// filter items on button click
	$('.filter-button-group').on( 'click', 'button', function() {
	    var filterValue = $(this).attr('data-filter');
	    $grid.isotope({ filter: filterValue });
	    $('.active').removeClass('active');
        $(this).addClass('active');
        $(".carousel-inner #first-popup").addClass('active');
	});

	$(".Matched:not(.Requested)").on('click', function(e){
		var ownedCard = $(this).find(".owned")[0].attributes;
		var wantedCard = $(this).find(".wanted")[0].attributes;
		var header = "<div class=\"row\" id=\"top-row\">"
			+ "<div class=\"col-xs-3 text-left\">"
			+ "<a class=\"matched-popup-close\" data-matched-popup-close=\"" + "matched-popup-matched-trade"
			+ "\" href=\"\">x</a>" 
			+ "</div>"
			+ "<div class=\"col-xs-6 text-center\">"
			+ "<h4>MATCHED TRADE</h4>"
            + "</div>"
            + "<div class=\"col-xs-3\">"
            + "<img src=\"./images/book4.svg\" id=\"book-corner\">"
			+ "</div>"
			+ "</div>"

		$("body").append("<div class=\"matched-popup\" data-matched-popup=\"" 
			+ "matched-popup-matched-trade"
			+ "\"><div class=\"matched-popup-inner\" id=\"matched\">"
			+ "<div class=\"first-page\">"
			
			+ header

			+ "<div class=\"row matched-inner\">"
			+ "<div class=\"col-xs-5 text-center\">"
			+ "<p>"
			+ "Title: " + ownedCard[1].nodeValue.toUpperCase() + "<br>"
			+ "Author: " + ownedCard[2].nodeValue.toUpperCase() + "<br>"
			+ "ISBN: " + ownedCard[4].nodeValue.toUpperCase() + "<br>"
			+ "<img class=\"matchbook\"src=\"" + ownedCard[5].nodeValue + "\"> <br>" 
			+ "</p>"
			+ "</div>" //close col

			+ "<div class=\"col-xs-2 text-center\" id=\"matched-divider\">↔</div>"

			+ "<div class=\"col-xs-5 text-center\">"
			+ "<p>"
			+ "Title: " + wantedCard[1].nodeValue.toUpperCase() + "<br>"
			+ "Author: " + wantedCard[2].nodeValue.toUpperCase() + "<br>"
			+ "ISBN: " + wantedCard[4].nodeValue.toUpperCase() + "<br>"
			+ "<img class=\"matchbook\" src=\"" + wantedCard[5].nodeValue + "\"> <br>"
			+ "</p>"
			+ "</div>" //close col
			+ "</div>" //close row

			+ "<div class=\"row\">"
			+ "<div class=\"col-xs-4\"></div>"
			+ "<div class=\"col-xs-2 text-center\">"
			+ "<a class=\"btn btn-warning accept-trade\" role=\"button\" href=\"#\">ACCEPT</a>"
			+ "</div>" //close col
			+ "<div class=\"col-xs-2 text-center\">"
			+ "<a class=\"btn btn-danger reject-trade\" role=\"button\" href=\"#\">REJECT</a>"
			+ "</div>" //close col
			+ "<div class=\"col-xs-4\"></div>"
			+ "</div>" //close row

			+ "</div>" //close first-page
			+ "</div></div>" //close matched-popup-inner and matched-popup
		);
		
		$('[data-matched-popup="' + "matched-popup-matched-trade" + '"]').fadeIn(350);

		// close the matched-popup if you are clicking outside of it
		$(".matched-popup").click(function(e){
			var targeted_matched_popup_class = "matched-popup-matched-trade";
			$('[data-matched-popup="' + targeted_matched_popup_class + '"]').fadeOut(350);
			$('[data-matched-popup="' + targeted_matched_popup_class + '"]').remove();
		});

		// do not close the pop-up if you are clicking inside of it
		$(".matched-popup-inner").click(function(e){
			e.stopPropagation();
		});

		//accept confirmation page
		$(".matched-popup-inner").append(
			"<div class=\"accept-page\" style=\"display:none\">"
			+ header
			+ "<div class=\"row text-center matched-inner\">"
			+ "<h4>Congratulations! You've accepted the trade.</h4>"
			+ "</div>"

			+ "<div class=\"row text-center\">"
			+ "<a class=\"btn btn-warning closebtn\" role=\"button\" href=\"\">Close</a>"
			+ "</div></div>"
		);

		//reject confirmation page
		$(".matched-popup-inner").append(
			"<div class=\"reject-page\"  style=\"display:none\">"
			+ header
			+ "<div class=\"row text-center matched-inner\">"
			+ "<h4>Are you sure you want to reject the trade?</h4>"
			+ "</div>"

			+ "<div class=\"row\">"
			+ "<div class=\"col-xs-4\"></div>"
			+ "<div class=\"col-xs-2 text-center\">"
			+ "<a class=\"btn btn-danger back\" role=\"button\" href=\"#\">NO, take me back!</a>"
			+ "</div>" //close col
			+ "<div class=\"col-xs-2 text-center\">"
			+ "<a class=\"btn btn-warning confirm\" role=\"button\" href=\"\">YES</a>"
			+ "</div>" //close col
			+ "<div class=\"col-xs-4\"></div>"
			+ "</div>" //close row
			+ "</div>"
		);

		//rejected page
		$(".matched-popup-inner").append(
			"<div class=\"rejected-page\"  style=\"display:none\">"
			+ header
			+ "<div class=\"row text-center matched-inner\">"
			+ "<h4>You've rejected the trade.</h4>"
			+ "</div>"

			+ "<div class=\"row text-center\">"
			+ "<a class=\"btn btn-warning closebtn\" role=\"button\" href=\"\">Close</a>"
			+ "</div></div>"
		);

		//close button on accept confirmation page
		$(".closebtn, .matched-popup-close").click(function(e){
			var targeted_matched_popup_class = "matched-popup-matched-trade";
			$('[data-matched-popup="' + targeted_matched_popup_class + '"]').fadeOut(350);
			$('[data-matched-popup="' + targeted_matched_popup_class + '"]').remove();
			e.preventDefault();
		});

		//go back button on reject page
		$(".back").click(function(e){
			$(".reject-page").hide();
			$(".first-page").show();
			e.preventDefault();
		});

		//get trade for reject/accept buttons
		$.ajax({url: "/api/found_trades/get_trade_by_wanted_book",
			data: { wanted_book: wantedCard[3].nodeValue },
			success: function(response){
				if(response.status === 0){
					var trade = response.data[0];

					//confirm reject trade button
					$(".confirm").click(function(e){
						$.post("/api/found_trades/update_status_rejected",
							{ trade_id: trade.trade_id, owned_book: trade.book_have, target_user: trade.target_id, wanted_book: trade.book_want },
							function(response){

							}
						);
						$(".reject-page").hide();
						$(".rejected-page").show();
						e.preventDefault();
					});

					//accept button
					$(".accept-trade").click(function(e){
						$.post("/api/found_trades/update_status_accepted",
							{ trade_id: trade.trade_id, owned_book: trade.book_have, target_user: trade.target_id, wanted_book: trade.book_want },
							function(response){

							}
						);

						$(".first-page").hide();
						$(".accept-page").show();
						e.preventDefault();

					});

					//reject button
					$(".reject-trade").click(function(e){
						$(".first-page").hide();
						$(".reject-page").show();
						e.preventDefault();
					});
				}
			}
		});

		e.preventDefault();
	});

	$(".Requested:not(.Matched)").on('click', function(e){
		console.log("requested book");

		// var header = "<div class=\"row\" id=\"top-row\">"
		// 	+ "<div class=\"col-xs-3 text-left\">"
		// 	+ "<a class=\"requested-popup-close\" data-requested-popup-close=\"" + "requested-popup-requested-trade"
		// 	+ "\" href=\"\">x</a>" 
		// 	+ "</div>"
		// 	+ "<div class=\"col-xs-6 text-center\">"
		// 	+ "<h4>EDIT TRADE</h4>"
  //           + "</div>"
  //           + "<div class=\"col-xs-3\">"
  //           + "<img src=\"./images/book4.svg\" id=\"book-corner\">"
		// 	+ "</div>"
		// 	+ "</div>"

		// $("body").append("<div class=\"requested-popup\" data-requested-popup=\"" 
		// 	+ "requested-popup-requested-trade"
		// 	+ "\"><div class=\"requested-popup-inner\" id=\"requested\">"
		// 	+ "<div class=\"first-page\">"
		// 	+ header
		// 	+ "</div>"
		// 	+ "</div>"
		// 	+ "</div>"
		// );

		// $('[data-requested-popup="' + "requested-popup" + '"]').fadeIn(350);
		
		// start at the first popup screen
		$('.carousel').carousel(0);

		$('[data-popup="' + "modify-trade" + '"]').fadeIn(350);
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

		// TODO: how to get book info? for the currently selected book
		var img_url = "";
		var title = "";
		var author = "";
		var isbn = "";

		// send owned book info values to the front-end (html)
		document.getElementById("confirmTradeOwnedBookImg").src = img_url;

		document.getElementById("confirmTradeOwnedBookTitle").innerHTML = "Title: " + title;

		document.getElementById("confirmTradeOwnedBookAuthor").innerHTML = "Author: " + author;

		document.getElementById("confirmTradeOwnedBookIsbn").innerHTML = "ISBN: " + isbn;
	});
});