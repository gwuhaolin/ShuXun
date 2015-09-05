/**
 * Created by wuhaolin on 5/20/15.
 * 上传一本二手书
 */
"use strict";

APP.controller('bs_person_uploadOneUsedBook', function ($scope, $controller, $state, SearchBook$) {
    $controller('person_uploadOneUsedBook', {$scope: $scope});
    $scope.SearchBook$ = SearchBook$;
    /**
     * @param role 是要卖掉二手书(sell)还是发布需求(need)
     */
    $scope.submitOnClick = function (role) {
        $scope.saveUsedBook(role, function () {
            if (role === 'sell') {
                $state.go('common.user-home', {ownerId: $scope.me.id, hashId: '主人要卖的旧书'});
            } else if (role === 'need') {
                $state.go('common.user-home', {ownerId: $scope.me.id, hashId: '主人发布的求书'});
            } else if (role === 'circle') {
                $state.go('common.user-home', {ownerId: $scope.me.id, hashId: '主人上传的书漂流'});
            }
        });
    };

});