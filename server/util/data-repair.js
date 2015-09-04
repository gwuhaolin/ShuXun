/**
 * Created by wuhaolin on 5/22/15.
 * 数据维修
 */
"use strict";
var AV = require('leanengine');
var Model = require('../../web/js/model.js');
var _ = require('underscore');
var BookInfo = require('./../book/book-info.js');
var DoubanBook = require('./../book/douban-book.js');

/**
 * 对UsedBook表里的没有Info属性的去抓取图书信息填上该属性
 */
exports.fillUsedBookInfoWhereInfoIsNull = function () {
    var query = new AV.Query(Model.UsedBook);
    query.doesNotExist('info');
    query.limit(1000);
    query.find().done(function (avosUsedBookList) {
        _.each(avosUsedBookList, function (avosUsedBook, index) {
            setTimeout(function () {
                BookInfo.fillUsedBookInfo(avosUsedBook).done(function (avosUsedBook) {
                    //console.log(avosUsedBook);
                }).fail(function (err) {
                    console.error(err);
                });
            }, 1000 * index);
        });
    });
};

/**
 * 对于BookInfo表里每一本书都去重新计算它的usedBooks属性
 */
exports.updateBookInfoUsedBooksRelation = function () {
    var query = new AV.Query(Model.BookInfo);
    query.limit(1000);
    query.find().done(function (avosBookInfoList) {
        _.each(avosBookInfoList, function (avosBookInfo) {
            computerBookInfoUsedBook(avosBookInfo);
        })
    }).fail(function (err) {
        console.error(err);
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
                    //console.log(avosBookInfo);
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
    query.limit(1000);
    query.find().done(function (avosBookInfoList) {
        _.each(avosBookInfoList, function (avosBookInfo, index) {
            setTimeout(function () {
                var isbn13 = avosBookInfo.get('isbn13');
                DoubanBook.spiderBookByISBN(isbn13).done(function (jsonBookInfo) {
                    BookInfo.updateAvosBookInfo(avosBookInfo, jsonBookInfo).done(function (avosBookInfo) {
                        //console.log(avosBookInfo);
                    }).fail(function (err) {
                        console.error(err);
                    });
                }).fail(function (err) {
                    console.error(err);
                });
            }, index * 1000);
        })
    })
};