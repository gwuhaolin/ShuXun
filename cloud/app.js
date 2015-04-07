/**
 * Created by wuhaolin on 3/29/15.
 * express 后端服务器
 */
var express = require('express');
var WechatAPI = require('cloud/wechat.js');
var Info = require('cloud/info.js');
var app = express();

////////////////////// WeChat /////////////////////////

/**
 * 获得最新的微信access_token
 */
app.get('/wechat/getAccessToken', function (req, res) {
    WechatAPI.getAccessToken(function (token) {
        res.jsonp(token);
    })
});

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


////////////////////// Info /////////////////////////
/**
 * 关键字或拼音搜索学校
 * @param keyword 关键字或拼音
 */
app.get('/info/getAllSchool', function (req, res) {
    var schools = Info.Schools;
    res.jsonp(schools);
});

/**
 * 关键字或拼音搜索专业
 * @param keyword 关键字或拼音
 */
app.get('/info/getAllMajor', function (req, res) {
    var majors = Info.Majors;
    res.jsonp(majors);
});

app.listen();