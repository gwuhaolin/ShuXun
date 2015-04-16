/**
 * Created by wuhaolin on 3/29/15.
 * express 后端服务器
 */
var express = require('express');
var WechatAPI = require('cloud/wechatAPI.js');
var WechatMsg = require('cloud/wechatMsg.js');
var BusinessSite = require('cloud/businessSite.js');
var Info = require('cloud/info.js');
var app = express();
////////////////////// WeChat /////////////////////////

/**
 * 获得微信JS-SDK配置
 */
app.get('/wechat/getJsConfig', function (req, res) {
    var fullUrl = req.header('Referer');
    WechatAPI.getJsConfig(fullUrl, function (config) {
        res.jsonp(config);
    });
});

/**
 * 微信获取用户信息 OAuth step 2
 * @param :code
 */
app.get('/wechat/getOAuthUserInfo/:code', function (req, res) {
    var code = req.params['code'];
    WechatAPI.getOAuthUserInfo(code, function (userInfo) {
        res.jsonp(userInfo);
    })
});

/**
 * 微信消息服务
 */
app.use('/wechat/msg', WechatMsg.MsgHandler);


////////////////////// Info /////////////////////////
app.get('/info/getAllMajor', function (req, res) {
    var majors = Info.Majors;
    res.jsonp(majors);
});

app.get('/info/getAllBookTags', function (req, res) {
    var tags = Info['BookTags'];
    res.jsonp(tags);
});

app.listen();

////////////////////// 图书电商信息 /////////////////////////
app.get('/business/:id', function (req, res) {
    var id = req.params['id'];
    BusinessSite.spider(id, function (json) {
        res.jsonp(json);
    })
});