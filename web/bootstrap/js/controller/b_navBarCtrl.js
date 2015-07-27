/**
 * Created by wuhaolin on 7/26/15.
 */
APP.controller('b_navBarCtrl', function ($scope,  Status$) {
    $scope.Status$= Status$;

    $scope.bookSearchResultMenuIsOpen = false;

    //监听着UserLoginSuccess事件，如果再其它地方用户登录成功了就广播该事件，然后header就会刷新
    $scope.$on('UserLoginSuccess', function () {
        $scope.me = AV.User.current();
    });

    $scope.logOut = function () {
        AV.User.logOut();
        eraseCookie('unionId');
        window.location.reload();
    }
});