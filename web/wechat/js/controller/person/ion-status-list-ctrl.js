/**
 * Created by wuhaolin on 5/20/15.
 * 我收到的信息列表
 */
"use strict";

APP.controller('ion_person_statusList', function ($scope, $controller) {
    $controller('person_statusList', {$scope: $scope});
});