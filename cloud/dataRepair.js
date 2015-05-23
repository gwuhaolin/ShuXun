/**
 * Created by wuhaolin on 5/22/15.
 * 数据维修
 */
"use strict";
var _ = require('underscore');
var BookInfo = require('cloud/book/bookInfo.js');

/**
 * 对应UsedBook表里的没有Info属性的区抓取图书信息填上该属性
 */
exports.fillUsedBookInfoWhereInfoIsNull = function () {
    var query = new AV.Query('UsedBook');
    query.doesNotExist('info');
    query.find().done(function (avosUsedBookList) {
        _.each(avosUsedBookList, function (avosUsedBook, index) {
            setTimeout(function () {
                BookInfo.fillUsedBookInfo(avosUsedBook).done(function (avosUsedBook) {
                    console.log(avosUsedBook);
                }).fail(function (err) {
                    console.log(err);
                });
            }, 1000 * index);
        });
    });
};

/**
 * 对于BookInfo表里每一本书都去重新计算它的UsedBooks属性
 */
exports.updateBookInfoUsedBooksRelation = function () {
    var query = new AV.Query('BookInfo');
    query.count().done(function (sumNum) {
        console.log(sumNum);
        for (var i = 0; i < sumNum; i += 100) {
            query = new AV.Query('BookInfo');
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
        var query = new AV.Query('UsedBook');
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