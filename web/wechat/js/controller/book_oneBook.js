/**
 * Created by wuhaolin on 5/20/15.
 * 展示一本书详细信息
 */
"use strict";

APP.controller('book_oneBook', function ($scope, $state, $stateParams, $ionicModal, DoubanBook$, WeChatJS$, InfoService$, UsedBook$, IonicModalView$, BusinessSite$, User$) {
    $scope.User$ = User$;
    //////////// 豆瓣图书信息 /////////
    $scope.isbn13 = $stateParams.isbn13;
    $scope.book = null;
    //目前是否正在加载数据
    $scope.isLoading = true;
    DoubanBook$.getBookByISBD($scope.isbn13, function (json) {
        if (json) {
            json.image = json.image.replace('mpic', 'lpic');//大图显示
            $scope.book = json;
            $scope.isbn13 = json.isbn13;
            $scope.isLoading = false;
            $scope.$apply();
            //加载电商联盟信息
            BusinessSite$.getBusinessInfoByISBN(json.isbn13).done(function (infos) {
                $scope.businessInfos = infos;
                $scope.$apply();
            });
        } else {
            alert('没有找到图书信息,再去搜搜看~');
            $state.go('tab.book_searchList');
        }
    });

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

    //////////// 二手书信息 /////////
    $scope.UsedBook$ = UsedBook$;
    UsedBook$.ISBN_sell.getUsedBookNumberEqualISBN($scope.isbn13).done(function (number) {
        //对应的图书有多少本二手书
        $scope.usedBookNumber = number;
    });
    UsedBook$.ISBN_sell.loadMoreUsedBookEqualISBN($scope.isbn13);//先加载5个

    //////////// 求书信息 /////////
    UsedBook$.ISBN_need.getNeedBookNumberEqualISBN($scope.isbn13).done(function (number) {
        //对应的图书有多少本二手书
        $scope.needBookNumber = number;
    });
    UsedBook$.ISBN_need.loadMoreNeedBookEqualISBN($scope.isbn13);//先加载5个

    $scope.WeChatJS$ = WeChatJS$;
});