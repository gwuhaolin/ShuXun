/**
 * Created by wuhaolin on 3/29/15.
 * express 后端服务器
 */
var WechatMsg = require('cloud/wechatMsg.js');
var express = require('express');
var app = express();
app.use(express.compress(), null);//压缩返回的数据
app.set('views', 'cloud/views');   // 设置模板目录
app.set("view engine", "ejs");
app.use(express.bodyParser(), null);    // 读取请求 body 的中间件
app.listen();
app.use('/wechat/msg', WechatMsg.MsgHandler);//微信消息服务
