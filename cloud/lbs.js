/**
 * Created by wuhaolin on 4/5/15.
 * LBS服务
 */
"use strict";

//百度地图
var BaiDu = {
    AppID: 'D9748868fb527b49a546fa88932b8cd9'
};
var Request = require('request');

/**
 * 更新用户的地理位置
 * @param avosUser AVOS User对象
 * @param latitude 纬度
 * @param longitude 经度
 */
exports.updateUserLocation = function (avosUser, latitude, longitude) {
    if (latitude && longitude) {
        var point = new AV.GeoPoint(latitude, longitude);
        user.set('location', point);
        return user.save();
    }
    return AV.Promise.error('缺少经纬度参数');
};

/**
 * 通过用户的IP地址获取用户的经纬度
 * @param ip ip地址
 * @param onSuccess 返回经纬度
 *              {
                    lng: point.x,
                    lat: point.y
                }
 * @param onError
 */
exports.getLocationByIP = function (ip, onSuccess, onError) {
    Request.get({
        url: 'http://api.map.baidu.com/location/ip',
        qs: {
            ak: BaiDu.AppID,
            ip: ip,
            coor: 'bd09ll'
        }
    }, function (err, res, body) {
        if (err) {
            onError(err);
        } else {
            var json = JSON.parse(body);
            if (json.status == 0) {
                var point = json['content']['point'];
                onSuccess({
                    lng: point.x,
                    lat: point.y
                });
            } else {
                onError(json);
            }
        }
    })
};

/**
 * 获得学校的地理经纬度
 * @param schoolName 学校的名称
 * @param onSuccess 返回
 *          {
				lat : 30.522385,
				lng : 114.369487
			}
 * @param onError 返回错误原因
 */
exports.getSchoolLocation = function (schoolName, onSuccess, onError) {
    Request.get({
        url: 'http://api.map.baidu.com/place/v2/search',
        qs: {
            ak: BaiDu.AppID,
            query: schoolName,
            scope: 1,
            page_size: 1,
            page_num: 0,
            region: '全国',
            output: 'json'
        }
    }, function (err, res, body) {
        if (err) {
            onError(err);
        } else {
            var json = JSON.parse(body);
            if (json.status == 0 && json.results.length > 0 && json.results[0].location) {
                var location = json.results[0].location;
                onSuccess(location);
            } else {
                onError(json);
            }
        }
    })
};
