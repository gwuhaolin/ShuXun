/**
 * Created by wuhaolin on 4/1/15.
 *
 */
"use strict";

var WECHAT = {
    AppID: 'wx9e79ee1bb4a12663',
    SECRET: '9b93032bd66454f92aa24d24f983020b',
    APIClient: require('wechat-api'),
    OAuthClient: require('wechat-oauth')
};
var APIClient = new WECHAT.APIClient(WECHAT.AppID, WECHAT.SECRET);
var OAuthClient = new WECHAT.OAuthClient(WECHAT.AppID, WECHAT.SECRET);

/**
 * 获得微信AccessToken
 */
exports.getAccessToken = function (callback) {
    APIClient.getLatestTicket(function (err, token) {
        callback(token['ticket']);
    })
};

/**
 * 使用wechat js接口前必须获得这个
 * 返回 wechat js sdk所有需要的config
 * @param url 微信浏览器当前打开的网页的URL
 * @param callback 返回JSON格式的config
 */
exports.getJsConfig = function (url, callback) {
    //如果发布了就关闭微信调试
    var isDebug = true;
    if(__production){
        isDebug = false;
    }
    APIClient.getJsConfig({
        debug: isDebug,
        url: url,
        //需要使用的借口列表
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'chooseImage', 'previewImage', 'uploadImage', 'openLocation', 'getLocation', 'scanQRCode']
    }, function (err, data) {
        if (err) {
            callback(err);
        } else {
            callback(data);
        }
    });
};

/**
 * 用户Web OAuth后
 * 获取Openid
 * @param code
 * @param callback
 * 返回 已经关注了用户的微信提供的所有信息
 */
exports.getOAuthUserInfo = function (code, callback) {
    OAuthClient.getAccessToken(code, function (err, result) {
        if (err) {
            callback(err);
        } else {
            OAuthClient.getUser(result.data.openid, function (err, userInfo) {
                if (err) {
                    callback(err);
                } else {
                    callback(userInfo);
                }
            })
        }
    });
};