/**
 * Created by wuhaolin on 5/20/15.
 * 图书搜索
 */
"use strict";

//图书搜索
APP.controller('ion_book_searchList', function ($scope, $timeout, $state, $stateParams) {

    var keyword = $stateParams['keyword'];
    if (keyword) {//如果url里附带keyword参数就自动执行搜索
        $scope.SearchBook$.keyword = keyword;
        $scope.SearchBook$.searchBtnOnClick();
    }

    $scope.scanQRBtnOnClick = function () {
        $scope.WeChatJS$.scanQRCode(function (code) {
            if (code && code.length >= 10 && code.length <= 13) {
                $state.go('book.one-book', {isbn13: code});
            } else {
                alert('不合法的ISBN号');
            }
        });
    };
});