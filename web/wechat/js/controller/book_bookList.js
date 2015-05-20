/**
 * Created by wuhaolin on 5/20/15.
 * 豆瓣图书列表
 */
"use strict";

APP.controller('book_bookList', function ($scope, $stateParams, BookRecommend$, LatestBook$) {
    $scope.title = $stateParams['title'];
    var cmd = $stateParams['cmd'];
    if (cmd == 'tag') {
        var tag = $stateParams['tag'];
        BookRecommend$.TagBook.setTag(tag);
        BookRecommend$.TagBook.loadMore();
        $scope.title = tag;
        $scope.books = BookRecommend$.TagBook.books;
        $scope.loadMore = BookRecommend$.TagBook.loadMore;
        $scope.hasMore = BookRecommend$.TagBook.hasMore;
    } else if (cmd == 'need') {
        $scope.books = BookRecommend$.NearNeedBook.books;
        $scope.loadMore = BookRecommend$.NearNeedBook.loadMore;
        $scope.hasMore = BookRecommend$.NearNeedBook.hasMore;
    } else if (cmd == 'major') {
        $scope.books = BookRecommend$.MajorBook.books;
        $scope.loadMore = BookRecommend$.MajorBook.loadMore;
        $scope.title = BookRecommend$.MajorBook.major;
        $scope.hasMore = BookRecommend$.MajorBook.hasMore;
    } else if (cmd == 'new') {
        $scope.books = LatestBook$.jsonBooks;
        $scope.loadMore = LatestBook$.loadMore;
        $scope.title = '新书速递';
        $scope.hasMore = LatestBook$.hasMore;
    }
});