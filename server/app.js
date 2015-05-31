/**
 * Created by wuhaolin on 3/29/15.
 * express 后端服务器
 */
"use strict";
var express = require('express');
var hbs = require('hbs');
var cookieParser = require('cookie-parser');
var WechatMsg = require('./wechat/wechatMsg.js');
var cloud = require('./cloud/cloud.js');

var app = express();
app.use(cloud);//加载定义的云代码
app.use(express.static('./public'));
app.use(cookieParser());

app.set('view engine', 'hbs');//模板引擎设置为hbs
hbs.localsAsTemplateData(app);
hbs.registerPartials(__dirname + '/views/partials');//注册hbs片段
app.locals.CDN = require('./util/CDN.js');

app.use('/wechat/msg', WechatMsg.MsgHandler);//微信消息服务

module.exports = app;