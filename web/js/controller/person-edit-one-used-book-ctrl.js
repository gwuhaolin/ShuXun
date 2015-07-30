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
        return $scope.usedBook.get('info');
    }, function () {
        $scope.usedBook.get('info') && $scope.usedBook.get('info').fetch().always(function () {
            $scope.$digest();
        });
    });
    $scope.valueHasChange = false;
    $scope.saveUsedBook = function (onSuccess) {
        $scope.usedBook.set('des', $scope.usedBook.attributes.des);
        $scope.usedBook.set('price', $scope.usedBook.attributes.price);
        UsedBook$.saveUsedBook($scope.usedBook).done(function () {
            onSuccess();
        }).fail(function (error) {
            alert(error.message);
        });
    }
});