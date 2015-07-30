/**
 * Created by wuhaolin on 7/28/15.
 */
"use strict";

APP.directive('bsInfiniteScroll', function () {

    function link($scope) {
        $scope.msg = '加载更多';
        $scope.loadMoreOnClick = function () {
            $scope.onInfinite();
            $scope.msg = '加载中...';
            setTimeout(function () {
                $scope.msg = '加载更多';
                $scope.$digest();
            }, 2500);
        }
    }

    return {
        restrict: 'E',
        scope: {
            onInfinite: '&'
        },
        templateUrl: 'html/directive/load-more.html',
        link: link
    }
});