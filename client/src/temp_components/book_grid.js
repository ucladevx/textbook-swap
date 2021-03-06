- var class_name = books[i]["status"] == "A" ? "Accepted" : books["status"] == "R" ? "Rejected" : "Matched";

if books[i].title
    .card.col-md-4.grid-item.Requested.All
        .row
            .col-md-7.book-info
                p.card-title #{books[i].title}
                p.card-author #{books[i].author}
            .col-md-5
                .owned(data-title=books[i].title, data-author=books[i].author, data-id=books[i].book_id, data-isbn=books[i].isbn, data-img=books[i].img_url, data-index=i)
                    img.book-img(src=books[i].img_url, alt='Card image cap')
        .row.info-row
            .col-md-12.info
                - var book_id = books[i].book_id.toString();
                - var num_books = book_nums[book_id] ? book_nums[book_id] : 0;
                p #{num_books} books wanted in exchange
else if books[i]["status"] == "R"
    .card.col-md-4.grid-item.All.Rejected
        //a.rejected-dismiss(data-id=books[i]['book_have'].book_id) x
        img.rejected-dismiss(src='images/facebook-angry.svg', data-id=books[i]['book_have'].book_id)
        .row
            .col-md-5
                .owned(data-title=books[i]['book_have'].title, data-author=books[i]['book_have'].author, data-id=books[i]['book_have'].book_id, data-isbn=books[i]['book_have'].isbn, data-img=books[i]['book_have'].img_url)
                    img.book-img(src=books[i]['book_have'].img_url, alt='Card image cap')
                p.title #{books[i]['book_have'].title}
            .col-md-2
                p.arrow.align-middle &nharr;
            .col-md-5
                .wanted(data-title=books[i]['book_want'].title, data-author=books[i]['book_want'].author, data-id=books[i]['book_want'].book_id, data-isbn=books[i]['book_want'].isbn, data-img=books[i]['book_want'].img_url)
                    img.book-img(src=books[i]['book_want'].img_url, alt='Card image cap')
                p.title #{books[i]['book_want'].title}
        .row.info-row
            .col-md-12.info
                p REJECTED trade for #{books[i]['book_have'].title}
else 
    .card.col-md-4.grid-item.All.Matched
        .row
            .col-md-5
                .owned(data-title=books[i]['book_have'].title, data-author=books[i]['book_have'].author, data-id=books[i]['book_have'].book_id, data-isbn=books[i]['book_have'].isbn, data-img=books[i]['book_have'].img_url)
                    img.book-img(src=books[i]['book_have'].img_url, alt='Card image cap')
                p.title #{books[i]['book_have'].title}
            .col-md-2
                if class_name == "Accepted"
                    p.arrow.align-middle &check;
                else
                    p.arrow.align-middle &quest;
            .col-md-5
                .wanted(data-title=books[i]['book_want'].title, data-author=books[i]['book_want'].author, data-id=books[i]['book_want'].book_id, data-isbn=books[i]['book_want'].isbn, data-img=books[i]['book_want'].img_url)
                    img.book-img(src=books[i]['book_want'].img_url, alt='Card image cap')
                p.title #{books[i]['book_want'].title}
        .row.info-row
            .col-md-12.info
                if class_name == "Accepted"
                    p NEW ACCEPTED TRADE for #{books[i]['book_have'].title}
                else if class_name == "Matched"
                    p NEW MATCH for #{books[i]['book_have'].title}
