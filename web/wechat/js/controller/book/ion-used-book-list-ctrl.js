/**
 * Created by wuhaolin on 5/20/15.
 * 二手书列表
 */
"use strict";

//二手书列表
APP.controller('ion_book_usedBookList', function ($scope, $controller, IonicModalView$) {
    $controller('book_usedBookList', {$scope: $scope});

    //按照专业筛选
    IonicModalView$.registerChooseMajorModalView($scope, function (major) {
        $scope.setMajorFilter && $scope.setMajorFilter(major);
    });

});