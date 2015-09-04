/**
 * Created by wuhaolin on 5/20/15.
 * 给用户发送信息
 */
"use strict";

APP.controller('ion_person_sendMsgToUser', function ($scope, $controller, $ionicScrollDelegate, Status$) {
    $controller('person_sendMsgToUser', {$scope: $scope});

    $scope.$on('NewStatusLoaded', function () {
        $ionicScrollDelegate.scrollBottom(true);
    });

    var autoTimer;
    //自动刷新拿去新信息,模仿真实聊天
    $scope.$on('$ionicView.afterEnter', function () {
        autoTimer = setInterval(function () {
            Status$.makeQueryStatusList_twoUser($scope.receiverObjectId, $scope.msg.usedBookObjectId).count().done(function (count) {
                if (count > $scope.statusList.length) {
                    $scope.loadMoreStatus();
                }
            });
        }, 1000);
    });
    $scope.$on('$ionicView.afterLeave', function () {
        clearInterval(autoTimer);
        Status$.cleanMyInbox($scope.msg.inboxType, $scope.msg.usedBookObjectId, $scope.receiverObjectId);
    });
});