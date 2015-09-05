/**
 * Created by wuhaolin on 5/20/15.
 * 编辑一本二手书的信息
 */
"use strict";

APP.controller('ion_person_editOneUsedBook', function ($scope, $controller, $state, $ionicHistory, UsedBook$) {
    $controller('person_editOneUsedBook', {$scope: $scope});

    $scope.submitOnClick = function () {
        $scope.saveUsedBook(function () {
            if ($scope.usedBook.get('role') == 'sell') {
                UsedBook$.MyUsedBook.loadMore();
                $state.go('common.user-home', {ownerId: $scope.usedBook.attributes.owner.id, hashId: '主人要卖的旧书'});
            } else if ($scope.usedBook.get('role') == 'need') {
                UsedBook$.MyNeedBook.loadMore();
                $state.go('common.user-home', {ownerId: $scope.usedBook.attributes.owner.id, hashId: '主人发布的求书'});
            }
            $ionicHistory.clearHistory();
        });
    }
});