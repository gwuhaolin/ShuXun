/**
 * Created by wuhaolin on 5/20/15.
 * 一本二手书的信息
 */
"use strict";

APP.controller('bs_book_oneUsedBook', function ($scope, $controller, UsedBook$) {
    $controller('book_oneUsedBook', {$scope: $scope});

    $scope.ownerOtherUsedBooks = [];
    $scope.ownerOtherNeedBooks = [];
    $scope.$watch(function () {
        return $scope.usedBook ? $scope.usedBook.get('owner') : null;
    }, function () {
        if ($scope.usedBook) {
            $scope.SEO$.setSEO([$scope.title, $scope.usedBook]);
            var owner = $scope.usedBook.get('owner');
            if (owner) {
                UsedBook$.loadUsedBookListForOwner(owner).done(function (usedBooks) {
                    $scope.ownerOtherUsedBooks = usedBooks;
                    $scope.$digest()
                });
                UsedBook$.loadNeedBookListForOwner(owner).done(function (needBooks) {
                    $scope.ownerOtherNeedBooks = needBooks;
                    $scope.$digest()
                });
                UsedBook$.loadCircleBookListForOwner(owner).done(function (circleBooks) {
                    $scope.ownerOtherCircleBooks = circleBooks;
                    $scope.$digest()
                });
            }
        }
    })
});