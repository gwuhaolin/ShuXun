/**
 * Created by wuhaolin on 5/20/15.
 * 主页推荐
 */
"use strict";

APP.controller('book_recommend', function ($scope, $state, $stateParams, $ionicModal, BookRecommend$, IonicModalView$, User$, BookInfo$) {
    $scope.User$ = User$;
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
    BookRecommend$.BookTag.load();
    $scope.LatestBook.loadMore();
    BookRecommend$.NearUsedBook.loadMore();
    BookRecommend$.NearNeedBook.loadMore();
    $ionicModal.fromTemplateUrl('template/bookTags.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.bookTagsModalView = modal;
    });
    $scope.$on('$ionicView.afterEnter', load);
    //去制定专业的推荐页面
    IonicModalView$.registerChooseMajorModalView($scope, function (major) {
        $state.go('tab.book_recommend', {major: major});
    });
});