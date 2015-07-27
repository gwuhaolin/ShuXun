/**
 * Created by wuhaolin on 6/7/15.
 */
APP.controller('d_tool_hello', function ($scope, User$, Status$) {
    User$.loginWithUnionId(readCookie('unionId')).done(function () {//已经注册过
        Status$.loadUnreadStatusesCount();//加载未读消息数量
        window.location.href = 'user-home.html?userObjectId=' + AV.User.current().id;
    });
});