/**
 * Created by wuhaolin on 5/20/15.
 * 编辑一本二手书的信息
 */
"use strict";

APP.controller('person_editOneUsedBook', function ($scope, $state, $stateParams, UsedBook$) {
    var usedBookId = $stateParams['usedBookId'];
    $scope.usedBook = new Model.UsedBook();
    $scope.usedBook.id = usedBookId;
    $scope.usedBook.fetch().done(function () {
        $scope.$digest();
    });
    //获取usedBook 对应的 BookInfo
    $scope.$watch(function () {
        return $scope.usedBook.get('bookInfo');
    }, function () {
        var bookInfo = $scope.usedBook.get('bookInfo');
        bookInfo && bookInfo.fetch().always(function () {
            $scope.$digest();
        });
    });
    $scope.valueHasChange = false;
    $scope.submitOnClick = function () {
        $scope.usedBook.set('des', $scope.usedBook.attributes.des);
        $scope.usedBook.set('price', $scope.usedBook.attributes.price);
        UsedBook$.saveUsedBook($scope.usedBook).done(function () {
            UsedBook$.reloadMyUsedBookAndGoMyHome($scope.usedBook.get('role'));
        }).fail(function (error) {
            alert(error.message);
        });
    }
});