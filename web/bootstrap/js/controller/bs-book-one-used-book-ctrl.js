/**
 * Created by wuhaolin on 5/20/15.
 * 一本二手书的信息
 */
"use strict";

APP.controller('bs_book_oneUsedBook', function ($scope, $controller) {
    $controller('book_oneUsedBook', {$scope: $scope});

    $scope.ownerOtherUsedBooks = [];
    $scope.ownerOtherNeedBooks = [];
    $scope.$watch(function () {
        return $scope.usedBook ? $scope.usedBook.get('owner') : null;
    }, function () {
        $scope.usedBook && $scope.usedBook.attributes.owner.relation('usedBooks').query().find().done(function (usedBooks) {
            AV._.each(usedBooks, function (usedBook) {
                if (usedBook.id != $scope.usedBookObjectId) {
                    var role = usedBook.get('role');
                    if (role == 'sell') {
                        $scope.ownerOtherUsedBooks.push(usedBook);
                    } else if (role == 'need') {
                        $scope.ownerOtherNeedBooks.push(usedBook);
                    }
                }
            });
        }).always(function () {
            $scope.$digest();
        })
    })
});