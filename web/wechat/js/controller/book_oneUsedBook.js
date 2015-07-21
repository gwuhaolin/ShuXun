/**
 * Created by wuhaolin on 5/20/15.
 * 一本二手书的信息
 */
"use strict";

APP.controller('book_oneUsedBook', function ($scope, $stateParams, UsedBook$, User$, WeChatJS$, Status$) {
    $scope.User$ = User$;
    $scope.WeChatJS$ = WeChatJS$;
    var usedBookObjectId = $stateParams['usedBookAvosObjectId'];
    var query = new AV.Query(Model.UsedBook);
    query.include('owner');
    query.include('info');
    query.get(usedBookObjectId).done(function (usedBook) {
        $scope.usedBook = usedBook;
    }).always(function () {
        $scope.$digest();
    });

    //加载评论数据
    Status$.getStatusList_reviewBook(usedBookObjectId).done(function (statusList) {
        $scope.statusList = statusList;
        $scope.$digest();
    });

    //统计用户行为
    $scope.$on('$ionicView.afterEnter', function () {
        var analyticsSugue = leanAnalytics.browseUsedBook(usedBookObjectId);
        $scope.$on('$ionicView.afterLeave', function () {
            analyticsSugue.send();
        });
    });
});