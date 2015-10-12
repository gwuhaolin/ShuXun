/**
 * Created by wuhaolin on 5/20/15.
 * 展示一本书详细信息
 */
"use strict";

APP.controller('bs_book_oneBook', function ($scope, $controller) {
    $controller('book_oneBook', {$scope: $scope});

    $scope.BookReview = $scope.DoubanBook$.BookReview;
    $scope.$watch(function () {
        return $scope.bookInfo;
    }, function () {
        if ($scope.bookInfo) {
            $scope.SEO$.setSEO($scope.bookInfo);
        }
    });

});