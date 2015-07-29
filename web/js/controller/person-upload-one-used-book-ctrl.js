/**
 * Created by wuhaolin on 7/29/15.
 * 上传一本二手书
 */
"use strict";

APP.controller('person_uploadOneUsedBook', function ($scope, $state, $stateParams, BookInfo$, UsedBook$, InfoService$) {
    $scope.InfoService$ = InfoService$;
    $scope.isLoading = false;

    //用$scope.usedBookJson.isbn13去豆瓣加载图书信息
    $scope.loadDoubanBookInfo = function () {
        $scope.isLoading = true;
        BookInfo$.getBookInfoByISBN($scope.usedBookJson.isbn13).done(function (bookInfo) {
            $scope.bookInfo = bookInfo;
        }).fail(function () {
            alert('没有找到图书信息,再去搜搜看~');
            $state.go('tab.book_searchList');
        }).always(function () {
            $scope.isLoading = false;
            $scope.$digest();
        });
    };

    $scope.usedBookJson = {
        isbn13: $stateParams.isbn13,
        price: null,
        des: '',
        owner: AV.User.current()
    };
    $scope.usedBookJson.isbn13 && $scope.loadDoubanBookInfo();

    /**
     * @param role 是要卖掉二手书(sell)还是发布需求(need)
     * @param onSuccess 当上传成功时调用
     */
    $scope.saveUsedBook = function (role, onSuccess) {
        $scope.usedBookJson.role = role;
        $scope.isLoading = true;
        var avosUsedBook = Model.UsedBook.new($scope.usedBookJson);
        UsedBook$.saveUsedBook(avosUsedBook).done(function () {
            onSuccess();
        }).fail(function (error) {
            alert(error.message);
        }).always(function () {
            $scope.isLoading = false;
        });
    };

});
