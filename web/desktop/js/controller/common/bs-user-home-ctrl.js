/**
 * Created by wuhaolin on 5/20/15.
 * 一个用户的主页
 */
"use strict";

APP.controller('bs_userHome', function ($scope, $controller, $sce, User$, BootstrapModalView$) {
    $controller('userHome', {$scope: $scope});
    $scope.AV = AV;
    $scope.User$ = User$;
    $scope.BootstrapModalView$ = BootstrapModalView$;

    /**
     * 判断是否本人是我自己
     * @returns {boolean}
     */
    $scope.isMe = function () {
        return $scope.owner && AV.User.current() && $scope.owner.id == AV.User.current().id;
    };

    $scope.ownerMapUrl = function () {
        var location = $scope.owner.attributes.location;
        var url = 'http://api.map.baidu.com/marker?content=Ta的位置&output=html&src=shuxun&location=' + location.latitude + ',' + location.longitude + '&title=' + $scope.owner.attributes.nickName;
        return $sce.trustAsResourceUrl(url);
    };

    //判断是否我已经关注ta
    function loadIsMyFollowee() {
        User$.loadIsMyFollowee($scope.owner).done(function (is) {
            $scope.isMyFollowee = is;
            $scope.$digest();
        });
    }

    $scope.$watch(function () {
        return $scope.owner;
    }, function () {
        loadIsMyFollowee();
        $scope.SEO$.setSEO($scope.owner);
    });
    $scope.$on('FollowSomeone', function () {
        loadIsMyFollowee();
    });
    $scope.$on('UnfollowSomeone', function () {
        loadIsMyFollowee();
    })
});
