/**
 * Created by wuhaolin on 5/20/15.
 * 一本二手书的信息
 */
"use strict";

APP.controller('book_oneUsedBook', function ($scope, $stateParams, UsedBook$, User$, WeChatJS$, Status$) {
    $scope.User$ = User$;
    $scope.WeChatJS$ = WeChatJS$;
    $scope.usedBookObjectId = $stateParams['usedBookAvosObjectId'];

    UsedBook$.getJsonUsedBookByAvosObjectId($scope.usedBookObjectId, function (json) {
        json.image = json.image ? json.image.replace('mpic', 'lpic') : '';//大图显示
        $scope.jsonUsedBook = json;
        $scope.$apply();
        var avosOwner = $scope.jsonUsedBook.owner;
        avosOwner.fetch().done(function (avosOwner) {
            $scope.ownerInfo = avosUserToJson(avosOwner);
            $scope.$apply();
        });
    });

    //加载评论数据
    Status$.getStatusList_reviewBook($scope.usedBookObjectId).done(function (avosStatusList) {
        $scope.jsonStatusList = [];
        for (var i = 0; i < avosStatusList.length; i++) {
            var jsonStatus = Status$.avosStatusToJson(avosStatusList[i]);
            jsonStatus.source.fetch().done(function () {
                $scope.$apply();
            });
            jsonStatus.to.fetch().done(function () {
                $scope.$apply();
            });
            $scope.jsonStatusList.push(jsonStatus);
        }
        $scope.$apply();
    })
});