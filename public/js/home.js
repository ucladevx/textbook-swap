$("#about").click(function(){
	$('html, body').animate({
		scrollTop: $("#second").offset().top
	}, 500);
});

$("#backtotop").click(function(){
	$('html, body').animate({
		scrollTop: "0px"
	}, 500);
});