var SuperAgent = require('superagent-charset');
var Cheerio = require('cheerio');

var isbn = '9787549224821';

SuperAgent.get('http://search.dangdang.com/')
    .query({
        //medium: '01',
        //category_path: '01.00.00.00.00.00',
        //key4: isbn
        key:isbn
    }).end(function (err, res) {
        if (err) {
            //rePromise.reject(err);
        } else {
            if (res.ok) {
                var $ = Cheerio.load(res.text);
                var bookHref = $('a[href^="http://product.dangdang.com/"]').first().attr('href').split('#')[0];
                SuperAgent.get(bookHref)
                    .charset('gbk')
                    .end(function (err, res) {
                        if (err) {
                            //rePromise.reject(err);
                        } else {
                            if (res.ok) {
                                var jsonBook = {
                                    title: '',
                                    image: '',
                                    author: [],
                                    publisher: '',
                                    pubdate: '',
                                    pages: '',
                                    binding: '',
                                    summary: '',
                                    author_intro: '',
                                    catalog: ''
                                };
                                $ = Cheerio.load(res.text);
                                //获取标题
                                jsonBook.title = $('div[name="Title_pub"]').children('h1').first();
                                jsonBook.title.children('span').remove();
                                jsonBook.title = jsonBook.title.text().trim();
                                //获取封面
                                jsonBook.image = $('#mainimg_pic').find('img').first().attr('src');

                                $('div[name="Infodetail_pub"]').first().find('.show_info_right').each(function () {
                                    var text = $(this).prev().text();
                                    if (text.match(/作*者/)) {
                                        var authors = $(this).children('a');
                                        for (var i = 0; i < authors.length; i++) {
                                            jsonBook.author.push(authors.eq(i).text());
                                        }
                                    } else if (text.match(/出*版*社/)) {
                                        jsonBook.publisher = $(this).text();
                                    } else if (text == '出版时间') {
                                        jsonBook.pubdate = $(this).text();
                                    } else if (text == 'ＩＳＢＮ') {
                                        console.log($(this).text());
                                    }
                                });

                                $('#detail_all').find('ul').first().children('li').each(function () {
                                    var twoStr = $(this).text().split("：");
                                    if (twoStr[0] == '页 数') {
                                        jsonBook.pages = twoStr[1];
                                    } else if (twoStr[0] == '包 装') {
                                        jsonBook.binding = twoStr[1];
                                    }
                                });
                                //获取内容
                                jsonBook.summary = $('#content').find('textarea').first().text().trim();
                                //获取作者简介
                                jsonBook.author_intro = $('#authorintro').find('textarea').first().text().trim();
                                //获取目录
                                jsonBook.catalog = $('#catalog_show').text().trim();

                                console.log(jsonBook);
                                //rePromise.resolve(jsonBook);
                            } else {
                                //rePromise.reject(res.text);
                            }
                        }
                    });
            } else {
                //rePromise.reject(res.text);
            }
        }
    });