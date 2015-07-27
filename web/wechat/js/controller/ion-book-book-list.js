/**
 * Created by wuhaolin on 5/20/15.
 * 豆瓣图书列表
 */
"use strict";

APP.controller('ion_book_bookList', function ($scope, $stateParams, BookRecommend$, BookInfo$) {
    $scope.title = $stateParams['title'];
    var cmd = $stateParams['cmd'];
    if (cmd == 'tag') {
        var tag = $stateParams['tag'];
        var me = AV.User.current();
        if (!tag && me) {
            tag = me.get('major');
        }
        BookRecommend$.TagBook.setTag(tag);
        BookRecommend$.TagBook.loadMore();
        $scope.title = tag;
        $scope.books = BookRecommend$.TagBook.books;
        $scope.loadMore = BookRecommend$.TagBook.loadMore;
        $scope.hasMore = BookRecommend$.TagBook.hasMore;

        //统计用户行为
        $scope.$on('$ionicView.afterEnter', function () {
            var analyticsSugue = leanAnalytics.browseTag(tag);
            $scope.$on('$ionicView.afterLeave', function () {
                //清空列表提高性能 TODO 不会执行
                BookRecommend$.TagBook.books.length = 0;
                analyticsSugue.send();
            });
        });
    } else if (cmd == 'latest') {
        $scope.books = BookInfo$.LatestBook.books;
        $scope.loadMore = BookInfo$.LatestBook.loadMore;
        $scope.title = '新书速递';
        $scope.hasMore = BookInfo$.LatestBook.hasMore;
    }
});