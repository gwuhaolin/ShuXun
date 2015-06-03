/**
 * Created by wuhaolin on 4/5/15.
 * LBS服务
 */
"use strict";
var AV = require('leanengine');
var SuperAgent = require('superagent');
//百度地图
var BaiDu = {
    AppID: 'D9748868fb527b49a546fa88932b8cd9'
};

/**
 * 更新用户的地理位置
 * @param avosUser AVOS User对象
 * @param latitude 纬度
 * @param longitude 经度
 */
exports.updateUserLocation = function (avosUser, latitude, longitude) {
    if (avosUser && latitude && longitude) {
        var point = new AV.GeoPoint(latitude, longitude);
        avosUser.set('location', point);
        return avosUser.save();
    }
    return AV.Promise.error('缺少必要参数');
};

/**
 * 通过用户的IP地址获取用户的经纬度
 * @param ip ip地址
 * 返回经纬度
 *              {
                    latitude: point.x,
                    longitude: point.y
                }
 */
exports.getLocationByIP = function (ip) {
    var rePromise = new AV.Promise(null);
    SuperAgent.get('http://api.map.baidu.com/location/ip')
        .query({
            ak: BaiDu.AppID,
            ip: ip,
            coor: 'bd09ll'
        })
        .end(function (err, res) {
            if (err) {
                rePromise.reject(err);
            } else {
                if (res.ok) {
                    var json = res.body;
                    if (json.status == 0) {
                        var point = json['content']['point'];
                        rePromise.resolve({
                            latitude: point.y,
                            longitude: point.x
                        });
                    } else {
                        rePromise.reject(json);
                    }
                } else {
                    rePromise.reject(res.text);
                }
            }
        });
    return rePromise;
};

/**
 * 获得学校的地理经纬度
 * @param schoolName 学校的名称
 * 返回
 *          {
				lat : 30.522385,
				lng : 114.369487
			}
 */
exports.getSchoolLocation = function (schoolName) {
    var rePromise = new AV.Promise(null);
    SuperAgent.get('http://api.map.baidu.com/place/v2/search')
        .query({
            ak: BaiDu.AppID,
            query: schoolName,
            scope: 1,
            page_size: 1,
            page_num: 0,
            region: '全国',
            output: 'json'
        }).end(function (err, res) {
            if (err) {
                rePromise.reject(err);
            } else {
                if (res.ok) {
                    var json = res.body;
                    if (json.status == 0 && json.results.length > 0 && json.results[0].location) {
                        var location = json.results[0].location;
                        rePromise.resolve(location);
                    } else {
                        rePromise.reject(json);
                    }
                } else {
                    rePromise.reject(res.text);
                }
            }
        });
    return rePromise;
};
