/**
 * Created by wuhaolin on 5/20/15.
 * 上传一本二手书
 */
"use strict";

APP.controller('bs_person_uploadOneUsedBook', function ($scope, $controller, $state, SearchBook$) {
    $controller('person_uploadOneUsedBook', {$scope: $scope});
    $scope.SearchBook$ = SearchBook$;
});