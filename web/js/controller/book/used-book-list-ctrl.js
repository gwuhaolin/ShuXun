/**
 * Created by wuhaolin on 5/20/15.
 * 二手书列表
 */
"use strict";

//二手书列表
APP.controller('book_usedBookList', function ($scope, $stateParams) {
    $scope.cmd = $stateParams['cmd'];
    $scope.sortWay = '';
    if ($scope.cmd == 'nearCircle') {
        $scope.title = '我附近的书漂流';
        $scope.usedBooks = $scope.BookRecommend$.NearCircleBook.circleBooks;
        $scope.loadMore = $scope.BookRecommend$.NearCircleBook.loadMore;
        $scope.hasMore = $scope.BookRecommend$.NearCircleBook.hasMore;
        $scope.setTagFilter = $scope.BookRecommend$.NearCircleBook.setTagFilter;
        $scope.getTagFilter = $scope.BookRecommend$.NearCircleBook.getTagFilter;
    } else if ($scope.cmd == 'nearUsed') {
        $scope.title = '我附近的二手书';
        $scope.usedBooks = $scope.BookRecommend$.NearUsedBook.usedBooks;
        $scope.loadMore = $scope.BookRecommend$.NearUsedBook.loadMore;
        $scope.hasMore = $scope.BookRecommend$.NearUsedBook.hasMore;
        $scope.setTagFilter = $scope.BookRecommend$.NearUsedBook.setTagFilter;
        $scope.getTagFilter = $scope.BookRecommend$.NearUsedBook.getTagFilter;
    } else if ($scope.cmd == 'nearNeed') {
        $scope.title = '我附近的求书';
        $scope.usedBooks = $scope.BookRecommend$.NearNeedBook.needBooks;
        $scope.loadMore = $scope.BookRecommend$.NearNeedBook.loadMore;
        $scope.hasMore = $scope.BookRecommend$.NearNeedBook.hasMore;
        $scope.setTagFilter = $scope.BookRecommend$.NearNeedBook.setTagFilter;
        $scope.getTagFilter = $scope.BookRecommend$.NearNeedBook.getTagFilter;
    } else if ($scope.cmd == 'isbnCircle') {
        $scope.title = '对应的书漂流';
        $scope.isbn13 = $stateParams['isbn13'];
        $scope.usedBooks = $scope.UsedBook$.ISBN_circle.nowEqualISBNCircleBooks;
        $scope.loadMore = $scope.UsedBook$.ISBN_circle.loadMoreCircleBookEqualISBN;
        $scope.hasMore = $scope.UsedBook$.ISBN_circle.hasMore;
    } else if ($scope.cmd == 'isbnUsed') {
        $scope.title = '对应要卖的旧书';
        $scope.isbn13 = $stateParams['isbn13'];
        $scope.usedBooks = $scope.UsedBook$.ISBN_sell.nowEqualISBNUsedBooks;
        $scope.loadMore = $scope.UsedBook$.ISBN_sell.loadMoreUsedBookEqualISBN;
        $scope.hasMore = $scope.UsedBook$.ISBN_sell.hasMore;
    } else if ($scope.cmd == 'isbnNeed') {
        $scope.title = '需要这本书的同学';
        $scope.isbn13 = $stateParams['isbn13'];
        $scope.usedBooks = $scope.UsedBook$.ISBN_need.nowEqualISBNNeedBooks;
        $scope.loadMore = $scope.UsedBook$.ISBN_need.loadMoreNeedBookEqualISBN;
        $scope.hasMore = $scope.UsedBook$.ISBN_need.hasMore;
    }

    var tagFilter = $stateParams['tagFilter'];
    if (tagFilter && $scope.setTagFilter) {
        $scope.setTagFilter(tagFilter);
    }
});