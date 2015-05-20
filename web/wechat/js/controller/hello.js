/**
 * Created by wuhaolin on 5/20/15.
 *
 */
"use strict";

APP.controller('hello', function ($scope, $state, $stateParams, $ionicHistory, WeChatJS$, User$) {
    User$.loginWithUnionId(readCookie('unionId')).done(function () {//尝试使用cookies登入
        $state.go('tab.person_my');
        $ionicHistory.clearHistory();
    });
    $scope.OAuthURL = WeChatJS$.getOAuthURL();
});