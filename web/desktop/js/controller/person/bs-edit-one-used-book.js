/**
 * Created by wuhaolin on 7/30/15.
 */

APP.controller('bs_person_editOneUsedBook', function ($scope, $controller, $state, UsedBook$, InfoService$) {
    $controller('person_editOneUsedBook', {$scope: $scope});
    $scope.InfoService$ = InfoService$;
});