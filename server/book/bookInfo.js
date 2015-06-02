/**
 * Created by wuhaolin on 5/21/15.
 *
 */
"use strict";
var AV = require('leanengine');
var Model = require('../../web/js/Model.js');
var DangDangBook = require('./dangdangBook.js');
var JDBook = require('./jdBook.js');
var DoubanBook = require('./doubanBook.js');

exports.BookInfoAttrName = ['doubanId', 'isbn13', 'title', 'image', 'author', 'translator', 'publisher', 'pubdate', 'price', 'pages', 'summary', 'binding', 'catalog', 'author_intro'];

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
 * 如果BookInfo表里已经有对应ISBN的图书信息就直接对接,否则先去抓取,抓取到后再去保存,再对接
 * @param avosUsedBook 要填充的UsedBook对象
 * @returns {AV.Promise} 如果填充填充返回UsedBook对象,否则返回错误原因
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
    return rePromise;

    function setUsedBookInfo(avosBookInfo) {
        avosUsedBook.set('info', avosBookInfo);
        avosUsedBook.save().done(function (avosUsedBook) {
            rePromise.resolve(avosUsedBook);
        }).fail(function (err) {
            rePromise.reject(err);
        });
        avosBookInfo.relation('usedBooks').add(avosUsedBook);
        avosBookInfo.save();
    }
};

/**
 * 更具图书pubdate获得最新出版的图书
 * @param skip
 * @param limit
 * @returns {AV.Promise} query.find()
 */
exports.getLatestBooks = function (skip, limit) {
    var query = new AV.Query(Model.BookInfo);
    query.select(['doubanId', 'isbn13', 'title', 'image', 'pubdate', 'author', 'publisher', 'pubdate', 'price']);
    query.descending('pubdate');
    query.skip(skip);
    query.limit(limit);
    return query.find();
};

/**
 * 获得用户附近的要卖的书
 * @param skip
 * @param limit
 * @param role 是附近的卖书=='sell' 还是求书=='need'
 * @param user 当前用户 用于获得用户的地理位置
 * @returns {AV.Promise} query.find()
 */
exports.getNearUsedBook = function (skip, limit, role, user) {
    var query = new AV.Query(Model.UsedBook);
    query.skip(skip);
    query.limit(limit);
    query.equalTo('role', role);
    if (user) {
        query.notEqualTo('owner', user);//不要显示自己的上传的
        query.near("location", user.get('location'));
    }
    return query.find();
};

