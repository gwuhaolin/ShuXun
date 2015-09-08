/**
 * Created by wuhaolin on 5/20/15.
 * 主页推荐
 */
"use strict";

APP.controller('book_recommendCtrl', function ($scope, $stateParams) {
    $scope.LatestBook = $scope.BookInfo$.LatestBook;

    //unshift加载和当前设置专业相关的TagBook
    $scope._setMajorFilterAndLoad = function () {
        $scope.major = $stateParams['major'];
        if ($scope.major) {
            $scope.BookRecommend$.NearUsedBook.setTagFilter($scope.major);
            $scope.BookRecommend$.NearNeedBook.setTagFilter($scope.major);
            $scope.BookRecommend$.NearCircleBook.setTagFilter($scope.major);
            $scope.BookRecommend$.NearUser.setMajorFilter($scope.major);
            $scope.BookRecommend$.TagBook.setTag($scope.major);
        } else {
            $scope.BookRecommend$.NearUsedBook.unshiftMajorBook();
            $scope.BookRecommend$.NearNeedBook.unshiftMajorBook();
            $scope.BookRecommend$.NearCircleBook.unshiftMajorBook();
            $scope.BookRecommend$.NearUser.unshiftMajorUser();
            var me = AV.User.current();
            me && $scope.BookRecommend$.TagBook.setTag(me.get('major'));
        }
        $scope.BookRecommend$.TagBook.loadMore();
    };

    $scope.BookRecommend$.NearUser.loadMore();
    $scope.LatestBook.loadMore();
    $scope.BookRecommend$.NearUsedBook.loadMore();
    $scope.BookRecommend$.NearNeedBook.loadMore();
    $scope.BookRecommend$.NearCircleBook.loadMore();
});
