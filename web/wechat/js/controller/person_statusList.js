/**
 * Created by wuhaolin on 5/20/15.
 * 我收到的信息列表
 */
"use strict";

APP.controller('person_statusList', function ($scope, $stateParams, Status$) {
    $scope.cmd = $stateParams.cmd;
    if ($scope.cmd == 'newUsedBook') {//显示上传的二手书
        $scope.title = '同学新上传的旧书';
        $scope.statusList = Status$.NewUsedBookStatus.statusList;
        Status$.NewUsedBookStatus.load();
    } else if ($scope.cmd == 'newNeedBook') {//显示发布的求书
        $scope.title = '同学新发布的求书';
        $scope.statusList = Status$.NewNeedBookStatus.statusList;
        Status$.NewNeedBookStatus.load();
    } else if ($scope.cmd == 'private') {
        $scope.title = '你收到的私信';
        $scope.statusList = Status$.PrivateStatus.statusList;
        Status$.PrivateStatus.load();
    } else if ($scope.cmd == 'reviewUsedBook') {
        $scope.title = '同学对你的书的评论';
        $scope.statusList = Status$.ReviewUsedBookStatus.statusList;
        Status$.ReviewUsedBookStatus.load();
    }
});