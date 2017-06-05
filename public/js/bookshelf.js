$(document).ready(function(){
	var $grid = $('.grid').isotope({
   itemSelector: '.grid-item',
	});

	// filter items on button click
	$('.filter-button-group').on( 'click', 'button', function() {
	  var filterValue = $(this).attr('data-filter');
	  $grid.isotope({ filter: filterValue });
	});

	$(".Matched").on('click', function(e){
		var ownedCard = $(this).find(".owned")[0].attributes;
		var wantedCard = $(this).find(".wanted")[0].attributes;

		$("body").append("<div class=\"popup\" data-popup=\"" 
			+ "popup-matched-trade"
			+ "\"><div class=\"popup-inner\" id=\"matched\">"
			+ "<div class=\"first-page\">"

			+ "<a class=\"popup-close\" data-popup-close=\"" + "popup-matched-trade"
			+ "\" href=\"\">x</a>" 
			
			+ "<div class=\"row\">"
			+ "<div class=\"col-2\"></div>"
			+ "<div class=\"col-8 text-center\">"
			+ "<h4>Matched Trade</h4>"
			+ "</div>"
			+ "</div>"

			+ "<div class=\"row\" id=\"book-info\">"
			+ "<div class=\"col-6 text-center\">"
			+ "<p>"
			+ "Title: " + ownedCard[1].nodeValue + "<br>"
			+ "Author: " + ownedCard[2].nodeValue + "<br>"
			+ "ISBN: " + ownedCard[4].nodeValue + "<br>"
			+ "<img src=\"" + ownedCard[5].nodeValue + "\"> <br>" 
			+ "</p>"
			+ "</div>" //close col

			+ "<div class=\"col-6 text-center\">"
			+ "<p>"
			+ "Title: " + wantedCard[1].nodeValue + "<br>"
			+ "Author: " + wantedCard[2].nodeValue + "<br>"
			+ "ISBN: " + wantedCard[4].nodeValue + "<br>"
			+ "<img src=\"" + wantedCard[5].nodeValue + "\"> <br>"
			+ "</p>"
			+ "</div>" //close col
			+ "</div>" //close row

			+ "<div class=\"row\">"
			+ "<div class=\"col-4\"></div>"
			+ "<div class=\"col-2 text-center\">"
			+ "<a class=\"btn btn-primary accept-trade\" role=\"button\" href=\"#\">Accept</a>"
			+ "</div>" //close col
			+ "<div class=\"col-2 text-center\">"
			+ "<a class=\"btn btn-danger reject-trade\" role=\"button\" href=\"#\">Reject</a>"
			+ "</div>" //close col
			+ "<div class=\"col-4\"></div>"
			+ "</div>" //close row

			+ "</div>" //close first-page
			+ "</div></div>" //close popup-inner and popup
		);
		
		$('[data-popup="' + "popup-matched-trade" + '"]').fadeIn(350);

		// close the popup if you are clicking outside of it
		$(".popup").click(function(e){
			var targeted_popup_class = "popup-matched-trade";
			$('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
			$('[data-popup="' + targeted_popup_class + '"]').remove();
		});

		// do not close the pop-up if you are clicking inside of it
		$(".popup-inner").click(function(e){
			e.stopPropagation();
		});

		//accept confirmation page
		$(".popup-inner").append(
			"<div class=\"accept-page\" style=\"display:none\">"
			+ "<h3>Congratulations! You've accepted the trade.</h3>"
			+ "<a class=\"popup-close\" data-popup-close=\"" + "popup-matched-trade"
			+ "\" href=\"\">x</a>" 
			+ "<a class=\"btn btn-warning closebtn\" role=\"button\" href=\"\">Close</a>"
			+ "</div>"
		);

		//reject confirmation page
		$(".popup-inner").append(
			"<div class=\"reject-page\"  style=\"display:none\">"
			+ "<h3>Are you sure you want to reject the trade?</h3>"
			+ "<a class=\"popup-close\" data-popup-close=\"" + "popup-matched-trade"
			+ "\" href=\"\">x</a>" 

			+ "<a class=\"btn btn-warning back\" role=\"button\" href=\"#\">No, take me back!</a>"
			+ "<a class=\"btn btn-danger confirm\" role=\"button\" href=\"\">Yes</a>"
			+ "</div>"
		);

		//rejected page
		$(".popup-inner").append(
			"<div class=\"rejected-page\"  style=\"display:none\">"
			+ "<h3>You've rejected the trade.</h3>"
			+ "<a class=\"popup-close\" data-popup-close=\"" + "popup-matched-trade"
			+ "\" href=\"\">x</a>" 

			+ "<a class=\"btn btn-warning closebtn\" role=\"button\" href=\"\">Close</a>"
			+ "</div>"
		);

		//close button on accept confirmation page
		$(".closebtn").click(function(e){
			var targeted_popup_class = "popup-matched-trade";
			$('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
			$('[data-popup="' + targeted_popup_class + '"]').remove();
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
							{ trade_id: trade.trade_id, owned_book: trade.book_have, target_user: trade.target_id, wanted_book: trade.book_want }
						);
						$(".reject-page").hide();
						$(".rejected-page").show();
						e.preventDefault();
					});

					//accept button
					$(".accept-trade").click(function(e){
						$.post("/api/found_trades/update_status_accepted",
							{ trade_id: trade.trade_id, owned_book: trade.book_have, target_user: trade.target_id, wanted_book: trade.book_want }
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
});