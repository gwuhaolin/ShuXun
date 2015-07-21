/**
 * Created by wuhaolin on 5/31/15.
 * 显示用户消息
 */
"use strict";
APP.directive('dUserInfo', function (User$) {
    function link($scope) {
        $scope.User$ = User$;
        //加载它的二手书的数量
        function loadHeUsedBookNumber() {
            if ($scope.user) {
                $scope.userUsedBookNumber = 0;
                var he = AV.Object.createWithoutData('_User', $scope.user.id);
                var query = he.relation('usedBooks').query();
                query.equalTo('role', 'sell');
                query.count().done(function (number) {
                    $scope.userUsedBookNumber = number;
                    $scope.$apply();
                });
            }
        }

        //加载它的求书的数量
        function loadHeNeedBookNumber() {
            if ($scope.user) {
                $scope.userNeedBookNumber = 0;
                var he = AV.Object.createWithoutData('_User', $scope.user.id);
                var query = he.relation('usedBooks').query();
                query.equalTo('role', 'need');
                query.count().done(function (number) {
                    $scope.userNeedBookNumber = number;
                    $scope.$apply();
                });
            }
        }

        //判断是否我已经关注ta
        $scope.isMyFollowee = false;
        function loadIsMyFollowee() {
            if ($scope.user && AV.User.current()) {
                var query = AV.User.current().followeeQuery();
                query.equalTo('followee', AV.Object.createWithoutData('_User', $scope.user.id));
                query.count().done(function (number) {
                    $scope.isMyFollowee = (number == 1);
                    $scope.$apply();
                })
            }
        }

        //加载我的两本书
        $scope.heUsedBookList = [];
        function loadHeTwoUsedBook() {
            if ($scope.user) {
                var he = AV.Object.createWithoutData('_User', $scope.user.id);
                var query = he.relation('usedBooks').query();
                query.limit(2);
                query.find().done(function (usedBookList) {
                    $scope.heUsedBookList = usedBookList;
                    $scope.$apply();
                });
            }
        }

        $scope.$watch(function () {
            if ($scope.user) {
                return $scope.user.attributes;
            } else {
                return null;
            }
        }, function () {
            loadIsMyFollowee();
            if ($scope.hideUsedBook == null || $scope.hideUsedBook == false) {
                loadHeUsedBookNumber();
                loadHeNeedBookNumber();
                !$scope.hideUsedBook && loadHeTwoUsedBook();
            }
        });
        $scope.$on('FollowSomeone', function () {
            loadIsMyFollowee();
        });
        $scope.$on('UnfollowSomeone', function () {
            loadIsMyFollowee();
        });
    }

    return {
        restrict: 'E',
        scope: {
            //用户的AVOS objectID
            user: '=',
            //是否隐藏二手书的数量
            hideUsedBook: '=?',
            //当给用户发送私信时,如果要显示当前二手书就传入
            usedBookObjectId: '=?'
        },
        templateUrl: '../mould/userInfo.html',
        link: link
    }
});