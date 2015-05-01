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

/**
 * @参数:start
 * @参数:id 豆瓣图书id
 */
app.get('/info/getDoubanBookReview', function (req, res) {
    var start = req.query.start;
    var id = req.query.id;
    Info.spiderDoubanBookReview(id, start).done(function (json) {
        res.jsonp(json);
    }).fail(function (err) {
        res.jsonp(err);
    })
});

/**
 * @参数:id 豆瓣书评id
 */
app.get('/info/getOneFullDoubanBookReview', function (req, res) {
    var id = req.query.id;
    Info.spiderDoubanBookOneFullReview(id).done(function (re) {
        res.jsonp(re);
    }).fail(function (err) {
        res.jsonp(err);
    })
});

/**
 * 新书速递功能
 * @参数:start
 * @参数:count
 */
app.get('/info/getNewBooks', function (req, res) {
    var start = req.query.start;
    var count = req.query.count;
    Info.getNewBooks(start, count).done(function (json) {
        res.jsonp(json);
    }).fail(function (err) {
        res.jsonp(err);
    })
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