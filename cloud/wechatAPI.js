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
 * 用户之间相互发送消息
 * @param senderName 发送者的昵称
 * @param senderOpenId 发送者的微信openID
 * @param receiverOpenId 接收者的微信openID
 * @param msg 消息内容
 * @param usedBookAvosObjectId 当前咨询的二手书的objectId
 * @param role 发送者的当前角色是卖家还是买家 sell | buy
 * @param isPrivate 聊天是否私信
 * @return AV.Promise
 */
exports.senderSendMsgToReceiver = function (senderName, senderOpenId, receiverOpenId, msg, usedBookAvosObjectId, role, isPrivate) {
    var TemplateId_ToBuyer = 'nYdPsuIRJl8RFgh1WBv28xfDGU_IcjQVz6AGFO6uVr8';//咨询回复消息提醒
    var TemplateId_ToSeller = 'Gguvq37B78_L8Uv9LZgp0gf8kQ5O8Xmthqttb7IrwVY';//用户咨询提醒
    var Color_Title = '#46bfb9';
    var Color_Context = '#30bf4c';
    var data = {
        first: {//标题
            value: '有同学发消息给你',
            color: Color_Title
        },
        keyword1: {//用户名称
            value: senderName,
            color: Color_Context
        },
        keyword2: {
            value: '',
            color: Color_Context
        },
        remark: {//咨询内容
            value: msg,
            color: Color_Context
        }
    };
    var templateId = TemplateId_ToSeller;
    var url = 'http://ishuxun.cn/wechat/#/tab/person/sendMsgToUser?openId=' + senderOpenId + '&isPrivate=' + isPrivate;
    if (role == 'sell') {//图书主人在回应咨询者
        url += '&role=buy';//我是卖家,所以你是买家
        templateId = TemplateId_ToBuyer;
    } else if (role == 'buy') {
        url += '&role=sell';
        templateId = TemplateId_ToSeller;
    }
    if (usedBookAvosObjectId) {
        url += '&usedBookAvosObjectId=' + usedBookAvosObjectId;
        var query = new AV.Query('UsedBook');
        query.select('title');
        query.get(usedBookAvosObjectId).done(function (usedBook) {
            var bookTitle = usedBook.get('title');
            if (role == 'sell') {//图书主人在回应咨询者
                data.first.value = bookTitle + '-主人回复你';
            } else if (role == 'buy') {
                data.first.value = '有同学咨询你的旧书-' + bookTitle;
            }
        }).always(function () {
            send();
        });
    } else {
        send();
    }

    var mainPromise = new AV.Promise(null);

    /**
     * 保存下这条聊天记录
     * @returns AV.Promise
     */
    function saveChat() {
        var promise = new AV.Promise(null);
        var query = new AV.Query(AV.User);
        query.equalTo('openId', senderOpenId);
        query.first().done(function (avosSender) {
            query = new AV.Query(AV.User);
            query.equalTo('openId', receiverOpenId);
            query.first().done(function (avosReceiver) {
                var avosUsedBook = null;
                if (usedBookAvosObjectId) {//如果有二手书的ID
                    avosUsedBook = AV.Object.createWithoutData('UsedBook', usedBookAvosObjectId);
                }
                var Chat = AV.Object.extend('Chat');
                var chat = new Chat();
                chat.save({
                    from: avosSender,
                    to: avosReceiver,
                    msg: msg,
                    usedBook: avosUsedBook,
                    isPrivate: Boolean(isPrivate)
                }).done(function (re) {
                    promise.resolve(re);
                }).fail(function (err) {
                    promise.reject(err);
                })
            }).fail(function (err) {
                promise.reject(err);
            })
        }).fail(function (err) {
            promise.reject(err);
        });
        return promise;
    }

    /**
     * 通过微信API发送这条消息
     */
    function send() {
        exports.APIClient.sendTemplate(receiverOpenId, templateId, url, Color_Title, data, function (err, result) {
            if (err) {
                mainPromise.reject(err);
            } else {
                saveChat().done(function () {
                    mainPromise.resolve(result);
                }).fail(function (err) {
                    mainPromise.reject(err);
                })
            }
        })
    }

    return mainPromise;
};
