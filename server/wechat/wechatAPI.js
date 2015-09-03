/**
 * Created by wuhaolin on 4/1/15.
 *
 */
"use strict";
var AppConfig = require('../../config/config.js');
var WeChatAPIClient = require('wechat-api');
var WeChatOAuthClient = require('wechat-oauth');
var AV = require('leanengine');
var APIClient = new WeChatAPIClient(AppConfig.WeChat.AppID_WeChat, AppConfig.WeChat.Secret_WeChat);
exports.APIClient = APIClient;
var OAuthClient_WeChat = new WeChatOAuthClient(AppConfig.WeChat.AppID_WeChat, AppConfig.WeChat.Secret_WeChat);
var OAuthClient_Desktop = new WeChatOAuthClient(AppConfig.WeChat.AppID_Desktop, AppConfig.WeChat.Secret_Desktop);

/**
 * 使用wechat js接口前必须获得这个
 * 返回 wechat js sdk所有需要的config
 * @param url 微信浏览器当前打开的网页的URL
 * @returns {AV.Promise}
 */
exports.getJsConfig = function (url) {
    var rePromise = new AV.Promise(null);
    //如果发布了就关闭微信调试
    var isDebug = process.env['NODE_ENV'] != 'production';
    APIClient.getJsConfig({
        debug: isDebug,
        url: url,
        //需要使用的借口列表
        jsApiList: AppConfig.WeChat.JsApiList
    }, function (err, data) {
        if (err) {
            rePromise.reject(err);
        } else {
            rePromise.resolve(data);
        }
    });
    return rePromise;
};

/**
 * 把微信返回的json转换为兼容User表的json
 * @param userInfo 微信返回的json
 * @returns {{openId: *, username: =unionid, password: =unionid, nickName: *, sex: *, avatarUrl: *}}
 * @private
 */
function _tranWechatUserInfoToAVOS(userInfo) {
    return {
        openId: userInfo['openid'],
        username: userInfo['unionid'],
        password: userInfo['unionid'],
        nickName: userInfo['nickname'],
        sex: userInfo['sex'],
        avatarUrl: userInfo['headimgurl']
    }
}

/**
 * WeChat OAuth 获取用户信息
 * 用户在微信里OAuth后传递code参数给我后
 * 调用OAuthClient_WeChat.getAccessToken方法获取用户的openId
 * 根据openId调用APIClient.getUser获取用户的json格式的信息
 * @param code 微信服务器url回调里的code参数
 * @returns {AV.Promise} 兼容_User表的json格式的用户信息，只能获得已经关注你了的用户的信息。
 * 如果用户没有关注书循微信号将会返回错误 APIClient.getUser(openID) 导致
 */
exports.getOAuthUserInfo_WeChat = function (code) {
    var rePromise = new AV.Promise(null);
    OAuthClient_WeChat.getAccessToken(code, function (err, result) {
        if (err) {
            rePromise.reject(err);
        } else {
            //result = {
            //    "data": {
            //        "access_token": "OezXcEiiBSKSxW0eoylIeNsoQsBi-EJn9cIrY8koOhTTs0EsIbkwLfpvofrWpVnxrTQgeddPIMk_rncx3xtrKGGgYY_-Ay4MdU0hc3B6ci9T9T616U1kuLRBprVBQXAsVvK4C2gjKAg68Fkbp6yYrw",
            //        "expires_in": 7200,
            //        "refresh_token": "OezXcEiiBSKSxW0eoylIeNsoQsBi-EJn9cIrY8koOhTTs0EsIbkwLfpvofrWpVnxrN7wAJ-X14pABdIYKHSpEwn3Y1Q7ZK591Mv6A0q_JitEooeac9FqOImlnQtj0bhdhKd9wz-Dk8PUNz_7UFD65w",
            //        "openid": "o6OKuw208fNg19y9mInz4iUOq2VU",
            //        "scope": "snsapi_base",
            //        "create_at": 1438859453118
            //    }
            //};
            APIClient.getUser(result.data['openid'], function (err, userInfo) {
                if (err) {
                    rePromise.reject(err);
                } else {
                    //userInfo like {
                    //    "openid": "OPENID",
                    //    "nickname": "NICKNAME",
                    //    "sex": 1,
                    //    "province": "PROVINCE",
                    //    "city": "CITY",
                    //    "country": "COUNTRY",
                    //    "headimgurl": "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0",
                    //    "privilege": [
                    //        "PRIVILEGE1",
                    //        "PRIVILEGE2"
                    //    ],
                    //    "unionid": " o6_bmasdasdsad6_2sgVt7hMZOPfL"
                    //};
                    rePromise.resolve(_tranWechatUserInfoToAVOS(userInfo));
                }
            })
        }
    });
    return rePromise;
};

/**
 * Web OAuth 获取用户信息
 * 用户Web里OAuth后传递code参数给我后
 * 调用OAuthClient_Desktop.getAccessToken方法获取用户的unionId
 * 再判断User表里有对应的unionId的用户吗？如果没有就返回error
 * 如果有就返回json格式的用户的信息
 * @param code 微信服务器url回调里的code参数
 * @returns {AV.Promise} 兼容_User表的json格式的用户信息，
 * 不需要必须关注书循微信号也可以正确获得用户信息，只需要用户用扫码同意后即可
 */
exports.getOAuthUserInfo_Desktop = function (code) {
    var rePromise = new AV.Promise(null);
    OAuthClient_Desktop.getAccessToken(code, function (err, result) {
        if (err) {
            rePromise.reject(err);
        } else {
            OAuthClient_Desktop.getUser(result.data['openid'], function (err, userInfo) {
                if (err) {
                    rePromise.reject(err);
                } else {
                    rePromise.resolve(_tranWechatUserInfoToAVOS(userInfo));
                }
            });
        }
    });
    return rePromise;
};

/**
 * 给用户发送模板信息
 * @param title 标题内容
 * @param senderName 发送者昵称
 * @param msg 消息内容
 * @param url 用户点击后打开的网页内容
 * @param receiverOpenId 接受者的微信openID
 * @returns {AV.Promise}
 */
exports.sendTemplateMsg = function (title, senderName, msg, url, receiverOpenId) {
    var TemplateId = 'Gguvq37B78_L8Uv9LZgp0gf8kQ5O8Xmthqttb7IrwVY';//用户咨询提醒
    var Color_Title = '#46bfb9';
    var Color_Context = '#30bf4c';
    var data = {
        first: {//标题
            value: title,
            color: Color_Title
        },
        keyword1: {//用户名称
            value: senderName,
            color: Color_Context
        },
        keyword2: {
            value: msg,
            color: Color_Context
        },
        remark: {//咨询内容
            value: '点击回复' + senderName,
            color: Color_Title
        }
    };
    var rePromise = new AV.Promise(null);
    APIClient.sendTemplate(receiverOpenId, TemplateId, url, Color_Title, data, function (err, result) {
        if (err) {
            rePromise.reject(err);
        } else {
            rePromise.resolve(result);
        }
    });
    return rePromise;
};