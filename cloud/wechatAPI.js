/**
 * Created by wuhaolin on 4/1/15.
 *
 */
"use strict";

exports.Config = {
    AppID: 'wx2940a8d3ddcad5e9',
    Secret: '109504a5c4cac98f12c024d724fd589f',
    Token: 'IShuXun',
    EncodingAESKey: 'qiYrBOvI9Z6mhRUZ1LrztiHquQg9NAgQ4arSkgd1aH3',
    APIClient: require('wechat-api'),
    OAuthClient: require('wechat-oauth')
};
exports.APIClient = new exports.Config.APIClient(exports.Config.AppID, exports.Config.Secret);
exports.OAuthClient = new exports.Config.OAuthClient(exports.Config.AppID, exports.Config.Secret);

/**
 * 使用wechat js接口前必须获得这个
 * 返回 wechat js sdk所有需要的config
 * @param url 微信浏览器当前打开的网页的URL
 * @param callback 返回JSON格式的config
 */
exports.getJsConfig = function (url, callback) {
    //如果发布了就关闭微信调试
    var isDebug = true;
    if (__production) {
        isDebug = false;
    }
    exports.APIClient.getJsConfig({
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
    exports.OAuthClient.getAccessToken(code, function (err, result) {
        if (err) {
            callback(err);
        } else {
            exports.OAuthClient.getUser(result.data.openid, function (err, userInfo) {
                if (err) {
                    callback(err);
                } else {
                    callback(userInfo);
                }
            })
        }
    });
};