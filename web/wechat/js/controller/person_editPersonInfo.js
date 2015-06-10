/**
 * Created by wuhaolin on 5/20/15.
 * 编辑用户信息
 */
"use strict";

APP.controller('person_editPersonInfo', function ($scope, $state, $ionicHistory, InfoService$, User$, IonicModalView$) {
    //是否对属性进行了修改
    $scope.attrHasChange = false;
    $scope.me = AV.User.current();
    var jsonMe = $scope.me.attributes;
    $scope.userInfo = {
        school: jsonMe.school,
        major: jsonMe.major,
        wechatAlert: jsonMe.wechatAlert,
        startSchoolYear: jsonMe.startSchoolYear
    };

    IonicModalView$.registerChooseSchoolModalView($scope, function (school) {
        $scope.attrHasChange = true;
        $scope.userInfo.school = school;
    });
    IonicModalView$.registerChooseMajorModalView($scope, function (major) {
        $scope.attrHasChange = true;
        $scope.userInfo.major = major;
    });
    $scope.startSchoolYearOptions = InfoService$.startSchoolYearOptions;

    $scope.confirmWechatAlert = function () {
        if ($scope.userInfo.wechatAlert == false) {
            $scope.userInfo.wechatAlert = !window.confirm('关闭后有同学给你发消息时你将收不到通知,确定关闭吗?');
        }
    };

    //点击提交修改时
    $scope.submitOnClick = function () {
        User$.updateMyInfoWithJson($scope.userInfo).done(function () {
            alert('修改成功');
            AV.User.current().fetch();
        }).fail(function (error) {
            alert('修改失败:' + error.message);
        }).always(function () {
            $state.go('tab.person_my');
            $ionicHistory.clearHistory();
        });
    };
});