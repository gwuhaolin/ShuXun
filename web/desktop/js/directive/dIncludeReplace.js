/**
 * Created by wuhaolin on 6/1/15.
 */
APP.directive('dIncludeReplace', function () {
    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el) {
            el.replaceWith(el.children());
        }
    };
});