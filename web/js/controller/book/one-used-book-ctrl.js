/**
 * Created by wuhaolin on 5/20/15.
 * 一本二手书的信息
 */
"use strict";

APP.controller('book_oneUsedBook', function ($scope, $stateParams, UsedBook$, User$, Status$) {
    $scope.User$ = User$;
    $scope.UsedBook$ = UsedBook$;

    $scope.usedBookObjectId = $stateParams['usedBookAvosObjectId'];
    var query = new AV.Query(Model.UsedBook);
    query.include('owner');
    query.include('info');
    query.get($scope.usedBookObjectId).done(function (usedBook) {
        $scope.usedBook = usedBook;
    }).always(function () {
        $scope.$digest();
    });

    $scope.me = AV.User.current();
    /**
     * 当前这本旧书是否是我的？
     * @returns {*|AV.Object|boolean}
     */
    $scope.isMy = function () {
        return $scope.usedBook &&  $scope.me &&  $scope.me.id == $scope.usedBook.attributes.owner.id;
    };

    //加载评论数据
    Status$.getStatusList_reviewBook($scope.usedBookObjectId).done(function (statusList) {
        $scope.statusList = statusList;
        $scope.$digest();
    });
});