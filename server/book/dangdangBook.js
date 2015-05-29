/**
 * Created by wuhaolin on 5/11/15.
 * 去当当网抓取图书信息
 */
"use strict";
var AV = require('leanengine');
var SuperAgent = require('superagent-charset');
var Cheerio = require('cheerio');

/**
 * 去豆瓣抓取图书信息
 * @param isbn13
 * @returns {AV.Promise}
 */
exports.spiderBookByISBN = function (isbn13) {
    var rePromise = new AV.Promise(null);
    SuperAgent.get('http://search.dangdang.com/')
        .query({
            key: isbn13
        }).end(function (err, res) {
            if (err) {
                rePromise.reject(err);
            } else {
                if (res.ok) {
                    var $ = Cheerio.load(res.text);
                    try {
                        var bookHref = $('a[href^="http://product.dangdang.com/"]').first().attr('href').split('#')[0];
                        SuperAgent.get(bookHref)
                            .charset('gbk')
                            .end(function (err, res) {
                                if (err) {
                                    rePromise.reject(err);
                                } else {
                                    if (res.ok) {
                                        var jsonBook = {
                                            isbn13: isbn13,
                                            author: []
                                        };
                                        $ = Cheerio.load(res.text);
                                        //获取标题
                                        jsonBook.title = $('div[name="Title_pub"]').children('h1').first();
                                        jsonBook.title.children('span').remove();
                                        jsonBook.title = jsonBook.title.text().trim();
                                        //获取封面
                                        jsonBook.image = $('#mainimg_pic').find('img').first().attr('src');
                                        jsonBook.image = jsonBook.image.replace('_x_', '_w_');//小图换大图

                                        $('.show_info_right').each(function () {
                                            var text = $(this).prev().text();
                                            if (text.match(/作*者/)) {
                                                var authors = $(this).children('a');
                                                for (var i = 0; i < authors.length; i++) {
                                                    jsonBook.author.push(authors.eq(i).text());
                                                }
                                            } else if (text.match(/出*版*社/)) {
                                                jsonBook.publisher = $(this).text().trim();
                                            } else if (text == '出版时间') {
                                                jsonBook.pubdate = $(this).text().trim();
                                            } else if (text == 'ＩＳＢＮ') {
                                                if ($(this).text() != isbn13) {
                                                    rePromise.reject('抓取到的图书ISBN编码不符合');
                                                }
                                            } else if (text.match(/定*价/)) {
                                                jsonBook.price = $(this).text().trim();
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

                                        rePromise.resolve(jsonBook);
                                    } else {
                                        rePromise.reject(res.text);
                                    }
                                }
                            });
                    } catch (err) {
                        rePromise.reject(err);
                    }
                } else {
                    rePromise.reject(res.text);
                }
            }
        });
    return rePromise;
};
