/**
 * Created by wuhaolin on 5/20/15.
 *
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
        var user = jsonToAvosUser(jsonUser);
        user.set('username', jsonUser.unionId);
        user.set('password', jsonUser.unionId);
        return user.signUp(null);
    };

    /**
     * 获得当前用户的地理位置
     * 如果没有用户或用户没有位置就返回null
     */
    this.getCurrentUserLocation = function () {
        var user = that.getCurrentAvosUser();
        if (user) {
            return user.get('location');
        }
        return null;
    };

    /**
     * 获得当前AVOS用户,如果当前用户不存在返回null
     * @returns {*|AV.Object}
     */
    this.getCurrentAvosUser = function () {
        return AV.User.current();
    };

    /**
     * 获得当前JSON格式的用户,如果当前用户不存在返回null
     * @returns {null}
     */
    this.getCurrentJsonUser = function () {
        var avosUser = that.getCurrentAvosUser();
        if (avosUser) {
            return avosUserToJson(avosUser);
        }
        return null;
    };

    /**
     * 我关注一个用户
     * @param userObjectId 用户的AVOS ID
     */
    this.followUser = function (userObjectId) {
        var me = that.getCurrentAvosUser();
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
        var me = that.getCurrentAvosUser();
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
        jsonUserList: [],
        loadMore: function () {
            var query = AV.User.current().followeeQuery();
            query.include('followee');
            query.skip(that.Followee.jsonUserList.length);
            query.limit(10);
            if(that.Followee._majorFilter){
                var userQuery = new AV.Query('_User');
                userQuery.equalTo('major', that.Followee._majorFilter);
                query.matchesQuery('followee',userQuery);
            }
            query.find().done(function (followees) {
                if (followees.length > 0) {
                    for (var i = 0; i < followees.length; i++) {
                        that.Followee.jsonUserList.push(avosUserToJson(followees[i]));
                    }
                } else {
                    that.Followee.hasMoreFlag = false;
                }
                $rootScope.$apply();
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
                that.Followee.jsonUserList.length = 0;
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
        jsonUserList: [],
        loadMore: function () {
            var query = AV.User.current().followerQuery();
            query.include('follower');
            query.skip(that.Follower.jsonUserList.length);
            query.limit(10);
            if(that.Follower._majorFilter){
                var userQuery = new AV.Query('_User');
                userQuery.equalTo('major', that.Follower._majorFilter);
                query.matchesQuery('follower',userQuery);
            }
            query.find().done(function (followers) {
                if (followers.length > 0) {
                    for (var i = 0; i < followers.length; i++) {
                        that.Follower.jsonUserList.push(avosUserToJson(followers[i]));
                    }
                } else {
                    that.Follower.hasMoreFlag = false;
                }
                $rootScope.$apply();
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
                that.Follower.jsonUserList.length = 0;
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
     * 替换微信默认的头像的大小
     * @param avatarUrl 头像的url
     * @param size 替换后获得的大小 有0、46、64、96、132数值可选，0代表640*640正方形头像
     * @returns {string} 替换后头像的url
     */
    this.changeWechatAvatarSize = function (avatarUrl, size) {
        if (avatarUrl) {
            return avatarUrl.substring(0, avatarUrl.length - 1) + size;
        } else {
            return null;
        }
    };

    /**
     * 使用微信写在cookie里的unionId登入,
     * 登陆成功后回加载未读消息数量
     * @param unionId 微信ID
     * @returns {*|AV.Promise}
     */
    this.loginWithUnionId = function (unionId) {
        var rePromise = new AV.Promise(null);
        if (unionId) {
            AV.User.logIn(unionId, unionId).done(function (me) {
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
});