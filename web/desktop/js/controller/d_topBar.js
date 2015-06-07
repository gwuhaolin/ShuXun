/**
 * Created by wuhaolin on 5/31/15.
 */
APP.controller('d_topBar', function ($scope, SearchBook$, Status$) {
    $scope.Status$ = Status$;
    $scope.SearchBook$ = SearchBook$;
    $scope.me = AV.User.current();

    $scope.logOut = function () {
        AV.User.logOut();
        eraseCookie('unionId');
        window.location.reload();
    }

});
