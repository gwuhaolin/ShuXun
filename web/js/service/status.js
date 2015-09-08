/**
 * Created by wuhaolin on 5/20/15.
 * 事件流
 */
"use strict";

APP.service('Status$', function ($rootScope, $state) {
    var that = this;

    /**
     * 我的未读消息总数
     * @returns {number}
     */
    this.unreadCountSum = function () {
        return that.NewUsedBookStatus.unreadCount + that.NewNeedBookStatus.unreadCount
            + that.PrivateStatus.unreadCount + that.ReviewUsedBookStatus.unreadCount;
    };

    /**
     * 加载我未读的消息的数量,并且显示在Tab上
     */
    this.loadUnreadStatusesCount = function () {
        var user = AV.User.current();
        if (user) {
            AV.Status.countUnreadStatuses(user, 'newUsedBook').done(function (result) {
                that.NewUsedBookStatus.unreadCount = result['unread'];
                $rootScope.$digest();
            });
            AV.Status.countUnreadStatuses(user, 'newNeedBook').done(function (result) {
                that.NewNeedBookStatus.unreadCount = result['unread'];
                $rootScope.$digest();
            });
            AV.Status.countUnreadStatuses(user, 'private').done(function (result) {
                that.PrivateStatus.unreadCount = result['unread'];
                $rootScope.$digest();
            });
            AV.Status.countUnreadStatuses(user, 'reviewUsedBook').done(function (result) {
                that.ReviewUsedBookStatus.unreadCount = result['unread'];
                $rootScope.$digest();
            });
        }
    };

    this.NewUsedBookStatus = {
        unreadCount: 0,
        statusList: [],
        load: function () {
            var query = AV.Status.inboxQuery(AV.User.current(), 'newUsedBook');
            query.include("usedBook");
            query.include("source");
            query.limit(that.NewUsedBookStatus.unreadCount);
            query.find().done(function (statuses) {
                that.NewUsedBookStatus.statusList.length = 0;
                for (var i = 0; i < statuses.length; i++) {
                    var one = statuses[i];
                    one.attributes = one.data;//坑爹的AVOS对应AV.Status把attributes属性换成了data
                    that.NewUsedBookStatus.statusList.push(one);
                }
                that.NewUsedBookStatus.unreadCount = 0;
                $rootScope.$digest();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        }
    };

    this.NewNeedBookStatus = {
        unreadCount: 0,
        statusList: [],
        load: function () {
            var query = AV.Status.inboxQuery(AV.User.current(), 'newNeedBook');
            query.include("usedBook");
            query.include("source");
            query.limit(that.NewNeedBookStatus.unreadCount);
            query.find().done(function (statuses) {
                that.NewNeedBookStatus.statusList.length = 0;
                for (var i = 0; i < statuses.length; i++) {
                    var one = statuses[i];
                    one.attributes = one.data;
                    that.NewNeedBookStatus.statusList.push(one);
                }
                that.NewNeedBookStatus.unreadCount = 0;
                $rootScope.$digest();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        }
    };

    this.PrivateStatus = {
        unreadCount: 0,
        statusList: [],
        load: function () {
            var query = AV.Status.inboxQuery(AV.User.current(), 'private');
            query.include("usedBook");
            query.include("source");
            query.limit(that.PrivateStatus.unreadCount);
            query.find().done(function (statuses) {
                that.PrivateStatus.statusList.length = 0;
                for (var i = 0; i < statuses.length; i++) {
                    var one = statuses[i];
                    one.attributes = one.data;
                    that.PrivateStatus.statusList.push(one);
                }
                that.PrivateStatus.unreadCount = 0;
                $rootScope.$digest();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        }
    };

    this.ReviewUsedBookStatus = {
        unreadCount: 0,
        statusList: [],
        load: function () {
            var query = AV.Status.inboxQuery(AV.User.current(), 'reviewUsedBook');
            query.include("usedBook");
            query.include("source");
            query.limit(that.ReviewUsedBookStatus.unreadCount);
            query.find().done(function (statuses) {
                that.ReviewUsedBookStatus.statusList.length = 0;
                for (var i = 0; i < statuses.length; i++) {
                    var one = statuses[i];
                    one.attributes = one.data;
                    that.ReviewUsedBookStatus.statusList.push(one);
                }
                that.ReviewUsedBookStatus.unreadCount = 0;
                $rootScope.$digest();
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            })
        }
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
     * 我想要买一本
     * @param usedBook
     */
    that.requestSellUsedBook = function (usedBook) {
        that.sendPrivateMsg(usedBook.get('owner').id, 'Hi，这本书我买了，给我留着！', 'buy', usedBook.id).done(function () {
            alert('成功向主人发送购买请求，请等待Ta的回复');
            $state.go('book.one-book', {isbn13: usedBook.get('isbn13')});
        }).fail(function (err) {
            alert(err.message);
        })
    };

    /**
     * 我正好有这本 ta发的求书
     * @param usedBook
     */
    that.requestNeedUsedBook = function (usedBook) {
        that.sendPrivateMsg(usedBook.get('owner').id, 'Hi，我正好有这本书要转让，给你留着！', 'sell', usedBook.id).done(function () {
            alert('成功告诉Ta你正好有这本书要卖，请等待Ta的回复');
            $state.go('book.one-book', {isbn13: usedBook.get('isbn13')});
        }).fail(function (err) {
            alert(err.message);
        })
    };

    /**
     * 我想要 Ta发的书漂流
     * @param usedBook
     */
    that.requestCircleUsedBook = function (usedBook) {
        that.sendPrivateMsg(usedBook.get('owner').id, 'Hi，好想要这本书，不能不留给我～', 'buy', usedBook.id).done(function () {
            alert('成功告诉Ta你想要这本书，请等待Ta的回复');
            $state.go('book.one-book', {isbn13: usedBook.get('isbn13')});
        }).fail(function (err) {
            alert(err.message);
        })
    };


    /**
     * 对一本二手书进行评论,评论的内容会被所有人看到
     * @param receiverObjectId 微信通知消息接受者的AVOS Id
     * @param usedBookObjectId 二手书的AVOS id
     * @param msg 评论内容
     * @param role 我当前扮演的角色是卖家(=sell)还是买家(=buy)
     * @returns {AV.Promise} AVOS Status
     */
    this.reviewUsedBook = function (receiverObjectId, usedBookObjectId, msg, role) {
        var rePromise = new AV.Promise(null);
        var query = new AV.Query(Model.UsedBook);
        query.select('owner');
        query.get(usedBookObjectId).done(function (avosUsedBook) {
            var bookOwner = avosUsedBook.get('owner');
            query = new AV.Query(Model.User);
            query.equalTo('objectId', bookOwner.id);
            var status = new AV.Status(null, msg);
            status.query = query;
            status.inboxType = 'reviewUsedBook';
            status.set('to', AV.Object.createWithoutData('_User', receiverObjectId));
            status.set('role', role);
            status.set('usedBook', avosUsedBook);
            status.send().done(function (status) {
                status.attributes = status.data;
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
        var query = new AV.Query(Model.Status);
        var usedBook = AV.Object.createWithoutData('UsedBook', usedBookId);
        query.equalTo('inboxType', 'reviewUsedBook');
        query.equalTo('usedBook', usedBook);
        query.include('source', 'to');
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
            var query1 = new AV.Query(Model.Status);
            query1.equalTo('source', me);
            query1.equalTo('to', he);
            var query2 = new AV.Query(Model.Status);
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

    /**
     * 清空我的收件箱
     * @param inboxType 邮件类型
     * @param usedBookObjectId 对应的二手书
     * @param receiverObjectId 消息接受者
     */
    this.cleanMyInbox = function (inboxType, usedBookObjectId, receiverObjectId) {
        var me = AV.User.current();
        var inboxQuery = AV.Status.inboxQuery(me, inboxType);
        usedBookObjectId && inboxQuery.equalTo('usedBook', AV.Object.createWithoutData('UsedBook', usedBookObjectId));
        receiverObjectId && inboxQuery.equalTo('source', AV.Object.createWithoutData('_User', receiverObjectId));
        inboxQuery.find().done(function () {
            that.loadUnreadStatusesCount();
        })
    };

});