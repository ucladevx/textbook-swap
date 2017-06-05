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

		//first-page
		var popup_inner = "<a class=\"popup-close\" data-popup-close=\"" + "popup-matched-trade"
			+ "\" href=\"\">x</a>" 
			
			+ "<div class=\"row text-center\"><h4>Matched Trade</h4></div>"

			+ "<div class=\"row\">"
			+ "<div class=\"col-xs-6 text-center\">"
			+ "<p>"
			+ "Title: " + ownedCard[1].nodeValue + "<br>"
			+ "Author: " + ownedCard[2].nodeValue + "<br>"
			+ "ISBN: " + ownedCard[4].nodeValue + "<br>"
			+ "<img src=\"" + ownedCard[5].nodeValue + "\"> <br>" 
			+ "</p>"
			+ "</div>" //close col

			+ "<div class=\"col-xs-6 text-center\">"
			+ "<p>"
			+ "Title: " + wantedCard[1].nodeValue + "<br>"
			+ "Author: " + wantedCard[2].nodeValue + "<br>"
			+ "ISBN: " + wantedCard[4].nodeValue + "<br>"
			+ "<img src=\"" + wantedCard[5].nodeValue + "\"> <br>"
			+ "</p>"
			+ "</div>" //close col
			+ "</div>" //close row

			+ "<div class=\"row\">"
			+ "<div class=\"col-xs-4\"></div>"
			+ "<div class=\"col-xs-2 text-center\">"
			+ "<a class=\"btn accept-trade\">Accept</a>"
			+ "</div>" //close col
			+ "<div class=\"col-xs-2 text-center\">"
			+ "<a class=\"btn reject-trade\">Reject</a>"
			+ "</div>" //close col
			+ "<div class=\"col-xs-4\"></div>"
			+ "</div>" //close row

		$("body").append("<div class=\"popup\" data-popup=\"" 
			+ "popup-matched-trade"
			+ "\"><div class=\"popup-inner\">"
			+ "<div class=\"first-page\">"
			+ popup_inner
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
			+ "<a class=\"btn close\">Close</a>"
			+ "</div>"
		);

		//reject confirmation page
		$(".popup-inner").append(
			"<div class=\"reject-page\"  style=\"display:none\">"
			+ "<h3>Are you sure you want to reject the trade?</h3>"
			+ "<a class=\"popup-close\" data-popup-close=\"" + "popup-matched-trade"
			+ "\" href=\"\">x</a>" 

			+ "<a class=\"btn confirm\">Yes</a>"
			+ "<a class=\"btn back\">No, take me back!</a>"
			+ "</div>"
		);

		//rejected page
		$(".popup-inner").append(
			"<div class=\"rejected-page\"  style=\"display:none\">"
			+ "<h3>You've rejected the trade.</h3>"
			+ "<a class=\"popup-close\" data-popup-close=\"" + "popup-matched-trade"
			+ "\" href=\"\">x</a>" 

			+ "<a class=\"btn close\">Close</a>"
			+ "</div>"
		);

		//close button on accept confirmation page
		$(".close").click(function(e){
			var targeted_popup_class = "popup-matched-trade";
			$('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
			$('[data-popup="' + targeted_popup_class + '"]').remove();
		});

		//go back button on reject page
		$(".back").click(function(e){
			$(".reject-page").hide();
			$(".first-page").show();
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
					});

					//accept button
					$(".accept-trade").click(function(e){
						$.post("/api/found_trades/update_status_accepted",
							{ trade_id: trade.trade_id, owned_book: trade.book_have, target_user: trade.target_id, wanted_book: trade.book_want }
						);

						$(".first-page").hide();
						$(".accept-page").show();

					});

					//reject button
					$(".reject-trade").click(function(e){
						$(".first-page").hide();
						$(".reject-page").show();
					});
				}
			}
		});

		e.preventDefault();
	});
});