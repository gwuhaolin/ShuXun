/**
 * Created by wuhaolin on 5/28/15.
 *
 */
"use strict";

var assert = require('assert');
var _ = require('underscore');
var Util = require('./../util.js');
var bookUtil = require('../../server/book/bookUtil.js');


describe('book/bookInfo.js', function () {

    describe('#checkCode13', function () {
        it('计算isbn13编码的最后一位校验位', function () {
            _.each(Util.ISBN_Legal_HasPub, function (isbn13) {
                assert.equal(bookUtil.checkCode13(isbn13), isbn13.charAt(12));
            });
        });
    });

    describe('#genISBN13ByPublisher', function () {
        it('生成一个出版社所有的ISBN13编码', function () {
            var publisherCode = '81115';
            var isbn13s = bookUtil.genISBN13ByPublisher(publisherCode);
            assert.equal(isbn13s.length, Math.pow(10, 13 - 4 - publisherCode.length - 1));
            _.each(isbn13s, function (isbn13) {
                assert.equal(isbn13.substr(0, 4 + publisherCode.length), '9787' + publisherCode);
                assert.equal(bookUtil.checkCode13(isbn13), isbn13.charAt(12));
            });
        });
    });

    describe('#isbn13IsLegal', function () {

        _.each(Util.ISBN_Legal_HasPub, function (isbn13) {
            it(isbn13 + '是合法的', function () {
                assert(bookUtil.isbn13IsLegal(isbn13));
            })
        });

        _.each(Util.ISBN_Illegal_13, function (isbn13) {
            it(isbn13 + '是不合法的', function () {
                assert(!bookUtil.isbn13IsLegal(isbn13));
            })
        });

        _.each(Util.ISBN_Illegal_Not13, function (isbn13) {
            it(isbn13 + '是不合法的', function () {
                assert(!bookUtil.isbn13IsLegal(isbn13));
            })
        });
    });

});