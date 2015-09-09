/**
 * Created by wuhaolin on 9/9/15.
 */

APP.directive('bsOneStatus', function () {

    function link($scope) {

    }

    return {
        restrict: 'E',
        scope: {
            status: '='
        },
        templateUrl: 'html/directive/one-status.html',
        link: link
    }
});

