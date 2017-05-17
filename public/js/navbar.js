$(document).ready(function(){
    var s = $(window).scrollTop(),
        d = $(document).height(),
        c = $(window).height();

    var scrollPercent = (s / (d-c)) * 100;
    if (scrollPercent > 97) { // check if user scrolled more than 50 from top of the browser window
        $(".navbar-fixed-top").css("opacity","0.6");
        $("nav").css('box-shadow', '0px 1px 8px #555');
        $("nav").hover(function(){
            $(".navbar-fixed-top").css("opacity", "1.0");
        },function(){
            $(".navbar-fixed-top").css("opacity","0.6");
        });
    } else {
        $(".navbar-fixed-top").css("opacity", "1.0");
        $("nav").hover(function(){
            $(".navbar-fixed-top").css("opacity", "1.0");
        },function(){
            $(".navbar-fixed-top").css("opacity", "1.0");
        });
    }
    $(window).scroll(function() { // check if scroll event happened
        var s = $(window).scrollTop(),
            d = $(document).height(),
            c = $(window).height();

        var scrollPercent = (s / (d-c)) * 100;
        if (scrollPercent > 97) {
            $(".navbar-fixed-top").css("opacity","0.6");
            $("nav").hover(function(){
                $(".navbar-fixed-top").css("opacity", "1.0");
            },function(){
                $(".navbar-fixed-top").css("opacity","0.6");
            });
        } else {
            $(".navbar-fixed-top").css("opacity", "1.0");
            $("nav").hover(function(){
                $(".navbar-fixed-top").css("opacity", "1.0");
            },function(){
                $(".navbar-fixed-top").css("opacity", "1.0");
            });
        }
    });
});
