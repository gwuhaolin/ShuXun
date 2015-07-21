/**
 * Created by wuhaolin on 5/20/15.
 * 一个用户的主页
 */
"use strict";

APP.controller('userHome', function ($scope, $stateParams, UsedBook$) {
    $scope.UsedBook$ = UsedBook$;
    var ownerId = $stateParams.ownerId;
    var query = new AV.Query(Model.User);
    query.get(ownerId).done(function (owner) {
        $scope.owner = owner;
        UsedBook$.loadUsedBookListForOwner(owner).done(function (usedBooks) {
            $scope.usedBooks = usedBooks;
            $scope.$digest();
        });
        UsedBook$.loadNeedBookListForOwner(owner).done(function (needBooks) {
            $scope.needBooks = needBooks;
            $scope.$digest();
        })
    });

    //统计用户行为
    $scope.$on('$ionicView.afterEnter', function () {
        var analyticsSugue = leanAnalytics.browseUser($scope.ownerId);
        $scope.$on('$ionicView.afterLeave', function () {
            analyticsSugue.send();
        });
    });
});
