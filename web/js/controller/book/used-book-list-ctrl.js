/**
 * Created by wuhaolin on 5/20/15.
 * 二手书列表
 */
"use strict";

//二手书列表
APP.controller('book_usedBookList', function ($scope, $stateParams, UsedBook$, BookRecommend$) {
    $scope.cmd = $stateParams['cmd'];
    $scope.sortWay = '';
    if ($scope.cmd == 'nearCircle') {
        $scope.title = '你附近的书漂流';
        $scope.usedBooks = BookRecommend$.NearCircleBook.circleBooks;
        $scope.loadMore = BookRecommend$.NearCircleBook.loadMore;
        $scope.hasMore = BookRecommend$.NearCircleBook.hasMore;
        $scope.setMajorFilter = BookRecommend$.NearCircleBook.setMajorFilter;
        $scope.getMajorFilter = BookRecommend$.NearCircleBook.getMajorFilter;
    } else if ($scope.cmd == 'nearUsed') {
        $scope.title = '你附近的二手书';
        $scope.usedBooks = BookRecommend$.NearUsedBook.usedBooks;
        $scope.loadMore = BookRecommend$.NearUsedBook.loadMore;
        $scope.hasMore = BookRecommend$.NearUsedBook.hasMore;
        $scope.setMajorFilter = BookRecommend$.NearUsedBook.setMajorFilter;
        $scope.getMajorFilter = BookRecommend$.NearUsedBook.getMajorFilter;
    } else if ($scope.cmd == 'nearNeed') {
        $scope.title = '你附近的求书';
        $scope.usedBooks = BookRecommend$.NearNeedBook.needBooks;
        $scope.loadMore = BookRecommend$.NearNeedBook.loadMore;
        $scope.hasMore = BookRecommend$.NearNeedBook.hasMore;
        $scope.setMajorFilter = BookRecommend$.NearNeedBook.setMajorFilter;
        $scope.getMajorFilter = BookRecommend$.NearNeedBook.getMajorFilter;
    } else if ($scope.cmd == 'isbnCircle') {
        $scope.title = '对应的书漂流';
        $scope.isbn13 = $stateParams['isbn13'];
        $scope.usedBooks = UsedBook$.ISBN_circle.nowEqualISBNCircleBooks;
        $scope.loadMore = UsedBook$.ISBN_circle.loadMoreCircleBookEqualISBN;
        $scope.hasMore = UsedBook$.ISBN_circle.hasMore;
    } else if ($scope.cmd == 'isbnUsed') {
        $scope.title = '对应要卖的旧书';
        $scope.isbn13 = $stateParams['isbn13'];
        $scope.usedBooks = UsedBook$.ISBN_sell.nowEqualISBNUsedBooks;
        $scope.loadMore = UsedBook$.ISBN_sell.loadMoreUsedBookEqualISBN;
        $scope.hasMore = UsedBook$.ISBN_sell.hasMore;
    } else if ($scope.cmd == 'isbnNeed') {
        $scope.title = '需要这本书的同学';
        $scope.isbn13 = $stateParams['isbn13'];
        $scope.usedBooks = UsedBook$.ISBN_need.nowEqualISBNNeedBooks;
        $scope.loadMore = UsedBook$.ISBN_need.loadMoreNeedBookEqualISBN;
        $scope.hasMore = UsedBook$.ISBN_need.hasMore;
    }

    var majorFilter = $stateParams['majorFilter'];
    if (majorFilter && $scope.setMajorFilter) {
        $scope.setMajorFilter(majorFilter);
    }
});