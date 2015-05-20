/**
 * Created by wuhaolin on 5/20/15.
 *
 */
"use strict";

APP.controller('person_needBookList', function ($scope, $ionicScrollDelegate, UsedBook$) {
    $scope.UsedBook$ = UsedBook$;
    UsedBook$.loadMyAvosNeedBookList();
    $scope.$on('$ionicView.afterEnter', function () {
        $ionicScrollDelegate.scrollTop(true);
    });
});