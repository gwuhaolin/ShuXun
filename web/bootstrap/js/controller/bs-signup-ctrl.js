/**
 * Created by wuhaolin on 7/30/15.
 */
APP.controller('bs_signUp', function ($scope, $stateParams, User$, BootstrapModalView$, InfoService$) {
    $scope.startSchoolYearOptions = InfoService$.startSchoolYearOptions;
    $scope.InfoService$ = InfoService$;
    var wechatAOuthCode = $stateParams['code'];

    $scope.step = 'subscribe';
    User$.getDesktopOAuthUserInfo(wechatAOuthCode).done(function (userInfo) {
        $scope.userInfo = userInfo;
        User$.loginWithUnionId(userInfo.username).done(function (user) {//已经注册过
            User$.updateMyInfoWithJson(userInfo);//更新微信信息
            $scope.userObjectId = user.id;
            $scope.step = 'ok';
        }).fail(function () {//已经关注书循，但是还没有注册过
            $scope.step = 'info';
        }).always(function () {
            $scope.$digest();
        });
    }).fail(function () {//用户还没有关注
        alert('要先关注书循微信号哦');
        $scope.step = 'subscribe';
    }).always(function () {
        $scope.$digest();
    });

    $scope.chooseMajor = function () {
        BootstrapModalView$.openChooseMajorModalView(function (major) {
            $scope.userInfo.major = major;
            $scope.$digest();
        })
    };

    $scope.chooseSchool = function () {
        BootstrapModalView$.openChooseSchoolModalView(function (school) {
            $scope.userInfo.school = school;
            $scope.$digest();
        })
    };

    $scope.submitOnClick = function () {
        User$.signUpWithJSONUser($scope.userInfo).done(function (me) {
            $scope.me = me;
            $scope.step = 'ok';
        }).fail(function (error) {
            alert(error.message);
        }).always(function () {
            $scope.$digest();
        });
    };
});