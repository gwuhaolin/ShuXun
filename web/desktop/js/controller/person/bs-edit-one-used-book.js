/**
 * Created by wuhaolin on 7/30/15.
 */

APP.controller('bs_person_editOneUsedBook', function ($scope, $controller, $state, UsedBook$, InfoService$) {
    $controller('person_editOneUsedBook', {$scope: $scope});
    $scope.InfoService$ = InfoService$;

    $scope.submitOnClick = function () {
        $scope.saveUsedBook(function () {
            if ($scope.usedBook.get('role') == 'sell') {
                UsedBook$.MyUsedBook.loadMore();
            } else if ($scope.usedBook.get('role') == 'need') {
                UsedBook$.MyNeedBook.loadMore();
            }
            $state.go('common.userHome', {ownerId: AV.User.current().id});
        });
    }
});