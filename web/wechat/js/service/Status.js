/**
 * Created by wuhaolin on 5/20/15.
 * 事件流
 */
"use strict";

APP.service('Status$', function ($rootScope, UsedBook$) {
    var that = this;
    var AttrName = ['inboxType', 'message', 'source', 'to', 'usedBook'];

    /**
     * 加载我未读的消息的数量,并且显示在Tab上
     */
    this.loadUnreadStatusesCount = function () {
        var user = AV.User.current();
        if (user) {
            AV.Status.countUnreadStatuses(user, 'newUsedBook').done(function (result) {
                that.NewUsedBookStatus.unreadCount = result['unread'];
                $rootScope.$apply();
            });
            AV.Status.countUnreadStatuses(user, 'newNeedBook').done(function (result) {
                that.NewNeedBookStatus.unreadCount = result['unread'];
                $rootScope.$apply();
            });
            AV.Status.countUnreadStatuses(user, 'private').done(function (result) {
                that.PrivateStatus.unreadCount = result['unread'];
                $rootScope.$apply();
            });
            AV.Status.countUnreadStatuses(user, 'reviewUsedBook').done(function (result) {
                that.ReviewUsedBookStatus.unreadCount = result['unread'];
                $rootScope.$apply();
            });
        }
    };

    this.NewUsedBookStatus = {
        unreadCount: 0,
        avosStatusList: [],
        load: function () {
            var query = AV.Status.inboxQuery(AV.User.current(), 'newUsedBook');
            query.include("usedBook");
            query.include("source");
            query.limit(that.NewUsedBookStatus.unreadCount);
            query.find().done(function (statuses) {
                for (var i = 0; i < statuses.length; i++) {
                    var one = statuses[i];
                    one.jsonUserInfo = avosUserToJson(one.get('source'));
                    one.jsonUsedBook = UsedBook$.avosUsedBookToJson(one.get('usedBook'));
                    that.NewUsedBookStatus.avosStatusList.push(one);
                }
                that.NewUsedBookStatus.unreadCount = 0;
                $rootScope.$apply();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        }
    };

    this.NewNeedBookStatus = {
        unreadCount: 0,
        avosStatusList: [],
        load: function () {
            var query = AV.Status.inboxQuery(AV.User.current(), 'newNeedBook');
            query.include("usedBook");
            query.include("source");
            query.limit(that.NewNeedBookStatus.unreadCount);
            query.find().done(function (statuses) {
                for (var i = 0; i < statuses.length; i++) {
                    var one = statuses[i];
                    one.jsonUserInfo = avosUserToJson(one.get('source'));
                    one.jsonUsedBook = UsedBook$.avosUsedBookToJson(one.get('usedBook'));
                    that.NewNeedBookStatus.avosStatusList.push(one);
                }
                that.NewNeedBookStatus.unreadCount = 0;
                $rootScope.$apply();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        }
    };

    this.PrivateStatus = {
        unreadCount: 0,
        avosStatusList: [],
        load: function () {
            var query = AV.Status.inboxQuery(AV.User.current(), 'private');
            query.include("usedBook");
            query.include("source");
            query.limit(that.PrivateStatus.unreadCount);
            query.find().done(function (statuses) {
                for (var i = 0; i < statuses.length; i++) {
                    var one = statuses[i];
                    one.jsonUserInfo = avosUserToJson(one.get('source'));
                    one.jsonUsedBook = UsedBook$.avosUsedBookToJson(one.get('usedBook'));
                    that.PrivateStatus.avosStatusList.push(one);
                }
                that.PrivateStatus.unreadCount = 0;
                $rootScope.$apply();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        }
    };

    this.ReviewUsedBookStatus = {
        unreadCount: 0,
        avosStatusList: [],
        load: function () {
            var query = AV.Status.inboxQuery(AV.User.current(), 'reviewUsedBook');
            query.include("usedBook");
            query.include("source");
            query.limit(that.ReviewUsedBookStatus.unreadCount);
            query.find().done(function (statuses) {
                for (var i = 0; i < statuses.length; i++) {
                    var one = statuses[i];
                    one.jsonUserInfo = avosUserToJson(one.get('source'));
                    one.jsonUsedBook = UsedBook$.avosUsedBookToJson(one.get('usedBook'));
                    that.ReviewUsedBookStatus.avosStatusList.push(one);
                }
                that.ReviewUsedBookStatus.unreadCount = 0;
                $rootScope.$apply();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        }
    };

    this.avosStatusToJson = function (avosStatus) {
        var re = {};
        for (var i = 0; i < AttrName.length; i++) {
            re[AttrName[i]] = avosStatus.get(AttrName[i]);
        }
        re.updatedAt = avosStatus.get('updatedAt');
        re.objectId = avosStatus.id;
        return re;
    };

    /**
     * 我发送私信给用户
     * @param receiverObjectId 接受者的avos id
     * @param msg 消息内容
     * @param role 我当前扮演的角色是卖家(=sell)还是买家(=buy)
     * @param usedBookObjectId 当前二手书的AVOS ID(可为空)
     * @returns {AV.Promise}
     */
    this.sendPrivateMsg = function (receiverObjectId, msg, role, usedBookObjectId) {
        var status = new AV.Status(null, msg);
        status.set('to', AV.Object.createWithoutData('_User', receiverObjectId));
        usedBookObjectId && status.set('usedBook', AV.Object.createWithoutData('UsedBook', usedBookObjectId));
        status.set('role', role);
        return AV.Status.sendPrivateStatus(status, receiverObjectId);
    };

    /**
     * 对一本二手书进行评论,评论的内容会被所有人看到
     * @param receiverObjectId 微信通知消息接受者的AVOS Id
     * @param usedBookObjectId 二手书的AVOS id
     * @param msg 评论内容
     * @param role 我当前扮演的角色是卖家(=sell)还是买家(=buy)
     * @returns {AV.Promise}
     */
    this.reviewUsedBook = function (receiverObjectId, usedBookObjectId, msg, role) {
        var rePromise = new AV.Promise(null);
        var query = new AV.Query('UsedBook');
        query.select('owner');
        query.get(usedBookObjectId).done(function (avosUsedBook) {
            var bookOwner = avosUsedBook.get('owner');
            query = new AV.Query(AV.User);
            query.equalTo('objectId', bookOwner.id);
            var status = new AV.Status(null, msg);
            status.query = query;
            status.inboxType = 'reviewUsedBook';
            status.set('to', AV.Object.createWithoutData('_User', receiverObjectId));
            status.set('role', role);
            status.set('usedBook', avosUsedBook);
            status.send().done(function (status) {
                rePromise.resolve(status);
            }).fail(function (err) {
                rePromise.reject(err);
            })
        }).fail(function (err) {
            rePromise.reject(err);
        });
        return rePromise;
    };

    /**
     * 获得关于一本书的所有评价
     * @param usedBookId
     * @returns {*|{}|AV.Promise}
     */
    this.getStatusList_reviewBook = function (usedBookId) {
        var query = new AV.Query('_Status');
        var usedBook = AV.Object.createWithoutData('UsedBook', usedBookId);
        query.equalTo('inboxType', 'reviewUsedBook');
        query.equalTo('usedBook', usedBook);
        return query.find();
    };

    /**
     * @param avosUserId 对方用户的id
     * @param avosUsedBookId 二手书的id 两个有这个参数就只显示关于这部二手书的私信,否则显示所有的私信
     * @returns {*|{}|AV.Query}
     */
    this.makeQueryStatusList_twoUser = function (avosUserId, avosUsedBookId) {
        if (avosUserId) {
            var me = AV.User.current();
            var he = AV.Object.createWithoutData('_User', avosUserId);
            var query1 = new AV.Query('_Status');
            query1.equalTo('source', me);
            query1.equalTo('to', he);
            var query2 = new AV.Query('_Status');
            query2.equalTo('source', he);
            query2.equalTo('to', me);
            if (avosUsedBookId) {
                var avosUsedBook = AV.Object.createWithoutData('UsedBook', avosUsedBookId);
                query1.equalTo('usedBook', avosUsedBook);
                query2.equalTo('usedBook', avosUsedBook);
            }
            return AV.Query.or(query1, query2);
        } else {
            return new AV.Error(1, '缺少avosUserId');
        }
    };
});