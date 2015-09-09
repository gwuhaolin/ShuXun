/**
 * Created by wuhaolin on 5/20/15.
 * 我收到的信息列表
 */
"use strict";

APP.controller('person_statusList', function ($scope, $stateParams) {
    $scope.cmd = $stateParams.cmd;
    if ($scope.cmd == 'newUsedBook') {
        $scope.title = '我关注的同学新上传的旧书';
        $scope.unreadStatusList = $scope.Status$.NewUsedBookStatus.unreadStatusList;
        $scope.historyStatusList = $scope.Status$.NewUsedBookStatus.historyStatusList;
        $scope.Status$.NewUsedBookStatus.loadUnread();
        $scope.Status$.NewUsedBookStatus.loadMoreHistory();
        $scope.loadMore = $scope.Status$.NewUsedBookStatus.loadMoreHistory;
        $scope.hasMore = $scope.Status$.NewUsedBookStatus.hasMoreHistory;
    } else if ($scope.cmd == 'newNeedBook') {
        $scope.title = '我关注的同学新发布的求书';
        $scope.unreadStatusList = $scope.Status$.NewNeedBookStatus.unreadStatusList;
        $scope.historyStatusList = $scope.Status$.NewNeedBookStatus.historyStatusList;
        $scope.Status$.NewNeedBookStatus.loadUnread();
        $scope.Status$.NewNeedBookStatus.loadMoreHistory();
        $scope.loadMore = $scope.Status$.NewNeedBookStatus.loadMoreHistory;
        $scope.hasMore = $scope.Status$.NewNeedBookStatus.hasMoreHistory;
    } else if ($scope.cmd == 'newCircleBook') {
        $scope.title = '我关注的同学新发布的书漂流';
        $scope.unreadStatusList = $scope.Status$.NewCircleBookStatus.unreadStatusList;
        $scope.historyStatusList = $scope.Status$.NewCircleBookStatus.historyStatusList;
        $scope.Status$.NewCircleBookStatus.loadUnread();
        $scope.Status$.NewCircleBookStatus.loadMoreHistory();
        $scope.loadMore = $scope.Status$.NewCircleBookStatus.loadMoreHistory;
        $scope.hasMore = $scope.Status$.NewCircleBookStatus.hasMoreHistory;
    } else if ($scope.cmd == 'private') {
        $scope.title = '我收到的私信';
        $scope.unreadStatusList = $scope.Status$.PrivateStatus.unreadStatusList;
        $scope.historyStatusList = $scope.Status$.PrivateStatus.historyStatusList;
        $scope.Status$.PrivateStatus.loadUnread();
        $scope.Status$.PrivateStatus.loadMoreHistory();
        $scope.loadMore = $scope.Status$.PrivateStatus.loadMoreHistory;
        $scope.hasMore = $scope.Status$.PrivateStatus.hasMoreHistory;
    } else if ($scope.cmd == 'reviewUsedBook') {
        $scope.title = '我关注的同学对我的书的评论';
        $scope.unreadStatusList = $scope.Status$.ReviewUsedBookStatus.unreadStatusList;
        $scope.historyStatusList = $scope.Status$.ReviewUsedBookStatus.historyStatusList;
        $scope.Status$.ReviewUsedBookStatus.loadUnread();
        $scope.Status$.ReviewUsedBookStatus.loadMoreHistory();
        $scope.loadMore = $scope.Status$.ReviewUsedBookStatus.loadMoreHistory;
        $scope.hasMore = $scope.Status$.ReviewUsedBookStatus.hasMoreHistory;
    }
});