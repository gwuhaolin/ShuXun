/**
 * Created by wuhaolin on 5/31/15.
 */
APP.controller('d_topBar', function ($scope, SearchBook$, Status$) {
    $scope.SearchBook$ = SearchBook$;
    $scope.me = AV.User.current();

    /**
     * 获得未读消息数量
     */
    $scope.unreadCountSum = function () {
        return Status$.NewUsedBookStatus.unreadCount + Status$.NewNeedBookStatus.unreadCount
            + Status$.PrivateStatus.unreadCount + Status$.ReviewUsedBookStatus.unreadCount;
    };

    $scope.logOut = function () {
        AV.User.logOut();
        eraseCookie('unionId');
        window.location.reload();
    }

});
