/**
 * Created by wuhaolin on 7/27/15.
 */
"use strict";

APP.controller('bs_book_recommendCtrl', function ($scope, $controller, $state, BootstrapModalView$, WechatNews$) {
    $controller('book_recommendCtrl', {$scope: $scope});
    $scope.WechatNews$ = WechatNews$;
    WechatNews$.loadMore();
    $scope._setMajorFilterAndLoad();
    $scope.chooseMajor = function () {
        BootstrapModalView$.openChooseMajorModalView(function (major) {
            $state.go('book.recommend', {major: major});
        })
    };
    $scope.SEO$.setSEO('图书推荐');
});