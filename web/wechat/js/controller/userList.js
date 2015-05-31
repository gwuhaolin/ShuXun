/**
 * Created by wuhaolin on 5/20/15.
 * 用户列表
 */
"use strict";

//用户列表
APP.controller('userList', function ($scope, $stateParams, UsedBook$, BookRecommend$, User$, IonicModalView$) {
    var cmd = $stateParams['cmd'];

    $scope.sortWay = '';

    if (cmd == 'near') {
        $scope.title = '你附近的同学';
        $scope.users = BookRecommend$.NearUser.users;
        $scope.loadMore = BookRecommend$.NearUser.loadMore;
        $scope.hasMore = BookRecommend$.NearUser.hasMore;
        $scope.setMajorFilter = BookRecommend$.NearUser.setMajorFilter;
        $scope.getMajorFilter = BookRecommend$.NearUser.getMajorFilter;
    } else if (cmd == 'followee') {//我关注的同学
        $scope.title = '我关注的同学';
        $scope.users = User$.Followee.users;
        $scope.loadMore = User$.Followee.loadMore;
        $scope.hasMore = User$.Followee.hasMore;
        $scope.setMajorFilter = User$.Followee.setMajorFilter;
        $scope.getMajorFilter = User$.Followee.getMajorFilter;
    } else if (cmd == 'follower') {//我的粉丝
        $scope.title = '我的粉丝';
        $scope.users = User$.Follower.users;
        $scope.loadMore = User$.Follower.loadMore;
        $scope.hasMore = User$.Follower.hasMore;
        $scope.setMajorFilter = User$.Follower.setMajorFilter;
        $scope.getMajorFilter = User$.Follower.getMajorFilter;
    }

    //按照专业筛选
    IonicModalView$.registerChooseMajorModalView($scope, function (major) {
        $scope.setMajorFilter(major);
    });
});