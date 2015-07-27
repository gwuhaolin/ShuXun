/**
 * Created by wuhaolin on 5/20/15.
 * 豆瓣图书列表
 */
"use strict";

APP.controller('bs_book_bookList', function ($scope, $injector) {
    $injector.invoke(book_bookList, this, {$scope: $scope});
});