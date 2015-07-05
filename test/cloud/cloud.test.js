/**
 * Created by wuhaolin on 7/3/15.
 */
"use strict";
var assert = require('assert');
var AV = require('leanengine');
var _ = require('underscore');
var Util = require('./../util.js');

describe('测试LeanCloud当前测试环境的云函数', function () {

    before(function () {
        Util.initAVOS();
    });

    describe('#getJsonBookByISBN13', function () {

        describe('要获取这些已经出版了的书的信息', function () {
            _.each(Util.ISBN_Legal_HasPub, function (isbn13) {
                it(isbn13, function (done) {
                    AV.Cloud.run('getJsonBookByISBN13', {
                        isbn13: isbn13
                    }).done(function (jsonBook) {
                        assert.equal(jsonBook.isbn13, isbn13);
                        done();
                    }).fail(function (err) {
                        done(err);
                    });
                });
            })
        });

        describe('不要获取这些不合法的isbn13的信息', function () {
            _.each(Util.ISBN_Illegal_13, function (isbn13) {
                it(isbn13, function (done) {
                    AV.Cloud.run('getJsonBookByISBN13', {
                        isbn13: isbn13
                    }).fail(function () {
                        done();
                    });
                });
            })
        });
    });

    describe('#updateMyLocation', function () {
        it('', function (done) {
            var latitude = 1;
            var longitude = 1;
            AV.Cloud.run('updateMyLocation', {
                latitude: latitude,
                longitude: longitude
            }).done(function (user) {
                assert.equal(user.latitude, latitude);
                assert.equal(user.longitude, longitude);
                done();
            }).fail(function (err) {
                done(err);
            })
        });
    });

});
