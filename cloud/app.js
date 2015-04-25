/**
 * Created by wuhaolin on 3/29/15.
 * express 后端服务器
 */
var express = require('express');
var WechatAPI = require('cloud/wechatAPI.js');
var WechatMsg = require('cloud/wechatMsg.js');
var BusinessSite = require('cloud/businessSite.js');
var request = require('request');
var Info = require('cloud/info.js');
var LBS = require('cloud/lbs.js');
var app = express();
app.use(express.compress(), null);//压缩返回的数据
app.set('views', 'cloud/views');   // 设置模板目录
app.set("view engine", "ejs");
app.listen();
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

////////////////////// 图书电商信息 /////////////////////////
/**
 * @queryParam id 豆瓣图书id
 */
app.get('/business/:id', function (req, res) {
    var id = req.params['id'];
    BusinessSite.spider(id, function (json) {
        res.jsonp(json);
    })
});

////////////////////// LBS /////////////////////////
/**
 * 根据用户的IP地址去调用百度API获得用户的经纬度
 */
app.get('/lbs/updateLocationByIP', function (req, res) {
    LBS.getLocationByIP(req, function (location) {
        var user = AV.User.current();
        if (user) {
            var point = new AV.GeoPoint(location.lat, location.lng);
            user.set('location', point);
            user.save().done(function () {
                res.jsonp(location);
            }).fail(function (error) {
                res.jsonp(error);
            })
        } else {
            res.jsonp('需要登录');
        }
    }, function (error) {
        res.jsonp(error);
    })
});
