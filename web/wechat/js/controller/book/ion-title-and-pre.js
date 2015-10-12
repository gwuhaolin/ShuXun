'use strict';
APP.controller('ion_titlePre', function ($scope, $stateParams) {
    $scope.title = $stateParams.title;
    $scope.pre = $stateParams.pre;
});