/**
 * Created by wuhaolin on 6/2/15.
 */

APP.controller('d_book_recommend', function ($scope, BookRecommend$, BookInfo$) {
    $scope.BookRecommend$ = BookRecommend$;
    $scope.BookInfo$ = BookInfo$;
    BookInfo$.LatestBook.loadMore();
    BookRecommend$.NearUsedBook.loadMore();
    BookRecommend$.NearNeedBook.loadMore();
    BookRecommend$.MajorBook.loadMore();
});