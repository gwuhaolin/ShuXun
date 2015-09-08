/**
 * Created by wuhaolin on 5/20/15.
 * 用户列表
 */
"use strict";

//用户列表
APP.controller('userList', function ($scope, $stateParams) {
    var cmd = $stateParams['cmd'];

    $scope.sortWay = '';

    if (cmd == 'near') {
        $scope.title = '你附近的同学';
        $scope.users = $scope.BookRecommend$.NearUser.users;
        $scope.loadMore = $scope.BookRecommend$.NearUser.loadMore;
        $scope.hasMore = $scope.BookRecommend$.NearUser.hasMore;
        $scope.setMajorFilter = $scope.BookRecommend$.NearUser.setMajorFilter;
        $scope.getMajorFilter = $scope.BookRecommend$.NearUser.getMajorFilter;
    } else if (cmd == 'followee') {//我关注的同学
        $scope.title = '我关注的同学';
        $scope.users = $scope.User$.Followee.users;
        $scope.loadMore = $scope.User$.Followee.loadMore;
        $scope.hasMore = $scope.User$.Followee.hasMore;
        $scope.setMajorFilter = $scope.User$.Followee.setMajorFilter;
        $scope.getMajorFilter = $scope.User$.Followee.getMajorFilter;
    } else if (cmd == 'follower') {//我的粉丝
        $scope.title = '我的粉丝';
        $scope.users = $scope.User$.Follower.users;
        $scope.loadMore = $scope.User$.Follower.loadMore;
        $scope.hasMore = $scope.User$.Follower.hasMore;
        $scope.setMajorFilter = $scope.User$.Follower.setMajorFilter;
        $scope.getMajorFilter = $scope.User$.Follower.getMajorFilter;
    }

    var majorFilter = $stateParams['majorFilter'];
    majorFilter && $scope.setMajorFilter(majorFilter);
});