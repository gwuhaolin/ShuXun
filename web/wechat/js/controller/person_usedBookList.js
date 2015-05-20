/**
 * Created by wuhaolin on 5/20/15.
 *
 */
"use strict";

APP.controller('person_usedBookList', function ($scope, $ionicScrollDelegate, UsedBook$) {
    $scope.UsedBook$ = UsedBook$;
    UsedBook$.loadMyAvosUsedBookList();
    $scope.$on('$ionicView.afterEnter', function () {
        $ionicScrollDelegate.scrollTop(true);
    });
});