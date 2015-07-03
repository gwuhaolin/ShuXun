/**
 * Created by wuhaolin on 6/12/15.
 */
var _ = require('underscore');
var AV = require('leanengine');
var Util = require('../util.js');
Util.initAVOS();
var assert = require('assert');
var Model = require('../../web/js/Model.js');
var InitiativeRecommend = require('../../server/util/initiativeRecommend.js');

var major = '计算机科学与技术';

describe('util/initiativeRecommend.js', function () {

    describe('#getAllUserCountEqualMajor', function () {
        it('获得所有对应专业的用户的数量', function (done) {
            InitiativeRecommend.getAllUserCountEqualMajor(major).done(function (count) {
                assert(count > 0, major + '的同学不止0个');
                done();
            }).fail(function (err) {
                done(err);
            })
        })
    });

    describe('#getAllUserEqualMajor', function () {
        it('获得所有对应专业的用户', function (done) {
            this.timeout(10000);
            InitiativeRecommend.getAllUserEqualMajor(major).done(function (users) {
                InitiativeRecommend.getAllUserCountEqualMajor(major).done(function (sumCount) {
                    assert(users.length == sumCount, '要获得所有的' + major + '专业的用户');
                    done();
                });
            }).fail(function (err) {
                done(err);
            })
        });
    });

    describe('#getAllUsedBookEqualMajor', function () {
        it('获得所有的对应专业的UsedBook', function (done) {
            var role = 'sell';
            InitiativeRecommend.getAllUsedBookEqualMajor(major, role).done(function (usedBooks) {
                assert(usedBooks.length > 0, major + '的书不止0个');
                _.each(usedBooks, function (usedBook) {
                    assert.equal(usedBook.get('role'), role, '指定role');
                });
                InitiativeRecommend.getAllUsedBookCountEqualMajor(major, role).done(function (sumCount) {
                    assert.equal(usedBooks.length, sumCount, '要获得所有对应专业的UsedBook');
                });
                done();
            }).fail(function (err) {
                done(err);
            })
        });
    });

    describe('测试的每种可能initiativeRecommendToOneUser', function () {
        var OpenID_HaoLin = 'ojIHWspkCcUdlXwMGo-sgl9gYEpo';

        it('男 2011 计算机科学与技术', function (done) {
            var user = Model.User.new({
                openId: OpenID_HaoLin,
                sex: 1,
                startSchoolYear: 2011,
                major: '计算机科学与技术'
            });
            InitiativeRecommend.initiativeRecommendToOneUser(user).done(function () {
                done();
            }).fail(function (err) {
                done(err);
            })
        });

        it('女 2011 计算机科学与技术', function (done) {
            var user = Model.User.new({
                openId: OpenID_HaoLin,
                sex: 2,
                startSchoolYear: 2011,
                major: '计算机科学与技术'
            });
            InitiativeRecommend.initiativeRecommendToOneUser(user).done(function () {
                done();
            }).fail(function (err) {
                done(err);
            })
        });

        it('女 2013 经济学', function (done) {
            var user = Model.User.new({
                openId: OpenID_HaoLin,
                sex: 2,
                startSchoolYear: 2013,
                major: '经济学'
            });
            InitiativeRecommend.initiativeRecommendToOneUser(user).done(function () {
                done();
            }).fail(function (err) {
                done(err);
            })
        });

        it('未知性别 2013 经济学', function (done) {
            var user = Model.User.new({
                openId: OpenID_HaoLin,
                startSchoolYear: 2013,
                major: '经济学'
            });
            InitiativeRecommend.initiativeRecommendToOneUser(user).done(function (re) {
                console.log(re);
                done();
            }).fail(function (err) {
                done(err);
            })
        });

        it('未知性别 2009 经济学', function (done) {
            var user = Model.User.new({
                openId: OpenID_HaoLin,
                startSchoolYear: 2009,
                major: '经济学'
            });
            InitiativeRecommend.initiativeRecommendToOneUser(user).done(function () {
                done();
            }).fail(function (err) {
                done(err);
            })
        });
    });

    describe.skip('调用initiativeRecommendToOneUser给所有用户发模板消息推送', function () {
        it('', function (done) {
            this.timeout(10000000);
            var query = new AV.Query(Model.User);
            query.limit(1000);
            query.find().done(function (userList) {
                _.each(userList, function (user, index) {
                    setTimeout(function () {
                        InitiativeRecommend.initiativeRecommendToOneUser(user).done(function (re) {
                            console.info(re);
                            console.info(user.attributes);
                        }).fail(function (err) {
                            console.error(err);
                            console.error(user.attributes);
                        })
                    }, index * 100);
                });
            })
        })
    });

});