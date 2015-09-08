/**
 * Created by wuhaolin on 5/20/15.
 * 给用户发送信息
 */
"use strict";

APP.controller('person_sendMsgToUser', function ($scope, $state, $stateParams) {
    $scope.receiverObjectId = $stateParams['receiverObjectId'];//消息接受者的AVOS ID
    $scope.isLoading = false;
    $scope.msg = {
        inboxType: $stateParams['inboxType'],//必须
        role: $stateParams['role'],//我当前是买家还是卖家,必须
        sendMsg: '',//必须
        usedBookObjectId: $stateParams['usedBookObjectId']//在私信下为空
    };

    //当前聊天模式
    $scope.nowModel = function () {
        if ($scope.msg.inboxType == 'private') {//发私信
            if ($scope.msg.role == 'sell') {
                return '回应卖家的私信';
            } else if ($scope.msg.role == 'buy') {
                return '给图书主人发私信';
            }
        } else if ($scope.msg.inboxType == 'reviewUsedBook') {//评价二手书
            if ($scope.msg.role == 'sell') {
                return '回复买家对旧书的评论';
            } else if ($scope.msg.role == 'buy') {
                return '对Ta的旧书发表评论';
            }
        }
    };

    //加载用户信息
    AV.Object.createWithoutData('_User', $scope.receiverObjectId).fetch().done(function (user) {
        $scope.user = user;
        $scope.$digest();
    });

    //加载聊天记录
    $scope.statusList = [];
    $scope.loadMoreStatus = function () {
        var query = $scope.Status$.makeQueryStatusList_twoUser($scope.receiverObjectId, $scope.msg.usedBookObjectId);
        query.skip($scope.statusList.length);
        query.find().done(function (statusList) {
            $scope.statusList.pushUniqueArray(statusList);
            $scope.$broadcast('NewStatusLoaded');
            $scope.$digest();
        });
    };

    //常用快捷回复
    $scope.commonReplayWords = [];
    if ($scope.msg.role == 'sell') {//我是卖家
        $scope.commonReplayWords = ['求微信号', '成交', '不能再便宜了', '这本书已经卖出去了'];
    } else {//我是买家
        $scope.commonReplayWords = ['求微信号', '成交', '可以再便宜点吗?', '你在什么地方?', '书有破损吗?'];
    }

    //加载二手书信息
    if ($scope.msg.usedBookObjectId) {
        $scope.usedBook = new Model.UsedBook();
        $scope.usedBook.id = $scope.msg.usedBookObjectId;
        $scope.usedBook.fetch().done(function () {
            $scope.$digest();
        });
    }

    //发出消息
    $scope.sendOnClick = function () {
        $scope.isLoading = true;
        var promise;
        if ($scope.msg.inboxType == 'private') {
            promise = $scope.Status$.sendPrivateMsg($scope.receiverObjectId, $scope.msg.sendMsg, $scope.msg.role, $scope.msg.usedBookObjectId);
        } else if ($scope.msg.inboxType == 'reviewUsedBook') {
            promise = $scope.Status$.reviewUsedBook($scope.receiverObjectId, $scope.msg.usedBookObjectId, $scope.msg.sendMsg, $scope.msg.role);
        }
        promise.done(function () {
            $scope.statusList.push(Model.Status.new({
                message: $scope.msg.sendMsg
            }));
            $scope.$broadcast('NewStatusLoaded');
        }).fail(function (err) {
            alert('发送失败:' + JSON.stringify(err));
        }).always(function () {
            $scope.isLoading = false;
            $scope.msg.sendMsg = '';
            $scope.$digest();
        });
    };
});