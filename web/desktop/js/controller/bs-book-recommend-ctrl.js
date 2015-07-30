/**
 * Created by wuhaolin on 7/27/15.
 */
"use strict";

APP.controller('bs_book_recommendCtrl', function ($scope, $controller, $state, BootstrapModalView$) {
    $controller('book_recommendCtrl', {$scope: $scope});
    $scope._setMajorFilterAndLoad();
    $scope.chooseMajor = function () {
        BootstrapModalView$.openChooseMajorModalView(function (major) {
            $state.go('book_recommend', {major: major});
        })
    }
});