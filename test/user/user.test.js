/**
 * Created by wuhaolin on 7/3/15.
 */
"use strict";
var assert = require('assert');
var Util = require('./../util.js');
var User = require('../../server/user/user.js');

describe('user/user.js', function () {

    before(function () {
        Util.initAVOS();
    });

    describe('#getUserByUnionID', function () {
        it('获取吴浩麟的信息', function (done) {
            User.getUserByUnionID(Util.WuHaolin.unionId).done(function (user) {
                assert.equal(user.get('username'), Util.WuHaolin.unionId, 'unionId');
                assert.equal(user.get('openId'), Util.WuHaolin.openId, 'openId');
                done();
            }).fail(function (err) {
                done(err);
            })
        });

        it('获取error_unionId的信息', function (done) {
            User.getUserByUnionID('error_unionId').done(function (user) {
                assert.equal(user, null, '不可能获得到用户的信息');
                done();
            }).fail(function (err) {
                done(err);
            })
        })
    });

});

