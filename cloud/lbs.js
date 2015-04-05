/**
 * Created by wuhaolin on 4/5/15.
 * LBS服务
 */
"use strict";

//百度地图
var BaiDu = {
    AppID: 'D9748868fb527b49a546fa88932b8cd9'
};
var request = require('request');

/**
 * @param request express请求
 * 返回浏览器的IP地址
 */
function getClientIP(request) {
    return request.headers['x-real-ip'];
}

function getLocationByIP(ip, callback) {
    request.get({
        url: 'http://api.map.baidu.com/location/ip',
        qs: {
            ak: BaiDu.AppID,
            ip: ip,
            coor: 'bd09ll'
        }
    }, function (err, res, body) {
        var point = JSON.parse(body)['point'];
        var location = {
            lng: point.x,
            lat: point.y
        };
        callback(location);
    })
}

/**
 * 获得客户端的地理位置
 * @param request express请求
 * @param callback 返回location
 */
exports.getClientLocation = function (request, callback) {
    var user = request.AV.user;
    if (user) {//用户已经登入
        var location = user.get('location');
        if (location) {
            callback(location);
        }
    } else {
        var ip = getClientIP(request);
        getLocationByIP(ip, function (location) {
            callback(location);
        })
    }
};
