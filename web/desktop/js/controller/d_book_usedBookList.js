/**
 * Created by wuhaolin on 6/13/15.
 */
APP.controller('d_book_usedBookList', function ($scope, BookRecommend$) {
    $scope.cmd = getQueryParameterByName('cmd');
    if ($scope.cmd == 'nearUsed') {
        $scope.title = '你附近的二手书';
        $scope.usedBooks = BookRecommend$.NearUsedBook.usedBooks;
        $scope.loadMore = BookRecommend$.NearUsedBook.loadMore;
        $scope.hasMore = BookRecommend$.NearUsedBook.hasMore;
    } else if ($scope.cmd == 'nearNeed') {
        $scope.title = '你附近的求书';
        $scope.usedBooks = BookRecommend$.NearNeedBook.needBooks;
        $scope.loadMore = BookRecommend$.NearNeedBook.loadMore;
        $scope.hasMore = BookRecommend$.NearNeedBook.hasMore;
    }
    $scope.loadMore();
});
