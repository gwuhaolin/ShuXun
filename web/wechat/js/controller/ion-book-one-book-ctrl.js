/**
 * Created by wuhaolin on 5/20/15.
 * 展示一本书详细信息
 */
"use strict";

APP.controller('ion_book_oneBook', function ($scope, $controller, $ionicModal, IonicModalView$, WeChatJS$) {
    $controller('book_oneBook', {$scope: $scope});

    $scope.WeChatJS$ = WeChatJS$;
    //显示作者介绍
    $scope.showAuthorIntro = function () {
        var title = $scope.book['author'].toString();
        var pre = $scope.book['author_intro'];
        IonicModalView$.alertTitleAndPreModalView(title, pre);
    };
    //显示出版信息
    $scope.showPubInfo = function () {
        var title = '出版信息';
        var b = $scope.book;
        var pre = '作者:' + b['author'].toString() +
            '\n出版社:' + b['publisher'] +
            '\n出版年:' + b['pubdate'] +
            '\n页数:' + b['pages'] +
            '\n定价:' + b['price'] +
            '\n装帧:' + b['binding'] +
            '\nISBN:' + b['isbn13'] +
            '\n目录:\n' + b['catalog'];
        IonicModalView$.alertTitleAndPreModalView(title, pre);
    };

    //显示图书简介
    $scope.showSummary = function () {
        var title = '图书简介';
        var pre = $scope.book.summary;
        IonicModalView$.alertTitleAndPreModalView(title, pre);
    };

    //统计用户行为
    $scope.$on('$ionicView.afterEnter', function () {
        var analyticsSugue = leanAnalytics.browseBookInfo($scope.isbn13);
        $scope.$on('$ionicView.afterLeave', function () {
            analyticsSugue.send();
        });
    });
});