/**
 * Created by wuhaolin on 5/20/15.
 * 用户注册
 */
"use strict";

APP.controller('ion_signUp', function ($scope, $timeout, $state, $stateParams, $ionicHistory) {
    //是否正在加载中..
    $scope.isLoading = true;
    //调用微信接口获取用户信息
    var wechatAOuthCode = $stateParams['code'];
    var nextState = 'person.my';
    $scope.User$.getWeChatOAuthUserInfo(wechatAOuthCode).done(function (userInfo) {
        $scope.isLoading = false;
        $scope.userInfo = userInfo;
        $scope.$digest();
        $scope.User$.loginWithUnionId(userInfo.username).done(function () {//已经注册过
            $scope.Status$.loadUnreadStatusesCount();//加载未读消息数量
            $state.go(nextState);
            $ionicHistory.clearHistory();
            $scope.User$.updateMyInfoWithJson(userInfo);//更新微信信息
        });
    }).fail(function () {//用户还没有关注
        $scope.WeChatJS$.tellUserGoWechat();
    });

    $scope.IonicModalView$.registerChooseSchoolModalView($scope, function (school) {
        $scope.userInfo.school = school;
    });

    $scope.IonicModalView$.registerChooseMajorModalView($scope, function (major) {
        $scope.userInfo.major = major;
    });

    $scope.startSchoolYearOptions = $scope.InfoService$.startSchoolYearOptions;

    //点击注册时
    $scope.submitOnClick = function () {
        $scope.isLoading = true;
        $scope.User$.signUpWithJSONUser($scope.userInfo).done(function () {
            $state.go(nextState);
            $ionicHistory.clearHistory();
        }).fail(function (error) {
            alert(error.message);
        }).always(function () {
            $scope.isLoading = false;
            $scope.$digest();
        })
    };

});