/**
 * Created by wuhaolin on 7/27/15.
 */
APP.directive('bsOneBookInfo', function (UsedBook$) {
    function link($scope) {
        if ($scope.shouldShowUsedBooksCount && $scope.bookInfo) {
            var isbn13 = $scope.bookInfo.get('isbn13');
            if (isbn13) {
                UsedBook$.ISBN_sell.getUsedBookNumberEqualISBN(isbn13).done(function (num) {
                    $scope.bookInfo.usedBookNumber = num;
                }).always(function () {
                    $scope.$digest();
                });
                UsedBook$.ISBN_need.getNeedBookNumberEqualISBN(isbn13).done(function (num) {
                    $scope.bookInfo.needBookNumber = num;
                }).always(function () {
                    $scope.$digest();
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
        templateUrl: 'html/directive/one-book-info.html',
        link: link
    }
});
