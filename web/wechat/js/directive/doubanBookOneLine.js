/**
 * Created by wuhaolin on 5/31/15.
 * 三本书排成一行
 */

APP.directive('doubanBookOneLine', function () {
    return {
        restrict: 'E',
        scope: {
            //三本图书的信息
            books: '='
        },
        templateUrl: 'temp/tool/doubanBookOneLineTemplate.html',
        link: function (scope) {
            scope.showNumber = Math.floor(document.body.clientWidth / 80);
        }
    }
});