/**
 * Created by wuhaolin on 5/20/15.
 * 用户注册
 */
"use strict";

APP.controller('signUp', function ($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicModal, InfoService$, User$, Status$, IonicModalView$) {
    //是否正在加载中..
    $scope.isLoading = true;
    //调用微信接口获取用户信息
    var wechatAOuthCode = $stateParams['code'];
    var nextState = 'tab.person_my';
    User$.getOAuthUserInfo(wechatAOuthCode).done(function (userInfo) {
        $scope.isLoading = false;
        $scope.userInfo = userInfo;
        User$.loginWithUnionId(userInfo.unionId).done(function () {//已经注册过
            Status$.loadUnreadStatusesCount();//加载未读消息数量
            $state.go(nextState);
            $ionicHistory.clearHistory();
            User$.updateMyInfoWithJson(userInfo);//更新微信信息
        });
        $scope.$apply();
    }).fail(function () {//用户还没有关注
        alert('要先关注书循微信号哦');
        window.location.href = 'http://mp.weixin.qq.com/s?__biz=MzAwMDQwMjMxNg==&mid=205566574&idx=1&sn=5784b3b5f4d870ca4715c2dd56d8f01e#rd';
    });

    IonicModalView$.registerChooseSchoolModalView($scope, function (school) {
        $scope.userInfo['school'] = school;
    });

    IonicModalView$.registerChooseMajorModalView($scope, function (major) {
        $scope.userInfo['major'] = major;
    });

    $scope.startSchoolYearOptions = InfoService$.startSchoolYearOptions;

    //点击注册时
    $scope.submitOnClick = function () {
        $scope.isLoading = true;
        User$.signUpWithJSONUser($scope.userInfo).done(function () {
            $state.go(nextState);
            $ionicHistory.clearHistory();
        }).fail(function (error) {
            alert(error.message);
        }).always(function () {
            $scope.isLoading = false;
            $scope.$apply();
        })
    };

});