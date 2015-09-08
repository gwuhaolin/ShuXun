/**
 * Created by wuhaolin on 5/20/15.
 * 一本二手书的信息
 */
"use strict";

APP.controller('ion_book_oneUsedBook', function ($scope, $controller) {
    $controller('book_oneUsedBook', {$scope: $scope});

    //统计用户行为
    $scope.$on('$ionicView.afterEnter', function () {
        var analyticsSugue = leanAnalytics.browseUsedBook($scope.usedBookObjectId);
        $scope.$on('$ionicView.afterLeave', function () {
            analyticsSugue.send();
        });
    });
});