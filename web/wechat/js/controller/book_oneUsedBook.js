/**
 * Created by wuhaolin on 5/20/15.
 * 一本二手书的信息
 */
"use strict";

APP.controller('book_oneUsedBook', function ($scope, $stateParams, UsedBook$, User$, WeChatJS$, Status$) {
    $scope.User$ = User$;
    $scope.WeChatJS$ = WeChatJS$;
    $scope.usedBookObjectId = $stateParams['usedBookAvosObjectId'];

    $scope.usedBook = new Model.UsedBook();
    $scope.usedBook.id = $scope.usedBookObjectId;
    $scope.usedBook.fetch().done(function () {
        //大图显示
        $scope.usedBook.attributes.image && $scope.usedBook.set('image', $scope.usedBook.attributes.image.replace('mpic', 'lpic'));
        $scope.usedBook.attributes.owner.fetch().done(function () {
            $scope.$apply();
        });
        $scope.$apply();
    });

    //加载评论数据
    Status$.getStatusList_reviewBook($scope.usedBookObjectId).done(function (statusList) {
        $scope.statusList = statusList;
        $scope.$apply();
    })
});