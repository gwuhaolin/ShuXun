/**
 * Created by wuhaolin on 7/28/15.
 */
"use strict";

APP.directive('bsOneUser', function () {

    function link($scope) {
        if (!$scope.popoverPlacement) {
            $scope.popoverPlacement = 'right';
        }
        if (!$scope.imageSize) {
            $scope.imageSize = 64;
        }
        if (!$scope.avatarSize) {
            $scope.avatarSize = 64;
        }
        if (!$scope.margin) {
            $scope.margin = 5;
        }
    }

    return {
        restrict: 'E',
        scope: {
            user: '=',
            imageSize: '@?',//px default=64
            avatarSize: '@?',//px default=64
            margin: '@?',//px default=5
            popoverPlacement: '@?'//default=right
        },
        templateUrl: 'html/directive/one-user.html',
        link: link
    }
});