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
				+ "\"><div class=\"popup-inner\">"
				+ "<a class=\"popup-close\" data-popup-close=\"" + "popup-matched-trade"
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

				+ "</div></div>"); //close popup-inner and popup
			    
			    $('[data-popup="' + "popup-matched-trade" + '"]').fadeIn(350);

			    // close the popup if you are clicking outside of it
			    $(".popup").click(function(e){
					var targeted_popup_class = jQuery(this).attr('data-popup');
					$('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
				});

				// do not close the pop-up if you are clicking inside of it
				$(".popup-inner").click(function(e){
					e.stopPropagation();
				});

				$.ajax({url: "/api/found_trades/get_trade_by_wanted_book",
					data: { wanted_book: wantedCard[3].nodeValue },
					success: function(response){
						if(response.status === 0){
							var trade = response.data[0];
							$(".accept-trade").click(function(e){
								$.post("/api/found_trades/update_status_accepted",
									{ trade_id: trade.trade_id, owned_book: trade.book_have, target_user: trade.target_id, wanted_book: trade.book_want },
									function(data){
										console.log(data);
									},
									"json"
								)
							});

							$(".reject-trade").click(function(e){
								$.post("/api/found_trades/update_status_rejected",
									{ trade_id: trade.trade_id, owned_book: trade.book_have, target_user: trade.target_id, wanted_book: trade.book_want },
									function(data){
										console.log(data);
									},
									"json"
								)
							});
						}
					}
				});
		e.preventDefault();
	});

});