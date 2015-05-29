/**
 * Created by wuhaolin on 5/28/15.
 *
 */
"use strict";
var AV = require('leanengine');
var assert = require('assert');
var bookUtil = require('../server/book/bookInfo.js');
var APP_ID = process.env['LC_APP_ID'] || 'kusn9e3cp5znt5lic9fufqfmsvsibsoaejpah089x6v2n7e0';
var APP_KEY = process.env['LC_APP_KEY'] || 'nt5l8v4n4m08zxttpt7upqxwgt6oy47lzb3f8c4juf34otfm';
var MASTER_KEY = process.env['LC_APP_MASTER_KEY'] || '6bc7zdxg90xi909pwtikora9uq2o2zvq402m2gfmb4w7tej2';
var isbn13 = '9787511721051';

describe('book/bookInfo.js', function () {

    before(function () {
        AV.initialize(APP_ID, APP_KEY, MASTER_KEY);
    });

    it('queryBookInfoByISBN', function (done) {
        bookUtil.queryBookInfoByISBN(isbn13).done(function (avosBookInfo) {
            if (avosBookInfo) {
                done();
            } else {
                done('没有获得');
            }
        }).fail(function (err) {
            done(err);
        })
    });

    it('hasISBN13Book', function (done) {
        bookUtil.hasISBN13Book(isbn13).done(function (re) {
            assert.deepEqual(re, {has: true, isbn13: isbn13});
            done();
        }).fail(function (err) {
            done(err);
        })
    })
});