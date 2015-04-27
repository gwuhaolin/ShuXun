/**
 * Created by wuhaolin on 4/11/15.
 *
 */
"use strict";
var Wechat = require('wechat');
var WechatAPI = require('cloud/wechatAPI.js');
var config = {
    token: WechatAPI.Config.Token,
    appid: WechatAPI.Config.AppID,
    encodingAESKey: WechatAPI.Config.EncodingAESKey
};

exports.MsgHandler = Wechat(config)
    .text(function (message, req, res) {
        res.reply('ishuxun');
    }).image(function (message, req, res) {
        res.reply('ishuxun');
    }).voice(function (message, req, res) {
        res.reply('ishuxun');
    }).video(function (message, req, res) {
        res.reply('ishuxun');
    }).location(function (message, req, res) {
        res.reply('ishuxun');
    }).link(function (message, req, res) {
        res.reply('ishuxun');
    }).event(function (message, req, res) {
        switch (message['Event']) {
            case 'LOCATION'://上报地理位置事件
                var openId = message['FromUserName'];
                var lat = message['Latitude'];
                var lon = message['Longitude'];
                saveLocationToUser(openId, lat, lon);
                res.reply('上报地理位置事件');
                return;
            case 'subscribe'://关注事件
                res.reply('关注事件');
                return;
            case 'unsubscribe'://取消关注事件
                res.reply('取消关注事件');
                return;
            case 'SCAN'://用户已关注时扫描带参数二维码事件事件推送
                res.reply('用户已关注时扫描带参数二维码事件事件推送');
                return;
            case 'CLICK'://用户点击自定义菜单后
                res.reply('用户点击自定义菜单后');
                return;
            case 'VIEW'://点击菜单跳转链接时的事件推送
                res.reply('点击菜单跳转链接时的事件推送');
                return;
        }
    }).middlewarify();

/**
 * 把用户上报的地理位置记录到AVOS
 * @param userOpenId 用户的微信平台的openID
 * @param lat 经度
 * @param lon 纬度
 */
function saveLocationToUser(userOpenId, lat, lon) {
    lat = parseFloat(lat);
    lon = parseFloat(lon);
    var query = new AV.Query(AV.User);
    query.equalTo('openId', userOpenId);
    query.first().done(function (avosUser) {
        if (avosUser) {
            var point = new AV.GeoPoint(lat, lon);
            avosUser.set('location', point);
            avosUser.save();
        }
    })
}