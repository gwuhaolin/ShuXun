/**
 * Created by wuhaolin on 7/28/15.
 */
"use strict";

APP.directive('bs-infinite-scroll', function ($window) {

    return {
        restrict: 'E',
        scope: {
            onInfinite: '&'
        },
        link: function ($scope, $element) {
            $element.addClass('col-xs-12');
            var e = $element[0];

            $window.on('scroll', function () {
                if ($window.scrollTop >= e.scrollHeight) {
                    $scope.onInfinite();
                }
            });
        }
    }
});