/**
 * Created by wuhaolin on 5/20/15.
 * 用户列表
 */
"use strict";

//用户列表
APP.controller('bs_userList', function ($scope, $controller, BootstrapModalView$) {
    $controller('userList', {$scope: $scope});
    $scope.loadMore();
    //按照专业筛选
    $scope.chooseMajor = function () {
        BootstrapModalView$.openChooseMajorModalView(function (major) {
            $scope.setMajorFilter && $scope.setMajorFilter(major);
        });
    };
    $scope.SEO$.setSEO($scope.users);
});