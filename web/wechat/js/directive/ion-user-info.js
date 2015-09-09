/**
 * Created by wuhaolin on 5/31/15.
 * 一个用户的信息
 */
"use strict";

APP.directive('ionUserInfo', function () {
    function link($scope) {
        $scope.AV = AV;
        //加载它的二手书的数量
        function loadHeUsedBookNumber() {
            $scope.$root.User$.loadHeUsedBookNumber($scope.user).done(function (number) {
                $scope.user.userUsedBookNumber = number;
                $scope.$digest();
            });
        }

        //加载它的求书的数量
        function loadHeNeedBookNumber() {
            $scope.$root.User$.loadHeNeedBookNumber($scope.user).done(function (number) {
                $scope.user.userNeedBookNumber = number;
                $scope.$digest();
            });
        }

        //加载它的求书的数量
        function loadHeCircleBookNumber() {
            $scope.$root.User$.loadHeCircleBookNumber($scope.user).done(function (number) {
                $scope.user.userCircleBookNumber = number;
                $scope.$digest();
            });
        }

        //判断是否我已经关注ta
        function loadIsMyFollowee() {
            $scope.$root.User$.loadIsMyFollowee($scope.user).done(function (is) {
                $scope.isMyFollowee = is;
                $scope.$digest();
            });
        }

        /**
         * 判断是否本人是我自己
         * @returns {boolean}
         */
        $scope.isMe = function () {
            return $scope.user.id == AV.User.current().id;
        };

        $scope.$watch(function () {
            return $scope.user;
        }, function () {
            loadIsMyFollowee();
            if (!$scope.hideUsedBook) {
                loadHeUsedBookNumber();
                loadHeNeedBookNumber();
                loadHeCircleBookNumber();
            }
        });
        $scope.$on('FollowSomeone', function () {
            loadIsMyFollowee();
        });
        $scope.$on('UnfollowSomeone', function () {
            loadIsMyFollowee();
        })
    }

    return {
        restrict: 'E',
        scope: {
            //用户的AVOS objectID
            user: '=',
            //是否隐藏二手书的数量
            hideUsedBook: '=?',
            //是否隐藏功能按钮
            hideActionButtons: '=?',
            //当给用户发送私信时,如果要显示当前二手书就传入
            usedBookObjectId: '=?'
        },
        templateUrl: 'html/directive/one-user.html',
        link: link
    }
});