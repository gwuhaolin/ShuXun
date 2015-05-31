/**
 * Created by wuhaolin on 5/31/15.
 */
APP.directive('oneNeedBook', function () {
    return {
        restrict: 'E',
        scope: {
            //三本图书的信息
            needBook: '='
        },
        templateUrl: 'temp/tool/oneNeedBookTemplate.html'
    }
});