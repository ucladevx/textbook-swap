$(document).ready(function(){
    $(window).scroll(function() { // check if scroll event happened
        var s = $(window).scrollTop(),
            d = $(document).height(),
            c = $(window).height();

        var scrollPercent = (s / (d-c)) * 100;
        if (scrollPercent > 90) { // check if user scrolled more than 50 from top of the browser window
            $(".navbar-fixed-top").css("opacity","0.25"); // if yes, then change the color of class "navbar-fixed-top" to white (#f8f8f8)
        } else {
            $(".navbar-fixed-top").css("opacity", "1.0"); // if not, change it back to transparent
        }
    });
});
