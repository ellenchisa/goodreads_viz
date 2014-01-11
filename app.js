var goodreads = require('goodreads');
var fs = require('fs');
var books = {};
var client = new goodreads.client({ 'key': 'auaYzVO0q5dYrIly7e9w', 'secret': 'UvPhnsJoOzfGeVC0cdD1pfELxfr6gxSn4LiKTfY'});

function getbooks(year,page){
    page=page || 1;
    if (!books[year]) { 
        books[year] = {
            meta: {
                count: 0,
                pages: 0,
                rating: {
                    min: null,
                    avg: 0,
                    max: null,
                }
            },
            books: []
        };
    }

    //console.log(JSON.stringify(books));

    client.getSingleShelf('1952043', year+'&per_page=200&page='+page, function(reading_shelf) {
        reading_shelf.GoodreadsResponse.books[0].book.forEach(function(book) {
            books[year].books.push({
                year: year,
                isbn: book.isbn[0],
                title: book.title[0],
                image_url: book.image_url[0],
                small_image_url: book.small_image_url[0],
                link: book.link[0],
                num_pages: +book.num_pages[0],
                average_rating: +book.average_rating[0],
                author: book.authors[0].author[0].name[0],
            })
        
            books[year].meta.pages += +book.num_pages[0];
            books[year].meta.rating.avg += +book.average_rating[0];

            if(!books[year].meta.rating.max || +book.average_rating[0] > books[year].meta.rating.max){
                books[year].meta.rating.max = +book.average_rating[0]
            }

            if(!books[year].meta.rating.min || +book.average_rating[0] < books[year].meta.rating.min){
                books[year].meta.rating.min = +book.average_rating[0]
            }
        });

        if (reading_shelf.GoodreadsResponse.books[0].book.length === 200){
            console.log('getting new books for', page+1)
            getbooks(year,page+1);
        } else {
            books[year].meta.count = books[year].books.length;
            books[year].meta.rating.avg /= books[year].meta.count;
            books[year].meta.rating.avg = Math.floor(books[year].meta.rating.avg * 100) / 100;

            console.log(year)
            console.log(books[year].meta);

            joinbooks()

            fs.writeFileSync("books.json", JSON.stringify(books));
        }        
    });
};

var outstanding = 11;

function joinbooks() {
    outstanding -= 1
    if (outstanding === 0) {
        console.log('gotallbooks')
    } else {
        console.log('still waiting')
    }
}


getbooks(2009);
getbooks(2010);
getbooks(2011);
getbooks(2012);
getbooks(2013);
getbooks('fiction');
getbooks('nonfiction');
getbooks(2008);
getbooks('pre-2008');
getbooks('female_author');
getbooks('male_author');


// projects.forEach(function(project) {
//             var title = $(project).find('.project_name').first().text();
//             var url = "http://www.kickstarter.com/" + $(project).attr('href');
//             var image = $(project).find('img').first().attr('src');
//             result.push({
//                 title:title,image:image,url:url
//             });
//         });

// book":[
// {"id":[{"_":"15812848",
// "isbn":["0452298156"],
// "isbn13":["9780452298156"],
// "title":["Why We Write: 20 Acclaimed Authors on How and Why They Do What They Do"],
// "image_url":["http://d202m5krfqbpi5.cloudfront.net/books/1358647492m/15812848.jpg"],
// "small_image_url":["http://d202m5krfqbpi5.cloudfront.net/books/1358647492s/15812848.jpg"],
// "link":["http://www.goodreads.com/book/show/15812848-why-we-write"],
// "num_pages":["256"],
// "average_rating":["4.04"],
// "description":["<strong>Twenty of America's bestselling authors share tricks, tips, and secrets of the successful writing life.</strong><br><br> Anyone who's ever sat down to write a novel or even a story knows how exhilarating and heartbreaking writing can be. So what makes writers stick with it? In <em>Why We Write</em>, twenty well-known authors candidly share what keeps them going and what they love most—and least—about their vocation.<br><br><strong>Contributing authors include:</strong><br> Isabel Allende<br> David Baldacci<br> Jennifer Egan<br> James Frey<br> Sue Grafton<br> Sara Gruen<br> Kathryn Harrison<br> Gish Jen<br> Sebastian Junger<br> Mary Karr<br> Michael Lewis<br> Armistead Maupin<br> Terry McMillan<br> Rick Moody<br> Walter Mosley<br> Susan Orlean<br> Ann Patchett<br> Jodi Picoult<br> Jane Smiley<br> Meg Wolitzer"]
// "authors":[
// {"author":[
// {"id":["238890"],
// "name":["Meredith Maran"],
// ,"link":["http://www.goodreads.com/author/show/238890.Meredith_Maran"],