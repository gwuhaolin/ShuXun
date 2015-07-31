/**
 * Created by wuhaolin on 3/29/15.
 * express 后端服务器
 */
"use strict";
var express = require('express');
var useragent = require('express-useragent');
var AV = require('leanengine');
var WechatMsg = require('./wechat/wechatMsg.js');
var cloud = require('./cloud/cloud.js');

var app = express();

app.use(cloud);//加载定义的云代码

app.use('/wechatMsg', WechatMsg);//配置微信消息服务

/**
 * 把微信OAuth回调映射到AngularJs signup路由
 */
app.get('/wechatOAuthForwarder', function (req, res) {
    var code = req.query.code;
    var state = req.query.state;
    if (state == 'wechat') {
        res.redirect('/wechat/#/tab/signUp?code=' + code);
    } else if (state == 'desktop') {
        res.redirect('/desktop/#/signUp?code=' + code);
    } else {
        res.redirect('/');
    }
});

/**
 * UA检测，如果是桌面浏览器就去desktop 是移动浏览器就去wechat
 */
app.get('/', function (req, res) {
    var userAgent = useragent.parse(req.headers['user-agent']);
    if (userAgent.isMobile) {//是移动浏览器
        res.redirect('/wechat');
    } else {//是桌面浏览器
        res.redirect('/desktop');
    }
});

app.use('/desktop', require('prerender-node').set('prerenderServiceUrl', 'http://101.200.192.219:3000'));
//app.use(require('prerender-node').set('prerenderServiceUrl', 'http://prerender.ishuxun.cn'));

/**
 * 配置静态资源
 */
app.use('/', express.static('./public'));

module.exports = app;