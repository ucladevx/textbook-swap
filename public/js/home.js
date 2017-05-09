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



$(document).ready(function(){

    var index = 0;
    var images=[];

    for(var i = 1; i <= 143; i+=1){
        var string = "/images/loop_animation/loopgraphic_00" + ("000"+i).slice(-3) + ".png";
        images[i-1] = new Image();
        images[i-1].src = string;
    }

    function loop_animate(){
        $("#second").css('background-image', images[index]);
        index += 1;
    }

    loop_animate();

    window.setInterval(loop_animate, 100);


});