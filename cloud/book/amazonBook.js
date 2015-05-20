/**
 * Created by wuhaolin on 5/19/15.
 *
 */
"use strict";
var SuperAgent = require('superagent');
var Cheerio = require('cheerio');

/**
 * 获取对应isbn的图书链接
 * @param isbn
 * @returns {AV.Promise}
 */
function getBookHrefByISBN(isbn) {
    var rePromise = new AV.Promise(null);
    SuperAgent.get('http://www.amazon.cn/gp/search/')
        .query({
            'search-alias': 'stripbooks',
            'field-isbn': isbn
        })
        .end(function (err, res) {
            if (err) {
                rePromise.reject(err);
            } else {
                var $ = Cheerio.load(res.text);
                var href = $('a .s-access-detail-page').first().attr('href');
                rePromise.resolve(href);
            }
        });
    return rePromise;
}

function getBookInfoByHref(href) {
    var rePromise = new AV.Promise(null);
    SuperAgent.get(href)
        .end(function (err, res) {
            if (err) {
                rePromise.reject(err);
            } else {
                var jsonBook = {
                    author: [],
                    translator: []
                };
                var $ = Cheerio.load(res.text);
                //书名
                jsonBook.title = $('#productTitle').text();
                //作者 译者
                $('.author').each(function () {
                    var text = $(this).children('span').text();
                    if (text.indexOf('作者') >= 0) {
                        jsonBook.author.push($(this).children('a').text());
                    } else if (text.indexOf('译者') >= 0) {
                        jsonBook.translator.push($(this).children('a').text());
                    }
                });
                $('#detail_bullets_id').find('li').each(function () {
                    var text = $(this).children('b').text();
                    if (text.indexOf('出版社') >= 0) {

                    }
                })
            }
        });
    return rePromise;
}