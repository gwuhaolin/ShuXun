/**
 * Created by wuhaolin on 5/20/15.
 * 一个用户的主页
 */
"use strict";

APP.controller('bs_userHome', function ($scope, $controller) {
    $controller('userHome', {$scope: $scope});
});
