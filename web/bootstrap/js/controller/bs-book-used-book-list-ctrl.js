/**
 * Created by wuhaolin on 5/20/15.
 * 二手书列表
 */
"use strict";

//二手书列表
APP.controller('bs_book_usedBookList', function ($scope, $controller, BootstrapModalView$) {
    $controller('book_usedBookList', {$scope: $scope});

    //按照专业筛选
    $scope.chooseMajor = function () {
        BootstrapModalView$.openChooseMajorModalView($scope, function (major) {
            $scope.setMajorFilter && $scope.setMajorFilter(major);
        });
    };
});