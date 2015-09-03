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
        template: '<div class="row"><div class="col-xs-12 text-center"><button class="btn btn-info btn-lg" style="margin: 10px" ng-bind="msg" ng-click="loadMoreOnClick()"></button> </div> </div>',
        link: link
    }
});