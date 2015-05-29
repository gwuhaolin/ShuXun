/**
 * Created by wuhaolin on 5/28/15.
 *
 */
"use strict";

var assert = require('assert');
var _ = require('underscore');
var bookUtil = require('../server/book/bookUtil.js');


describe('book/bookUtil.js', function () {

    it('计算isbn13编码的最后一位校验位', function () {
        var rightIsbn13s = ['9787550249745', '9787508646480', '9787301254561'];
        _.each(rightIsbn13s, function (isbn13) {
            assert.equal(bookUtil.checkCode13(isbn13), isbn13.charAt(12));
        });
    });

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