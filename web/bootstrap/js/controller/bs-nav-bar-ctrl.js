/**
 * Created by wuhaolin on 7/26/15.
 */
"use strict";

APP.controller('bs_navBarCtrl', function ($scope, Status$, SearchBook$) {
    $scope.Status$ = Status$;
    $scope.SearchBook$ = SearchBook$;

    $scope.bookSearchResultMenuIsOpen = false;

    //监听着UserLoginSuccess事件，如果再其它地方用户登录成功了就广播该事件，然后header就会刷新
    $scope.$on('UserLoginSuccess', function () {
        $scope.me = AV.User.current();
    });

    $scope.logOut = function () {
        AV.User.logOut();
        eraseCookie('unionId');
        window.location.reload();
    };

    /**
     * 结束搜索，清空搜索浏览
     */
    $scope.endSearch = function () {
        SearchBook$.books.length = 0;
        SearchBook$.keyword = '';
    };
});