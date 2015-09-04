/**
 * Created by wuhaolin on 5/19/15.
 *
 */
"use strict";
var AV = require('leanengine');
var Unirest = require('unirest');
var Cheerio = require('cheerio');

/**
 * 获取对应isbn的图书链接
 * @param isbn
 * @returns {AV.Promise}
 */
function getBookHrefByISBN(isbn) {
    var rePromise = new AV.Promise(null);
    Unirest.get('http://www.amazon.cn/gp/search/').query({
        'search-alias': 'stripbooks',
        'field-isbn': isbn
    }).end(function (res) {
        if (res.ok) {
            var $ = Cheerio.load(res.raw_body);
            var href = $('a .s-access-detail-page').first().attr('href');
            rePromise.resolve(href);
        } else {
            rePromise.reject(res.error);
        }
    });
    return rePromise;
}

function getBookInfoByHref(href) {
    var rePromise = new AV.Promise(null);
    Unirest.get(href).end(function (res) {
        if (res.ok) {
            var jsonBook = {
                author: [],
                translator: []
            };
            var $ = Cheerio.load(res.raw_body);
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
        } else {
            rePromise.reject(res.error);
        }
    });
    return rePromise;
}

exports.spiderBookByISBN = function (isbn13) {
    var rePromise = new AV.Promise(null);
    getBookHrefByISBN(isbn13).then(function (url) {
        return getBookInfoByHref(url);
    }).then(function (jsonBook) {
        rePromise.resolve(jsonBook);
    }, function (err) {
        rePromise.reject(err);
    });
    return rePromise;
};
