/**
 * Created by wuhaolin on 4/8/15.
 * AVOS 运代码
 */
"use strict";
var WechatAPI = require('cloud/wechatAPI.js');
var LBS = require('cloud/lbs.js');

/**
 * 更新微信菜单
 * 微信菜单格式见 http://mp.weixin.qq.com/wiki/13/43de8269be54a0a6f64413e4dfa94f39.html
 */
AV.Cloud.define('updateWechatMenu', function (req, res) {
    var wechatMenu = {
        "button": [
            {
                "type": "view",
                "name": "买书",
                "url": "http://ishuxun.cn/wechat/"
            },
            {
                "type": "view",
                "name": "卖书",
                "url": "http://ishuxun.cn/wechat/#/tab/person/uploadOneUsedBook/"
            }
        ]
    };
    WechatAPI.APIClient.createMenu(wechatMenu, function (err, result) {
        if (err) {
            res.error(err);
        } else {
            res.success(result);
        }
    });
});

/**
 * 给分数发送模板消息
 * @参数:sendName 发送者的昵称
 * @参数:sendId 发送者的微信openId
 * @参数:receiverId 接收者的微信openId
 * @参数:msg 信息内容
 * @参数:usedBookAvosObjectId 当前咨询的二手书的objectId
 * @参数:role 发送者的当前角色是卖家还是买家 sell | buy
 * @参数:isPrivate 聊天是否私信
 * @返回 发送成功时返回
 *      发送失败时返回 error
 */
AV.Cloud.define('sendTemplateMsgToUser', function (req, res) {
    var sendName = req.params['sendName'];
    var senderId = req.params['senderId'];
    var receiverId = req.params['receiverId'];
    var msg = req.params['msg'];
    var usedBookAvosObjectId = req.params['usedBookAvosObjectId'];
    var role = req.params['role'];
    var isPrivate = req.params['isPrivate'];
    WechatAPI.senderSendMsgToReceiver(sendName, senderId, receiverId, msg, usedBookAvosObjectId, role, isPrivate).done(function () {
        res.success();
    }).fail(function (err) {
        res.error(err);
    })
});

/**
 * 根据我的IP地址更新我经纬度
 * 如果有latitude和longitude参数就用这两个参数更新,否则调用根据IP地址获得地理位置更新
 * @参数:latitude 纬度
 * @参数:longitude 经度
 * 如果更新成功就返回success,否则返回error
 */
AV.Cloud.define('updateMyLocation', function (req, res) {
    var latitude;
    var longitude;
    if (req.params['latitude'] && req.params['longitude']) {//用户提交的GPS地位
        latitude = parseFloat(req.params['latitude']);
        longitude = parseFloat(req.params['longitude']);
        updateLocation();
    } else {//使用IP地址定位
        var ip = req.remoteAddress;
        LBS.getLocationByIP(ip, function (location) {
            latitude = parseFloat(location.lat);
            longitude = parseFloat(location.lng);
            updateLocation();
        })
    }
    function updateLocation() {
        var user = req.user;
        if (user) {
            LBS.updateUserLocation(user, latitude, longitude).done(function () {
                res.success();
            }).fail(function (err) {
                res.error(err);
            })
        } else {
            res.error('需要先登入');
        }
    }
});