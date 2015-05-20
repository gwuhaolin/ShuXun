/**
 * Created by wuhaolin on 5/12/15.
 * 去京东抓取图书信息
 */
"use strict";
var SuperAgent = require('superagent-charset');
var Cheerio = require('cheerio');

exports.spiderBookByISBN = function (isbn) {
    var rePromise = new AV.Promise(null);
    SuperAgent.get('http://search.jd.com/bookadvsearch')
        .query({
            isbn: isbn,
            book: 'y',//图书
            wtype: '1'//京东直营
        }).end(function (err, res) {
            if (err) {
                rePromise.reject(err);
            } else {
                var $ = Cheerio.load(res.text);
                var bookUrl = $('.item-book').first().find('a[href^="http://item.jd.com/"]').attr('href');
                var jdId = bookUrl.split('/')[3].split('.')[0];
                console.log(jdId);
                SuperAgent.get(bookUrl)
                    .charset('gbk')
                    .end(function (err, res) {
                        if (err) {
                            rePromise.reject(err);
                        } else {
                            var jsonBook = {
                                isbn13: isbn,
                                author: []
                            };
                            $ = Cheerio.load(res.text);
                            //获取标题
                            jsonBook.title = $('#name').children('h1').first().text().trim();
                            //获取作者
                            $('#p-author').children('a').each(function () {
                                jsonBook.author.push($(this).text());
                            });
                            //获得图片
                            jsonBook.image = $('#product-intro').find('img[width="350"][height="350"]').first().attr('src');
                            //获得出版信息
                            $('#parameter2').children('li').each(function () {
                                var text = $(this).text();
                                if (text.indexOf('出版社') >= 0) {
                                    jsonBook.publisher = text.split('：')[1].trim();
                                } else if (text.indexOf('ISBN') >= 0) {
                                    if (text.split('：')[1] != isbn) {
                                        rePromise.reject('抓取到的图书ISBN编码不符合');
                                    }
                                } else if (text.indexOf('出版时间') >= 0) {
                                    jsonBook.pubdate = text.split('：')[1];
                                } else if (text.indexOf('页数') >= 0) {
                                    jsonBook.pages = text.split('：')[1];
                                } else if (text.indexOf('包装') >= 0) {
                                    jsonBook.binding = text.split('：')[1];
                                }
                            });
                            //获得定价
                            jsonBook.price = $('#page_maprice').text().trim();
                            //获取简介 TODO error
                            SuperAgent.get('http://d.3.cn/desc/' + jdId)
                                .charset('gbk')
                                .end(function (err, res) {
                                    try {
                                        $ = Cheerio.load(res.body);
                                        $('.item-mt h3').each(function () {
                                            var text = $(this).text();
                                            console.log(text);
                                            if (text == '内容简介') {
                                                jsonBook.summary = $(this).parent().next().children('.book-detail-content').first().text();
                                            } else if (text == '作者简介') {
                                                jsonBook.author_intro = $(this).parent().next().children('.book-detail-content').first().text();
                                            } else if (text == '目录') {
                                                jsonBook.catalog = $(this).parent().next().children('.book-detail-content').first().text();
                                            }
                                        });
                                    } finally {
                                        rePromise.resolve(jsonBook);
                                    }
                                });
                        }
                    })
            }
        });
    return rePromise;
};