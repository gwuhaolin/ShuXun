/**
 * Created by wuhaolin on 5/20/15.
 * 展示一本书详细信息
 */
"use strict";

APP.controller('ion_book_oneBook', function ($scope, $controller, $ionicModal) {
    $controller('book_oneBook', {$scope: $scope});

    //显示作者介绍
    $scope.showAuthorIntro = function () {
        var title = $scope.bookInfo.attributes.author.toString();
        var pre = $scope.bookInfo.attributes.author_intro;
        $scope.IonicModalView$.alertTitleAndPreModalView(title, pre);
    };
    //显示出版信息
    $scope.showPubInfo = function () {
        var title = '出版信息';
        var bookJson = $scope.bookInfo.attributes;
        var pre = '作者:' + bookJson.author.toString() +
            '\n出版社:' + bookJson.publisher +
            '\n出版年:' + bookJson.pubdate +
            '\n页数:' + bookJson.pages +
            '\n定价:' + bookJson.price +
            '\n装帧:' + bookJson.binding +
            '\nISBN:' + bookJson.isbn13 +
            '\n目录:\n' + bookJson.catalog;
        $scope.IonicModalView$.alertTitleAndPreModalView(title, pre);
    };

    //显示图书简介
    $scope.showSummary = function () {
        var title = '图书简介';
        var pre = $scope.bookInfo.attributes.summary;
        $scope.IonicModalView$.alertTitleAndPreModalView(title, pre);
    };

    //统计用户行为
    $scope.$on('$ionicView.afterEnter', function () {
        var analyticsSugue = leanAnalytics.browseBookInfo($scope.isbn13);
        $scope.$on('$ionicView.afterLeave', function () {
            analyticsSugue.send();
        });
    });
});