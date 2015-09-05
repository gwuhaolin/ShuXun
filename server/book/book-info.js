/**
 * Created by wuhaolin on 5/21/15.
 *
 */
"use strict";
var AV = require('leanengine');
var Model = require('../../web/js/model.js');
var DangDangBook = require('./dangdang-book.js');
var JDBook = require('./jd-book.js');
var DoubanBook = require('./douban-book.js');

exports.BookInfoAttrName = ['doubanId', 'isbn13', 'title', 'image', 'author', 'translator', 'publisher', 'pubdate', 'price', 'pages', 'summary', 'binding', 'catalog', 'author_intro', 'tags', 'rating'];
exports.BookInfoAttrName_douban = ['id', 'isbn13', 'title', 'image', 'author', 'translator', 'publisher', 'pubdate', 'price', 'pages', 'summary', 'binding', 'catalog', 'author_intro', 'tags', 'rating'];


/**
 * 从BookInfo 表里查询图书信息
 * @param isbn13
 * @returns {AV.Promise} query.first()
 */
exports.queryBookInfoByISBN = function (isbn13) {
    var query = new AV.Query(Model.BookInfo);
    query.equalTo('isbn13', isbn13);
    return query.first();
};

/**
 * BookInfo表里有对应isbn13的信息不?
 * @param isbn13
 * @returns {AV.Promise} json格式{
               has:true,
               isbn13:isbn13
           }
 */
exports.hasISBN13Book = function (isbn13) {
    var rePromise = new AV.Promise(null);
    var query = new AV.Query(Model.BookInfo);
    query.equalTo('isbn13', isbn13);
    query.count().done(function (num) {
        if (num > 0) {
            rePromise.resolve({
                has: true,
                isbn13: isbn13
            });
        } else {
            rePromise.resolve({
                has: false,
                isbn13: isbn13
            });
        }
    }).fail(function (err) {
        rePromise.reject(err);
    });
    return rePromise;
};

/**
 * 去抓取图书的信息
 * 先去豆瓣>当当>京东
 * @param isbn13 图书的isbn13
 * @return {AV.Promise} json格式的图书信息
 * 如果所有途径都抓去不到这个isbn13图书的信息就抛出最后的抓取异常
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
 * 已经有对应ISBN的不会被保存
 * @param jsonBook
 * @return {AV.Promise} avosBookInfo.save()
 */
exports.saveBookInfo = function (jsonBook) {
    var avosBookInfo = Model.BookInfo.new(jsonBook);
    return avosBookInfo.save();
};

/**
 * 更新一个AvosBookInfo的信息
 * @param avosBookInfo 要被更新的对象
 * @param jsonBookInfo 用来更新的信息
 * @return {AV.Promise} avosBookInfo.save()
 */
exports.updateAvosBookInfo = function (avosBookInfo, jsonBookInfo) {
    for (var i = 0; i < exports.BookInfoAttrName.length; i++) {
        var attrName = exports.BookInfoAttrName[i];
        avosBookInfo.set(attrName, jsonBookInfo[attrName]);
    }
    return avosBookInfo.save();
};

/**
 * 填充UsedBook对象的bookInfo信息
 * 把usedBook.bookInfo属性设置为抓取到的BookInfo
 * 在对应的BookInfo.usedBooks属性里添加usedBook
 * 如果BookInfo表里已经有对应ISBN的图书信息就直接对接,否则先去抓取,抓取到后再去保存,再对接
 * @param avosUsedBook 要填充的UsedBook对象
 * @returns {AV.Promise} 如果填充成功返回包含BookInfo属性的UsedBook对象,否则返回错误原因
 */
exports.fillUsedBookInfo = function (avosUsedBook) {
    var rePromise = new AV.Promise(null);
    var isbn13 = avosUsedBook.get('isbn13');
    exports.queryBookInfoByISBN(isbn13).done(function (avosBookInfo) {
        if (avosBookInfo) {//已经有对应图书信息了
            setUsedBookInfo(avosBookInfo);
        } else {//还没有图书信息
            exports.spiderBookInfo(isbn13).done(function (jsonBook) {//去抓取
                exports.saveBookInfo(jsonBook).done(function (avosBookInfo) {//保存抓取到的
                    setUsedBookInfo(avosBookInfo);
                }).fail(function (err) {
                    rePromise.reject(err);
                });
            }).fail(function (err) {
                rePromise.reject(err);
            });
        }
    }).fail(function (err) {
        rePromise.reject(err);
    });

    function setUsedBookInfo(avosBookInfo) {
        avosUsedBook.set('bookInfo', avosBookInfo);
        var usedBookPromise = avosUsedBook.save();
        avosBookInfo.relation('usedBooks').add(avosUsedBook);
        var bookInfoPromise = avosBookInfo.save();
        AV.Promise.when(usedBookPromise, bookInfoPromise).done(function () {
            rePromise.resolve(avosUsedBook);
        }).fail(function (err) {
            rePromise.reject(err);
        })
    }

    return rePromise;
};