/**
 * Created by wuhaolin on 6/2/15.
 * 一本旧书书的模板
 */

APP.directive('dOneUsedBook', function () {

    function link($scope) {
        //检测bookInfo属性是否fetch,如果没有就fetch,因为需要用到这个属性
        var bookInfo = $scope.usedBook.attributes.info;
        if ($scope.usedBook.attributes.info && !bookInfo.attributes.isbn13) {
            bookInfo.fetch().done(function () {
                $scope.$apply();
            })
        }
    }

    return {
        restrict: 'E',
        scope: {
            usedBook: '='
        },
        templateUrl: '../temp/oneUsedBookTemplate.html',
        link: link
    }
});
