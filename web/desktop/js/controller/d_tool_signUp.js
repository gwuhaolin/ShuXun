/**
 * Created by wuhaolin on 6/5/15.
 *
 */
APP.controller('d_tool_signUp', function ($scope, $location, User$, Status$, InfoService$) {
    $scope.startSchoolYearOptions = InfoService$.startSchoolYearOptions;
    $scope.majors = InfoService$.majors;//InfoService$自动加载所有majors TODO 不能正确到显示专业
    var timer = setInterval(function () {//加载所有到学校 TODO 不能显示所有学校
        if (InfoService$.School.hasMore()) {
            InfoService$.School.loadMore();
        } else {
            clearInterval(timer);
        }
    }, 100);
    $scope.schools = InfoService$.School.schools;
    var authCode = getQueryParameterByName('code');
    $scope.step = 'subscribe';
    User$.getDesktopOAuthUserInfo(authCode).done(function (userInfo) {
        $scope.userInfo = userInfo;
        User$.loginWithUnionId(userInfo.username).done(function (user) {//已经注册过
            User$.updateMyInfoWithJson(userInfo);//更新微信信息
            $scope.userObjectId = user.id;
            $scope.step = 'ok';
        }).fail(function () {//已经关注书循，但是还没有注册过
            $scope.step = 'info';
        }).always(function () {
            $scope.$apply();
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
        }).fail(function (error) {
            alert(error.message);
        }).always(function () {
            $scope.$apply();
        });
    };
});