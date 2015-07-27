/**
 * Created by wuhaolin on 5/20/15.
 * 我的主页
 */
"use strict";

APP.controller('ion_person_my', function ($scope, $state, $stateParams, User$, Status$) {
    $scope.Status$ = Status$;
    function load() {
        $scope.user = AV.User.current();
        //加载我上传的二手书的数量
        var myUsedBookRelation = AV.User.current().relation('usedBooks');
        var query = myUsedBookRelation.query();
        query.equalTo('role', 'sell');
        query.count().done(function (number) {
            $scope.myUsedBookNumber = number;
            $scope.$digest();
        });
        //加载我发布的求书需求的数量
        query = myUsedBookRelation.query();
        query.equalTo('role', 'need');
        query.count().done(function (number) {
            $scope.myNeedBookNumber = number;
            $scope.$digest();
        });
        //加载我关注的同学的数量
        query = AV.User.current().followeeQuery();
        query.count().done(function (followeeNumber) {
            $scope.followeeNumber = followeeNumber;
            $scope.$digest();
        });
        //加载我的粉丝的数量
        query = AV.User.current().followerQuery();
        query.count().done(function (followerNumber) {
            $scope.followerNumber = followerNumber;
            $scope.$digest();
        });
        //加载我的未读消息
        Status$.loadUnreadStatusesCount();
    }

    $scope.$on('$ionicView.afterEnter', load);

    /**
     * 用户退出
     */
    $scope.logOut = function () {
        AV.User.logOut();
        eraseCookie('unionId');
        wx.closeWindow();
    }
});