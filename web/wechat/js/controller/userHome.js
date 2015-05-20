/**
 * Created by wuhaolin on 5/20/15.
 * 一个用户的主页
 */
"use strict";

APP.controller('userHome', function ($scope, $stateParams, UsedBook$) {
    $scope.UsedBook$ = UsedBook$;
    var ownerId = $stateParams.ownerId;
    var query = new AV.Query(AV.User);
    $scope.jsonUsedBookList = [];
    $scope.jsonNeedBookList = [];
    query.get(ownerId).done(function (avosOwner) {
        $scope.jsonOwnerInfo = avosUserToJson(avosOwner);
        UsedBook$.loadUsedBookListForOwner(avosOwner).done(function (avosUsedBooks) {
            for (var i = 0; i < avosUsedBooks.length; i++) {
                $scope.jsonUsedBookList.push(UsedBook$.avosUsedBookToJson(avosUsedBooks[i]));
            }
            $scope.$apply();
        });
        UsedBook$.loadNeedBookListForOwner(avosOwner).done(function (avosUsedBooks) {
            for (var i = 0; i < avosUsedBooks.length; i++) {
                $scope.jsonNeedBookList.push(UsedBook$.avosUsedBookToJson(avosUsedBooks[i]));
            }
            $scope.$apply();
        })
    });
});
