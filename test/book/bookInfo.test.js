/**
 * Created by wuhaolin on 5/28/15.
 *
 */
"use strict";
var assert = require('assert');
var _ = require('underscore');
var Util = require('./../util.js');
var bookUtil = require('../../server/book/bookInfo.js');
var isbn13s_ok = ['9787511721051', '9787210036944', '9787300093598'];
var isbn13s_no = ['9787511721052', '9787210036945', '9787300093597'];

describe('book/bookInfo.js', function () {

    before(function () {
        Util.initAVOS();
    });

    describe('#queryBookInfoByISBN', function () {

        _.each(isbn13s_ok, function (isbn13) {
            it('必须要查询到这书' + isbn13 + '的信息', function (done) {
                bookUtil.queryBookInfoByISBN(isbn13).done(function (avosBookInfo) {
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
                bookUtil.queryBookInfoByISBN(isbn13).done(function (avosBookInfo) {
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
                bookUtil.hasISBN13Book(isbn13).done(function (re) {
                    assert.deepEqual(re, {has: true, isbn13: isbn13});
                    done();
                }).fail(function (err) {
                    done(err);
                })
            });
        });


        _.each(isbn13s_no, function (isbn13) {
            it(isbn13 + '这书的信息是不可能有的', function (done) {
                bookUtil.hasISBN13Book(isbn13).done(function (re) {
                    assert.deepEqual(re, {has: false, isbn13: isbn13});
                    done();
                }).fail(function (err) {
                    done(err);
                })
            });
        });

    });

});