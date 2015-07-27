/**
 * Created by wuhaolin on 5/20/15.
 * 编辑一本二手书的信息
 */
"use strict";

APP.controller('ion_person_editOneUsedBook', function ($scope, $state, $ionicHistory, $stateParams, UsedBook$) {
    var usedBookId = $stateParams['usedBookId'];
    $scope.usedBook = new Model.UsedBook();
    $scope.usedBook.id = usedBookId;
    $scope.usedBook.fetch().done(function () {
        $scope.$digest();
    });
    $scope.valueHasChange = false;
    $scope.submitOnClick = function () {
        $scope.usedBook.set('des', $scope.usedBook.attributes.des);
        $scope.usedBook.set('price', $scope.usedBook.attributes.price);
        $scope.usedBook.save(null).done(function () {
            if ($scope.usedBook.get('role') == 'sell') {
                UsedBook$.MyUsedBook.loadMore();
                $state.go('tab.person_usedBooksList');
            } else if ($scope.usedBook.get('role') == 'need') {
                UsedBook$.MyNeedBook.loadMore();
                $state.go('tab.person_needBooksList');
            }
            $ionicHistory.clearHistory();
        }).fail(function (error) {
            alert(error.message);
        })
    }
});