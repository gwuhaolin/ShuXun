/**
 * Created by wuhaolin on 5/29/15.
 */
var assert = require('assert');
var _ = require('underscore');
var Util = require('./../util.js');
var BookInfo = require('../../server/book/book-info.js');
var doubanBook = require('../../server/book/douban-book.js');
var doubanIDs_ok = ['2368198', '3796063', '25863979', '26368070'];

describe('book/douban-book.js', function () {

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

    describe('#spiderBookByDoubanId', function () {
        var doubanId = doubanIDs_ok[0];
        it(doubanId + '的信息是有的', function (done) {
            this.timeout(10000);
            doubanBook.spiderBookByDoubanId(doubanId).done(function (jsonBookInfo) {
                assert.equal(jsonBookInfo.doubanId, doubanId, 'doubanId必须相等');
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

    describe('#spiderDoubanIdByISBN13', function () {
        _.each(Util.ISBN_Legal_HasPub, function (isbn13) {
            it(isbn13 + '是有豆瓣ID的', function (done) {
                this.timeout(10000);
                doubanBook.spiderDoubanIdByISBN13(isbn13).done(function (doubanId) {
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

    describe('#searchBooks', function () {
        var count = 1;
        var keyword = '小王子';
        var tag = '计算机科学';
        var start = 0;

        /**
         * 检测搜索结果返回的信息是否合格
         * @param json 豆瓣返回的json
         */
        function checkDoubanSearchResult(json) {
            assert(typeof json.start === 'number', 'start');
            assert(typeof json.count === 'number', 'count');
            assert(typeof json.total === 'number', 'total');
            assert(typeof json.books.length === 'number', 'books');
            _.each(json.books, function (one) {
                assert(typeof  json.books[0] === 'object', 'one book');
            });
        }

        it('按照关键字搜索', function (done) {
            doubanBook.searchBooks(keyword, null, start, count, null).done(function (json) {
                checkDoubanSearchResult(json);
                done();
            }).fail(function (err) {
                done(err);
            })
        });

        it('按照tag搜索', function (done) {
            doubanBook.searchBooks(null, tag, start, count, null).done(function (json) {
                checkDoubanSearchResult(json);
                done();
            }).fail(function (err) {
                done(err);
            })
        });

        it('start参数为null, 默认为0', function (done) {
            doubanBook.searchBooks(keyword, null, null, count, null).done(function (json) {
                checkDoubanSearchResult(json);
                assert(json.start == 0, '.start == start');
                assert(json.count == count, '.count == count');
                done();
            }).fail(function (err) {
                done(err);
            })
        });

        it('count参数为null, 默认为20', function (done) {
            doubanBook.searchBooks(null, tag, start, null, null).done(function (json) {
                checkDoubanSearchResult(json);
                assert(json.start == start, '.start == start');
                assert(json.count == 20, '.count == count');
                done();
            }).fail(function (err) {
                done(err);
            })
        });

        it('设置fields参数', function (done) {
            var fields = ['isbn13'];
            doubanBook.searchBooks(keyword, null, null, count, fields).done(function (json) {
                checkDoubanSearchResult(json);
                _.each(json.books, function (one) {
                    assert.equal(_.keys(one).length, fields.length, '只返回选定的字段' + _.keys(one));
                    _.each(fields, function (key) {
                        assert(one[key], '要有' + key + '属性');
                    })
                });
                done();
            }).fail(function (err) {
                done(err);
            })
        });

        it('fields参数为空,就获取BookInfo表里的字段', function (done) {
            doubanBook.searchBooks(keyword, null, null, count, null).done(function (json) {
                checkDoubanSearchResult(json);
                _.each(json.books, function (one) {
                    assert.equal(_.keys(one).length, BookInfo.BookInfoAttrName_douban.length, '只返回选定的字段' + _.keys(one));
                    _.each(BookInfo.BookInfoAttrName_douban, function (key) {
                        assert(one[key], '要有' + key + '属性');
                    })
                });
                done();
            }).fail(function (err) {
                done(err);
            })
        })
    });

});