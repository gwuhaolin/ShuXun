/**
 * Created by wuhaolin on 5/31/15.
 */
APP.directive('usedBookOneLine', function () {
    return {
        restrict: 'E',
        scope: {
            //三本图书的信息
            bookInfos: '='
        },
        templateUrl: 'temp/tool/usedBookOneLineTemplate.html'
    }
});

