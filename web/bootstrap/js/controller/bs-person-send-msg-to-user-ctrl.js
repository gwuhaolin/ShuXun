/**
 * Created by wuhaolin on 5/20/15.
 * 给用户发送信息
 */
"use strict";

APP.controller('bs_person_sendMsgToUser', function ($scope, $controller, Status$) {
    $controller('person_sendMsgToUser', {$scope: $scope});

    $scope.$on('NewStatusLoaded', function () {
        //$ionicScrollDelegate.scrollBottom(true);
    });
});