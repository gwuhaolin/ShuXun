/**
 * Created by wuhaolin on 3/27/15.
 *
 */
"use strict";

angular.module('AppDirective', [], null)

/**
 * 星星评分
 */
    .directive('reviewStar', function () {
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

    .directive('userInfo', function (WeChatJS$) {
        function link($scope) {
            $scope.WeChatJS$ = WeChatJS$;
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
            templateUrl: 'temp/tool/threeDoubanBookOneLineTemplate.html',
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
            templateUrl: 'temp/tool/threeUsedBookOneLineTemplate.html',
            link: function (scope) {
                scope.showNumber = Math.floor(document.body.clientWidth / 80);
            }
        }
    });
