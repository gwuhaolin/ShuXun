/**
 * Created by wuhaolin on 5/20/15.
 * 主页推荐
 */
"use strict";

APP.controller('ion_book_recommend', function ($scope, $controller, $state, $ionicModal) {
    $controller('book_recommendCtrl', {$scope: $scope});

    $scope.$on('$ionicView.afterEnter', $scope._setMajorFilterAndLoad);
    //去制定专业的推荐页面
    $scope.IonicModalView$.registerChooseMajorModalView($scope, function (major) {
        $state.go('book.recommend', {major: major});
    });
    //按照专业筛选
    $scope.IonicModalView$.registerChooseBookTagModalView($scope, function (bookTag) {
        $state.go('book.book-list', {cmd: 'tag', tag: bookTag});
    });
});