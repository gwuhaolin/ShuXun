/**
 * Created by wuhaolin on 5/20/15.
 * 用户列表
 */
"use strict";

//用户列表
APP.controller('ion_userList', function ($scope, $controller) {
    $controller('userList', {$scope: $scope});
    //按照专业筛选
    $scope.IonicModalView$.registerChooseMajorModalView($scope, function (major) {
        $scope.setMajorFilter(major);
    });
});