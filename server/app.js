/**
 * Created by wuhaolin on 3/29/15.
 * express 后端服务器
 */
"use strict";
var express = require('express');
var hbs = require('hbs');
var WechatMsg = require('./wechat/wechatMsg.js');
var cloud = require('./cloud/cloud.js');
var desktopRouter = express.Router();
var bookRouter = require('./router/book.js');
var personRouter = require('./router/person.js');

var app = express();
app.use(cloud);//加载定义的云代码

//配置HBS
app.set('views', '../public/desktop');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
//注册hbs片段
hbs.registerPartials(__dirname + '../web/desktop/hbsPartial');

//配置router
app.use('/desktop', desktopRouter);
desktopRouter.use('/book', bookRouter);
desktopRouter.use('/person', personRouter);

//配置静态资源
app.use(express.static('./public'));

//配置微信
app.use('/wechat/msg', WechatMsg);//微信消息服务

module.exports = app;