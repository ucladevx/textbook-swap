$(document).ready(function(){
    $(window).scroll(function() { // check if scroll event happened
        var s = $(window).scrollTop(),
            d = $(document).height(),
            c = $(window).height();

        var scrollPercent = (s / (d-c)) * 100;
        if (scrollPercent > 95) { // check if user scrolled more than 50 from top of the browser window
            $(".navbar-fixed-top").css("opacity","0.45");
            $("nav").css('box-shadow', '0px 1px 8px #555');
        } else {
            $(".navbar-fixed-top").css("opacity", "1.0");
            $("nav").css('box-shadow', '0px 1px 8px #AAA');
        }
    });
});
