/**
 * Created by wuhaolin on 9/8/15.
 */

APP.directive('ionOneStatus', function () {

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

