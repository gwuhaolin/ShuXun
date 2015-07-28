/**
 * Created by wuhaolin on 5/20/15.
 * 展示一本书详细信息
 */
"use strict";

APP.controller('bs_book_oneBook', function ($scope, $controller, DoubanBook$) {
    $controller('book_oneBook', {$scope: $scope});

    $scope.BookReview = DoubanBook$.BookReview;
    $scope.$watch(function () {
        return $scope.book;
    }, function () {
        if ($scope.book) {
            $scope.BookReview.clear();
            $scope.BookReview.nowBookId = $scope.book.id;
            $scope.BookReview.loadMore();
        }
    });

});