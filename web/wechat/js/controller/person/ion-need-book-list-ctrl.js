/**
 * Created by wuhaolin on 5/20/15.
 * 求书列表
 */
"use strict";

APP.controller('ng_person_needBookList', function ($scope, $ionicScrollDelegate, UsedBook$) {
    $scope.UsedBook$ = UsedBook$;
    $scope.$on('$ionicView.afterEnter', function () {
        $ionicScrollDelegate.scrollTop(true);
    });
});