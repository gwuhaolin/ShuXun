/**
 * Created by wuhaolin on 5/20/15.
 * 主页推荐
 */
"use strict";

APP.controller('book_recommendCtrl', function ($scope, $stateParams, BookRecommend$, User$, BookInfo$) {
    $scope.User$ = User$;
    $scope.BookRecommend$ = BookRecommend$;
    $scope.LatestBook = BookInfo$.LatestBook;

    //unshift加载和当前设置专业相关的TagBook
    $scope._setMajorFilterAndLoad = function () {
        $scope.major = $stateParams['major'];
        if ($scope.major) {
            BookRecommend$.NearUsedBook.setTagFilter($scope.major);
            BookRecommend$.NearNeedBook.setTagFilter($scope.major);
            BookRecommend$.NearCircleBook.setTagFilter($scope.major);
            BookRecommend$.NearUser.setMajorFilter($scope.major);
            BookRecommend$.TagBook.setTag($scope.major);
        } else {
            BookRecommend$.NearUsedBook.unshiftMajorBook();
            BookRecommend$.NearNeedBook.unshiftMajorBook();
            BookRecommend$.NearCircleBook.unshiftMajorBook();
            BookRecommend$.NearUser.unshiftMajorUser();
            var me = AV.User.current();
            me && BookRecommend$.TagBook.setTag(me.get('major'));
        }
        BookRecommend$.TagBook.loadMore();
    };

    BookRecommend$.NearUser.loadMore();
    $scope.LatestBook.loadMore();
    BookRecommend$.NearUsedBook.loadMore();
    BookRecommend$.NearNeedBook.loadMore();
    BookRecommend$.NearCircleBook.loadMore();
});
