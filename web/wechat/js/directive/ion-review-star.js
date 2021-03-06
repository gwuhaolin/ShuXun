/**
 * Created by wuhaolin on 5/31/15.
 * 星星评分
 */
"use strict";

APP.directive('ionReviewStar', function () {
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
});