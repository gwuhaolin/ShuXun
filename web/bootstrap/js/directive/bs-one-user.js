/**
 * Created by wuhaolin on 7/28/15.
 */
"use strict";

APP.directive('bsOneUser', function (User$) {

    function link($scope) {
        //加载它的二手书的数量
        function loadHeUsedBookNumber() {
            User$.loadHeUsedBookNumber($scope.user).done(function (number) {
                $scope.user.userUsedBookNumber = number;
                $scope.$digest();
            });
        }

        //加载它的求书的数量
        function loadHeNeedBookNumber() {
            User$.loadHeNeedBookNumber($scope.user).done(function (number) {
                $scope.user.userNeedBookNumber = number;
                $scope.$digest();
            });
        }

        $scope.$watch(function () {
            return $scope.user;
        }, function () {
            loadHeUsedBookNumber();
            loadHeNeedBookNumber();
        });

    }

    return {
        restrict: 'E',
        scope: {
            user: '=',
            imageSize: '@',
            avatarSize: '@',
            margin: '@',
            popoverPlacement: '@'
        },
        templateUrl: 'html/directive/one-user.html',
        link: link
    }
});