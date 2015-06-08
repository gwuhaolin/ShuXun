/**
 * Created by wuhaolin on 5/22/15.
 * 数据维修
 */
"use strict";
var AV = require('leanengine');
var AVConfig = require('../../config/global.json');
var APP_ID = process.env['LC_APP_ID'] || AVConfig.applicationId;
var APP_KEY = process.env['LC_APP_KEY'] || AVConfig.applicationKey;
var MASTER_KEY = process.env['LC_APP_MASTER_KEY'] || AVConfig.masterKey;
AV.initialize(APP_ID, APP_KEY, MASTER_KEY);
AV.Cloud.useMasterKey();
var Model = require('../../web/js/Model.js');
var _ = require('underscore');
var BookInfo = require('./../book/bookInfo.js');
var DoubanBook = require('./../book/doubanBook.js');

/**
 * 对与UsedBook表里的没有Info属性的去抓取图书信息填上该属性
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
                            console.error(err);
                        });
                    }, 1000 * index + sumNum);
                });
            });
        }
    });
};

/**
 * 对于BookInfo表里每一本书都去重新计算它的usedBooks属性
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
        query.select('isbn13');
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
 * 对于doubanId为空的书的信息(也就是不是从豆瓣获取的图书信息),重新去豆瓣抓取一次
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

/**
 * 对于BookInfo表,tags和rating还为空,需要重新去抓取完善属性
 */
exports.updateBookInfoWhereTagsAndRatingIsNull = function () {
    var query = new AV.Query(Model.BookInfo);
    query.doesNotExist('tags');
    query.doesNotExist('rating');
    query.count().done(function (sumNum) {
        for (var i = 0; i < sumNum; i += 100) {
            query = new AV.Query(Model.BookInfo);
            query.doesNotExist('tags');
            query.doesNotExist('rating');
            query.skip(i);
            query.limit(100);
            query.find().done(function (avosBookInfoList) {
                _.each(avosBookInfoList, function (avosBookInfo, index) {
                    setTimeout(function () {
                        var isbn13 = avosBookInfo.get('isbn13');
                        BookInfo.spiderBookInfo(isbn13).done(function (jsonBookInfo) {
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
    })
};