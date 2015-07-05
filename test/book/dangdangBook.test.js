/**
 * Created by wuhaolin on 5/29/15.
 */
var assert = require('assert');
var _ = require('underscore');
var Util = require('./../util.js');
var dangdangBook = require('../../server/book/dangdangBook.js');


describe('book/dangdangBook.js', function () {

    describe('#spiderBookByISBN', function () {

        _.each(Util.ISBN_Legal_HasPub, function (isbn13, index) {
            setTimeout(function () {
                it('抓取' + isbn13 + '的图书信息', function (done) {
                    this.timeout(10000);
                    dangdangBook.spiderBookByISBN(isbn13).done(function (jsonBookInfo) {
                        assert.equal(jsonBookInfo.isbn13, isbn13, 'isbn13必须相等');
                        Util.checkJsonBookInfoIsNice(jsonBookInfo);
                        done();
                    }).fail(function (err) {
                        done(err);
                    })
                });
            }, index * 1000);
        });
    })

});
