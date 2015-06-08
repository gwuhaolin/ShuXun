/**
 * Created by wuhaolin on 6/7/15.
 * 一本旧书书的模板
 */

APP.directive('dOneNeedBook', function () {

    function link($scope, UsedBook$) {
        $scope.AV = AV;
        $scope.UsedBook$ = UsedBook$;
        //检测bookInfo属性是否fetch,如果没有就fetch,因为需要用到这个属性
        var bookInfo = $scope.needBook.attributes.info;
        if ($scope.needBook.attributes.info && !bookInfo.attributes.isbn13) {
            bookInfo.fetch().done(function () {
                $scope.$apply();
            })
        }
    }

    return {
        restrict: 'E',
        scope: {
            needBook: '='
        },
        templateUrl: '../hbsPartial/oneNeedBook.html',
        link: link
    }
});

