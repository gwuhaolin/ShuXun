/**
 * Created by wuhaolin on 5/20/15.
 * 一个用户的主页
 */
"use strict";

APP.controller('userHome', function ($scope, $stateParams, UsedBook$) {
    $scope.UsedBook$ = UsedBook$;
    var ownerId = $stateParams.ownerId;
    var query = new AV.Query(Model.User);
    $scope.jsonUsedBookList = [];
    $scope.jsonNeedBookList = [];
    query.get(ownerId).done(function (owner) {
        $scope.owner = owner;
        UsedBook$.loadUsedBookListForOwner(owner).done(function (usedBooks) {
            $scope.usedBooks = usedBooks;
            $scope.$apply();
        });
        UsedBook$.loadNeedBookListForOwner(owner).done(function (needBooks) {
            $scope.needBooks = needBooks;
            $scope.$apply();
        })
    });
});
