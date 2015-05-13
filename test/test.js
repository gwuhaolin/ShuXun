var SuperAgent = require('superagent-charset');
var Cheerio = require('cheerio');

var isbn = '9787549224821';

SuperAgent.get('http://book.douban.com/subject_search')
    .query({
        search_text: isbn,
        cat: '1001'
    }).end(function (err, res) {
        var $ = Cheerio.load(res.text);
        var bookUrl = $('a[href^="http://book.douban.com/subject/"]').first().attr('href');

    });