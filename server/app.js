/**
 * Created by wuhaolin on 3/29/15.
 * express 后端服务器
 */
"use strict";
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var WechatMsg = require('./wechat/wechatMsg.js');
var cloud = require('./cloud/cloud.js');

var app = express();
app.use(cloud);//加载定义的云代码
app.use(express.static('./public'));
app.use(cookieParser());

app.use('/wechat/msg', WechatMsg.MsgHandler);//微信消息服务

module.exports = app;