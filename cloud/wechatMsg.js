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
    .text(function (message, req, res, next) {
    }).image(function (message, req, res, next) {
    }).voice(function (message, req, res, next) {
    }).video(function (message, req, res, next) {
    }).location(function (message, req, res, next) {
    }).link(function (message, req, res, next) {
    }).event(function (message, req, res, next) {
        switch (message['Event']) {
            case 'LOCATION':
                var openId = message['FromUserName'];
                var lat = message['Latitude'];
                var lon = message['Longitude'];
                saveLocationToUser(openId, lat, lon);
                break;
        }
    }).middlewarify();

/**
 * 把用户上报的地理位置记录到AVOS
 * @param userOpenId 用户的微信平台的openID
 * @param lat 经度
 * @param lon 纬度
 */
function saveLocationToUser(userOpenId, lat, lon) {
    var query = new AV.Query(AV.User);
    query.equalTo('openId', userOpenId);
    query.first().done(function (avosUser) {
        var point = new AV.GeoPoint({latitude: lat, longitude: lon});
        avosUser.set('location', point);
        avosUser.save();
    })

}