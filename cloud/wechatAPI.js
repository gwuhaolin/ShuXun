/**
 * Created by wuhaolin on 4/1/15.
 *
 */
"use strict";

exports.Config = {
    AppID: 'wx2940a8d3ddcad5e9',
    Secret: '109504a5c4cac98f12c024d724fd589f',
    Token: 'wonderful',
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
 * @returns {AV.Promise}
 */
exports.getJsConfig = function (url) {
    var rePromise = new AV.Promise(null);
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
            rePromise.reject(err);
        } else {
            rePromise.resolve(data);
        }
    });
    return rePromise;
};

/**
 * 用户Web OAuth后
 * 获取Openid
 * @param code
 * @returns {AV.Promise}
 */
exports.getOAuthUserInfo = function (code) {
    var rePromise = new AV.Promise(null);
    exports.OAuthClient.getAccessToken(code, function (err, result) {
        if (err) {
            rePromise.reject(err);
        } else {
            exports.OAuthClient.getUser(result.data.openid, function (err, userInfo) {
                if (err) {
                    rePromise.reject(err);
                } else {
                    rePromise.resolve(userInfo);
                }
            })
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
    exports.APIClient.sendTemplate(receiverOpenId, TemplateId, url, Color_Title, data, function (err, result) {
        if (err) {
            rePromise.reject(err);
        } else {
            rePromise.resolve(result);
        }
    });
    return rePromise;
};