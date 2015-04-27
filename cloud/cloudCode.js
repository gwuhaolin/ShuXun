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
 * 当一本二手书被卖出时
 * 参数: id 被卖出的二手书的AVOS ID
 * 返回: 事物完成成功返回success,否则返回error
 */
AV.Cloud.define('usedBookHasSell', function (request, response) {
    var usedBookId = request.params['id'];
    var query = new AV.Query('UsedBook');
    query.get(usedBookId).done(function (avosUsedBook) {//从UsedBook表获得被卖的二手书
        var HasSellUsedBook = AV.Object.extend('HasSellUsedBook');
        var hasUsedBook = new HasSellUsedBook();
        hasUsedBook.save({//从UsedBook表获得被卖的二手书的信息转移到HasSellUsedBook表
            owner: avosUsedBook.get('owner'),
            des: avosUsedBook.get('des'),
            price: avosUsedBook.get('price'),
            isbn13: avosUsedBook.get('isbn13'),
            title: avosUsedBook.get('title'),
            image: avosUsedBook.get('image')
        }).done(function () {
            avosUsedBook.destroy().done(function () {//删除UsedBook表获得被卖的二手书
                response.success();
            }).fail(function (error) {
                response.error(error);
            })
        })
    }).fail(function (error) {
        response.error(error);
    })
});

/**
 * 给分数发送模板消息
 * @参数:sendName 发送者的昵称
 * @参数:sendId 发送者的微信openId
 * @参数:receiverId 接收者的微信openId
 * @参数:msg 信息内容
 * @参数:usedBookAvosObjectId 当前咨询的二手书的objectId
 * @返回 发送成功时返回
 *      发送失败时返回 error
 */
AV.Cloud.define('sendTemplateMsgToUser', function (request, response) {
    var sendName = request.params['sendName'];
    var sendId = request.params['sendId'];
    var receiverId = request.params['receiverId'];
    var msg = request.params['msg'];
    var usedBookAvosObjectId = request.params['usedBookAvosObjectId'];
    WechatAPI.senderSendMsgToReceiver(sendName, sendId, receiverId, msg, usedBookAvosObjectId).done(function () {
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
        var ip = request.remoteAddress;
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

/**
 * 上传一本二手书时,把二手书的位置定为主人当前的位置
 */
AV.Cloud.beforeSave('UsedBook', function (request, response) {
    var location = request.user.get('location');
    var point = new AV.GeoPoint(location);
    request.object.set('location', point);
    request.object.save();
    response.success();
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