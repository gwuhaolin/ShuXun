/**
 * Created by wuhaolin on 5/20/15.
 * 我上传的二手书列表
 */
"use strict";

APP.controller('person_usedBookList', function ($scope, $ionicScrollDelegate, UsedBook$) {
    $scope.UsedBook$ = UsedBook$;
    UsedBook$.loadMyUsedBookList();
    $scope.$on('$ionicView.afterEnter', function () {
        $ionicScrollDelegate.scrollTop(true);
    });
});