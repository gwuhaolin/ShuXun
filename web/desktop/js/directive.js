/**
 * Created by wuhaolin on 3/27/15.
 * 自定义指令
 */
"use strict";

/**
 * 显示用户消息
 */

APP.directive('dUserInfo', function (User$, UsedBook$) {
    function link($scope) {
        $scope.User$ = User$;
        //加载它的二手书的数量
        function loadHeUsedBookNumber() {
            if ($scope.jsonUserInfo) {
                $scope.jsonUserInfo.userUsedBookNumber = 0;
                var he = AV.Object.createWithoutData('_User', $scope.jsonUserInfo.objectId);
                var query = he.relation('usedBooks').query();
                query.equalTo('role', 'sell');
                query.count().done(function (number) {
                    $scope.jsonUserInfo.userUsedBookNumber = number;
                    $scope.$apply();
                });
            }
        }

        //加载它的求书的数量
        function loadHeNeedBookNumber() {
            if ($scope.jsonUserInfo) {
                $scope.jsonUserInfo.userNeedBookNumber = 0;
                var he = AV.Object.createWithoutData('_User', $scope.jsonUserInfo.objectId);
                var query = he.relation('usedBooks').query();
                query.equalTo('role', 'need');
                query.count().done(function (number) {
                    $scope.jsonUserInfo.userNeedBookNumber = number;
                    $scope.$apply();
                });
            }
        }

        //判断是否我已经关注ta
        $scope.isMyFollowee = false;
        function loadIsMyFollowee() {
            if ($scope.jsonUserInfo && AV.User.current()) {
                var query = AV.User.current().followeeQuery();
                query.equalTo('followee', AV.Object.createWithoutData('_User', $scope.jsonUserInfo.objectId));
                query.count().done(function (number) {
                    $scope.jsonUserInfo.isMyFollowee = (number == 1);
                    $scope.$apply();
                })
            }
        }

        //加载我的两本书
        $scope.heJsonUsedBookList = [];
        function loadHeTwoUsedBook() {
            if ($scope.jsonUserInfo) {
                var he = AV.Object.createWithoutData('_User', $scope.jsonUserInfo.objectId);
                var query = he.relation('usedBooks').query();
                query.limit(2);
                query.find().done(function (avosUsedBookList) {
                    $scope.heJsonUsedBookList = [];
                    for (var i = 0; i < avosUsedBookList.length; i++) {
                        $scope.heJsonUsedBookList.push(UsedBook$.avosUsedBookToJson(avosUsedBookList[i]));
                    }
                    $scope.$apply();
                });
            }
        }

        $scope.$watch(function () {
            return $scope.jsonUserInfo;
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
            jsonUserInfo: '=',
            //是否隐藏二手书的数量
            hideUsedBook: '=?',
            //当给用户发送私信时,如果要显示当前二手书就传入
            usedBookObjectId: '=?'
        },
        templateUrl: 'temp/tool/userInfoTemplate.html',
        link: link
    }
});