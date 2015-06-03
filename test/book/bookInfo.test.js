/**
 * Created by wuhaolin on 5/28/15.
 *
 */
"use strict";
var assert = require('assert');
var _ = require('underscore');
var Model = require('../../web/js/Model.js');
var Util = require('./../util.js');
var bookInfo = require('../../server/book/bookInfo.js');
var isbn13s_ok = ['9787511721051', '9787210036944', '9787300093598'];
var isbn13s_no = ['9787511721052', '9787210036945', '9787300093597'];

describe('book/bookInfo.js', function () {

    before(function () {
        Util.initAVOS();
    });

    describe('#queryBookInfoByISBN', function () {

        _.each(isbn13s_ok, function (isbn13) {
            it('必须要查询到这书' + isbn13 + '的信息', function (done) {
                bookInfo.queryBookInfoByISBN(isbn13).done(function (avosBookInfo) {
                    if (avosBookInfo) {
                        done();
                    } else {
                        done('没有成功获得信息' + isbn13);
                    }
                }).fail(function (err) {
                    done(err);
                })
            });
        });

        _.each(isbn13s_no, function (isbn13) {
            it('不可能查到书' + isbn13 + '的信息', function (done) {
                bookInfo.queryBookInfoByISBN(isbn13).done(function (avosBookInfo) {
                    if (avosBookInfo) {
                        done('获得了不应该出现的信息' + isbn13);
                    } else {
                        done();
                    }
                }).fail(function (err) {
                    done(err);
                })
            })
        });

    });


    describe('#hasISBN13Book', function () {

        _.each(isbn13s_ok, function (isbn13) {
            it(isbn13 + '这书的信息是有的', function (done) {
                bookInfo.hasISBN13Book(isbn13).done(function (re) {
                    assert.deepEqual(re, {has: true, isbn13: isbn13});
                    done();
                }).fail(function (err) {
                    done(err);
                })
            });
        });


        _.each(isbn13s_no, function (isbn13) {
            it(isbn13 + '这书的信息是不可能有的', function (done) {
                bookInfo.hasISBN13Book(isbn13).done(function (re) {
                    assert.deepEqual(re, {has: false, isbn13: isbn13});
                    done();
                }).fail(function (err) {
                    done(err);
                })
            });
        });

    });

    describe('#getLatestBooks', function () {

        it('得到最新的图书列表', function (done) {
            this.timeout(100000);
            var attrNames = ['doubanId', 'isbn13', 'title', 'image', 'pubdate', 'author', 'publisher', 'pubdate', 'price'];
            var limit = 1;
            bookInfo.getLatestBooks(0, limit).done(function (bookInfos) {
                assert(bookInfos.length == limit, '获得指定数量的信息');
                _.each(bookInfos, function (bookInfo) {
                    _.each(attrNames, function (key) {
                        assert(bookInfo.get(key), '要包含' + key + '属性');
                    });
                });
                done();
            }).fail(function (err) {
                done(err);
            })
        });
    });

    describe('#getNearUsedBook', function () {
        var start = 0;
        var limit = 1;
        var user = new Model.User();
        user.id = '553b9b1ae4b06ee8dfb27780';

        it('获得用户附近的要卖的书', function (done) {
            var role = 'sell';
            bookInfo.getNearUsedBook(start, limit, role, user).done(function (usedBooks) {
                assert.equal(usedBooks.length, limit, '获得指定数量的书');
                _.each(usedBooks, function (usedBook) {
                    assert(usedBook instanceof Model.UsedBook);
                    assert.equal(usedBook.get('role'), role);
                });
                done();
            }).fail(function (err) {
                done(err);
            })
        });

        it('获得用户附近的求书', function (done) {
            var role = 'need';
            bookInfo.getNearUsedBook(start, limit, role, user).done(function (usedBooks) {
                assert.equal(usedBooks.length, limit, '获得指定数量的书');
                _.each(usedBooks, function (usedBook) {
                    assert(usedBook instanceof Model.UsedBook);
                    assert.equal(usedBook.get('role'), role);
                });
                done();
            }).fail(function (err) {
                done(err);
            })
        })
    });

    describe('#fillUsedBookInfo', function () {

        it('填充UsedBook对象的bookInfo信息', function (done) {
            bookInfo.getNearUsedBook(0, 1, 'sell').done(function (usedBooks) {
                _.each(usedBooks, function (one) {
                    bookInfo.fillUsedBookInfo(one).done(function (usedBook) {
                        var bookInfo = usedBook.get('info');
                        assert(bookInfo, '填充后的usedBook必须要有info属性');
                        assert.equal(usedBook.get('isbn13'), bookInfo.get('isbn13'), 'ISBN要相等');
                        var query = bookInfo.relation('usedBooks').query();
                        query.equalTo('objectId', usedBook.id).done(function (reUsedBook) {
                            assert.deepEqual(reUsedBook.attributes, usedBook.attributes, '在bookInfo的usedBooks relation里要有对应的UsedBook');
                            done();
                        })
                    }).fail(function (err) {
                        done(err);
                    })
                })
            })
        })
    })

});