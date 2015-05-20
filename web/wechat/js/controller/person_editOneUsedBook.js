/**
 * Created by wuhaolin on 5/20/15.
 * 编辑一本二手书的信息
 */
"use strict";

APP.controller('person_editOneUsedBook', function ($scope, $state, $ionicHistory, $stateParams, UsedBook$) {
    var usedBookId = $stateParams['usedBookId'];
    $scope.avosUsedBook = AV.Object.createWithoutData('UsedBook', usedBookId);
    $scope.avosUsedBook.fetch().done(function () {
        $scope.jsonUsedBookChangeInfo = UsedBook$.avosUsedBookToJson($scope.avosUsedBook);
        $scope.$apply();
    });
    $scope.valueHasChange = false;
    $scope.submitOnClick = function () {
        $scope.avosUsedBook.set('des', $scope.jsonUsedBookChangeInfo.des);
        $scope.avosUsedBook.set('price', $scope.jsonUsedBookChangeInfo.price);
        $scope.avosUsedBook.save(null).done(function () {
            if ($scope.avosUsedBook.get('role') == 'sell') {
                UsedBook$.loadMyAvosUsedBookList();
                $state.go('tab.person_usedBooksList');
            } else if ($scope.avosUsedBook.get('role') == 'need') {
                UsedBook$.loadMyAvosNeedBookList();
                $state.go('tab.person_needBooksList');
            }
            $ionicHistory.clearHistory();
        }).fail(function (error) {
            alert(error.message);
        })
    }
});