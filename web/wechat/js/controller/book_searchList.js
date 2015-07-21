/**
 * Created by wuhaolin on 5/20/15.
 * 图书搜索
 */
"use strict";

//图书搜索
APP.controller('book_searchList', function ($scope, $timeout, $state, $stateParams, SearchBook$, WeChatJS$) {
    $scope.SearchBook$ = SearchBook$;

    var keyword = $stateParams['keyword'];
    if (keyword) {//如果url里附带keyword参数就自动执行搜索
        SearchBook$.keyword = keyword;
        SearchBook$.searchBtnOnClick();
    }

    $scope.scanQRBtnOnClick = function () {
        WeChatJS$.scanQRCode(function (code) {
            if (code && code.length >= 10 && code.length <= 13) {
                $state.go('tab.book_oneBook', {isbn13: code});
            } else {
                alert('不合法的ISBN号');
            }
        });
    };

    $scope.$on('$ionicView.afterLeave', function () {
        //清空列表提高性能 TODO 不会执行
        SearchBook$.books.length = 0;
        SearchBook$.keyword = '';
    });
});