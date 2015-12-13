/**
 * Created by wuhaolin on 5/29/15.
 */
var assert = require('assert');
var AppConfig = require('../../config/config.json');
var wechatAPI = require('../../server/wechat/wechatAPI.js');
var Util = require('../util.js');

describe('wechat/wechatAPI.js', function () {

    describe('#getJsConfig', function () {
        var url = 'http://www.ishuxun.cn';
        it('返回设置的配置', function (done) {
            wechatAPI.getJsConfig(url).done(function (jsonConfig) {
                assert(jsonConfig.debug, '本机运行的环境是测试环境');
                assert.equal(jsonConfig.jsApiList, AppConfig.WeChat.JsApiList);
                assert.equal(jsonConfig.appId, AppConfig.WeChat.AppID_WeChat);
                done();
            }).fail(function (err) {
                done(err);
            })
        })
    });

    describe('#getOAuthUserInfo_WeChat', function () {
        it('', function (done) {
            var error_code = 'error_code';
            wechatAPI.getOAuthUserInfo_WeChat(error_code).fail(function (err) {
                assert(err, '使用错误的code就应该返回错误');
                done();
            })
        });
    });

    describe('#getOAuthUserInfo_Desktop', function () {
        it('', function (done) {
            var error_code = 'error_code';
            wechatAPI.getOAuthUserInfo_Desktop(error_code).fail(function (err) {
                assert(err, '使用错误的code就应该返回错误');
                done();
            })
        });
    });

    describe('#sendTemplateMsg', function () {
        it('发送给吴浩麟', function (done) {
            wechatAPI.sendTemplateMsg('title', 'senderName', 'msg', 'url', Util.WuHaolin.openId).done(function () {
                done();
                console.warn('吴浩麟的微信必须收到对应的模版消息');
            }).fail(function (err) {
                done(err);
            })
        });

        it('发送信息给错误的openID', function (done) {
            var openID_error = 'error_openID';
            wechatAPI.sendTemplateMsg('title', 'senderName', 'msg', 'url', openID_error).fail(function (err) {
                done();
            });
        })
    });


});