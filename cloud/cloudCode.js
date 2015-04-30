/**
 * Created by wuhaolin on 4/8/15.
 * AVOS 运代码
 */
"use strict";
var WechatAPI = require('cloud/wechatAPI.js');
var LBS = require('cloud/lbs.js');
var Info = require('cloud/info.js');

/**
 * 更新微信菜单
 * 微信菜单格式见 http://mp.weixin.qq.com/wiki/13/43de8269be54a0a6f64413e4dfa94f39.html
 */
AV.Cloud.define('updateWechatMenu', function (request, response) {
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
    WechatAPI.APIClient.createMenu(wechatMenu, function (error, result) {
        if (error) {
            response.error(error);
        } else {
            response.success(result);
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
AV.Cloud.define('sendTemplateMsgToUser', function (request, response) {
    var sendName = request.params['sendName'];
    var senderId = request.params['senderId'];
    var receiverId = request.params['receiverId'];
    var msg = request.params['msg'];
    var usedBookAvosObjectId = request.params['usedBookAvosObjectId'];
    var role = request.params['role'];
    var isPrivate = request.params['isPrivate'];
    WechatAPI.senderSendMsgToReceiver(sendName, senderId, receiverId, msg, usedBookAvosObjectId, role, isPrivate).done(function () {
        response.success();
    }).fail(function (error) {
        response.error(error);
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
            }).fail(function (error) {
                res.error(error);
            })
        } else {
            res.error('需要先登入');
        }
    }
});


AV.Cloud.beforeSave('UsedBook', function (req, res) {
    var user = req.user;
    //设置二手书的地理位置
    var location = user.get('location');
    var point = new AV.GeoPoint(location);
    req.object.set('location', point);
    req.object.save();
    //设置用户的二手书的relations
    user.relation('usedBooks').add(req.object);
    user.save().done(function () {
        res.success();
    }).fail(function (err) {
        res.error(err);
    });
});
AV.Cloud.beforeDelete('UsedBook', function (req, res) {
    //把当前usedBook从主人的usedBooks属性中移除
    var user = req.user;
    user.relation('usedBooks').remove(request.object);
    user.save().done(function () {
        res.success();
    }).fail(function (err) {
        res.err(err);
    });
});


/**
 * 更新学校对象的经纬度
 * @param avosSchool 学校的名称
 */
function updateSchoolLocation(avosSchool) {
    var name = avosSchool.get('name');
    LBS.getSchoolLocation(name, function (location) {
        var point = new AV.GeoPoint(location.lat, location.lng);
        avosSchool.set('location', point);
        avosSchool.save();
    })
}
/**
 * 避免添加重名的学校
 */
AV.Cloud.beforeSave('School', function (request, response) {
    var avosSchool = request.object;
    var query = new AV.Query('School');
    query.equalTo('name', avosSchool.get('name'));
    query.count().done(function (number) {
        if (number > 0) {
            response.error('这个学校已经添加了');
        } else {
            response.success();
        }
    });
});
/**
 * 当添加了一个学校之后,会根据学校的名称自动调用百度API去获得这个学校的经纬度
 */
AV.Cloud.afterSave('School', function (request, response) {
    var avosSchool = request.object;
    updateSchoolLocation(avosSchool);
    response.success();
});
/**
 * 当更新了一个学校之后,会根据学校的名称自动调用百度API去获得这个学校的经纬度
 */
AV.Cloud.afterUpdate('School', function (request, response) {
    var avosSchool = request.object;
    updateSchoolLocation(avosSchool);
    response.success();
});
/**
 * 更新全国大学信息
 */
AV.Cloud.define('updateSchoolInfo', function (request, response) {
    Info.spiderSchoolsFromMyFriday();
    response.success();
});