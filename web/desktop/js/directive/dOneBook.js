/**
 * Created by wuhaolin on 6/2/15.
 * 一本图书的模板
 */

APP.directive('dOneBook', function () {
    return {
        restrict: 'E',
        scope: {
            bookInfo: '='
        },
        templateUrl: '../temp/oneBookTemplate.html'
    }
});
