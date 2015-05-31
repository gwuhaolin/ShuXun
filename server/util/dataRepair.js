/**
 * Created by wuhaolin on 5/22/15.
 * 数据维修
 */
"use strict";
var AV = require('leanengine');
var _ = require('underscore');
var BookInfo = require('./../book/bookInfo.js');
var DoubanBook = require('./../book/doubanBook.js');

/**
 * 对应UsedBook表里的没有Info属性的区抓取图书信息填上该属性
 */
exports.fillUsedBookInfoWhereInfoIsNull = function () {
    var query = new AV.Query(Model.UsedBook);
    query.doesNotExist('info');
    query.count().done(function (sumNum) {
        for (var i = 0; i < sumNum; i += 100) {
            query = new AV.Query(Model.UsedBook);
            query.doesNotExist('info');
            query.skip(i);
            query.limit(100);
            query.find().done(function (avosUsedBookList) {
                _.each(avosUsedBookList, function (avosUsedBook, index) {
                    setTimeout(function () {
                        BookInfo.fillUsedBookInfo(avosUsedBook).done(function (avosUsedBook) {
                            console.log(avosUsedBook);
                        }).fail(function (err) {
                            console.log(err);
                        });
                    }, 1000 * index + sumNum);
                });
            });
        }
    });
};

/**
 * 对于BookInfo表里每一本书都去重新计算它的UsedBooks属性
 */
exports.updateBookInfoUsedBooksRelation = function () {
    var query = new AV.Query(Model.BookInfo);
    query.count().done(function (sumNum) {
        console.log(sumNum);
        for (var i = 0; i < sumNum; i += 100) {
            query = new AV.Query(Model.BookInfo);
            query.skip(i);
            query.limit(100);
            query.find().done(function (avosBookInfoList) {
                _.each(avosBookInfoList, function (avosBookInfo) {
                    computerBookInfoUsedBook(avosBookInfo);
                })
            }).fail(function (err) {
                console.error(err);
            });
        }
    });

    function computerBookInfoUsedBook(avosBookInfo) {
        var isbn13 = avosBookInfo.get('isbn13');
        var query = new AV.Query(Model.UsedBook);
        query.equalTo('isbn13', isbn13);
        query.find().done(function (avosUsedBookList) {
            avosBookInfo.relation('usedBooks').add(avosUsedBookList);
            if (avosUsedBookList.length > 0) {
                avosBookInfo.save().done(function (avosBookInfo) {
                    console.log(avosBookInfo);
                }).fail(function (err) {
                    console.error(err);
                });
            }
        })
    }
};

/**
 * 对于doubanId为空的书的信息,重新去豆瓣抓取一次
 */
exports.updateNoDoubanIdBookInfoFromDouban = function () {
    var query = new AV.Query(Model.BookInfo);
    query.doesNotExist('doubanId');
    query.count().done(function (sumNum) {
        for (var i = 0; i < sumNum; i += 100) {
            query = new AV.Query(Model.BookInfo);
            query.doesNotExist('doubanId');
            query.skip(i);
            query.limit(100);
            query.find().done(function (avosBookInfoList) {
                _.each(avosBookInfoList, function (avosBookInfo, index) {
                    setTimeout(function () {
                        var isbn13 = avosBookInfo.get('isbn13');
                        DoubanBook.spiderBookByISBN(isbn13).done(function (jsonBookInfo) {
                            BookInfo.updateAvosBookInfo(avosBookInfo, jsonBookInfo).done(function (avosBookInfo) {
                                console.log(avosBookInfo);
                            }).fail(function (err) {
                                console.error(err);
                            });
                        }).fail(function (err) {
                            console.error(err);
                        });
                    }, index * 1000 + sumNum);
                })
            })
        }
    });

};