/**
 * Created by wuhaolin on 7/29/15.
 * 上传一本二手书
 */
"use strict";

APP.controller('person_uploadOneUsedBook', function ($scope, $state, $stateParams) {
    $scope.isLoading = false;

    //用$scope.usedBookJson.isbn13去豆瓣加载图书信息
    $scope.loadDoubanBookInfo = function () {
        $scope.isLoading = true;
        $scope.BookInfo$.getBookInfoByISBN($scope.usedBookJson.isbn13).done(function (bookInfo) {
            $scope.bookInfo = bookInfo;
        }).fail(function () {
            alert('没有找到图书信息,再去搜搜看~');
            $state.go('book.search-list');
        }).always(function () {
            $scope.isLoading = false;
            $scope.$digest();
        });
    };

    var role = $stateParams.role;
    if (role === 'sell') {
        $scope.title = '上传要卖的旧书';
    } else if (role === 'need') {
        $scope.title = '发布求书公告';
    } else if (role === 'circle') {
        $scope.title = '分享书漂流';
    }
    $scope.me = AV.User.current();
    $scope.usedBookJson = {
        isbn13: $stateParams.isbn13,
        role: role,
        price: null,
        des: '',
        owner: $scope.me
    };
    $scope.usedBookJson.isbn13 && $scope.loadDoubanBookInfo();

    $scope.submitOnClick = function () {
        $scope.isLoading = true;
        var avosUsedBook = Model.UsedBook.new($scope.usedBookJson);
        $scope.UsedBook$.saveUsedBook(avosUsedBook).done(function () {
        }).fail(function (error) {
            alert(error.message);
        }).always(function () {
            $scope.isLoading = false;
        });
    };

});
