/**
 * Created by wuhaolin on 5/31/15.
 * 一个用户的信息
 */
APP.directive('userInfo', function (WeChatJS$, User$) {
    function link($scope) {
        $scope.AV = AV;
        $scope.WeChatJS$ = WeChatJS$;
        $scope.User$ = User$;
        //加载它的二手书的数量
        function loadHeUsedBookNumber() {
            if ($scope.user) {
                $scope.user.userUsedBookNumber = 0;
                var he = AV.Object.createWithoutData('_User', $scope.user.id);
                var query = he.relation('usedBooks').query();
                query.equalTo('role', 'sell');
                query.count().done(function (number) {
                    $scope.user.userUsedBookNumber = number;
                    $scope.$apply();
                });
            }
        }

        //加载它的求书的数量
        function loadHeNeedBookNumber() {
            if ($scope.user) {
                $scope.user.userNeedBookNumber = 0;
                var he = AV.Object.createWithoutData('_User', $scope.user.id);
                var query = he.relation('usedBooks').query();
                query.equalTo('role', 'need');
                query.count().done(function (number) {
                    $scope.user.userNeedBookNumber = number;
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

        /**
         * 判断是否本人是我自己
         * @returns {boolean}
         */
        $scope.isMe = function () {
            return $scope.user.id == AV.User.current().id;
        };

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
            //当给用户发送私信时,如果要显示当前二手书就传入
            usedBookObjectId: '=?'
        },
        templateUrl: 'temp/tool/userInfoTemplate.html',
        link: link
    }
});