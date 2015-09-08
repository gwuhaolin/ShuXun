/**
 * Created by wuhaolin on 9/6/15.
 */

APP.controller('bs_login', function ($scope) {
    $scope.submitOnClick = function () {
        var username = this.username;
        $scope.User$.loginWithUnionId(username).done(function () {
            createCookie('unionId', username, 365);
            alert('成功登入');
        }).fail(function (err) {
            alert(err.message);
        })
    };
});