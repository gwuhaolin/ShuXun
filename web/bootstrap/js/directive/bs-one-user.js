/**
 * Created by wuhaolin on 7/28/15.
 */
"use strict";

APP.directive('bsOneUser', function () {

    return {
        restrict: 'E',
        scope: {
            user: '=',
            imageSize: '@',
            avatarSize: '@',
            margin: '@',
            popoverPlacement: '@'
        },
        templateUrl: 'html/directive/one-user.html'
    }
});