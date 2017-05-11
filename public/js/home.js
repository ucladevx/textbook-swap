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

    var imgPreloader = $("<div>").appendTo(".about_graphic");
    for(var i = 1; i <= 143; i+=1){
        var string = "/images/loops_animation/loopgraphic_00" + ("000"+i).slice(-3) + ".png";
        $("<img>").attr({"src": string, "id": "image" + i, "display": "none"}).appendTo(imgPreloader);
        var target = "#image" + i;
        $(target).css({"z-index": i, "position":"absolute", "top":"50px", "left":"50px"});
    }

    function loop_animate(){
        var targetindex = index%143 + 1;

        var target = "#image" + targetindex;
        $(target).css("opacity", 1.0);
        $(target).attr("display", "block");

        for(var i = 1; i <= 143; i+=1){
            if(i != targetindex) {
                var remaining = "#image" + i;
                $(remaining).css("opacity", 0.0);
                $(remaining).attr("display", "none");
            }
        }

        index+=1;
    }

    loop_animate();

    window.setInterval(loop_animate, 20);


});