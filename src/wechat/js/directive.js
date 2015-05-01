/**
 * Created by wuhaolin on 3/27/15.
 *
 */
"use strict";

/**
 * 星星评分
 */
APP.directive('reviewStar', function () {
    function link($scope, $element) {
        var numStars = $scope.numStars, score = $scope.score, numRaters = $scope.numRaters;
        var colorStarHtmlTemp = '<i class="icon ion-ios-star energized"></i>',
            emptyStarHtmlTemp = '<i class="icon ion-ios-star-outline"></i>';
        $element.append('<i>' + score + '分&nbsp</i>');
        $element.append('<i>' + numRaters + '人参与&nbsp</i>');
        for (var i = 1; i <= 5; i++) {
            var oneStar;
            if (i <= numStars) {
                oneStar = angular.element(colorStarHtmlTemp).clone();
            } else {
                oneStar = angular.element(emptyStarHtmlTemp).clone();
            }
            $element.append(oneStar);
        }
    }

    return {
        restrict: 'E',
        scope: {
            //要显示的星星数,整数
            numStars: '@',
            //详细分值
            score: '@',
            //总评分人数
            numRaters: '@'
        },
        link: link
    }
})

/**
 * 显示用户消息
 */

    .directive('userInfo', function (WeChatJS$, User$) {
        function link($scope) {
            $scope.WeChatJS$ = WeChatJS$;
            $scope.User$ = User$;

            //判断是否我已经关注ta
            $scope.isMyFollowee = false;
            function loadIsMyFollowee() {
                if ($scope.jsonUserInfo) {
                    var query = AV.User.current().followeeQuery();
                    query.equalTo('followee', AV.Object.createWithoutData('_User', $scope.jsonUserInfo.objectId));
                    query.count().done(function (number) {
                        $scope.isMyFollowee = (number == 1);
                        $scope.$apply();
                    })
                }
            }

            $scope.$watch(function () {
                return $scope.jsonUserInfo;
            }, function () {
                loadIsMyFollowee();
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
                jsonUserInfo: '=',
                userUsedBookNumber: '='
            },
            templateUrl: 'temp/tool/userInfoTemplate.html',
            link: link
        }
    })

/**
 * 三本书排成一行
 */
    .directive('doubanBookOneLine', function () {
        return {
            restrict: 'E',
            scope: {
                //三本图书的信息
                jsonBooksInfo: '='
            },
            templateUrl: 'temp/tool/doubanBookOneLineTemplate.html',
            link: function (scope) {
                scope.showNumber = Math.floor(document.body.clientWidth / 80);
            }
        }
    })

    .directive('usedBookOneLine', function () {
        return {
            restrict: 'E',
            scope: {
                //三本图书的信息
                jsonBooksInfo: '='
            },
            templateUrl: 'temp/tool/usedBookOneLineTemplate.html',
            link: function (scope) {
                scope.showNumber = Math.floor(document.body.clientWidth / 80);
            }
        }
    })

    .directive('oneUsedBook', function () {
        return {
            restrict: 'E',
            scope: {
                //三本图书的信息
                jsonUsedBook: '='
            },
            templateUrl: 'temp/tool/oneUsedBookTemplate.html'
        }
    });
