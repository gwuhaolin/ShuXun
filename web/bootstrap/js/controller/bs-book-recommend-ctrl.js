/**
 * Created by wuhaolin on 5/20/15.
 * 主页推荐
 */
"use strict";

APP.controller('bs_bookRecommendCtrl', function ($scope, $stateParams, BookRecommend$, BookInfo$) {
    $scope.BookRecommend$ = BookRecommend$;
    $scope.LatestBook = BookInfo$.LatestBook;

    function load() {
        $scope.major = $stateParams['major'];
        if ($scope.major) {
            BookRecommend$.NearUsedBook.setMajorFilter($scope.major);
            BookRecommend$.NearNeedBook.setMajorFilter($scope.major);
            BookRecommend$.NearUser.setMajorFilter($scope.major);
            BookRecommend$.TagBook.setTag($scope.major);
        } else {
            BookRecommend$.NearUsedBook.unshiftMajorBook();
            BookRecommend$.NearNeedBook.unshiftMajorBook();
            BookRecommend$.NearUser.unshiftMajorUser();
            var me = AV.User.current();
            me && BookRecommend$.TagBook.setTag(me.get('major'));
        }
        BookRecommend$.TagBook.loadMore();
    }

    BookRecommend$.NearUser.loadMore();
    $scope.LatestBook.loadMore();
    BookRecommend$.NearUsedBook.loadMore();
    BookRecommend$.NearNeedBook.loadMore();
});