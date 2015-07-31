/**
 * Created by wuhaolin on 5/20/15.
 * 进入认证页面
 * 1.必须在微信里打开该页面
 * 2.不需要必须关注过书循微信号
 */
"use strict";

APP.controller('ion_hello', function ($scope, $state, $stateParams, $ionicHistory, WeChatJS$, User$) {
    $scope.WeChatJS$ = WeChatJS$;
    User$.loginWithUnionId(readCookie('unionId')).done(function () {//尝试使用cookies登入
        $state.go('tab.person_my');
        $ionicHistory.clearHistory();
    });
});