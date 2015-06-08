/**
 * Created by wuhaolin on 6/5/15.
 *
 */
APP.controller('d_tool_signUp', function ($scope, $location, User$, Status$, InfoService$) {
    $scope.startSchoolYearOptions = InfoService$.startSchoolYearOptions;
    $scope.majors = InfoService$.majors;
    InfoService$.School.loadMore();
    $scope.schools = InfoService$.School.schools;
    var wechatAOuthCode = $location.search().code;
    $scope.step = 'subscribe';
    User$.getOAuthUserInfo(wechatAOuthCode).done(function (userInfo) {
        $scope.userInfo = userInfo;
        User$.loginWithUnionId(userInfo.unionId).done(function () {//已经注册过
            Status$.loadUnreadStatusesCount();//加载未读消息数量
            User$.updateMyInfoWithJson(userInfo);//更新微信信息
            $scope.step = 'ok';
        });
    }).fail(function () {//用户还没有关注
        alert('要先关注书循微信号哦');
        $scope.step = 'subscribe';
    }).always(function () {
        $scope.$apply();
    });

    $scope.submitOnClick = function () {
        User$.signUpWithJSONUser($scope.userInfo).done(function () {
            $scope.step = 'ok';
            $scope.$apply();
        }).fail(function (error) {
            alert(error.message);
        });
    };
});