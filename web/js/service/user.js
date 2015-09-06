/**
 * Created by wuhaolin on 5/20/15.
 * 用户
 */
"use strict";

APP.service('User$', function ($rootScope, Status$) {
    var that = this;

    /**
     * 用户注册 用户名=Email
     * @param jsonUser json格式的用户信息
     * @returns {*|AV.Promise}
     */
    this.signUpWithJSONUser = function (jsonUser) {
        var user = Model.User.new(jsonUser);
        return user.signUp(null);
    };

    /**
     * 我关注一个用户
     * @param userObjectId 用户的AVOS ID
     */
    this.followUser = function (userObjectId) {
        var me = AV.User.current();
        if (me) {
            me.follow(userObjectId).done(function () {
                $rootScope.$broadcast('FollowSomeone');
            }).fail(function (err) {
                alert('关注失败:' + err.message);
            })
        } else {
            alert('请先登入');
        }
    };

    /**
     * 我取消关注一个用户
     * @param userObjectId 用户的AVOS ID
     */
    this.unfollowUser = function (userObjectId) {
        var me = AV.User.current();
        if (me) {
            me.unfollow(userObjectId).done(function () {
                $rootScope.$broadcast('UnfollowSomeone');
            }).fail(function (err) {
                alert('取消关注失败:' + err.message);
            })
        } else {
            alert('请先登入');
        }
    };

    this.Followee = {
        users: [],
        loadMore: function () {
            var query = AV.User.current().followeeQuery();
            query.include('followee');
            query.skip(that.Followee.users.length);
            query.limit(10);
            if (that.Followee._majorFilter) {
                var userQuery = new AV.Query(Model.User);
                userQuery.equalTo('major', that.Followee._majorFilter);
                query.matchesQuery('followee', userQuery);
            }
            query.find().done(function (followees) {
                if (followees.length > 0) {
                    //因为这不是通过Model.User查询的所以要挂上avatarUrlWithSize方法
                    for (var i = 0; i < followees.length; i++) {
                        followees[i].avatarUrlWithSize = Model.User.prototype.avatarUrlWithSize;
                    }
                    that.Followee.users.pushUniqueArray(followees);
                } else {
                    that.Followee.hasMoreFlag = false;
                }
                $rootScope.$digest();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            });
        },
        hasMoreFlag: true,
        hasMore: function () {
            return that.Followee.hasMoreFlag;
        },
        _majorFilter: null,
        setMajorFilter: function (major) {
            if (major != that.Followee._majorFilter) {
                that.Followee.users.length = 0;
                that.Followee.hasMoreFlag = true;
                that.Followee._majorFilter = major;
                that.Followee.loadMore();
            }
        },
        getMajorFilter: function () {
            return that.Followee._majorFilter;
        }
    };

    this.Follower = {
        users: [],
        loadMore: function () {
            var query = AV.User.current().followerQuery();
            query.include('follower');
            query.skip(that.Follower.users.length);
            query.limit(10);
            if (that.Follower._majorFilter) {
                var userQuery = new AV.Query(Model.User);
                userQuery.equalTo('major', that.Follower._majorFilter);
                query.matchesQuery('follower', userQuery);
            }
            query.find().done(function (followers) {
                if (followers.length > 0) {
                    //因为这不是通过Model.User查询的所以要挂上avatarUrlWithSize方法
                    for (var i = 0; i < followers.length; i++) {
                        followers[i].avatarUrlWithSize = Model.User.prototype.avatarUrlWithSize;
                    }
                    that.Follower.users.pushUniqueArray(followers);
                } else {
                    that.Follower.hasMoreFlag = false;
                }
                $rootScope.$digest();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            });
        },
        hasMoreFlag: true,
        hasMore: function () {
            return that.Follower.hasMoreFlag;
        },
        _majorFilter: null,
        setMajorFilter: function (major) {
            if (major != that.Follower._majorFilter) {
                that.Follower.users.length = 0;
                that.Follower.hasMoreFlag = true;
                that.Follower._majorFilter = major;
                that.Follower.loadMore();
            }
        },
        getMajorFilter: function () {
            return that.Follower._majorFilter;
        }
    };

    /**
     * 使用微信写在cookie里的unionId登入,
     * 登陆成功后会 1.广播事件UserLoginSuccess 2.加载未读消息数量
     * @param unionId 微信ID
     * @returns {*|AV.Promise}
     */
    this.loginWithUnionId = function (unionId) {
        var rePromise = new AV.Promise(null);
        if (unionId) {
            AV.User.logIn(unionId, unionId).done(function (me) {
                $rootScope.$broadcast('UserLoginSuccess');
                rePromise.resolve(me);
                Status$.loadUnreadStatusesCount();//加载未读消息数量
            }).fail(function (err) {
                rePromise.reject(err);
            })
        } else {
            rePromise.reject('unionId错误');
        }
        return rePromise;
    };

    /**
     * 用户在微信里OAuth后获取用户信息
     * @param code
     * @return {AV.Promise} 如果用户已经关注就返回和User表兼容的JSON格式的用户信息
     * 对于没有关注的用户返回error
     */
    this.getWeChatOAuthUserInfo = function (code) {
        var rePromise = new AV.Promise(null);
        if (code) {
            AV.Cloud.run('getWechatOAuthUserInfo', {
                code: code
            }, null).done(function (jsonUser) {
                createCookie('unionId', jsonUser.username, 365);
                rePromise.resolve(jsonUser);
            }).fail(function (err) {
                rePromise.reject(err);
            });
        } else {
            rePromise.reject('不合法的code');
        }
        return rePromise;
    };

    /**
     * 用户网页里OAuth后获取用户信息
     * @param code
     * @return {AV.Promise} 如果用户已经关注就返回和User表兼容的JSON格式的用户信息
     */
    this.getDesktopOAuthUserInfo = function (code) {
        var rePromise = new AV.Promise(null);
        if (code) {
            AV.Cloud.run('getDesktopOAuthUserInfo', {
                code: code
            }).done(function (jsonUser) {
                createCookie('unionId', jsonUser.username, 365);
                rePromise.resolve(jsonUser);
            }).fail(function (err) {
                rePromise.reject(err);
            });
        } else {
            rePromise.reject('不合法的code');
        }
        return rePromise;
    };

    /**
     * 更新我的个人信息,会先登入后再更新调用时不要再登入了
     * @param jsonUser 符合User表的json格式的个人信息
     */
    this.updateMyInfoWithJson = function (jsonUser) {
        var rePromise = new AV.Promise(null);
        var unionId = readCookie('unionId');
        that.loginWithUnionId(unionId).done(function (me) {
            for (var attrName in jsonUser) {
                me.set(attrName, jsonUser[attrName]);
            }
            me.save().done(function () {
                rePromise.resolve(me);
            }).fail(function (err) {
                rePromise.reject(err);
            })
        }).fail(function (err) {
            rePromise.reject(err);
        });
        return rePromise;
    };


    /**
     * 加载he的要卖的书的数量
     * @param he
     * @returns {AV.Promise} number 书的数量
     */
    this.loadHeUsedBookNumber = function (he) {
        if (he) {
            var query = he.relation('usedBooks').query();
            query.equalTo('alive', true);
            query.equalTo('role', 'sell');
            return query.count();
        } else {
            return AV.Promise.error('require user ');
        }
    };

    /**
     * 加载he的发布的求书的数量
     * @param he
     * @returns {AV.Promise} number 书的数量
     */
    this.loadHeNeedBookNumber = function (he) {
        if (he) {
            var query = he.relation('usedBooks').query();
            query.equalTo('alive', true);
            query.equalTo('role', 'need');
            return query.count();
        } else {
            return AV.Promise.error('require user ');
        }
    };

    /**
     * 加载he的发布的求书的数量
     * @param he
     * @returns {AV.Promise} number 书的数量
     */
    this.loadHeCircleBookNumber = function (he) {
        if (he) {
            var query = he.relation('usedBooks').query();
            query.equalTo('alive', true);
            query.equalTo('role', 'circle');
            return query.count();
        } else {
            return AV.Promise.error('require user ');
        }
    };

    /**
     * 判断是否我已经关注ta
     * @param he
     * @returns {AV.Promise} boolean
     */
    this.loadIsMyFollowee = function (he) {
        var rePromise = new AV.Promise();
        if (he && AV.User.current()) {
            var query = AV.User.current().followeeQuery();
            query.equalTo('followee', AV.Object.createWithoutData('_User', he.id));
            query.count().done(function (number) {
                rePromise.resolve(number == 1);
            }).fail(function (err) {
                rePromise.reject(err);
            })
        } else {
            rePromise.resolve(false);
        }
        return rePromise;
    }
});