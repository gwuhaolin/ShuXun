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
            $state.go('common.user-home', {ownerId: AV.User.current().id});
        });
    };

});