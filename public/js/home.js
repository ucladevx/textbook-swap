$("#about").click(function(){
	$('html, body').animate({
		scrollTop: $("#second").offset().top
	}, 500);
});

$("#nav_about").click(function(){
    $('html, body').animate({
        scrollTop: $("#second").offset().top
    }, 500);
});

$("#backtotop").click(function(){
	$('html, body').animate({
		scrollTop: "0px"
	}, 500);
});

$("#navbar_logo").click(function(){
    $('html, body').animate({
        scrollTop: "0px"
    }, 500);
});
