/**
 * Created by wuhaolin on 5/20/15.
 * 主页推荐
 */
"use strict";

APP.controller('book_recommend', function ($scope, $ionicModal, BookRecommend$, User$, LatestBook$) {
    $scope.User$ = User$;
    $scope.BookRecommend$ = BookRecommend$;
    $scope.LatestBook$ = LatestBook$;
    LatestBook$.loadMore();
    BookRecommend$.MajorBook.loadMore();
    BookRecommend$.NearUsedBook.loadMore();
    BookRecommend$.NearNeedBook.loadMore();
    $ionicModal.fromTemplateUrl('template/bookTags.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.bookTagsModalView = modal;
    });
});