/**
 * Created by wuhaolin on 5/29/15.
 */
var assert = require('assert');
var _ = require('underscore');
var Util = require('./../util.js');
var doubanBook = require('../../server/book/doubanBook.js');
var doubanIDs_ok = ['2368198', '3796063', '25863979', '26368070'];

describe('book/doubanBook.js', function () {

    before(function () {
        Util.initAVOS();
    });

    describe('spiderDoubanBookReview', function () {
        _.each(doubanIDs_ok, function (doubanId) {
            it(doubanId + '是有豆瓣书评的', function (done) {
                doubanBook.spiderDoubanBookReview(doubanId, 0).done(function (jsonReviews) {
                    _.each(jsonReviews, function (one) {
                        assert(one.reviewId, 'reviewId');
                        assert(one.avatarUrl, 'avatarUrl');
                        assert(one.title, 'title');
                        assert(one.context, 'context');
                    });
                    done();
                }).fail(function (err) {
                    done(err);
                })
            });
        });

    });

    describe('#spiderBookByISBN', function () {
        var isbn13 = Util.ISBN_Legal_HasPub[0];
        it(isbn13 + '的信息是有的', function (done) {
            this.timeout(10000);
            doubanBook.spiderBookByISBN(isbn13).done(function (jsonBookInfo) {
                assert.equal(jsonBookInfo.isbn13, isbn13, 'ISBN13必须相等');
                assert(jsonBookInfo.doubanId, '必须有doubanId属性');
                Util.checkJsonBookInfoIsNice(jsonBookInfo);
                done();
            }).fail(function (err) {
                done(err);
            })
        });
    });

    describe('#spiderBusinessInfo', function () {
        _.each(Util.ISBN_Legal_HasPub, function (isbn13) {
            it(isbn13 + '是有网购信息的', function (done) {
                this.timeout(10000);
                doubanBook.spiderBusinessInfo(isbn13).done(function (infos) {
                    _.each(infos, function (one) {
                        assert(one.url, 'url');
                        assert(one.name, 'name');
                        assert(one.price, 'price');
                        assert(one.logoUrl, 'logoUrl');
                    });
                    done();
                }).fail(function (err) {
                    done(err);
                })
            })
        });
    });

    describe('#getDoubanIdByISBN13', function () {
        _.each(Util.ISBN_Legal_HasPub, function (isbn13) {
            it(isbn13 + '是有豆瓣ID的', function (done) {
                this.timeout(10000);
                doubanBook.getDoubanIdByISBN13(isbn13).done(function (doubanId) {
                    assert(doubanId, 'doubanId');
                    done();
                }).fail(function (err) {
                    done(err);
                })
            })
        });
    });

    describe('#spiderAndSaveLatestBooks', function () {
        it('不要报错', function (done) {
            this.timeout(100000);
            doubanBook.spiderAndSaveLatestBooks().fail(function (err) {
                done(err);
            }).done(function () {
                done();
            })
        })
    });

});