/**
 * Created by wuhaolin on 5/29/15.
 */
var assert = require('assert');
var wechatAPI = require('../../server/wechat/wechatAPI.js');

describe('wechat/wechatAPI.js', function () {

    describe('#getJsConfig', function () {
        var url = 'http://www.ishuxun.cn';
        it('返回设置的配置', function (done) {
            wechatAPI.getJsConfig(url).done(function (jsonConfig) {
                assert(jsonConfig.debug, '本机运行的环境是测试环境');
                assert.equal(jsonConfig.jsApiList, wechatAPI.Config.JsApiList, 'JsApiList');
                assert.equal(jsonConfig.appId, wechatAPI.Config.AppID, 'appId');
                done();
            }).fail(function (err) {
                done(err);
            })
        })
    });

});