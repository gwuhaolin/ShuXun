/**
 * Created by wuhaolin on 3/29/15.
 * express 后端服务器
 */
"use strict";
var Express = require('express');
var WechatMsg = require('cloud/wechatMsg.js');
var app = Express();
app.use(Express.compress(), null);//压缩返回的数据
app.set('views', 'cloud/views');   // 设置模板目录
app.set('view engine', 'jade');
app.use(Express.bodyParser(), null);    // 读取请求 body 的中间件
app.listen();
app.use('/wechat/msg', WechatMsg.MsgHandler);//微信消息服务

app.get('/test', function (req, res) {
    res.render('test');
});