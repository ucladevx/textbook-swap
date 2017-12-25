doctype html
html
    head
        meta(charset='utf-8')
        title Loops - Dashboard
        script(src='https://code.jquery.com/jquery-3.2.1.min.js', crossorigin='anonymous')
        link(rel="stylesheet", type="text/css", href="/assets/sweetalert/dist/sweetalert.css")
        link(rel='stylesheet', href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css', integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u', crossorigin='anonymous')
        link(rel='stylesheet' type="text/css" href="css/bookshelf.css")
        link(rel='stylesheet' type="text/css" href="css/new_trade_form.css")
        link(href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet")
        //- link(rel='stylesheet' type="text/css" href="css/bookshelf_navbar.css")

    body
        include bookshelf_navbar.pug
        include newtradeform.pug
        include modifytrade.pug
        .bookshelf_navbar_container
            .row.bookshelf_navbar
                .col-md-3.welcome_dialog_container
                    h4.welcome-dialog
                        | Hi&nbsp;
                        span.username #{username[0].user_name},
                        |  welcome to your&nbsp;
                        span.bookshelf_name Bookshelf!
                .col-md-6.filter_button_container
                    .filter-button-group.button-group(data-filter-group= "Status")
                        button.All_but.active.filter-button(data-filter='.All') ALL
                        button.Requested_but.filter-button(data-filter='.Requested') REQUESTED
                        button.Matched_but.filter-button(data-filter='.Matched') MATCHED
                        button.Rejected_but.filter-button(data-filter='.Rejected') REJECTED
                .col-md-3.bookshelf_image_container
                    img(src='images/Bookshelf_Dashboard.svg')

        .grid.carousel-inner
            - for(var i = -1; i < books.length; i++){
                if (i + 3) % 3 == 2
                    .row.shelf
                        if i == -1
                            .card.col-md-4.grid-item.All.Requested.Matched.Rejected.new-trade-card(data-popup-open='popup-1', href='#')
                                .row.card_row
                                    .col-md-4
                                    .col-md-4
                                        img.card-img-top(src='/images/grey_plus.png', alt='Card image cap')
                                    .col-md-4
                                .row
                                    .card-block
                                        h4#new-trade-title NEW TRADE
                        else
                            include book_grid
                else
                    include book_grid
            - }
        script(type='text/javascript').
            var book_info = !{JSON.stringify(books)};
        script(src="/assets/isotope.pkgd.min.js")
        script(src="/assets/sweetalert/dist/sweetalert.min.js")
        script(src='https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js', integrity='sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb', crossorigin='anonymous')
        script(src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js', integrity='sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa', crossorigin='anonymous')
        script(src="/js/bookshelf.js")
        script(src="/js/new_trade_form.js")