/**
 * Created by wuhaolin on 6/2/15.
 */

APP.controller('d_book_recommend', function ($scope, BookRecommend$, BookInfo$, User$) {
    $scope.major = getQueryParameterByName('major');
    if (!$scope.major && AV.User.current()) {
        $scope.major = AV.User.current().get('major');
    }
    $scope.User$ = User$;
    $scope.BookRecommend$ = BookRecommend$;
    $scope.LatestBook = BookInfo$.LatestBook;
    if ($scope.major) {
        BookRecommend$.NearUsedBook.setMajorFilter($scope.major);
        BookRecommend$.NearNeedBook.setMajorFilter($scope.major);
        BookRecommend$.NearUser.setMajorFilter($scope.major);
        BookRecommend$.TagBook.setTag($scope.major);
        BookRecommend$.TagBook.loadMore();
    } else {
        BookRecommend$.NearUsedBook.unshiftMajorBook();
        BookRecommend$.NearNeedBook.unshiftMajorBook();
        BookRecommend$.NearUser.unshiftMajorUser();
    }
    BookRecommend$.NearUser.loadMore();
    BookRecommend$.BookTag.load();
    $scope.LatestBook.loadMore();
    BookRecommend$.NearUsedBook.loadMore();
    BookRecommend$.NearNeedBook.loadMore();
});