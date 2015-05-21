/**
 * Created by wuhaolin on 5/21/15.
 *
 */
"use strict";
var DangDangBook = require('cloud/book/dangdangBook.js');
var JDBook = require('cloud/book/jdBook.js');
var DoubanBook = require('cloud/book/doubanBook.js');

exports.AVOS = {
    _Class: AV.Object.extend('BookInfo'),
    AttrName: ['doubanId', 'isbn13', 'title', 'image', 'author', 'translator', 'publisher', 'pubdate', 'price', 'pages', 'summary', 'binding', 'catalog', 'author_intro'],
    makeQuery: function () {
        return new AV.Query('BookInfo');
    },
    makeObject: function (jsonBook) {
        var avosBook = new exports.AVOS._Class();
        if (jsonBook) {
            for (var i = 0; i < exports.AVOS.AttrName.length; i++) {
                var attrName = exports.AVOS.AttrName[i];
                avosBook.set(attrName, jsonBook[attrName]);
            }
        }
        return avosBook;
    }
};

/**
 * 从BookInfo 表里查询图书信息
 * @param isbn13
 * @returns {AV.Promise}
 */
exports.queryBookInfoByISBN = function (isbn13) {
    var query = new AV.Query('BookInfo');
    query.equalTo('isbn13', isbn13);
    return query.first();
};

/**
 * 去抓取图书的信息
 * 先去豆瓣>亚马逊>当当>京东
 * @param isbn13 图书的isbn13
 * @return {AV.Promise} json格式的图书信息
 */
exports.spiderBookInfo = function (isbn13) {
    var rePromise = new AV.Promise(null);
    DoubanBook.spiderBookByISBN(isbn13).done(function (jsonBook) {
        rePromise.resolve(jsonBook);
    }).fail(function () {
        DangDangBook.spiderBookByISBN(isbn13).done(function (jsonBook) {//先去当当网
            rePromise.resolve(jsonBook);
        }).fail(function () {
            JDBook.spiderBookByISBN(isbn13).done(function (jsonBook) {//不行再去京东
                rePromise.resolve(jsonBook);
            }).fail(function (err) {
                rePromise.reject(err);
            });
        });
    });
    return rePromise;
};

/**
 * 把抓取到的图书信息保存到BookInfo表
 * @param jsonBook
 */
exports.saveBookInfo = function (jsonBook) {
    var BookInfo = AV.Object.extend('BookInfo');
    var avosBookInfo = new BookInfo();
    return avosBookInfo.save(jsonBook);
};