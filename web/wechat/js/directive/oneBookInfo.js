/**
 * Created by wuhaolin on 7/20/15.
 */
APP.directive('oneBookInfo', function (UsedBook$) {
    function link($scope) {
        if ($scope.shouldShowUsedBooksCount) {
            var isbn13 = $scope.bookInfo.get('isbn13');
            if (isbn13) {
                UsedBook$.ISBN_sell.getUsedBookNumberEqualISBN(isbn13).done(function (num) {
                    $scope.bookInfo.usedBookNumber = num;
                }).always(function () {
                    $scope.$apply();
                });
                UsedBook$.ISBN_need.getNeedBookNumberEqualISBN(isbn13).done(function (num) {
                    $scope.bookInfo.needBookNumber = num;
                }).always(function () {
                    $scope.$apply();
                })
            }
        }
    }

    return {
        restrict: 'E',
        scope: {
            //三本图书的信息
            bookInfo: '=',
            shouldShowUsedBooksCount: '='
        },
        templateUrl: 'temp/tool/oneBookInfoTemplate.html',
        link: link
    }
});