/**
 * Created by wuhaolin on 3/29/15.
 * express 后端服务器
 */
var express = require('express');
var WechatMsg = require('cloud/wechatMsg.js');
var request = require('request');
var app = express();
app.use(express.compress(), null);//压缩返回的数据
app.set('views', 'cloud/views');   // 设置模板目录
app.set("view engine", "ejs");
/**
 * 微信消息服务
 */
app.use('/wechat/msg', WechatMsg.MsgHandler);
app.listen();