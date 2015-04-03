/**
 * Created by wuhaolin on 4/1/15.
 *
 */
"use strict";

/**
 * 用这些信息去注册一个用户,用户的账号密码都等于微信的openid
 * @param wechatInfo 来自微信API的信息
 * @param schoolCode 学校代码
 * @param academyCode 学院代码
 * @param grade 年级 大一:1 研一:4+1
 * @param email 邮箱
 * @returns {*|AV.Promise}
 */
function createUser(wechatInfo, schoolCode, academyCode, grade, email) {
    var user = new AV.User();
    //from wechat
    user.set('nickName', wechatInfo['nickname']);
    user.set('sex', wechatInfo['sex']);
    user.set('avatarUrl', wechatInfo['headimgurl']);
    user.setUsername(wechatInfo['openid'], null);
    user.setPassword(wechatInfo['password'], null);

    user.setEmail(email, null);
    user.set('schoolCode', schoolCode);
    user.set('majorCode', academyCode);
    user.set('grade', grade);
    user.set('location', location);

    return user.signUp(null);
}