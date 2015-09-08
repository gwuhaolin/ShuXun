/**
 * Created by wuhaolin on 5/20/15.
 * 豆瓣图书列表
 */
"use strict";

APP.controller('book_bookList', function ($scope, $stateParams) {
    $scope.title = $stateParams['title'];
    var cmd = $stateParams['cmd'];
    if (cmd == 'tag') {
        var tag = $stateParams['tag'];
        var me = AV.User.current();
        if (!tag && me) {
            tag = me.get('major');
        }
        $scope.BookRecommend$.TagBook.setTag(tag);
        $scope.BookRecommend$.TagBook.loadMore();
        $scope.title = tag;
        $scope.books = $scope.BookRecommend$.TagBook.books;
        $scope.loadMore = $scope.BookRecommend$.TagBook.loadMore;
        $scope.hasMore = $scope.BookRecommend$.TagBook.hasMore;
    } else if (cmd == 'latest') {
        $scope.books = $scope.BookInfo$.LatestBook.books;
        $scope.loadMore = $scope.BookInfo$.LatestBook.loadMore;
        $scope.title = '新书速递';
        $scope.hasMore = $scope.BookInfo$.LatestBook.hasMore;
    }
});
