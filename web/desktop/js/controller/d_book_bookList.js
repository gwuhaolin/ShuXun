/**
 * Created by wuhaolin on 6/11/15.
 */
APP.controller('d_book_bookList', function ($scope, BookRecommend$, BookInfo$) {
    var cmd = getQueryParameterByName('cmd');
    if (cmd == 'tag') {
        var tag = getQueryParameterByName('tag');
        BookRecommend$.TagBook.setTag(tag);
        BookRecommend$.TagBook.loadMore();
        $scope.title = tag;
        $scope.books = BookRecommend$.TagBook.books;
        $scope.loadMore = BookRecommend$.TagBook.loadMore;
        $scope.hasMore = BookRecommend$.TagBook.hasMore;
    } else if (cmd == 'latest') {
        $scope.books = BookInfo$.LatestBook.books;
        $scope.loadMore = BookInfo$.LatestBook.loadMore;
        $scope.title = '新书速递';
        $scope.hasMore = BookInfo$.LatestBook.hasMore;
        BookInfo$.LatestBook.loadMore();
    }
});