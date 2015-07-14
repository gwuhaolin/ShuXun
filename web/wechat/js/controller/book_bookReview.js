/**
 * Created by wuhaolin on 5/20/15.
 * 豆瓣书评
 */
"use strict";

APP.controller('book_bookReview', function ($scope, $stateParams, $ionicHistory, DoubanBook$) {
    $scope.BookReview = DoubanBook$.BookReview;
    $scope.BookReview.nowBookId = $stateParams['doubanBookId'];
    $scope.title = $stateParams['bookTitle'] + ' 书评';
    $scope.$on('$ionicView.afterLeave', function () {
        $scope.BookReview.clear();
    });
    $scope.goBack= function () {
        $ionicHistory.goBack();
    }
});