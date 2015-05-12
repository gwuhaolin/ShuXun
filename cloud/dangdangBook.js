/**
 * Created by wuhaolin on 5/11/15.
 * 去当当网抓取图书信息
 */
"use strict";
var SuperAgent = require('superagent');
var Cheerio = require('cheerio');

exports.spiderBookByISBN = function (isbn) {
    var rePromise = new AV.Promise(null);
    SuperAgent.get('http://search.dangdang.com/')
        .query({
            medium: '01',
            category_path: '01.00.00.00.00.00',
            key4: isbn
        }).end(function (err, res) {
            if (err) {
                rePromise.reject(err);
            } else {
                if (res.ok) {
                    var $ = Cheerio.load(res.text);
                    var href = $('a[href^="http://product.dangdang.com/"]').first().attr('href').split('#')[0];
                    SuperAgent.get(href).end(function (err, res) {
                        if (err) {
                            rePromise.reject(err);
                        } else {
                            if (res.ok) {
                                var jsonBook = {
                                    title: '',
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
                                console.log(res.text);
                                var pubInfo = $('div[name="Infodetail_pub"]').first();
                                //获取作者
                                var authors = $(pubInfo).find('div:contains("作")').next().children('a');
                                for (var i = 0; i < authors.length; i++) {
                                    jsonBook.author.push(authors[i].text());
                                }
                                //获取出版社
                                jsonBook.publisher = $(pubInfo).find('div:contains("社")').next().children('a').text();
                                //获取出版社
                                jsonBook.pubdate= $(pubInfo).find('div:contains("出版时间")').next().children('a').text();

                                $('#detail_all').find('ul').first().children('li').each(function () {
                                    var twoStr = $(this).text().split("：");
                                    if (twoStr[0] == '页 数') {
                                        jsonBook.pages = twoStr[1];
                                    } else if (twoStr[0] == '包 装') {
                                        jsonBook.binding = twoStr[1];
                                    }
                                });

                                //获取内容
                                jsonBook.summary = $('#content_all').text();
                                //获取作者简介
                                jsonBook.author_intro = $('#authorintro_all').text();
                                //获取目录
                                jsonBook.catalog = $('#catalog_show').text();

                                rePromise.resolve(jsonBook);
                            } else {
                                rePromise.reject(res.text);
                            }
                        }
                    });
                } else {
                    rePromise.reject(res.text);
                }
            }
        });
    return rePromise;
};
