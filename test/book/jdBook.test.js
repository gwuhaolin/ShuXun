/**
 * Created by wuhaolin on 5/29/15.
 */
var assert = require('assert');
var _ = require('underscore');
var Util = require('./../util.js');
var jdBook = require('../../server/book/jdBook.js');

describe('book/jdBook.js', function () {

    describe('#spiderBookByISBN', function () {
        _.each(Util.ISBN_Legal_HasPub, function (isbn13) {
            it(isbn13 + '的信息是有的', function (done) {
                jdBook.spiderBookByISBN(isbn13).done(function (jsonBookInfo) {
                    assert(jsonBookInfo.isbn13 == isbn13, 'isbn13必须相等');
                    Util.checkJsonBookInfoIsNice(jsonBookInfo);
                    done();
                }).fail(function (err) {
                    done(err);
                })
            })
        });
    })
});