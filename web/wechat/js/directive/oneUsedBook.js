/**
 * Created by wuhaolin on 5/31/15.
 */
APP.directive('oneUsedBook', function () {
    return {
        restrict: 'E',
        scope: {
            //三本图书的信息
            usedBook: '='
        },
        templateUrl: 'temp/tool/oneUsedBookTemplate.html'
    }
});
