/**
 * Created by wuhaolin on 5/20/15.
 * 二手书列表
 */
"use strict";

//二手书列表
APP.controller('bs_book_usedBookList', function ($scope, $controller) {
    $controller('book_usedBookList', {$scope: $scope});
    $scope.loadMore();
    //按照专业筛选
    $scope.chooseBookTag = function () {
        $scope.BootstrapModalView$.openChooseBookTagModalView(function (bookTag) {
            $scope.setTagFilter && $scope.setTagFilter(bookTag);
        });
    };
    $scope.SEO$.setSEO($scope.usedBooks);
});